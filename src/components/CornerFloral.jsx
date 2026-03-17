import React from "react";

/* Reusable botanical corner – mirrored via CSS transform for each corner */
function CornerFloral() {
  return (
    <svg viewBox="0 0 280 260" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main stems */}
      <path d="M15 15 Q75 42 58 118 Q44 178 94 228 Q132 262 202 248" stroke="#3A7A3A" strokeWidth="1.5" fill="none" opacity="0.7"/>
      <path d="M60 10 Q90 50 75 120 Q60 180 100 220" stroke="#6AAF6A" strokeWidth="1" fill="none" opacity="0.4"/>

      {/* Banana leaves */}
      <ellipse cx="52" cy="28" rx="28" ry="11" fill="#6AAF6A" opacity="0.58" transform="rotate(-35 52 28)"/>
      <ellipse cx="28" cy="58" rx="24" ry="10" fill="#3A7A3A" opacity="0.5" transform="rotate(-58 28 58)"/>
      <ellipse cx="16" cy="92" rx="22" ry="9" fill="#6AAF6A" opacity="0.45" transform="rotate(-78 16 92)"/>
      <ellipse cx="88" cy="20" rx="30" ry="11" fill="#3A7A3A" opacity="0.4" transform="rotate(-18 88 20)"/>
      {/* Leaf veins */}
      <line x1="52" y1="5" x2="34" y2="48" stroke="#2A5A2A" strokeWidth="0.7" opacity="0.35"/>
      <line x1="28" y1="32" x2="10" y2="78" stroke="#2A5A2A" strokeWidth="0.6" opacity="0.28"/>

      {/* Main rose / marigold */}
      <circle cx="78" cy="78" r="22" fill="#E8961E" opacity="0.28"/>
      <circle cx="78" cy="78" r="5" fill="#C8963C" opacity="0.7"/>
      <ellipse cx="78" cy="58" rx="8" ry="14" fill="#FDDDB0" opacity="0.55" transform="rotate(-5 78 58)"/>
      <ellipse cx="93" cy="68" rx="8" ry="14" fill="#F5C4B0" opacity="0.5" transform="rotate(40 93 68)"/>
      <ellipse cx="91" cy="88" rx="8" ry="14" fill="#FDDDB0" opacity="0.5" transform="rotate(82 91 88)"/>
      <ellipse cx="78" cy="98" rx="8" ry="14" fill="#F5C4B0" opacity="0.5" transform="rotate(130 78 98)"/>
      <ellipse cx="63" cy="88" rx="8" ry="14" fill="#FDDDB0" opacity="0.48" transform="rotate(175 63 88)"/>

      {/* Pink blossom */}
      <circle cx="148" cy="55" r="14" fill="#F2C4C4" opacity="0.4"/>
      <circle cx="148" cy="55" r="4" fill="#C8963C" opacity="0.55"/>
      <ellipse cx="148" cy="43" rx="5" ry="10" fill="#F2C4C4" opacity="0.5"/>
      <ellipse cx="159" cy="51" rx="5" ry="10" fill="#D4BDC8" opacity="0.45" transform="rotate(42 159 51)"/>
      <ellipse cx="157" cy="64" rx="5" ry="10" fill="#F2C4C4" opacity="0.42" transform="rotate(85 157 64)"/>
      <ellipse cx="139" cy="64" rx="5" ry="10" fill="#D4BDC8" opacity="0.42" transform="rotate(140 139 64)"/>

      {/* Small marigold */}
      <circle cx="62" cy="168" r="14" fill="#F5C040" opacity="0.28"/>
      <circle cx="62" cy="168" r="5" fill="#E8961E" opacity="0.45"/>
      <circle cx="62" cy="168" r="2" fill="#C8963C" opacity="0.6"/>

      {/* Peacock feather eye accent */}
      <circle cx="198" cy="88" r="10" fill="#1A6B6B" opacity="0.22"/>
      <circle cx="198" cy="88" r="5" fill="#2E9090" opacity="0.3"/>
      <circle cx="198" cy="88" r="2.5" fill="#C8963C" opacity="0.55"/>

      {/* Floating gold dots */}
      <circle cx="42" cy="112" r="2.2" fill="#C8963C" opacity="0.65"/>
      <circle cx="112" cy="42" r="2"   fill="#C8963C" opacity="0.6"/>
      <circle cx="168" cy="112" r="2"  fill="#C8963C" opacity="0.55"/>
      <circle cx="225" cy="65" r="1.8" fill="#C8963C" opacity="0.45"/>
    </svg>
  );
}

export function CornerTL() {
  return (
    <div className="absolute top-16 left-0 w-48 md:w-64 lg:w-72 pointer-events-none opacity-50 z-10">
      <CornerFloral />
    </div>
  );
}

export function CornerTR() {
  return (
    <div className="absolute top-16 right-0 w-48 md:w-64 lg:w-72 pointer-events-none opacity-50 z-10" style={{ transform: "scaleX(-1)" }}>
      <CornerFloral />
    </div>
  );
}

export function CornerBL() {
  return (
    <div className="absolute bottom-0 left-0 w-36 md:w-48 pointer-events-none opacity-32 z-10" style={{ transform: "scaleY(-1)" }}>
      <CornerFloral />
    </div>
  );
}

export function CornerBR() {
  return (
    <div className="absolute bottom-0 right-0 w-36 md:w-48 pointer-events-none opacity-32 z-10" style={{ transform: "scale(-1,-1)" }}>
      <CornerFloral />
    </div>
  );
}
