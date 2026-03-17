import React, { useEffect, useState, useRef } from "react";

const WEDDING_DATE = new Date("2026-05-09T11:00:00");

function pad(n) {
  return String(Math.max(0, n)).padStart(2, "0");
}

function calc() {
  const diff = WEDDING_DATE - new Date();
  if (diff <= 0) return { d: "00", h: "00", m: "00", s: "00" };
  return {
    d: pad(Math.floor(diff / 864e5)),
    h: pad(Math.floor((diff % 864e5) / 36e5)),
    m: pad(Math.floor((diff % 36e5) / 6e4)),
    s: pad(Math.floor((diff % 6e4) / 1e3)),
  };
}

function CDCard({ value, label }) {
  return (
    <div className="cd-card px-6 py-5 text-center min-w-[90px] sm:min-w-[108px]">
      <div
        className="leading-none"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(2.2rem, 6vw, 3.2rem)",
          fontWeight: 400,
          color: "var(--text-dark)",
        }}
      >
        {value}
      </div>
      <div
        className="mt-1 text-xs uppercase tracking-widest font-light"
        style={{ color: "var(--text-soft)", letterSpacing: "0.22em" }}
      >
        {label}
      </div>
    </div>
  );
}

export default function Countdown() {
  const [time, setTime] = useState(calc);
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative border-section py-16 sm:py-20 text-center"
      style={{ background: "linear-gradient(180deg, var(--ivory), rgba(200,150,60,0.06), var(--ivory))" }}
    >
      <span
        className={`block text-xs tracking-widest uppercase mb-2 reveal ${vis ? "visible reveal-d1" : ""}`}
        style={{ fontFamily: "'Cinzel', serif", color: "var(--gold)", letterSpacing: "0.45em" }}
      >
        Counting Down
      </span>
      <h2
        className={`reveal ${vis ? "visible reveal-d2" : ""}`}
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
          fontWeight: 400,
          color: "var(--text-dark)",
        }}
      >
        The Celebrations Begin In
      </h2>

      {/* Ornament */}
      <div className={`flex items-center justify-center gap-3 my-3 reveal ${vis ? "visible reveal-d3" : ""}`}>
        <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, var(--gold-light))" }} />
        <span>🌸</span>
        <div className="h-px w-12" style={{ background: "linear-gradient(90deg, var(--gold-light), transparent)" }} />
      </div>

      <div className={`flex flex-wrap gap-3 sm:gap-4 justify-center mt-4 reveal ${vis ? "visible reveal-d3" : ""}`}>
        <CDCard value={time.d} label="Days"    />
        <CDCard value={time.h} label="Hours"   />
        <CDCard value={time.m} label="Minutes" />
        <CDCard value={time.s} label="Seconds" />
      </div>
    </section>
  );
}
