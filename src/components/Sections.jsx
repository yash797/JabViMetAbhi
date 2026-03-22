import React, { useEffect, useRef, useState } from "react";

/* ─── Utility: useReveal hook ─── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

/* ─── Section heading ─── */
function SectionHead({ eyebrow, title, sub, ornament = "🌸", vis }) {
  return (
    <div className="text-center mb-10 sm:mb-14">
      <span className={`block text-xs tracking-widest uppercase mb-2 reveal ${vis ? "visible reveal-d1" : ""}`}
        style={{ fontFamily: "'Cinzel', serif", color: "var(--gold)", letterSpacing: "0.45em" }}>
        {eyebrow}
      </span>
      <h2 className={`reveal ${vis ? "visible reveal-d2" : ""}`}
        style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4.5vw, 3rem)", fontWeight: 400, color: "var(--text-dark)" }}>
        {title}
      </h2>
      {sub && (
        <p className={`mt-1 reveal ${vis ? "visible reveal-d3" : ""}`}
          style={{ fontFamily: "'EB Garamond', Georgia, serif", fontStyle: "italic", fontSize: "1rem", color: "var(--text-muted)" }}>
          {sub}
        </p>
      )}
      <div className={`flex items-center justify-center gap-3 mt-2 reveal ${vis ? "visible reveal-d4" : ""}`}>
        <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, var(--gold-light))" }} />
        <span>{ornament}</span>
        <div className="h-px w-12" style={{ background: "linear-gradient(90deg, var(--gold-light), transparent)" }} />
      </div>
    </div>
  );
}

/* ════════════════════════════════
   SUMMER BAND
════════════════════════════════ */
export function SummerBand() {
  return (
    <div className="summer-band py-5 px-4 text-center">
      <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "1.05rem", color: "var(--text-mid)" }}>
        ☀️ &nbsp; A summer wedding in sacred Shirdi — warm evenings, marigold skies &amp; love in full bloom &nbsp; ☀️
      </p>
    </div>
  );
}

/* ════════════════════════════════
   PEACOCK QUOTE BAND
════════════════════════════════ */
export function PeacockBand() {
  return (
    <div className="pq-band py-12 px-6 text-center relative overflow-hidden">
      <span className="absolute text-9xl opacity-5 pointer-events-none select-none"
        style={{ top: "50%", left: "8%", transform: "translateY(-50%)" }}>🦚</span>
      <span className="absolute text-9xl opacity-5 pointer-events-none select-none"
        style={{ top: "50%", right: "8%", transform: "translateY(-50%) scaleX(-1)" }}>🦚</span>
      <p style={{
        fontFamily: "'Playfair Display', serif", fontStyle: "italic",
        fontSize: "clamp(1.05rem, 2.5vw, 1.45rem)", color: "rgba(255,255,255,0.85)",
        maxWidth: "580px", margin: "0 auto", lineHeight: 1.7,
      }}>
        "As the peacock dances in the rain, may your love flourish through every season —
        vivid, joyful, and eternally beautiful."
      </p>
      <p
  className="mt-4 text-xs tracking-widest uppercase"
  style={{
    fontFamily: "'Cinzel', serif",
    color: "var(--gold-light)",
    opacity: 0.7,
    letterSpacing: "0.3em",
  }}
>
  ✦ &nbsp; Vidhi &amp; Abhishek &nbsp;
  <span className="block sm:inline mt-2 sm:mt-0">
    Shirdi, May 2026
  </span>
  &nbsp; ✦
</p>
    </div>
  );
}

