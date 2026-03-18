import React, { useEffect, useRef } from "react";
import MonogramSVG from "./MonogramSVG";
import Monogram from "./av_monogram.png";
import { CornerTL, CornerTR, CornerBL, CornerBR } from "./CornerFloral";

/* ── Floating petal colours ── */
const PETAL_COLORS = [
  "#F2C4C4",
  "#E8961E",
  "#6AAF6A",
  "#D4848E",
  "#F5C040",
  "#D4BDC8",
  "#FDDDB0",
  "#C4B8D4",
];

/* ── Gold sparkle positions ── */
const SPARKLES = [
  { top: "18%", left: "12%", dur: "2.8s", delay: "0.3s" },
  { top: "22%", left: "88%", dur: "3.1s", delay: "0.9s" },
  { top: "55%", left: "6%", dur: "2.5s", delay: "1.5s" },
  { top: "60%", left: "93%", dur: "2.9s", delay: "0.5s" },
  { top: "35%", left: "92%", dur: "3.3s", delay: "1.2s" },
  { top: "75%", left: "15%", dur: "2.6s", delay: "0.7s" },
  { top: "15%", left: "55%", dur: "3.0s", delay: "2.0s" },
  { top: "80%", left: "75%", dur: "2.7s", delay: "1.8s" },
  { top: "42%", left: "4%", dur: "3.2s", delay: "0.4s" },
  { top: "25%", left: "50%", dur: "2.4s", delay: "1.3s" },
];

