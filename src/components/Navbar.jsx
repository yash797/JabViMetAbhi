import React, { useState, useEffect } from "react";
import Monogram from "./av_monogram.png";

const links = [
  { label: "Events", href: "#events" },
  { label: "Couple", href: "#couple" },
  { label: "Playlist", href: "#playlist" },
  { label: "Attire", href: "#dresscode" },
  { label: "Venue", href: "#venue" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (href) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 nav-glass ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => scrollTo("#home")}
          className="flex items-center gap-2 font-cinzel text-base tracking-widest text-yellow-800 focus:outline-none"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          <img src={Monogram} width="38px" />
          <span>V &amp; A</span>
        </button>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-7 list-none">
          {links.map((l) => (
            <li key={l.href}>
              <button
                onClick={() => scrollTo(l.href)}
                className="text-xs tracking-widest uppercase font-light transition-colors duration-200 focus:outline-none"
                style={{
                  fontFamily: "'Lato', sans-serif",
                  color: "var(--text-mid)",
                  letterSpacing: "0.22em",
                }}
                onMouseEnter={(e) => (e.target.style.color = "var(--gold)")}
                onMouseLeave={(e) => (e.target.style.color = "var(--text-mid)")}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1 focus:outline-none"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span
            className="block h-0.5 w-6 transition-all duration-300"
            style={{
              background: "var(--gold)",
              transform: open ? "rotate(45deg) translate(4px, 4px)" : "none",
            }}
          />
          <span
            className="block h-0.5 w-6 transition-all duration-300"
            style={{
              background: "var(--gold)",
              opacity: open ? 0 : 1,
            }}
          />
          <span
            className="block h-0.5 w-6 transition-all duration-300"
            style={{
              background: "var(--gold)",
              transform: open ? "rotate(-45deg) translate(4px, -4px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "260px" : "0" }}
      >
        <div
          className="px-6 pb-4 pt-1 flex flex-col gap-3 border-t"
          style={{ borderColor: "var(--border-gold)" }}
        >
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="text-left text-xs tracking-widest uppercase font-light py-1.5 focus:outline-none"
              style={{
                fontFamily: "'Cinzel', serif",
                color: "var(--text-mid)",
                letterSpacing: "0.25em",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
