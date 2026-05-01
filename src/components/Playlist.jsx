import React, { useState, useEffect, useRef, useCallback } from "react";
import { Redis } from '@upstash/redis'
/* ══════════════════════════════════════════════════════════════
   PLAYLIST
   Flow:
   1. Search songs via Deezer (CORS proxy)
   2. Add to LOCAL queue instantly
   3. "Submit to Playlist" → saves queue to Upstash Redis
   4. "View Added Songs" → loads shared list from Redis
   5. Duplicate detection with toast error
   ══════════════════════════════════════════════════════════════ */

// ── Keys & endpoints ─────────────────────────────────────────
const LOCAL_KEY     = "va_local_queue";
const PLAYLIST_KEY  = "va_wedding_songs";
const API           = "/api/spotify";

// Upstash direct (CORS-enabled) — used for READ only
// const UPSTASH_URL_LOAD="https://included-shad-76730.upstash.io"
// const UPSTASH_TOKEN_LOAD="gQAAAAAAASu6AAIncDE3NzNjMjRmYmViNjQ0NGE5YjkwN2Q2NzExYzg4YWViY3AxNzY3MzA"
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN // FULL ACCESS TOKEN
})

/* ── Search via Vercel function ── */
async function searchTracks(q) {
  if (!q.trim()) return [];
  try {
    const res  = await fetch(`${API}?q=${encodeURIComponent(q)}`);
    const text = await res.text();
    if (text.trim().startsWith("<")) throw new Error("API not available");
    const data = JSON.parse(text);
    if (data.error) throw new Error(data.error);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("[Search] error:", e.message);
    return [];
  }
}

/* ── Load playlist DIRECTLY from Upstash (CORS supported for reads) ── */
async function loadSharedPlaylist() {
  try {
    const songs = await redis.get(PLAYLIST_KEY);
    return Array.isArray(songs) ? songs : [];
  } catch (e) {
    console.error("[loadPlaylist] error:", e.message);
    return [];
  }
}

/* ── Submit queue via Vercel function (server-side write to Redis) ── */
async function submitQueue(newSongs) {
  try {
    const existing    = await redis.get(PLAYLIST_KEY) || [];
    const existingIds = new Set(existing.map(s => s.id));
    const toAdd       = newSongs.filter(s => !existingIds.has(s.id));
    const duplicates  = newSongs.filter(s =>  existingIds.has(s.id));
    const updated     = [...existing, ...toAdd];
    await redis.set(PLAYLIST_KEY, updated);
    return { success: true, added: toAdd.length, duplicates: duplicates.length, total: updated.length };
  } catch (e) {
    console.error("[submitQueue] error:", e.message);
    return { error: e.message };
  }
}

/* ── helpers ── */
function fmt(ms) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function useReveal(t = 0.08) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold: t }
    );
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [t]);
  return [ref, vis];
}

/* ── EQ Bars ── */
function EqBars({ n = 5, h = 24, active = true, color = "var(--teal)" }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"flex-end", gap:"2.5px", height:`${h}px` }}>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} style={{
          width:"3px", borderRadius:"2px", background:color, minHeight:"4px",
          animation: active
            ? `plEq ${0.38 + i * 0.13}s ${i * 0.08}s ease-in-out infinite alternate`
            : "none",
          height: active ? `${28 + (i % 3) * 22}%` : "20%",
        }} />
      ))}
    </span>
  );
}

/* ── Music Icon ── */
function MusicIcon({ size = 18, color = "var(--teal)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
    </svg>
  );
}

/* ── Floating Notes ── */
function FloatingNotes() {
  const notes  = ["♪","♫","♬","♩"];
  const colors = ["var(--gold)","var(--teal)","#E8961E","#C8963C"];
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:1 }}>
      {Array.from({ length: 12 }, (_, i) => (
        <span key={i} style={{
          position:"absolute", bottom:"-5%",
          left:`${6 + (i * 8.3) % 88}%`,
          fontSize: i % 3 === 0 ? "1.1rem" : "0.8rem",
          color: colors[i % colors.length],
          opacity: 0.08 + (i % 3) * 0.04,
          animation:`plNote ${7 + (i * 0.5) % 5}s ${(i * 0.6) % 6}s linear infinite`,
          fontFamily:"serif",
        }}>
          {notes[i % notes.length]}
        </span>
      ))}
    </div>
  );
}