/* ════════════════════════════════
   COUPLE
════════════════════════════════ */
function PersonCard({ frameClass, emoji, name, role, bio, vis, delay }) {
  return (
    <div className={`text-center max-w-xs mx-auto reveal ${vis ? `visible ${delay}` : ""}`}>
      <div className={`${frameClass} w-40 h-40 sm:w-48 sm:h-48 rounded-full mx-auto mb-5 flex items-center justify-center text-5xl sm:text-6xl`}
        style={{ border: "2px solid rgba(200,150,60,0.3)", boxShadow: "0 0 0 7px rgba(200,150,60,0.07), 0 8px 40px rgba(200,150,60,0.15)" }}>
        {emoji}
      </div>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 400, color: "var(--text-dark)" }}>{name}</p>
      <p className="mt-0.5 text-xs tracking-widest uppercase" style={{ fontFamily: "'Cinzel', serif", color: "var(--gold)", letterSpacing: "0.3em" }}>{role}</p>
      <p className="mt-3 text-sm font-light leading-relaxed" style={{ color: "var(--text-soft)" }}>{bio}</p>
    </div>
  );
}

export function Couple() {
  const [ref, vis] = useReveal();
  return (
    <section ref={ref} id="couple" className="py-16 sm:py-24 px-4"
      style={{ background: "linear-gradient(180deg, var(--ivory), rgba(242,196,196,0.1), var(--ivory))" }}>
      <SectionHead eyebrow="The Couple" title="Two Hearts, One Story" ornament="🌸" vis={vis} />
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 max-w-3xl mx-auto">
        <PersonCard frameClass="v-frame" emoji="🌺" name="Vidhi" role="The Bride"
          bio="Grace, warmth, and a smile that could light up the grandest palace — Vidhi steps into this new chapter carrying the love of her family and the promise of a radiant tomorrow."
          vis={vis} delay="reveal-d1" />

        {/* Ampersand divider */}
        <div className={`flex md:flex-col items-center gap-3 md:gap-4 reveal ${vis ? "visible reveal-d2" : ""}`}>
          <div className="w-16 md:w-px md:h-16 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "4rem", color: "var(--gold)", fontStyle: "italic", lineHeight: 1 }}>&amp;</span>
          <div className="w-16 md:w-px md:h-16 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
        </div>

        <PersonCard frameClass="a-frame" emoji="🦚" name="Abhishek" role="The Groom"
          bio="Steadfast, warm, and ready for life's greatest adventure — Abhishek arrives not just as a groom, but as Vidhi's forever companion, her person for every season."
          vis={vis} delay="reveal-d3" />
      </div>
    </section>
  );
}

/* ════════════════════════════════
   DRESS CODE
════════════════════════════════ */
const DRESS = [
  { cardClass:"dc-baarat",  icon:"🎺", event:"Baarat Swagat",      dress:"Ethnic Festive",       hint:"Traditional outfit, salwar suits & sarees in warm festive tones" },
  { cardClass:"dc-mahera",  icon:"🌺", event:"Mahera Ceremony",    dress:"Traditional Indian",   hint:"Classic silks, lehengas, kurtas in earthy hues" },
  { cardClass:"dc-sangeet", icon:"🎶", event:"Sangeet & DJ Night", dress:"Cocktail Glam",        hint:"Bold colours, sequins & fusion-ethnic ensembles" },
  { cardClass:"dc-carnival",icon:"🎡", event:"Carnival",      dress:"Shades of Pink",    hint:"Blush, rose, baby pink, pastel lilac — fully embrace the theme!" },
  { cardClass:"dc-wedding", icon:"💍", event:"Wedding Ceremony",   dress:"Royal Indian",         hint:"Rich silks, heavy lehengas & sherwanis." },
];

