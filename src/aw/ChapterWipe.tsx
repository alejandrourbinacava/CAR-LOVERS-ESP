// ============================================================
// CHAPTER WIPE — transición de capítulo: la rejilla barre la
// pantalla, aparece "CAPÍTULO N" y el título en texto cinético.
// ============================================================
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { GridBG } from "./GridBG";
import { KText } from "./KText";
import { FONT_KINETIC } from "../theme";

export const ChapterWipe: React.FC<{ n: number; label: string; rank?: string; lang?: "es" | "en" }> = ({ n, label, rank, lang = "es" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const outP = interpolate(frame, [durationInFrames - 10, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // barrido horizontal: entra de izquierda a derecha y sale hacia la derecha
  const clip = `inset(0 ${100 - inP * 100}% 0 ${outP * 100}%)`;
  return (
    <AbsoluteFill style={{ clipPath: clip }}>
      <Audio src={staticFile("assets/sfx/swipe.mp3")} volume={0.5} />
      <GridBG speed={2} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 18, flexDirection: "column" }}>
        <div
          style={{
            fontFamily: FONT_KINETIC,
            fontStyle: "italic",
            fontWeight: 800,
            fontSize: 46,
            color: "#fff",
            letterSpacing: 8,
            opacity: interpolate(frame, [6, 14], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {rank ? "" : lang === "en" ? `CHAPTER ${n}` : `CAPÍTULO ${n}`}
        </div>
        {rank ? (
          <div
            style={{
              fontFamily: FONT_KINETIC,
              fontStyle: "italic",
              fontWeight: 900,
              fontSize: 230,
              lineHeight: 0.9,
              color: "#FFD400",
              textShadow: "0 10px 40px rgba(0,0,0,0.6)",
              transform: `scale(${interpolate(frame, [4, 14], [1.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              opacity: interpolate(frame, [4, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            {/^\d+$/.test(rank) ? `#${rank}` : lang === "en" ? `${rank} TIER` : rank}
          </div>
        ) : null}
        <div style={{ width: 960 }}>
          <KText text={label} size={118} delay={8} outAt={durationInFrames - 12} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