/* ── Toast ── */
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg = type === "error"
    ? "linear-gradient(135deg, #FFF0EE, #FDDDD8)"
    : "linear-gradient(135deg, #EDF7E3, #C8E6B8)";
  const border = type === "error"
    ? "1px solid rgba(196,96,122,0.35)"
    : "1px solid rgba(58,122,58,0.3)";
  const color = type === "error" ? "#9B2040" : "#3A6020";
  const icon  = type === "error" ? "⚠️" : "✓";

  return (
    <div style={{
      position:"fixed", bottom:"2rem", left:"50%", transform:"translateX(-50%)",
      zIndex:999, background:bg, border, borderRadius:"14px",
      padding:"0.85rem 1.5rem", display:"flex", alignItems:"center", gap:"0.6rem",
      boxShadow:"0 8px 30px rgba(0,0,0,0.12)",
      animation:"toastIn .3s ease",
      fontFamily:"'Lato',sans-serif", fontSize:"0.88rem", color,
      maxWidth:"90vw", whiteSpace:"nowrap",
    }}>
      <span>{icon}</span>
      <span>{message}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TRACK ROW — reused in both queue and shared list
   ══════════════════════════════════════════════════════════════ */
function TrackRow({ track, index, rightSlot }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:"0.75rem",
      padding:"0.7rem 0.9rem", borderRadius:"14px",
      background:"rgba(255,255,255,0.75)", backdropFilter:"blur(8px)",
      border:"1px solid rgba(200,150,60,0.15)",
      transition:"background .2s, transform .2s",
    }}
    onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.95)"; e.currentTarget.style.transform="translateX(3px)"; }}
    onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.75)"; e.currentTarget.style.transform="translateX(0)"; }}
    >
      {/* number */}
      <span style={{ fontSize:"0.65rem", color:"var(--text-muted)", flexShrink:0,
        width:"18px", textAlign:"right", fontFamily:"'Cinzel',serif" }}>
        {index + 1}
      </span>

      {/* album art */}
      {track.image
        ? <img src={track.image} alt="" style={{ width:"40px", height:"40px",
            borderRadius:"7px", objectFit:"cover", flexShrink:0,
            boxShadow:"0 2px 8px rgba(26,107,107,0.15)" }} />
        : <div style={{ width:"40px", height:"40px", borderRadius:"7px", flexShrink:0,
            background:"rgba(26,107,107,0.07)", display:"flex",
            alignItems:"center", justifyContent:"center", fontSize:"0.9rem" }}>🎵</div>
      }

      {/* info */}
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.86rem",
          color:"var(--text-dark)", overflow:"hidden",
          textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
          {track.name}
        </p>
        <p style={{ fontSize:"0.69rem", color:"var(--text-soft)", marginTop:"1px",
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
          {track.artist}
          {track.duration_ms ? ` · ${fmt(track.duration_ms)}` : ""}
        </p>
      </div>

      {/* by (shared list only) */}
      {track.by && (
        <span style={{ fontSize:"0.65rem", color:"var(--teal)", flexShrink:0,
          display:"none" }} className="plSmShow">
          {track.by}
        </span>
      )}

      {/* right slot — remove btn or nothing */}
      {rightSlot}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function Playlist() {
  const [ref, vis]    = useReveal();

  // search
  const [query, setQuery]         = useState("");
  const [results, setResults]     = useState([]);
  const [searching, setSearching] = useState(false);

  // local queue (this guest's picks before submitting)
  const [queue, setQueue]         = useState(() => {
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]"); } catch { return []; }
  });

  // guest name
  const [name, setName]           = useState("");

  // submission
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  // shared list view
  const [showShared, setShowShared]     = useState(false);
  const [sharedSongs, setSharedSongs]   = useState([]);
  const [loadingShared, setLoadingShared] = useState(false);
  const [copied, setCopied]             = useState(false);

  // toast
  const [toast, setToast] = useState(null); // { message, type }

  const debRef = useRef(null);

  /* persist queue to localStorage */
  useEffect(() => {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(queue)); } catch { /**/ }
  }, [queue]);

  /* inject keyframes once */
  useEffect(() => {
    const id = "pl-kf5";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
      @keyframes plNote {
        0%   { transform:translateY(0) rotate(0deg); opacity:0; }
        8%   { opacity:0.14; }
        92%  { opacity:0.06; }
        100% { transform:translateY(-112vh) rotate(25deg); opacity:0; }
      }
      @keyframes plEq {
        from { transform:scaleY(0.25); }
        to   { transform:scaleY(1); }
      }
      @keyframes plSpin  { to { transform:rotate(360deg); } }
      @keyframes toastIn {
        from { opacity:0; transform:translateX(-50%) translateY(16px); }
        to   { opacity:1; transform:translateX(-50%) translateY(0); }
      }
      .plR { opacity:0; transform:translateY(24px);
             transition:opacity .72s ease, transform .72s ease; }
      .plV { opacity:1 !important; transform:translateY(0) !important; }
      .d1{transition-delay:.07s} .d2{transition-delay:.16s}
      .d3{transition-delay:.25s} .d4{transition-delay:.34s}
      .plSpin  { animation:plSpin 10s linear infinite; }
      .plSrch::placeholder  { color:var(--text-muted); }
      .plSrch:focus  {
        outline:none;
        border-color:var(--teal) !important;
        box-shadow:0 0 0 3px rgba(26,107,107,0.12) !important;
      }
      .plName::placeholder { color:var(--text-muted); }
      .plName:focus {
        outline:none;
        border-color:var(--gold) !important;
        box-shadow:0 0 0 3px rgba(200,150,60,0.1) !important;
      }
      .plResRow { transition:background .18s; }
      .plResRow:hover { background:rgba(26,107,107,0.06) !important; }
      @media(min-width:500px){ .plSmShow{ display:block !important; } }
    `;
    document.head.appendChild(s);
  }, []);

  /* search */
  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); return; }
    setSearching(true);
    const res = await searchTracks(q);
    setResults(res);
    setSearching(false);
  }, []);

  const handleQ = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debRef.current);
    debRef.current = setTimeout(() => doSearch(val), 400);
  };

  /* show toast */
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  /* add to LOCAL queue */
  const addToQueue = (t) => {
    // check local queue
    if (queue.find(s => s.id === t.id)) {
      showToast("This song is already in your queue!", "error");
      return;
    }
    setQueue(prev => [...prev, {
      id:          t.id,
      name:        t.name,
      artist:      t.artist,
      album:       t.album,
      image:       t.image,
      duration_ms: t.duration_ms,
      url:         t.url,
    }]);
    setQuery("");
    setResults([]);
    showToast(`"${t.name}" added to your queue ✓`);
  };

  /* remove from local queue */
  const removeFromQueue = (id) => {
    setQueue(prev => prev.filter(s => s.id !== id));
  };

  /* submit queue to Redis via Vercel function */
  const submitPlaylist = async () => {
    if (queue.length === 0) {
      showToast("Add at least one song first!", "error");
      return;
    }
    setSubmitting(true);

    const guestName = name.trim() || "A Guest";
    const timestamp = new Date().toLocaleDateString("en-IN", { day:"numeric", month:"short" });
    const tagged    = queue.map(s => ({ ...s, by: guestName, at: timestamp }));

    const result = await submitQueue(tagged);
    setSubmitting(false);

    if (result.error) {
      showToast("Something went wrong. Please try again.", "error");
    } else {
      setSubmitted(true);
      setQueue([]);
      localStorage.removeItem(LOCAL_KEY);
      if (result.duplicates > 0) {
        showToast(
          `${result.added} song${result.added !== 1 ? "s" : ""} added! (${result.duplicates} already in playlist)`,
          "success"
        );
      } else {
        showToast(`${result.added} song${result.added !== 1 ? "s" : ""} added to the wedding playlist! 🎉`);
      }
    }
  };

  /* load shared list from Redis via Vercel function */
  const loadSharedList = async () => {
    setShowShared(true);
    setLoadingShared(true);
    const songs = await loadSharedPlaylist();
    setSharedSongs(songs);
    setLoadingShared(false);
  };

  const copyDJ = () => {
    navigator.clipboard.writeText(
      sharedSongs.map((s, i) => `${i + 1}. ${s.name} — ${s.artist}  (by ${s.by || "Guest"})`).join("\n")
    ).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const inputStyle = (extra = {}) => ({
    width:"100%", padding:"0.82rem 1.15rem",
    border:"1px solid rgba(200,150,60,0.3)", borderRadius:"12px",
    background:"rgba(255,255,255,0.75)", backdropFilter:"blur(8px)",
    fontFamily:"'Lato',sans-serif", fontSize:"0.9rem",
    color:"var(--text-dark)", transition:"border-color .3s, box-shadow .3s",
    ...extra,
  });

  return (
    <section ref={ref} id="playlist" style={{
      position:"relative", overflow:"hidden", padding:"6rem 1.5rem",
      background:`
        radial-gradient(ellipse 80% 50% at 50% 0%,   rgba(26,107,107,0.08) 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 0%   100%, rgba(232,150,30,0.09) 0%, transparent 55%),
        radial-gradient(ellipse 60% 40% at 100% 100%, rgba(200,150,60,0.07) 0%, transparent 55%),
        var(--ivory)
      `,
    }}>
      <FloatingNotes />

      {/* toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* top/bottom gold rules */}
      {["top","bottom"].map(p => (
        <div key={p} style={{ position:"absolute", [p]:0, left:0, right:0, height:"1px",
          background:"linear-gradient(90deg,transparent,var(--gold-light),var(--gold),var(--gold-light),transparent)" }} />
      ))}

      <div style={{ position:"relative", zIndex:10, maxWidth:"700px", margin:"0 auto" }}>

        {/* ── HEADER ── */}
        <div className={`plR d1 ${vis ? "plV" : ""}`} style={{ textAlign:"center", marginBottom:"2.5rem" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
            gap:"1.1rem", marginBottom:"1.3rem" }}>
            <EqBars n={5} h={32} active={vis} />
            <div className="plSpin" style={{
              width:"54px", height:"54px", borderRadius:"50%",
              background:`conic-gradient(
                var(--teal) 0deg 45deg, var(--parchment) 45deg 90deg,
                var(--gold) 90deg 135deg, var(--parchment) 135deg 180deg,
                var(--teal) 180deg 225deg, var(--parchment) 225deg 270deg,
                var(--gold) 270deg 315deg, var(--parchment) 315deg 360deg)`,
              boxShadow:"0 0 0 3px var(--ivory), 0 0 0 5px var(--gold-light), 0 6px 24px rgba(200,150,60,0.3)",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <div style={{ width:"15px", height:"15px", borderRadius:"50%",
                background:"var(--ivory)", border:"2px solid var(--gold)" }} />
            </div>
            <EqBars n={5} h={32} active={vis} />
          </div>

          <span style={{ display:"block", fontFamily:"'Cinzel',serif", fontSize:"0.62rem",
            letterSpacing:"0.5em", textTransform:"uppercase",
            color:"var(--gold)", marginBottom:"0.65rem" }}>
            Shape Our Soundtrack
          </span>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:400,
            fontSize:"clamp(1.9rem,4.5vw,3rem)", color:"var(--text-dark)", lineHeight:1.15 }}>
            Our Wedding Playlist 🎶
          </h2>
          <p style={{ fontFamily:"'EB Garamond',Georgia,serif", fontStyle:"italic",
            fontSize:"1.05rem", color:"var(--text-muted)", marginTop:"0.6rem", lineHeight:1.7 }}>
            Search your favourite songs, build your queue, then submit — help us
            create the perfect wedding night soundtrack!
          </p>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
            gap:"0.9rem", marginTop:"1rem" }}>
            <div style={{ flex:1, maxWidth:"80px", height:"1px",
              background:"linear-gradient(90deg,transparent,var(--gold-light))" }} />
            <span style={{ color:"var(--teal)", fontSize:"1.1rem" }}>🎵</span>
            <div style={{ flex:1, maxWidth:"80px", height:"1px",
              background:"linear-gradient(90deg,var(--gold-light),transparent)" }} />
          </div>

          {/* View Added Songs button */}
           {/* <button
            onClick={loadSharedList}
            style={{
              marginTop:"1.2rem",
              background:"transparent",
              border:"1px solid rgba(26,107,107,0.35)",
              borderRadius:"30px",
              padding:"0.5rem 1.4rem",
              fontFamily:"'Cinzel',serif",
              fontSize:"0.65rem",
              letterSpacing:"0.2em",
              textTransform:"uppercase",
              color:"var(--teal)",
              cursor:"pointer",
              transition:"all .25s",
            }}
            onMouseEnter={e => { e.target.style.background="rgba(26,107,107,0.08)"; }}
            onMouseLeave={e => { e.target.style.background="transparent"; }}
          >
            🎵 View Added Songs ({sharedSongs.length > 0 ? sharedSongs.length : "?"})
          </button> */}
        </div>

        {/* ── SHARED LIST MODAL ── */}
        {showShared && (
          <div style={{
            marginBottom:"2.5rem", borderRadius:"20px", overflow:"hidden",
            border:"1px solid rgba(26,107,107,0.2)",
            background:"rgba(255,255,255,0.9)", backdropFilter:"blur(20px)",
            boxShadow:"0 12px 50px rgba(26,107,107,0.1)",
          }}>
            {/* header */}
            <div style={{
              padding:"1rem 1.3rem",
              background:"linear-gradient(135deg,rgba(26,107,107,0.08),rgba(200,150,60,0.05))",
              borderBottom:"1px solid rgba(26,107,107,0.1)",
              display:"flex", alignItems:"center", justifyContent:"space-between",
              flexWrap:"wrap", gap:"0.5rem",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.7rem" }}>
                <EqBars n={4} h={18} active color="var(--teal)" />
                <div>
                  <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1rem",
                    color:"var(--text-dark)", fontWeight:400 }}>
                    Wedding Playlist
                  </p>
                  {!loadingShared && (
                    <p style={{ fontSize:"0.65rem", color:"var(--text-muted)", marginTop:"1px" }}>
                      {sharedSongs.length} song{sharedSongs.length !== 1 ? "s" : ""} from your guests
                    </p>
                  )}
                </div>
              </div>
              <div style={{ display:"flex", gap:"0.6rem", alignItems:"center" }}>
                {sharedSongs.length > 0 && (
                  <button onClick={copyDJ} style={{
                    fontSize:"0.62rem", padding:"0.38rem 0.9rem", borderRadius:"20px",
                    fontFamily:"'Cinzel',serif", letterSpacing:"0.1em", cursor:"pointer",
                    transition:"all .2s",
                    background: copied ? "rgba(26,107,107,0.12)" : "rgba(200,150,60,0.1)",
                    border: copied ? "1px solid rgba(26,107,107,0.35)" : "1px solid rgba(200,150,60,0.3)",
                    color: copied ? "var(--teal)" : "var(--gold-dark)",
                  }}>
                    {copied ? "✓ Copied!" : "📋 Copy for DJ"}
                  </button>
                )}
                <button onClick={() => setShowShared(false)} style={{
                  background:"none", border:"none", cursor:"pointer",
                  fontSize:"1rem", color:"var(--text-muted)", padding:"0 4px",
                  lineHeight:1,
                }}>✕</button>
              </div>
            </div>

            {/* content */}
            <div style={{ padding:"1rem", maxHeight:"360px", overflowY:"auto" }}>
              {loadingShared ? (
                <div style={{ textAlign:"center", padding:"2rem",
                  fontFamily:"'Playfair Display',serif", fontStyle:"italic",
                  color:"var(--text-muted)" }}>
                  Loading playlist…
                </div>
              ) : sharedSongs.length === 0 ? (
                <div style={{ textAlign:"center", padding:"2rem",
                  fontFamily:"'Playfair Display',serif", fontStyle:"italic",
                  color:"var(--text-muted)" }}>
                  No songs yet — be the first to submit! 🎶
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
                  {sharedSongs.map((s, i) => (
                    <TrackRow key={s.id + i} track={s} index={i} rightSlot={null} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SUBMITTED STATE ── */}
        {submitted ? (
          <div className={`plR d2 ${vis ? "plV" : ""}`} style={{
            textAlign:"center", padding:"3rem 1.5rem",
            borderRadius:"20px",
            background:"linear-gradient(135deg,rgba(26,107,107,0.07),rgba(200,150,60,0.05))",
            border:"1px solid rgba(26,107,107,0.2)",
          }}>
            <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🎉</div>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.3rem",
              color:"var(--text-dark)", fontWeight:400 }}>
              Thank you, {name.trim() || "dear guest"}!
            </p>
            <p style={{ fontFamily:"'EB Garamond',serif", fontStyle:"italic",
              fontSize:"1rem", color:"var(--text-soft)", marginTop:"0.5rem" }}>
              Your songs have been added to the wedding playlist 💛
            </p>
            <button
              onClick={() => { setSubmitted(false); setName(""); }}
              style={{
                marginTop:"1.5rem", background:"transparent",
                border:"1px solid rgba(26,107,107,0.3)", borderRadius:"30px",
                padding:"0.55rem 1.5rem", fontFamily:"'Cinzel',serif",
                fontSize:"0.65rem", letterSpacing:"0.2em",
                color:"var(--teal)", cursor:"pointer",
              }}
            >
              Add More Songs
            </button>
          </div>
        ) : (
          <>
            {/* ── YOUR NAME ── */}
            <div className={`plR d2 ${vis ? "plV" : ""}`} style={{ marginBottom:"0.9rem" }}>
              <label style={{ display:"block", fontFamily:"'Cinzel',serif", fontSize:"0.6rem",
                letterSpacing:"0.2em", textTransform:"uppercase",
                color:"var(--text-soft)", marginBottom:"0.45rem" }}>
                Your Name
              </label>
              <input type="text" className="plName"
                placeholder="So we know who suggested it 🥂"
                value={name} onChange={e => setName(e.target.value)}
                style={inputStyle()} />
            </div>

            {/* ── SEARCH ── */}
            <div className={`plR d3 ${vis ? "plV" : ""}`} style={{ marginBottom:"1rem" }}>
              <label style={{ display:"block", fontFamily:"'Cinzel',serif", fontSize:"0.6rem",
                letterSpacing:"0.2em", textTransform:"uppercase",
                color:"var(--text-soft)", marginBottom:"0.45rem" }}>
                Search a Song
              </label>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:"1rem", top:"50%",
                  transform:"translateY(-50%)", pointerEvents:"none",
                  fontSize:"1rem", color:"var(--teal)" }}>
                  {searching ? "⏳" : "🔍"}
                </span>
                <input type="text" className="plSrch"
                  placeholder="Search songs — Bollywood, English, any language…"
                  value={query} onChange={handleQ}
                  style={inputStyle({
                    paddingLeft:"3rem",
                    border:`1.5px solid ${searching ? "var(--teal)" : "rgba(200,150,60,0.3)"}`,
                    borderRadius:"14px",
                    boxShadow: searching ? "0 0 0 3px rgba(26,107,107,0.1)" : "none",
                  })} />
              </div>
            </div>

            {/* ── SEARCH RESULTS ── */}
            {results.length > 0 && (
              <div style={{
                marginBottom:"1.5rem", borderRadius:"18px", overflow:"hidden",
                border:"1px solid rgba(26,107,107,0.2)",
                background:"rgba(255,255,255,0.85)", backdropFilter:"blur(16px)",
                boxShadow:"0 8px 40px rgba(26,107,107,0.08)",
              }}>
                <div style={{ padding:"0.65rem 1.1rem",
                  borderBottom:"1px solid rgba(26,107,107,0.1)",
                  background:"rgba(26,107,107,0.04)",
                  display:"flex", alignItems:"center", gap:"0.6rem" }}>
                  <EqBars n={4} h={14} active color="var(--teal)" />
                  <span style={{ fontFamily:"'Cinzel',serif", fontSize:"0.58rem",
                    letterSpacing:"0.22em", textTransform:"uppercase", color:"var(--teal)" }}>
                    Search Results
                  </span>
                </div>

                {results.map((t, ri) => {
                  const inQueue = queue.find(s => s.id === t.id);
                  return (
                    <div key={t.id} className="plResRow"
                      style={{ display:"flex", alignItems:"center", gap:"0.85rem",
                        padding:"0.75rem 1.1rem", background:"transparent",
                        borderBottom: ri < results.length - 1
                          ? "1px solid rgba(200,150,60,0.1)" : "none" }}>

                      {t.image
                        ? <img src={t.image} alt="" style={{ width:"44px", height:"44px",
                            borderRadius:"8px", objectFit:"cover", flexShrink:0,
                            boxShadow:"0 2px 10px rgba(26,107,107,0.18)" }} />
                        : <div style={{ width:"44px", height:"44px", borderRadius:"8px",
                            flexShrink:0, background:"rgba(26,107,107,0.08)",
                            display:"flex", alignItems:"center",
                            justifyContent:"center", fontSize:"1.2rem" }}>🎵</div>
                      }

                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.9rem",
                          color:"var(--text-dark)", fontWeight:500,
                          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {t.name}
                        </p>
                        <p style={{ fontSize:"0.71rem", color:"var(--text-soft)", marginTop:"2px",
                          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {t.artist} · {fmt(t.duration_ms)}
                        </p>
                      </div>

                      <a href={t.url} target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{ flexShrink:0, opacity:0.45, transition:"opacity .2s" }}
                        onMouseEnter={e => e.currentTarget.style.opacity="1"}
                        onMouseLeave={e => e.currentTarget.style.opacity="0.45"}>
                        <MusicIcon size={17} />
                      </a>

                      <button onClick={() => addToQueue(t)} style={{
                        flexShrink:0, fontSize:"0.68rem", padding:"0.4rem 0.9rem",
                        borderRadius:"20px", cursor:"pointer",
                        fontFamily:"'Cinzel',serif", letterSpacing:"0.1em",
                        fontWeight:600, minWidth:"60px", transition:"all .2s",
                        background: inQueue
                          ? "rgba(26,107,107,0.12)"
                          : "linear-gradient(135deg, var(--teal), #0D4040)",
                        color:  inQueue ? "var(--teal)" : "white",
                        border: inQueue ? "1px solid rgba(26,107,107,0.35)" : "none",
                        boxShadow: inQueue ? "none" : "0 3px 12px rgba(26,107,107,0.3)",
                      }}>
                        {inQueue ? "✓ In Queue" : "+ Add"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── LOCAL QUEUE ── */}
            {queue.length > 0 && (
              <div className={`plR d4 ${vis ? "plV" : ""}`} style={{ marginBottom:"1.5rem" }}>

                {/* queue header */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                  marginBottom:"0.85rem", flexWrap:"wrap", gap:"0.5rem" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
                    <EqBars n={4} h={18} active color="var(--teal)" />
                    <div>
                      <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1rem",
                        color:"var(--text-dark)", fontWeight:400 }}>
                        Your Queue
                      </p>
                      <p style={{ fontSize:"0.65rem", color:"var(--text-muted)", marginTop:"1px" }}>
                        {queue.length} song{queue.length !== 1 ? "s" : ""} ready to submit
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setQueue([])} style={{
                    fontSize:"0.62rem", padding:"0.35rem 0.8rem", borderRadius:"20px",
                    fontFamily:"'Cinzel',serif", letterSpacing:"0.1em", cursor:"pointer",
                    background:"rgba(196,96,122,0.08)",
                    border:"1px solid rgba(196,96,122,0.25)",
                    color:"var(--rose)", transition:"all .2s",
                  }}>
                    Clear All
                  </button>
                </div>

                {/* queue tracks */}
                <div style={{ display:"flex", flexDirection:"column", gap:"0.45rem",
                  marginBottom:"1.2rem" }}>
                  {queue.map((s, i) => (
                    <TrackRow
                      key={s.id}
                      track={s}
                      index={i}
                      rightSlot={
                        <button onClick={() => removeFromQueue(s.id)} style={{
                          background:"none", border:"none", cursor:"pointer",
                          fontSize:"0.8rem", color:"rgba(196,96,122,0.35)",
                          transition:"color .2s", padding:"0 2px", flexShrink:0,
                        }}
                        onMouseEnter={e => e.currentTarget.style.color="rgba(196,96,122,0.8)"}
                        onMouseLeave={e => e.currentTarget.style.color="rgba(196,96,122,0.35)"}>
                          ✕
                        </button>
                      }
                    />
                  ))}
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  onClick={submitPlaylist}
                  disabled={submitting}
                  style={{
                    width:"100%", padding:"1rem",
                    background: submitting
                      ? "rgba(26,107,107,0.4)"
                      : "linear-gradient(135deg, var(--teal), #0D4040)",
                    color:"white", border:"none",
                    fontFamily:"'Cinzel',serif", fontSize:"0.78rem",
                    letterSpacing:"0.25em", textTransform:"uppercase",
                    cursor: submitting ? "not-allowed" : "pointer",
                    borderRadius:"40px",
                    boxShadow:"0 4px 20px rgba(26,107,107,0.3)",
                    transition:"all .3s",
                  }}
                  onMouseEnter={e => { if (!submitting) e.target.style.boxShadow="0 8px 30px rgba(26,107,107,0.45)"; }}
                  onMouseLeave={e => { e.target.style.boxShadow="0 4px 20px rgba(26,107,107,0.3)"; }}
                >
                  {submitting ? "Submitting…" : `Submit ${queue.length} Song${queue.length !== 1 ? "s" : ""} to Playlist ✦`}
                </button>
              </div>
            )}

            {/* ── EMPTY STATE ── */}
            {queue.length === 0 && results.length === 0 && (
              <div className={`plR d4 ${vis ? "plV" : ""}`}
                style={{ textAlign:"center", padding:"2.5rem 1rem" }}>
                <div className="plSpin" style={{
                  width:"56px", height:"56px", borderRadius:"50%",
                  margin:"0 auto 1.1rem", opacity:0.65,
                  background:`conic-gradient(
                    var(--teal) 0deg 60deg, var(--parchment) 60deg 120deg,
                    var(--gold) 120deg 180deg, var(--parchment) 180deg 240deg,
                    var(--teal) 240deg 300deg, var(--parchment) 300deg 360deg)`,
                  boxShadow:"0 0 0 3px var(--ivory), 0 0 0 4px var(--gold-light)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <div style={{ width:"13px", height:"13px", borderRadius:"50%",
                    background:"var(--ivory)", border:"2px solid var(--gold)" }} />
                </div>
                <p style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic",
                  fontSize:"1rem", color:"var(--text-soft)" }}>
                  Search a song above to get started!
                </p>
                <p style={{ fontSize:"0.78rem", color:"var(--text-muted)",
                  marginTop:"0.4rem", fontWeight:300 }}>
                  Add multiple songs to your queue, then hit Submit 🎶
                </p>
                <div style={{ display:"flex", justifyContent:"center", gap:"5px", marginTop:"1.1rem" }}>
                  {[0,1,2,3,4].map(j => (
                    <div key={j} style={{
                      width:"5px", height:"5px", borderRadius:"50%",
                      background:"var(--teal)", opacity:0.45,
                      animation:`plEq ${0.45 + j*0.1}s ${j*0.09}s ease-in-out infinite alternate`,
                    }} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}
