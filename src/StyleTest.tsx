import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ModelCard } from "./aw/ModelCard";
import { ChapterWipe } from "./aw/ChapterWipe";
import { Stat } from "./aw/Stat";
import { GridBG } from "./aw/GridBG";

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
  </AbsoluteFill>
);
