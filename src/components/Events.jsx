import React, { useEffect, useRef, useState } from "react";

const DAY1 = [
  {
    time: "11:00", ap: "AM", icon: "🎺", colorClass: "ev-baarat",
    name: "Baarat Swagat", tag: "tag-baarat", tagLabel: "Baarat · Procession",
    desc: "The groom's grand procession arrives at the resort gates, welcomed with dhol, shehnai, and the warmth of both families coming together for the very first time.",
  },
  //{
    //time: "1:00", ap: "PM", icon: "🍽️", colorClass: "ev-lunch",
   // name: "Shahi Bhoj", tag: "tag-lunch", tagLabel: "Lunch · Family Feast",
    //desc: "A joyful feast for both families — celebrate new bonds over traditional flavours and warm hospitality under the glorious Shirdi sun.",
  //},
  {
    time: "4:00", ap: "PM", icon: "🌺", colorClass: "ev-mahera",
    name: "Mahera Ceremony", tag: "tag-mahera", tagLabel: "Mahera · Bride's Side",
    desc: "A deeply touching tradition — the bride's maternal side showers her with gifts, blessings, and love as she prepares to step into her new life.",
  },
  {
    time: "7:30", ap: "PM", icon: "🎶", colorClass: "ev-sangeet",
    name: "Sangeet Night", tag: "tag-sangeet", tagLabel: "Sangeet · Music & Dance",
    desc: "Music, laughter, and performances — families serenade the couple with songs and dances that will be remembered for generations.",
  },
  {
    time: "10:00", ap: "PM", icon: "🎧", colorClass: "ev-dj",
    name: "DJ Night", tag: "tag-dj", tagLabel: "DJ Night · Party",
    desc: "The night ignites — dance floors, lights, and the best beats as the celebration continues late into the warm Shirdi night. Dress to dance and shine!",
  },
];

const DAY2 = [
  {
    time: "10:00", ap: "AM", icon: "🎡", colorClass: "ev-carnival",
    name: "Carnival", tag: "tag-carnival", tagLabel: "Carnival · Shades of Pink Theme",
    desc: "Start the morning in pink! A whimsical carnival gathering — games, cotton candy, photo booths, and pastel joy for the entire family. Dress code: pastel pinks.",
  },
  {
     time: "12:00", ap: "PM", icon: "🏺", colorClass: "ev-haldi",
     name: "Beh Ceremony", tag: "tag-haldi", tagLabel: "Haldi · Sacred Ritual",
     desc: "Married women carry decorated pots with songs and dance, invoking blessings and marking a joyful start to the wedding celebrations.",
   },
  {
    time: "4:30", ap: "PM", icon: "🐎", colorClass: "ev-baarat2",
    name: "Baarat Procession", tag: "tag-baarat", tagLabel: "Baarat · Royal Entry",
    desc: "Abhishek arrives in royal splendour — the wedding procession with dhol, horse, and family dancing all the way to the mandap. An unforgettable entry.",
  },
  {
    time: "7:00", ap: "PM", icon: "💍", colorClass: "ev-wedding",
    name: "The Wedding Ceremony", tag: "tag-wedding", tagLabel: "Vivah · The Main Event",
    desc: "Under the stars of Shirdi's summer sky, Vidhi and Abhishek take their sacred vows — the varmala, the pheras, and the beginning of forever.",
  },
];

function EventCard({ ev, delayClass }) {
  return (
    <div className={`event-card ${delayClass}`}>
      {/* Time column */}
      <div
        className={`${ev.colorClass} flex flex-col items-center justify-center py-5 px-2 text-center`}
      >
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: "white", lineHeight: 1.2 }}>
          {ev.time}
        </p>
        <p className="text-xs mt-0.5 tracking-wider" style={{ color: "rgba(255,255,255,0.72)", letterSpacing: "0.12em" }}>
          {ev.ap}
        </p>
        <span className="text-2xl mt-2">{ev.icon}</span>
      </div>
      {/* Body */}
      <div className="ev-body">
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 400, color: "var(--text-dark)" }}>
          {ev.name}
        </p>
        <p className="mt-1 text-sm font-light leading-relaxed" style={{ color: "var(--text-soft)" }}>
          {ev.desc}
        </p>
        <span className={`inline-block mt-2 text-xs px-3 py-0.5 rounded-full tracking-wider uppercase ${ev.tag}`}
          style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "0.12em" }}>
          {ev.tagLabel}
        </span>
      </div>
    </div>
  );
}