export function DressCode() {
  const [ref, vis] = useReveal();
  const delays = ["reveal-d1","reveal-d2","reveal-d3","reveal-d4","reveal-d5"];
  return (
    <section ref={ref} id="dresscode" className="py-16 sm:py-24 px-4" style={{ background: "var(--ivory)" }}>
      <SectionHead eyebrow="What to Wear" title="Dress Code" sub="Look your most beautiful for every celebration" ornament="👗" vis={vis} />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
        {DRESS.map((d, i) => (
          <div key={d.event}
            className={`${d.cardClass} border rounded-2xl p-5 text-center hover:-translate-y-1.5 transition-transform duration-300 reveal ${vis ? `visible ${delays[i]}` : ""}`}>
            <span className="block text-3xl mb-2">{d.icon}</span>
            <p className="text-xs tracking-widest uppercase mb-1" style={{ fontFamily: "'Cinzel', serif", color: "var(--text-muted)", letterSpacing: "0.18em" }}>{d.event}</p>
            <p className="font-medium" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: "var(--text-dark)" }}>{d.dress}</p>
            <p className="mt-1.5 text-xs font-light leading-snug" style={{ color: "var(--text-muted)" }}>{d.hint}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════
   LIVE WEATHER — Open-Meteo
   Shirdi: lat 19.7827, lon 74.4856
════════════════════════════════ */
// WMO weather code → human label + emoji
function parseWeather(code, isDay) {
  const map = {
    0:  { label: "Clear Sky",       emoji: isDay ? "☀️" : "🌙" },
    1:  { label: "Mostly Clear",    emoji: isDay ? "🌤️" : "🌙" },
    2:  { label: "Partly Cloudy",   emoji: "⛅" },
    3:  { label: "Overcast",        emoji: "☁️" },
    45: { label: "Foggy",           emoji: "🌫️" },
    48: { label: "Icy Fog",         emoji: "🌫️" },
    51: { label: "Light Drizzle",   emoji: "🌦️" },
    53: { label: "Drizzle",         emoji: "🌦️" },
    55: { label: "Heavy Drizzle",   emoji: "🌧️" },
    61: { label: "Light Rain",      emoji: "🌧️" },
    63: { label: "Rain",            emoji: "🌧️" },
    65: { label: "Heavy Rain",      emoji: "🌧️" },
    80: { label: "Rain Showers",    emoji: "🌦️" },
    81: { label: "Rain Showers",    emoji: "🌦️" },
    82: { label: "Heavy Showers",   emoji: "⛈️" },
    95: { label: "Thunderstorm",    emoji: "⛈️" },
    96: { label: "Thunderstorm",    emoji: "⛈️" },
    99: { label: "Thunderstorm",    emoji: "⛈️" },
  };
  return map[code] || { label: "Clear", emoji: "🌡️" };
}

function useShirdiWeather() {
  const [weather, setWeather] = useState({ temp: null, label: null, emoji: "🌡️", loading: true, error: false });

  useEffect(() => {
    const controller = new AbortController();
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=19.7827&longitude=74.4856&current=temperature_2m,weathercode,is_day&temperature_unit=celsius&timezone=Asia%2FKolkata",
      { signal: controller.signal }
    )
      .then((r) => r.json())
      .then((data) => {
        const c = data.current;
        const { label, emoji } = parseWeather(c.weathercode, c.is_day);
        setWeather({
          temp: Math.round(c.temperature_2m),
          label,
          emoji,
          loading: false,
          error: false,
        });
      })
      .catch((e) => {
        if (e.name !== "AbortError")
          setWeather({ temp: null, label: null, emoji: "🌡️", loading: false, error: true });
      });
    return () => controller.abort();
  }, []);

  return weather;
}

/* ════════════════════════════════
   VENUE + MAP
════════════════════════════════ */
export function Venue() {
  const [ref, vis] = useReveal();
  const weather = useShirdiWeather();

  // Build the weather display string
  const weatherVal = weather.loading
    ? "Fetching…"
    : weather.error
    ? "Unavailable"
    : `${weather.temp}°C · ${weather.label}`;

  const weatherEmoji = weather.loading ? "⏳" : weather.emoji;

  return (
    <section ref={ref} id="venue" className="py-16 sm:py-24 px-4"
      style={{ background: "linear-gradient(180deg, var(--ivory), rgba(200,150,60,0.05), var(--ivory))" }}>
      <SectionHead eyebrow="The Venue" title="Sapphero Resorts, Shirdi" sub="A regal setting for a royal celebration" ornament="🏰" vis={vis} />

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Map */}
        <div className={`map-card reveal ${vis ? "visible reveal-d1" : ""}`}>
          <iframe
            title="Sapphero Resorts Shirdi"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3752.3!2d74.4830702!3d19.7826971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdc5b9cf087a249%3A0xed17882c72d8338b!2sSapphero%20Resorts%20Shirdi!5e0!3m2!1sen!2sin!4v1700000000000"
            width="100%"
            height="360"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Info */}
        <div className={`flex flex-col gap-4 reveal ${vis ? "visible reveal-d2" : ""}`}>
          <div className="venue-header p-5 sm:p-6">
            <span className="block text-4xl mb-3">🦚</span>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.55rem", fontWeight: 400, color: "var(--text-dark)" }}>
              Sapphero Resorts Shirdi
            </p>
            <p className="mt-0.5 text-xs tracking-widest uppercase" style={{ fontFamily: "'Cinzel', serif", color: "var(--gold)", letterSpacing: "0.2em" }}>
              The Wedding Venue
            </p>
            <p className="mt-3 text-sm font-light leading-relaxed" style={{ color: "var(--text-soft)" }}>
              78/3, Laxmiwadi, Nighoj, Ta-Rahta, Dist,<br />
              beside Sainagar Railway Station,<br />
              Shirdi, Nighoj, Maharashtra – 423109
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-yellow-400 text-sm tracking-widest">★★★★☆</span>
              <span className="text-xs font-light" style={{ color: "var(--text-muted)" }}>4.2 · 651 reviews</span>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "📞",        label: "Contact", val: "+91 95793 45348"  },
              { icon: "📅",        label: "Dates",   val: "9–10 May 2026"    },
              { icon: weatherEmoji,label: "Shirdi Now", val: weatherVal,
                highlight: !weather.loading && !weather.error },
              { icon: "🕌",        label: "Nearby",  val: "Sai Baba Shirdi"  },
            ].map((ic) => (
              <div
                key={ic.label}
                className="venue-ic p-3 text-center"
                style={ic.highlight ? {
                  background: "linear-gradient(135deg, rgba(200,150,60,0.12), rgba(232,150,30,0.08))",
                  border: "1px solid rgba(200,150,60,0.35)",
                } : {}}
              >
                <span className="block text-2xl mb-1">{ic.icon}</span>
                <p className="text-xs uppercase tracking-wider"
                  style={{ fontFamily: "'Cinzel', serif", color: "var(--text-muted)", letterSpacing: "0.18em" }}>
                  {ic.label}
                </p>
                <p className="mt-0.5 text-sm"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: ic.highlight ? "var(--gold-dark)" : "var(--text-dark)",
                    fontWeight: ic.highlight ? 500 : 400,
                  }}>
                  {ic.val}
                </p>
              </div>
            ))}
          </div>

          <a
            href="https://www.google.com/maps/place/Sapphero+Resorts+Shirdi/@19.7826971,74.4830702,17z"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-directions py-3.5 px-4"
          >
            <span>📍</span> Get Directions on Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════
   HOW TO REACH (no stay card)
