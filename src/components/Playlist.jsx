import React, { useState, useEffect, useRef, useCallback } from "react";

/* iTunes search + Upstash Redis shared playlist */
async function searchTracks(q) {
  if (!q.trim()) return [];
  try {
    const res  = await fetch(`/api/spotify?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("[Search] error:", e.message);
    return [];
  }
}

async function loadPlaylist() {
  try {
    const res  = await fetch("/api/spotify?action=playlist");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

async function addToPlaylist(song) {
  try {
    const res  = await fetch("/api/spotify?action=add", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(song),
    });
    const data = await res.json();
    return Array.isArray(data) ? data : null;
  } catch { return null; }
}

async function removeFromPlaylist(id) {
  try {
    const res  = await fetch(`/api/spotify?action=remove&id=${id}`, { method: "DELETE" });
    const data = await res.json();
    return Array.isArray(data) ? data : null;
  } catch { return null; }
}


/* ── helpers ── */
function fmt(ms) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function useReveal(threshold = 0.08) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

/* ── sub-components ── */
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

/* ══════════════════════════════════════════════════════════════
   MAIN
   ══════════════════════════════════════════════════════════════ */
export default function Playlist() {
  const [ref, vis]                = useReveal();
  const [query, setQuery]         = useState("");
  const [results, setResults]     = useState([]);
  const [searching, setSearching] = useState(false);
  const [songs, setSongs]         = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [name, setName]           = useState("");
  const [added, setAdded]         = useState(null);
  const [saving, setSaving]       = useState(false);
  const [copied, setCopied]       = useState(false);
  const debRef = useRef(null);

  /* load shared playlist from server */
  useEffect(() => {
    setLoadingList(true);
    loadPlaylist().then((data) => {
      setSongs(data);
      setLoadingList(false);
    });
  }, []);

  /* inject keyframes once */
  useEffect(() => {
    const id = "pl-kf4";
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
      @keyframes plSlide {
        from { opacity:0; transform:translateX(-12px); }
        to   { opacity:1; transform:translateX(0); }
      }
      .plR { opacity:0; transform:translateY(24px);
             transition:opacity .72s ease, transform .72s ease; }
      .plV { opacity:1 !important; transform:translateY(0) !important; }
      .d1{transition-delay:.07s} .d2{transition-delay:.16s}
      .d3{transition-delay:.25s} .d4{transition-delay:.34s}
      .plSlide { animation:plSlide .32s ease forwards; }
      .plSpin  { animation:plSpin 10s linear infinite; }
      .plSearchInp::placeholder { color:var(--text-muted); }
      .plSearchInp:focus {
        outline:none;
        border-color:var(--teal) !important;
        box-shadow:0 0 0 3px rgba(26,107,107,0.12) !important;
      }
      .plNameInp::placeholder { color:var(--text-muted); }
      .plNameInp:focus {
        outline:none;
        border-color:var(--gold) !important;
        box-shadow:0 0 0 3px rgba(200,150,60,0.1) !important;
      }
      .plResultRow { transition:background .18s; cursor:default; }
      .plResultRow:hover { background:rgba(26,107,107,0.06) !important; }
      .plSongRow { transition:background .2s, transform .2s; }
      .plSongRow:hover {
        background:rgba(255,255,255,0.95) !important;
        transform:translateX(3px);
      }
      @media(min-width:500px){ .plSmShow{ display:block !important; } }
    `;
    document.head.appendChild(s);
  }, []);

  /* search */
  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); return; }
    setSearching(true);
    const res = await searchTracks(q);
    setResults(Array.isArray(res) ? res : []);
    setSearching(false);
  }, []);

  const handleQ = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debRef.current);
    debRef.current = setTimeout(() => doSearch(val), 400);
  };

  const addTrack = async (t) => {
    if (songs.find((s) => s.id === t.id)) {
      setAdded(t.id); setTimeout(() => setAdded(null), 1800); return;
    }
    const entry = {
      id:       t.id,
      name:     t.name,
      artist:   t.artists.map((a) => a.name).join(", "),
      album:    t.album.name,
      image:    t.album.images?.[1]?.url || t.album.images?.[0]?.url || "",
      duration: fmt(t.duration_ms),
      url:      t.external_urls.spotify || "#",
      by:       name.trim() || "A Guest",
      at:       new Date().toLocaleDateString("en-IN", { day:"numeric", month:"short" }),
    };
    setSaving(true);
    const updated = await addToPlaylist(entry);
    if (updated) setSongs(updated);
    else setSongs(prev => [entry, ...prev]); // fallback
    setSaving(false);
    setAdded(t.id); setTimeout(() => setAdded(null), 2000);
    setQuery(""); setResults([]);
  };

  const remove = async (id) => {
    const updated = await removeFromPlaylist(id);
    if (updated) setSongs(updated);
    else setSongs(prev => prev.filter(s => s.id !== id)); // fallback
  };

  const copyDJ = () => {
    navigator.clipboard.writeText(
      songs.map((s, i) => `${i + 1}. ${s.name} — ${s.artist}  (by ${s.by})`).join("\n")
    ).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 2200);
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

      {/* gold rules */}
      {["top","bottom"].map((p) => (
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
            Drop your favourite party song &amp; help us build the perfect
            wedding night soundtrack — from Bollywood to bangers!
          </p>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
            gap:"0.9rem", marginTop:"1rem" }}>
            <div style={{ flex:1, maxWidth:"80px", height:"1px",
              background:"linear-gradient(90deg,transparent,var(--gold-light))" }} />
            <span style={{ color:"var(--teal)", fontSize:"1.1rem" }}>🎵</span>
            <div style={{ flex:1, maxWidth:"80px", height:"1px",
              background:"linear-gradient(90deg,var(--gold-light),transparent)" }} />
          </div>
        </div>

        {/* ── TOKEN ERROR BANNER ── */}


        {/* ── NAME INPUT ── */}
        <div className={`plR d2 ${vis ? "plV" : ""}`} style={{ marginBottom:"0.9rem" }}>
          <label style={{ display:"block", fontFamily:"'Cinzel',serif", fontSize:"0.6rem",
            letterSpacing:"0.2em", textTransform:"uppercase",
            color:"var(--text-soft)", marginBottom:"0.45rem" }}>
            Your Name
          </label>
          <input type="text" className="plNameInp"
            placeholder="So we know who to thank 🥂"
            value={name} onChange={(e) => setName(e.target.value)}
            style={inputStyle()} />
        </div>

        {/* ── SEARCH INPUT ── */}
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
            <input
              type="text"
              className="plSearchInp"
              placeholder="Search songs — artist, Bollywood, English…"
              value={query}
              onChange={handleQ}

              style={inputStyle({
                paddingLeft:"3rem",
                border:`1.5px solid ${searching ? "var(--teal)" : "rgba(200,150,60,0.3)"}`,
                borderRadius:"14px",
                boxShadow: searching ? "0 0 0 3px rgba(26,107,107,0.1)" : "none",

              })}
            />
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", marginTop:"0.45rem" }}>
            <div style={{ width:"7px", height:"7px", borderRadius:"50%",
              background:"#1DB954", boxShadow:"0 0 6px rgba(29,185,84,0.5)" }} />
            <span style={{ fontSize:"0.65rem", color:"var(--text-muted)" }}>
              Music search ready
            </span>
          </div>
        </div>

        {/* ── SEARCH RESULTS ── */}
        {results.length > 0 && (
          <div style={{
            marginBottom:"2rem", borderRadius:"18px", overflow:"hidden",
            border:"1px solid rgba(26,107,107,0.2)",
            background:"rgba(255,255,255,0.82)", backdropFilter:"blur(16px)",
            boxShadow:"0 8px 40px rgba(26,107,107,0.08)",
          }}>
            <div style={{ padding:"0.65rem 1.1rem",
              borderBottom:"1px solid rgba(26,107,107,0.1)",
              background:"rgba(26,107,107,0.04)",
              display:"flex", alignItems:"center", gap:"0.6rem" }}>
              <EqBars n={4} h={14} active color="var(--teal)" />
              <span style={{ fontFamily:"'Cinzel',serif", fontSize:"0.58rem",
                letterSpacing:"0.22em", textTransform:"uppercase", color:"var(--teal)" }}>
                Song Results
              </span>
            </div>

            {results.map((t, ri) => {
              const justAdded = added === t.id;
              const inList    = songs.some((s) => s.id === t.id);
              return (
                <div key={t.id} className="plResultRow"
                  style={{ display:"flex", alignItems:"center", gap:"0.85rem",
                    padding:"0.75rem 1.1rem", background:"transparent",
                    borderBottom: ri < results.length - 1
                      ? "1px solid rgba(200,150,60,0.1)" : "none" }}>

                  {t.album.images?.[2]?.url
                    ? <img src={t.album.images[2].url} alt=""
                        style={{ width:"44px", height:"44px", borderRadius:"8px",
                          objectFit:"cover", flexShrink:0,
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
                      {t.artists.map((a) => a.name).join(", ")} · {t.album.name}
                    </p>
                  </div>

                  <span className="plSmShow" style={{ display:"none",
                    fontSize:"0.7rem", color:"var(--text-muted)", flexShrink:0 }}>
                    {fmt(t.duration_ms)}
                  </span>

                  <a href={t.external_urls.spotify || "#"} target="_blank" rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ flexShrink:0, opacity:0.5, transition:"opacity .2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity="1"}
                    onMouseLeave={(e) => e.currentTarget.style.opacity="0.5"}>
                    <MusicIcon size={17} />
                  </a>

                  <button onClick={() => addTrack(t)} style={{
                    flexShrink:0, fontSize:"0.68rem", padding:"0.4rem 0.9rem",
                    borderRadius:"20px", cursor:"pointer", fontFamily:"'Cinzel',serif",
                    letterSpacing:"0.1em", fontWeight:600, minWidth:"60px",
                    transition:"all .2s",
                    background: justAdded || inList
                      ? "rgba(26,107,107,0.12)"
                      : "linear-gradient(135deg, var(--teal), #0D4040)",
                    color:  justAdded || inList ? "var(--teal)" : "white",
                    border: justAdded || inList ? "1px solid rgba(26,107,107,0.35)" : "none",
                    boxShadow: justAdded || inList ? "none" : "0 3px 12px rgba(26,107,107,0.3)",
                  }}>
                    {justAdded ? "✓ Done!" : inList ? "✓ Added" : saving ? "…" : "+ Add"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ── SONG LIST ── */}
        {songs.length > 0 && (
          <div className={`plR d4 ${vis ? "plV" : ""}`}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
              marginBottom:"1rem", flexWrap:"wrap", gap:"0.6rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.7rem" }}>
                <EqBars n={4} h={20} active color="var(--teal)" />
                <div>
                  <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem",
                    color:"var(--text-dark)", fontWeight:400 }}>
                    Guest Suggestions
                  </p>
                  <p style={{ fontSize:"0.68rem", color:"var(--text-muted)", marginTop:"1px" }}>
                    {songs.length} track{songs.length !== 1 ? "s" : ""} &amp; counting 🎉
                  </p>
                </div>
              </div>
              <button onClick={copyDJ} style={{
                fontSize:"0.65rem", padding:"0.42rem 1rem", borderRadius:"20px",
                fontFamily:"'Cinzel',serif", letterSpacing:"0.12em",
                cursor:"pointer", transition:"all .2s",
                background: copied ? "rgba(26,107,107,0.12)" : "rgba(200,150,60,0.1)",
                border: copied
                  ? "1px solid rgba(26,107,107,0.35)"
                  : "1px solid rgba(200,150,60,0.3)",
                color: copied ? "var(--teal)" : "var(--gold-dark)",
              }}>
                {copied ? "✓ Copied!" : "📋 Copy for DJ"}
              </button>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
              {songs.map((s, i) => (
                <div key={s.id} className="plSongRow plSlide"
                  style={{ display:"flex", alignItems:"center", gap:"0.75rem",
                    padding:"0.7rem 0.9rem", borderRadius:"14px",
                    background:"rgba(255,255,255,0.72)", backdropFilter:"blur(8px)",
                    border:"1px solid rgba(200,150,60,0.15)",
                    animationDelay:`${i * 0.04}s` }}>

                  <span style={{ fontSize:"0.65rem", color:"var(--text-muted)",
                    flexShrink:0, width:"16px", textAlign:"right",
                    fontFamily:"'Cinzel',serif" }}>{i + 1}</span>

                  {s.image
                    ? <img src={s.image} alt="" style={{ width:"40px", height:"40px",
                        borderRadius:"7px", objectFit:"cover", flexShrink:0,
                        boxShadow:"0 2px 8px rgba(26,107,107,0.15)" }} />
                    : <div style={{ width:"40px", height:"40px", borderRadius:"7px",
                        flexShrink:0, background:"rgba(26,107,107,0.07)",
                        display:"flex", alignItems:"center",
                        justifyContent:"center", fontSize:"0.9rem" }}>🎵</div>
                  }

                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.86rem",
                      color:"var(--text-dark)",
                      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {s.name}
                    </p>
                    <p style={{ fontSize:"0.69rem", color:"var(--text-soft)", marginTop:"1px",
                      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {s.artist}
                    </p>
                  </div>

                  <div className="plSmShow" style={{ display:"none",
                    textAlign:"right", flexShrink:0 }}>
                    <p style={{ fontSize:"0.65rem", color:"var(--teal)" }}>{s.by}</p>
                    <p style={{ fontSize:"0.58rem", color:"var(--text-muted)" }}>{s.at}</p>
                  </div>

                  <span className="plSmShow" style={{ display:"none",
                    fontSize:"0.68rem", color:"var(--text-muted)", flexShrink:0 }}>
                    {s.duration}
                  </span>

                  <a href={s.url} target="_blank" rel="noopener noreferrer"
                    style={{ flexShrink:0, opacity:0.4, transition:"opacity .2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity="0.9"}
                    onMouseLeave={(e) => e.currentTarget.style.opacity="0.4"}>
                    <MusicIcon size={15} />
                  </a>

                  <button onClick={() => remove(s.id)} style={{
                    background:"none", border:"none", cursor:"pointer",
                    fontSize:"0.75rem", color:"rgba(196,96,122,0.3)",
                    transition:"color .2s", padding:"0 2px", flexShrink:0 }}
                    onMouseEnter={(e) => e.currentTarget.style.color="rgba(196,96,122,0.75)"}
                    onMouseLeave={(e) => e.currentTarget.style.color="rgba(196,96,122,0.3)"}>
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop:"1.4rem", textAlign:"center" }}>
              <a href="https://spotify.com" target="_blank" rel="noopener noreferrer"
                style={{ display:"inline-flex", alignItems:"center", gap:"0.4rem",
                  textDecoration:"none", fontSize:"0.7rem", color:"var(--text-muted)" }}>
                Powered by <MusicIcon size={12} />
                <span style={{ color:"var(--teal)", fontWeight:600 }}>iTunes</span>
              </a>
            </div>
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {songs.length === 0 && results.length === 0 && (
          <div className={`plR d4 ${vis ? "plV" : ""}`}
            style={{ textAlign:"center", padding:"3rem 1rem" }}>
            {loadingList && (
              <p style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic",
                fontSize:"1rem", color:"var(--text-muted)", marginBottom:"2rem" }}>
                Loading playlist…
              </p>
            )}
            <div className="plSpin" style={{
              width:"60px", height:"60px", borderRadius:"50%",
              margin:"0 auto 1.2rem", opacity:0.7,
              background:`conic-gradient(
                var(--teal) 0deg 60deg, var(--parchment) 60deg 120deg,
                var(--gold) 120deg 180deg, var(--parchment) 180deg 240deg,
                var(--teal) 240deg 300deg, var(--parchment) 300deg 360deg)`,
              boxShadow:"0 0 0 3px var(--ivory), 0 0 0 4px var(--gold-light), 0 4px 20px rgba(200,150,60,0.2)",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <div style={{ width:"14px", height:"14px", borderRadius:"50%",
                background:"var(--ivory)", border:"2px solid var(--gold)" }} />
            </div>
            <p style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic",
              fontSize:"1.1rem", color:"var(--text-soft)" }}>
              The dancefloor is waiting…
            </p>
            <p style={{ fontSize:"0.82rem", color:"var(--text-muted)",
              marginTop:"0.4rem", fontWeight:300 }}>
              Be the first to drop a track and get the party started! 🕺
            </p>
            <div style={{ display:"flex", justifyContent:"center", gap:"5px", marginTop:"1.2rem" }}>
              {[0,1,2,3,4].map((j) => (
                <div key={j} style={{
                  width:"6px", height:"6px", borderRadius:"50%",
                  background:"var(--teal)", opacity:0.5,
                  animation:`plEq ${0.45 + j * 0.1}s ${j * 0.09}s ease-in-out infinite alternate`,
                }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