function DayBlock({ badge, badgeStyle, title, date, events, vis, delay }) {
  const delays = ["reveal-d1","reveal-d2","reveal-d3","reveal-d4","reveal-d5"];
  return (
    <div className={`mb-12 reveal ${vis ? "visible" : ""} ${delay}`}>
      {/* Day header */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span
          className="px-4 py-1.5 rounded-full text-white text-xs tracking-widest uppercase"
          style={{ fontFamily: "'Cinzel', serif", background: badgeStyle, letterSpacing: "0.18em", whiteSpace: "nowrap" }}
        >
          {badge}
        </span>
        <div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.35rem", fontWeight: 400, color: "var(--text-dark)" }}>{title}</p>
          <p style={{ fontFamily: "'EB Garamond', Georgia, serif", fontStyle: "italic", fontSize: "0.9rem", color: "var(--text-soft)" }}>{date}</p>
        </div>
        <div className="flex-1 min-w-[40px] h-px" style={{ background: "linear-gradient(90deg, rgba(200,150,60,0.3), transparent)" }} />
      </div>
      {/* Events */}
      <div className="flex flex-col gap-3">
        {events.map((ev, i) => (
          <EventCard key={ev.name} ev={ev} delayClass={`reveal ${vis ? `visible ${delays[i] || ""}` : ""}`} />
        ))}
      </div>
    </div>
  );
}

export default function Events() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.05 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} id="events" className="py-16 sm:py-24 px-4" style={{ background: "var(--ivory)" }}>
      {/* Section head */}
      <div className="text-center mb-10 sm:mb-14">
        <span className={`block text-xs tracking-widest uppercase mb-2 reveal ${vis ? "visible reveal-d1" : ""}`}
          style={{ fontFamily: "'Cinzel', serif", color: "var(--gold)", letterSpacing: "0.45em" }}>
          Join the Festivities
        </span>
        <h2 className={`reveal ${vis ? "visible reveal-d2" : ""}`}
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4.5vw, 3rem)", fontWeight: 400, color: "var(--text-dark)" }}>
          Wedding Schedule
        </h2>
        <p className={`mt-1 reveal ${vis ? "visible reveal-d3" : ""}`}
          style={{ fontFamily: "'EB Garamond', Georgia, serif", fontStyle: "italic", fontSize: "1rem", color: "var(--text-muted)" }}>
          Two glorious days of celebration, ritual &amp; joy
        </p>
        <div className={`flex items-center justify-center gap-3 mt-2 reveal ${vis ? "visible reveal-d4" : ""}`}>
          <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, var(--gold-light))" }} />
          <span>🦚</span>
          <div className="h-px w-12" style={{ background: "linear-gradient(90deg, var(--gold-light), transparent)" }} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <DayBlock
          badge="Day 1 · 9th May, Saturday"
          badgeStyle="linear-gradient(135deg, #C8963C, #7A5510)"
          title="Baarat, Mahera & Sangeet"
          date="Festivities begin"
          events={DAY1}
          vis={vis}
          delay="reveal-d1"
        />
        <DayBlock
          badge="Day 2 · 10th May, Sunday"
          badgeStyle="linear-gradient(135deg, #D0608A, #8A2040)"
          title="Carnival, Baarat & The Wedding"
          date="The big day"
          events={DAY2}
          vis={vis}
          delay="reveal-d2"
        />
      </div>
    </section>
  );
}
