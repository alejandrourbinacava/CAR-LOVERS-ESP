// ============================================================
// RANK BADGE — etiqueta persistente del puesto arriba a la izquierda
// ("12 | 2026 Buick Envision"), visible todo el bloque del modelo.
// ============================================================
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { FONT_KICKER, FONT_DISPLAY } from "../theme";

export const RankBadge: React.FC<{ rank: string; label: string }> = ({ rank, label }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  // entra tras la transición de capítulo (≈1,6 s) para no taparse con ella
  const inS = spring({ frame: frame - 48, fps, config: { damping: 200 } });
  const out = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(inS, [0, 1], [-520, 0]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 40, top: 26, display: "flex", alignItems: "stretch", height: 46, transform: `translateX(${x}px)`, opacity: out, boxShadow: "0 6px 18px rgba(0,0,0,0.45)" }}>
        {rank ? (
          <div style={{ background: "#FFD400", color: "#111", fontFamily: FONT_DISPLAY, fontSize: 34, padding: "0 14px", display: "flex", alignItems: "center", minWidth: 46, justifyContent: "center" }}>
            {rank}
          </div>
        ) : null}
        <div
          style={{
            background: "rgba(10,14,24,0.86)",
            color: "#fff",
            fontFamily: FONT_KICKER,
            fontWeight: 600,
            fontSize: 28,
            letterSpacing: 1,
            padding: "0 18px",
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            borderLeft: "3px solid #FFD400",
          }}
        >
          {label}
        </div>
      </div>
    </AbsoluteFill>
  );
};
