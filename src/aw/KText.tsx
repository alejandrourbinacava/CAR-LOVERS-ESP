// ============================================================
// KTEXT — texto cinético: cada palabra entra con desenfoque,
// desplazamiento e inclinación; todo sale con desenfoque.
// Montserrat cursiva extra-gorda (amarillo por defecto).
// ============================================================
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { FONT_KINETIC } from "../theme";

export const KText: React.FC<{
  text: string;
  size?: number;
  color?: string;
  delay?: number; // frames antes de empezar
  stagger?: number; // frames entre palabras
  outAt?: number; // frame (de la secuencia) en que empieza a salir; por defecto los últimos 10
  align?: "left" | "center" | "right";
}> = ({ text, size = 110, color = "#FFD400", delay = 0, stagger = 4, outAt, align = "center" }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const words = text.split(/\s+/).filter(Boolean);
  const out0 = outAt ?? durationInFrames - 10;
  const out = interpolate(frame, [out0, out0 + 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : align === "left" ? "flex-start" : "flex-end",
        gap: `0 ${size * 0.28}px`,
        fontFamily: FONT_KINETIC,
        fontStyle: "italic",
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.02,
        color,
        textTransform: "uppercase",
        textShadow: "0 6px 26px rgba(0,0,0,0.65)",
        letterSpacing: -1,
        filter: out > 0.01 ? `blur(${out * 14}px)` : "none",
        opacity: 1 - out,
      }}
    >
      {words.map((w, i) => {
        const p = spring({ frame: frame - delay - i * stagger, fps, config: { damping: 16, stiffness: 170 } });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${interpolate(p, [0, 1], [48, 0])}px) skewX(${interpolate(p, [0, 1], [-10, 0])}deg)`,
              opacity: interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
              filter: p < 0.98 ? `blur(${interpolate(p, [0, 1], [16, 0])}px)` : "none",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
