// ============================================================
// CONTADOR ANIMADO (estilo Vox)
// Numero gigante en Anton que cuenta hacia arriba, con kicker
// superior, sufijo en acento y subrayado que crece.
// ============================================================

import React from "react";
import {
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";
import { FONT_DISPLAY, FONT_KICKER, COLORS, hexA } from "../theme";

export const AnimatedCounter: React.FC<{
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  kicker?: string;
}> = ({ value, label, prefix = "", suffix = "", kicker = "EL DATO" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ frame, fps, config: { damping: 200, mass: 0.7 } });
  const current = Math.round(interpolate(progress, [0, 1], [0, value]));

  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 120 } });
  const scale = interpolate(enter, [0, 1], [0.7, 1]);
  const opacity = interpolate(enter, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });
  const underline = spring({ frame: frame - 8, fps, config: { damping: 200 } });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}
    >
      {/* Kicker */}
      <div
        style={{
          fontFamily: FONT_KICKER,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: 8,
          color: COLORS.yellow,
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        {kicker}
      </div>

      {/* Numero gigante */}
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 320,
          lineHeight: 0.9,
          color: COLORS.white,
          transform: `scale(${scale})`,
          textShadow: `0 0 60px ${hexA(COLORS.cyan, 0.4)}, 0 10px 40px rgba(0,0,0,0.6)`,
          display: "flex",
          alignItems: "baseline",
        }}
      >
        <span>
          {prefix}
          {current.toLocaleString("es-ES")}
        </span>
        {suffix && (
          <span style={{ color: COLORS.yellow, fontSize: 150, marginLeft: 14 }}>
            {suffix}
          </span>
        )}
      </div>

      {/* Subrayado de acento */}
      <div
        style={{
          height: 10,
          width: `${interpolate(underline, [0, 1], [0, 520])}px`,
          background: `linear-gradient(90deg, ${COLORS.yellow}, ${hexA(
            COLORS.yellow,
            0
          )})`,
          borderRadius: 5,
          marginTop: 8,
          marginBottom: 26,
        }}
      />

      {/* Etiqueta */}
      <div
        style={{
          fontFamily: FONT_KICKER,
          fontWeight: 600,
          fontSize: 46,
          color: COLORS.white,
          letterSpacing: 1,
          textTransform: "uppercase",
          opacity: interpolate(frame, [10, 22], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {label}
      </div>
    </div>
  );
};
