import React from "react";

/* ──────────────────────────────────────────────────────────────
   MonogramSVG
   Recreates the logo: Mughal arch frame + peacock + gazebo +
   tropical leaves + pink flowers + "अV" gold monogram
   transparent background, scalable via `size` prop
────────────────────────────────────────────────────────────── */
export default function MonogramSVG({ size = 260 }) {
  return (
    <svg
      width={size}
      height={size * 1.1}
      viewBox="0 0 260 286"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Vidhi and Abhishek Monogram"
    >
      {/* ── Banana / Palm leaves behind arch ── */}
      {/* Left leaf cluster */}
      <ellipse cx="68" cy="52" rx="10" ry="42" fill="#4A9A4A" opacity="0.88" transform="rotate(-28 68 52)" />
      <ellipse cx="55" cy="58" rx="9" ry="38" fill="#3A7A3A" opacity="0.75" transform="rotate(-45 55 58)" />
      <ellipse cx="48" cy="45" rx="8" ry="34" fill="#6AAF6A" opacity="0.65" transform="rotate(-18 48 45)" />
      {/* Left leaf veins */}
      <line x1="68" y1="10" x2="50" y2="90" stroke="#2A5A2A" strokeWidth="0.7" opacity="0.5" />
      <line x1="55" y1="20" x2="35" y2="92" stroke="#2A5A2A" strokeWidth="0.6" opacity="0.4" />

      {/* Right leaf cluster */}
      <ellipse cx="192" cy="52" rx="10" ry="42" fill="#4A9A4A" opacity="0.88" transform="rotate(28 192 52)" />
      <ellipse cx="205" cy="58" rx="9" ry="38" fill="#3A7A3A" opacity="0.75" transform="rotate(45 205 58)" />
      <ellipse cx="212" cy="45" rx="8" ry="34" fill="#6AAF6A" opacity="0.65" transform="rotate(18 212 45)" />
      {/* Right leaf veins */}
      <line x1="192" y1="10" x2="210" y2="90" stroke="#2A5A2A" strokeWidth="0.7" opacity="0.5" />
      <line x1="205" y1="20" x2="225" y2="92" stroke="#2A5A2A" strokeWidth="0.6" opacity="0.4" />

      {/* ── Arch frame – filled ivory ── */}
      <path
        d="M72 280 L72 148 Q72 60 130 60 Q188 60 188 148 L188 280 Z"
        fill="#FAF6EE"
        opacity="0.97"
      />
      {/* Gold arch outer border */}
      <path
        d="M72 280 L72 148 Q72 60 130 60 Q188 60 188 148 L188 280"
        stroke="#C8963C"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Gold arch inner border */}
      <path
        d="M82 280 L82 152 Q82 74 130 74 Q178 74 178 152 L178 280"
        stroke="#C8963C"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />

      {/* Arch top keystone ornament */}
      <circle cx="130" cy="57" r="8" stroke="#C8963C" strokeWidth="1.5" fill="none" />
      <circle cx="130" cy="57" r="3" fill="#C8963C" opacity="0.8" />
      <line x1="95" y1="64" x2="115" y2="64" stroke="#C8963C" strokeWidth="1" opacity="0.5" />
      <line x1="145" y1="64" x2="165" y2="64" stroke="#C8963C" strokeWidth="1" opacity="0.5" />

      {/* ── Monogram "अV" ── */}
      {/* The अ (Devanagari A) for Abhishek */}
      <text
        x="108"
        y="128"
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize="38"
        fontWeight="500"
        fill="#C8963C"
        letterSpacing="-2"
      >
        अ
      </text>
      {/* The V for Vidhi (Latin) */}
      <text
        x="136"
        y="128"
        fontFamily="'Cinzel', serif"
        fontSize="40"
        fontWeight="600"
        fill="#C8963C"
        letterSpacing="0"
      >
        V
      </text>

      {/* Small floral sprig between monogram and peacock */}
      <circle cx="152" cy="138" r="4" fill="#C4607A" opacity="0.7" />
      <circle cx="144" cy="132" r="3" fill="#D4848E" opacity="0.6" />
      <circle cx="160" cy="133" r="2.5" fill="#C4607A" opacity="0.55" />
      <path d="M148 140 Q152 150 158 148" stroke="#6AAF6A" strokeWidth="1" fill="none" />
      <ellipse cx="150" cy="152" rx="5" ry="2.5" fill="#6AAF6A" opacity="0.6" transform="rotate(-20 150 152)" />
      <ellipse cx="158" cy="150" rx="4" ry="2" fill="#4A9A4A" opacity="0.5" transform="rotate(15 158 150)" />

      {/* ── Mughal Gazebo / Chhatri (left inside arch) ── */}
      {/* Dome */}
      <ellipse cx="105" cy="192" rx="20" ry="12" fill="#EDE0C4" stroke="#C8963C" strokeWidth="1" />
      <path d="M85 192 Q105 170 125 192" fill="#F5EDD8" stroke="#C8963C" strokeWidth="1" />
      {/* Pillars */}
      <rect x="88" y="192" width="4" height="24" fill="#EDE0C4" stroke="#C8963C" strokeWidth="0.5" rx="1" />
      <rect x="96" y="192" width="4" height="24" fill="#EDE0C4" stroke="#C8963C" strokeWidth="0.5" rx="1" />
      <rect x="104" y="192" width="4" height="24" fill="#EDE0C4" stroke="#C8963C" strokeWidth="0.5" rx="1" />
      <rect x="112" y="192" width="4" height="24" fill="#EDE0C4" stroke="#C8963C" strokeWidth="0.5" rx="1" />
      <rect x="120" y="192" width="4" height="24" fill="#EDE0C4" stroke="#C8963C" strokeWidth="0.5" rx="1" />
      {/* Base */}
      <rect x="83" y="214" width="44" height="5" fill="#EDE0C4" stroke="#C8963C" strokeWidth="0.5" rx="1" />
      {/* Dome finial */}
      <circle cx="105" cy="170" r="3" fill="#C8963C" opacity="0.8" />
      <line x1="105" y1="173" x2="105" y2="180" stroke="#C8963C" strokeWidth="1" />

      {/* ── Pink flowers around base ── */}
      {/* Flower 1 */}
      <circle cx="88" cy="248" r="8" fill="#F2C4C4" opacity="0.8" />
      <circle cx="88" cy="248" r="3" fill="#C8963C" opacity="0.7" />
      <circle cx="88" cy="240" r="5" fill="#F2C4C4" opacity="0.5" />
      <circle cx="95" cy="243" r="5" fill="#D4848E" opacity="0.45" />
      <circle cx="93" cy="253" r="5" fill="#F2C4C4" opacity="0.45" />
      <circle cx="83" cy="253" r="5" fill="#D4848E" opacity="0.4" />
      <circle cx="81" cy="243" r="5" fill="#F2C4C4" opacity="0.45" />
      {/* Flower 2 */}
      <circle cx="108" cy="258" r="7" fill="#E8B4B0" opacity="0.75" />
      <circle cx="108" cy="258" r="3" fill="#C8963C" opacity="0.65" />
      <circle cx="108" cy="251" r="4" fill="#F2C4C4" opacity="0.5" />
      <circle cx="114" cy="254" r="4" fill="#E8B4B0" opacity="0.45" />
      <circle cx="113" cy="263" r="4" fill="#F2C4C4" opacity="0.42" />
      <circle cx="103" cy="263" r="4" fill="#E8B4B0" opacity="0.42" />
      {/* Flower 3 - small bud */}
      <circle cx="125" cy="252" r="5" fill="#F5C4C0" opacity="0.7" />
      <circle cx="125" cy="252" r="2" fill="#C8963C" opacity="0.6" />
      {/* Stems & grass */}
      <path d="M88 256 Q86 268 82 272" stroke="#4A9A4A" strokeWidth="1" fill="none" opacity="0.7" />
      <path d="M108 265 Q107 274 104 278" stroke="#4A9A4A" strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M75 270 Q78 262 82 272" stroke="#6AAF6A" strokeWidth="0.8" fill="none" opacity="0.55" />
      <path d="M130 265 Q127 258 125 266" stroke="#6AAF6A" strokeWidth="0.8" fill="none" opacity="0.5" />

      {/* ── Peacock (right side, overlapping arch) ── */}
      {/* Tail fan feathers */}
      <ellipse cx="178" cy="220" rx="28" ry="10" fill="#1A6B6B" opacity="0.35" transform="rotate(-5 178 220)" />
      <ellipse cx="182" cy="228" rx="26" ry="9" fill="#2E9090" opacity="0.3" transform="rotate(10 182 228)" />
      <ellipse cx="175" cy="235" rx="24" ry="8" fill="#1A6B6B" opacity="0.28" transform="rotate(-10 175 235)" />
      <ellipse cx="185" cy="238" rx="22" ry="7" fill="#2E9090" opacity="0.25" transform="rotate(15 185 238)" />
      <ellipse cx="170" cy="242" rx="20" ry="7" fill="#1A6B6B" opacity="0.25" transform="rotate(-18 170 242)" />

      {/* Peacock feather eyes */}
      {[
        { cx: 180, cy: 214 },
        { cx: 186, cy: 222 },
        { cx: 176, cy: 228 },
        { cx: 184, cy: 233 },
        { cx: 172, cy: 238 },
      ].map((p, i) => (
        <g key={i}>
          <circle cx={p.cx} cy={p.cy} r="5.5" fill="#1A6B6B" opacity="0.4" />
          <circle cx={p.cx} cy={p.cy} r="3.5" fill="#2E9090" opacity="0.5" />
          <circle cx={p.cx} cy={p.cy} r="1.8" fill="#C8963C" opacity="0.75" />
        </g>
      ))}

      {/* Peacock body */}
      <ellipse cx="160" cy="210" rx="14" ry="28" fill="#1A6B6B" opacity="0.88" transform="rotate(8 160 210)" />
      {/* Breast highlight */}
      <ellipse cx="157" cy="205" rx="8" ry="16" fill="#2E9090" opacity="0.6" transform="rotate(5 157 205)" />
      {/* Wing detail */}
      <ellipse cx="165" cy="215" rx="10" ry="18" fill="#0D4040" opacity="0.5" transform="rotate(12 165 215)" />

      {/* Neck */}
      <ellipse cx="152" cy="180" rx="8" ry="18" fill="#1A6B6B" opacity="0.9" transform="rotate(-5 152 180)" />
      <ellipse cx="150" cy="178" rx="5" ry="14" fill="#2E9090" opacity="0.6" transform="rotate(-3 150 178)" />

      {/* Head */}
      <circle cx="149" cy="162" r="11" fill="#1A6B6B" opacity="0.9" />
      <circle cx="149" cy="162" r="7" fill="#2E9090" opacity="0.7" />
      <circle cx="147" cy="159" r="3" fill="#0D4040" opacity="0.9" />
      <circle cx="146" cy="158" r="1.2" fill="white" opacity="0.9" />

      {/* Crest feathers */}
      <line x1="149" y1="151" x2="145" y2="140" stroke="#C8963C" strokeWidth="0.8" opacity="0.8" />
      <line x1="149" y1="151" x2="149" y2="138" stroke="#C8963C" strokeWidth="0.8" opacity="0.8" />
      <line x1="149" y1="151" x2="153" y2="140" stroke="#C8963C" strokeWidth="0.8" opacity="0.8" />
      <circle cx="145" cy="139" r="2.5" fill="#C8963C" opacity="0.8" />
      <circle cx="149" cy="137" r="2.5" fill="#C8963C" opacity="0.8" />
      <circle cx="153" cy="139" r="2.5" fill="#C8963C" opacity="0.8" />

      {/* Beak */}
      <path d="M158 162 L166 158 L158 165 Z" fill="#C8963C" opacity="0.85" />

      {/* Feet/legs */}
      <line x1="155" y1="238" x2="152" y2="260" stroke="#0D4040" strokeWidth="1.5" opacity="0.6" />
      <line x1="160" y1="238" x2="163" y2="260" stroke="#0D4040" strokeWidth="1.5" opacity="0.6" />
      <path d="M152 260 L144 264 M152 260 L155 265" stroke="#0D4040" strokeWidth="1" opacity="0.5" />
      <path d="M163 260 L158 265 M163 260 L168 263" stroke="#0D4040" strokeWidth="1" opacity="0.5" />

      {/* ── Gold sparkle dots ── */}
      {[
        { cx: 80, cy: 155, r: 1.8 },
        { cx: 170, cy: 100, r: 1.5 },
        { cx: 90, cy: 100, r: 1.8 },
        { cx: 135, cy: 162, r: 1.5 },
        { cx: 100, cy: 235, r: 1.5 },
      ].map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="#C8963C" opacity="0.7" />
      ))}
    </svg>
  );
}
