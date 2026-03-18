import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Countdown from "./components/Countdown";
import Events from "./components/Events";
import Playlist from "./components/Playlist";

import {
  SummerBand,
  PeacockBand,
  Couple,
  DressCode,
  Venue,
  HowToReach,
  Footer,
} from "./components/Sections";

export default function App() {
  return (
    <div className="min-h-screen" style={{ background: "var(--ivory)" }}>
      <Navbar />
      <Hero />
      <Countdown />
      <SummerBand />
      <Events />
      <PeacockBand />
      <Couple />
      <DressCode />
      <Playlist />
      <Venue />
      <HowToReach />
      <Footer />
    </div>
  );
}