════════════════════════════════ */
const REACH = [
  {
    icon:"✈️", how:"By Air", from:"Shirdi Airport",
    detail:"Shirdi Airport (SAG) is just ~15 km away. Regular flights from Mumbai, Delhi, Hyderabad & Bangalore. Cabs available right at the airport.",
  },
  {
    icon:"🚂", how:"By Train", from:"Sainagar Shirdi Station",
    detail:"The resort is right beside Sainagar Shirdi Railway Station — a 2-minute walk! Direct trains from Mumbai, Pune, Nashik & major cities.",
  },
  {
    icon:"🚌", how:"By Road", from:"Via NH60 / Pune–Nashik",
    detail:"~240 km from Mumbai (4.5 hrs), ~190 km from Pune (3.5 hrs), ~90 km from Nashik (2 hrs) via NH60. Ample parking at the resort.",
  },
];

export function HowToReach() {
  const [ref, vis] = useReveal();
  const delays = ["reveal-d1","reveal-d2","reveal-d3"];
  return (
    <section ref={ref} className="pb-16 sm:pb-24 pt-0 px-4"
      style={{ background: "linear-gradient(180deg, rgba(200,150,60,0.04), var(--ivory))" }}>
      <div className="text-center mb-8 sm:mb-12">
        <span className={`block text-xs tracking-widest uppercase mb-2 reveal ${vis ? "visible reveal-d1" : ""}`}
          style={{ fontFamily: "'Cinzel', serif", color: "var(--gold)", letterSpacing: "0.45em" }}>
          Getting There
        </span>
        <h2 className={`reveal ${vis ? "visible reveal-d2" : ""}`}
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4.5vw, 3rem)", fontWeight: 400, color: "var(--text-dark)" }}>
          How to Reach Us
        </h2>
        <div className={`flex items-center justify-center gap-3 mt-2 reveal ${vis ? "visible reveal-d3" : ""}`}>
          <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, var(--gold-light))" }} />
          <span>✈️</span>
          <div className="h-px w-12" style={{ background: "linear-gradient(90deg, var(--gold-light), transparent)" }} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {REACH.map((r, i) => (
          <div key={r.how} className={`reach-card p-5 sm:p-6 text-center reveal ${vis ? `visible ${delays[i]}` : ""}`}>
            <span className="block text-4xl mb-3">{r.icon}</span>
            <p className="text-xs tracking-widest uppercase mb-1" style={{ fontFamily: "'Cinzel', serif", color: "var(--gold)", letterSpacing: "0.2em" }}>{r.how}</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: "var(--text-dark)" }}>{r.from}</p>
            <p className="mt-2 text-sm font-light leading-relaxed" style={{ color: "var(--text-soft)" }}>{r.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════
   FOOTER
════════════════════════════════ */
export function Footer() {
  return (
    <footer className="footer-bg py-16 px-4 text-center relative overflow-hidden">
      {/* Top gold line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-80"
        style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />

      {/* Decorative wave SVG */}
      <svg viewBox="0 0 500 35" className="w-full max-w-md mx-auto mb-6 opacity-25" fill="none">
        <path d="M0 17.5 Q125 0 250 17.5 Q375 35 500 17.5" stroke="#C8963C" strokeWidth="0.8" fill="none"/>
        <circle cx="250" cy="17.5" r="5" fill="#C8963C"/>
        <circle cx="185" cy="10" r="3" fill="#C8963C" opacity="0.6"/>
        <circle cx="315" cy="25" r="3" fill="#C8963C" opacity="0.6"/>
      </svg>

      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.6rem", color: "var(--gold)", fontWeight: 400 }}>
        #JabViMetAbhi 
        {/* <span style={{ fontStyle: "italic", color: "var(--gold)" }}>#JabViMetAbhi;</span> Abhishek */}
      </p>
      <p className="mt-2 text-xs tracking-widest uppercase" style={{ fontFamily: "'Cinzel', serif", color: "rgba(255,255,255,0.3)", letterSpacing: "0.35em" }}>
        9th &amp; 10th May, 2026
      </p>
      <p className="mt-1 text-xs tracking-wider font-light" style={{ color: "rgba(255,255,255,0.18)", letterSpacing: "0.12em" }}>
        Sapphero Resorts · Shirdi, Maharashtra
      </p>
      <span className="block text-3xl mt-5 opacity-25">🦚</span>
      <p className="mt-3" style={{ fontFamily: "'EB Garamond', Georgia, serif", fontStyle: "italic", fontSize: "1rem", color: "rgba(255,255,255,0.22)" }}>
        With love, laughter, and a peacock's blessing
      </p>
      <p className="mt-6 text-xs font-light" style={{ color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
        Made with ♥ for Vidhi &amp; Abhishek
      </p>
    </footer>
  );
}