export default function Hero() {
  const petalsRef = useRef(null);

  useEffect(() => {
    const container = petalsRef.current;
    if (!container) return;
    const petals = [];
    for (let i = 0; i < 20; i++) {
      const el = document.createElement("div");
      const s = Math.random() * 10 + 6;
      el.className = "petal";
      Object.assign(el.style, {
        width: `${s}px`,
        height: `${s * 0.65}px`,
        background:
          PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 30 - 10}%`,
        animationDuration: `${Math.random() * 12 + 8}s`,
        animationDelay: `${Math.random() * 8}s`,
        opacity: "0",
      });
      container.appendChild(el);
      petals.push(el);
    }
    return () => petals.forEach((p) => p.remove());
  }, []);

  /* Parallax on scroll */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const logo = document.getElementById("hero-logo-wrap");
      const names = document.getElementById("hero-names");
      if (y < 700) {
        if (logo) logo.style.transform = `translateY(${y * 0.12}px)`;
        if (names) names.style.opacity = String(Math.max(0, 1 - y / 380));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-16 px-4"
    >
      {/* Layered background */}
      <div className="absolute inset-0 hero-bg" />

      {/* Shimmer line below nav */}
      <div
        className="absolute shimmer-line anim-shimmer"
        style={{ top: "64px", left: 0, right: 0, height: "1px" }}
      />

      {/* Petal container */}
      <div
        ref={petalsRef}
        className="absolute inset-0 overflow-hidden pointer-events-none z-10"
      />

      {/* Gold sparkles */}
      {SPARKLES.map((s, i) => (
        <div
          key={i}
          className="sparkle-dot anim-sparkle"
          style={{
            top: s.top,
            left: s.left,
            animationDuration: s.dur,
            animationDelay: s.delay,
            zIndex: 11,
          }}
        />
      ))}

      {/* Mughal arch watermark */}
      <svg
        className="absolute anim-arch"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -52%)",
          width: "min(500px, 85vw)",
          height: "min(570px, 88vh)",
          pointerEvents: "none",
          zIndex: 1,
        }}
        viewBox="0 0 500 580"
        fill="none"
      >
        <path
          d="M80 580 L80 220 Q80 60 250 60 Q420 60 420 220 L420 580"
          stroke="rgba(200,150,60,0.11)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M110 580 L110 228 Q110 100 250 100 Q390 100 390 228 L390 580"
          stroke="rgba(200,150,60,0.07)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M200 70 Q250 30 300 70"
          stroke="rgba(200,150,60,0.14)"
          strokeWidth="1.5"
          fill="none"
        />
        <circle
          cx="250"
          cy="55"
          r="12"
          stroke="rgba(200,150,60,0.14)"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="250" cy="55" r="5" fill="rgba(200,150,60,0.14)" />
        <rect
          x="60"
          y="200"
          width="20"
          height="30"
          rx="2"
          stroke="rgba(200,150,60,0.09)"
          strokeWidth="1"
          fill="none"
        />
        <rect
          x="420"
          y="200"
          width="20"
          height="30"
          rx="2"
          stroke="rgba(200,150,60,0.09)"
          strokeWidth="1"
          fill="none"
        />
        <circle
          cx="250"
          cy="180"
          r="30"
          stroke="rgba(200,150,60,0.07)"
          strokeWidth="1"
          fill="none"
        />
        <circle
          cx="250"
          cy="180"
          r="20"
          stroke="rgba(200,150,60,0.05)"
          strokeWidth="1"
          fill="none"
        />
        <line
          x1="80"
          y1="580"
          x2="420"
          y2="580"
          stroke="rgba(200,150,60,0.11)"
          strokeWidth="1.5"
        />
        <path
          d="M80 580 Q40 520 30 460 Q20 400 50 350"
          stroke="rgba(58,122,58,0.07)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M420 580 Q460 520 470 460 Q480 400 450 350"
          stroke="rgba(58,122,58,0.07)"
          strokeWidth="1"
          fill="none"
        />
      </svg>

      {/* Corner botanicals */}
      <CornerTL />
      <CornerTR />
      <CornerBL />
      <CornerBR />

      {/* ── Hero content ── */}
      <div className="relative z-20 flex flex-col items-center text-center w-full max-w-3xl mx-auto">
        {/* Eyebrow */}
        <p
          className="hero-eyebrow mb-6 tracking-widest text-xs uppercase"
          style={{
            fontFamily: "'Cinzel', serif",
            color: "var(--gold)",
            letterSpacing: "0.55em",
          }}
        >
          ✦ &nbsp; Together with their families &nbsp; ✦
        </p>

        {/* Logo monogram */}
        <div id="hero-logo-wrap" className="hero-logo relative mb-4 md:mb-6">
          <div
            className="logo-glow anim-pulse-glow absolute rounded-full pointer-events-none"
            style={{ inset: "-24px", borderRadius: "50%" }}
          />
          <div
            className="relative"
            style={{ filter: "drop-shadow(0 6px 30px rgba(200,150,60,0.45))" }}
          >
            <img
              src={Monogram}
              alt="Monogram"
              className="w-[250px] object-contain"
              draggable={false}
            />
            {/* <Monogram size={220} /> */}
          </div>
        </div>

        {/* Names */}
        <h1
          id="hero-names"
          className="hero-names leading-none text-center"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(3.5rem, 11vw, 8rem)",
            fontWeight: 400,
            color: "var(--text-dark)",
          }}
        >
          Vidhi
          <span
            className="block"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "0.38em",
              color: "var(--gold)",
              fontStyle: "italic",
              letterSpacing: "0.06em",
              margin: "0.25rem 0",
              fontWeight: 400,
            }}
          >
            &amp;
          </span>
          Abhishek
        </h1>

        {/* Ornament divider */}
        <div className="hero-ornament flex items-center gap-3 md:gap-4 my-4 md:my-5">
          <div
            className="h-px w-16 md:w-24"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--gold-light))",
            }}
          />
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rotate-45"
              style={{ background: "var(--gold)" }}
            />
            <span
              className="text-xl"
              style={{ filter: "drop-shadow(0 2px 8px rgba(26,107,107,0.5))" }}
            >
              🦚
            </span>
            <div
              className="w-1.5 h-1.5 rotate-45"
              style={{ background: "var(--gold)" }}
            />
          </div>
          <div
            className="h-px w-16 md:w-24"
            style={{
              background:
                "linear-gradient(90deg, var(--gold-light), transparent)",
            }}
          />
        </div>

        {/* Date + venue */}
        <div className="hero-date-blk text-center">
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
              fontStyle: "italic",
              color: "var(--text-mid)",
              letterSpacing: "0.04em",
            }}
          >
            9th &amp; 10th May, 2026
          </p>
          <p
            className="mt-1 tracking-widest uppercase text-xs font-light"
            style={{
              fontFamily: "'Cinzel', serif",
              color: "var(--text-soft)",
              letterSpacing: "0.3em",
            }}
          >
            Sapphero Resorts, Shirdi
          </p>
          {/* <p
            className="mt-0.5 tracking-wider uppercase text-xs font-light"
            style={{ color: "var(--text-muted)", letterSpacing: "0.18em" }}
          >
            Maharashtra, India
          </p> */}
        </div>

        <div
          className="
    hero-pill
    mt-4
    inline-flex flex-col sm:flex-row
    items-center justify-center
    gap-1 sm:gap-2
    px-3 py-1.5
    sm:px-4 sm:py-2 md:px-5
    text-[10px] sm:text-xs md:text-sm
    tracking-[0.15em] sm:tracking-[0.2em]
    rounded-full
    text-center
    max-w-[90%] sm:max-w-fit
  "
          style={{
            fontFamily: "'Cinzel', serif",
            background:
              "linear-gradient(135deg, rgba(232,150,30,0.15), rgba(200,150,60,0.1))",
            border: "1px solid rgba(200,150,60,0.35)",
            color: "var(--gold-dark)",
          }}
        >
          <span>☀️ A Summer Wedding</span>

          {/* Divider only on larger screens */}
          <span className="hidden sm:inline">&nbsp;·&nbsp;</span>

          <span>🕶️ Carry Your Sunglasses!</span>
        </div>

        {/* CTAs */}
        <div className="hero-ctas flex flex-wrap gap-3 mt-7 justify-center">
          <button
            className="btn-gold text-xs px-7 py-3.5"
            onClick={() => scrollTo("events")}
          >
            View Schedule
          </button>
          <button
            className="btn-outline text-xs px-7 py-3.5"
            onClick={() => scrollTo("venue")}
          >
            Venue &amp; Directions
          </button>
        </div>
      </div>

      {/* Scroll nudge */}
      <div
        className="anim-breathe absolute bottom-6"
        style={{ left: "50%", transform: "translateX(-50%)" }}
      >
        <div
          className="w-px h-9 mx-auto mb-1"
          style={{
            background: "linear-gradient(180deg, var(--gold), transparent)",
          }}
        />
        <span
          className="block text-center text-xs tracking-widest uppercase"
          style={{
            color: "var(--text-muted)",
            letterSpacing: "0.22em",
            fontSize: "0.6rem",
          }}
        >
          Scroll
        </span>
      </div>
    </section>
  );
}
