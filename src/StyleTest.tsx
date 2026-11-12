import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ModelCard } from "./aw/ModelCard";
import { ChapterWipe } from "./aw/ChapterWipe";
import { Stat } from "./aw/Stat";
import { GridBG } from "./aw/GridBG";
import { QuoteCard } from "./aw/QuoteCard";
import { RankBadge } from "./aw/RankBadge";

// Composición de prueba del estilo dinámico (solo para Remotion Studio, no se renderiza en producción)
export const StyleTest: React.FC = () => (
  <AbsoluteFill style={{ background: "#222" }}>
    <Sequence from={0} durationInFrames={90}>
      <ModelCard
        name="BYD Dolphin Surf"
        lines={["Desde 16.990 €", "Autonomía 322 km"]}
        cut="assets/cut/byd-dolphin-surf.png"
        side="right"
      />
    </Sequence>
    <Sequence from={90} durationInFrames={90}>
      <ModelCard
        name="Citroën ë-C3"
        lines={["Desde 13.300 €", "Autonomía 326 km"]}
        cut="assets/cut/citroen-ec3.png"
        side="left"
      />
    </Sequence>
    <Sequence from={180} durationInFrames={60}>
      <GridBG />
      <ChapterWipe n={2} label="El coste real" />
    </Sequence>
    <Sequence from={240} durationInFrames={60}>
      <GridBG />
      <Stat value="16.990 €" sub="precio de partida" algo />
    </Sequence>
    {/* estilo EN (Car Lovers English): número de puesto, etiqueta fija, cita tecleada, cifra en formato US */}
    <Sequence from={300} durationInFrames={50}>
      <GridBG />
      <ChapterWipe n={3} label="Buick Envision" rank="12" lang="en" />
    </Sequence>
    <Sequence from={350} durationInFrames={120}>
      <GridBG />
      <RankBadge rank="12" label="2026 Buick Envision" />
    </Sequence>
    <Sequence from={470} durationInFrames={150}>
      <QuoteCard text="Owners call the infotainment software unreliable: frozen screens and blank rear cameras" source="Consumer Reports" />
    </Sequence>
    <Sequence from={620} durationInFrames={80}>
      <GridBG />
      <Stat value="$47,100" sub="average selling price · 256 days of supply" algo lang="en" />
    </Sequence>
  </AbsoluteFill>
);
