// ============================================================
// CHAPTER BAR (motion graphic): barra de progreso superior segmentada
// por capitulos + etiqueta del capitulo actual (arriba a la derecha)
// que se "voltea" al cambiar de capitulo.
// ============================================================

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { FONT_KICKER, COLORS } from "../theme";
import { Chapter } from "../config";

export const ChapterBar: React.FC<{ chapters: Chapter[]; total: number }> = ({
  chapters,
  total,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (!chapters.length) return null;

  let ci = 0;
  for (let i = 0; i < chapters.length; i++) if (chapters[i].fromSeconds <= t) ci = i;
  const cur = chapters[ci];
  const sinceChange = t - cur.fromSeconds;
  const flip = interpolate(sinceChange, [0, 0.4], [90, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const labelOp = interpolate(sinceChange, [0, 0.25], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const pct = Math.min(100, (t / total) * 100);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Barra */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 9, background: "rgba(255,255,255,0.12)" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: COLORS.yellow, boxShadow: "0 0 14px rgba(255,212,0,0.7)" }} />
        {chapters.map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(c.fromSeconds / total) * 100}%`,
              top: 0,
              width: 3,
              height: "100%",
              background: "rgba(0,0,0,0.75)",
            }}
          />
        ))}
      </div>
      {/* Etiqueta del capitulo actual */}
      <div
        style={{
          position: "absolute",
          right: 46,
          top: 28,
          opacity: labelOp,
          transform: `perspective(600px) rotateX(${flip}deg)`,
          transformOrigin: "top center",
          background: "rgba(8,10,20,0.72)",
          borderRight: `6px solid ${COLORS.yellow}`,
          padding: "8px 20px 9px 22px",
          borderRadius: 6,
        }}
      >
        <span
          style={{
            fontFamily: FONT_KICKER,
            fontWeight: 600,
            fontSize: 28,
            color: "#fff",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: COLORS.yellow }}>{String(ci + 1).padStart(2, "0")}</span>
          {"  ·  "}
          {cur.label}
        </span>
      </div>
    </AbsoluteFill>
  );
};
