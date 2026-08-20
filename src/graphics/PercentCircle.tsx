// ============================================================
// CIRCULO DE PORCENTAJE (estilo Vox)
// Anillo con trazo en degradado + marcas de tick, numero central
// en Anton que cuenta hacia arriba, y etiqueta inferior.
// ============================================================

import React from "react";
import {
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";
import { FONT_DISPLAY, FONT_KICKER, COLORS, hexA } from "../theme";

export const PercentCircle: React.FC<{
  value: number; // 0-100
  label: string;
  kicker?: string;
}> = ({ value, label, kicker = "PORCENTAJE" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ frame, fps, config: { damping: 200, mass: 0.8 } });
  const currentValue = interpolate(progress, [0, 1], [0, value]);

  const size = 560;
  const stroke = 30;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = interpolate(currentValue, [0, 100], [circumference, 0]);

  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const scale = interpolate(enter, [0, 1], [0.8, 1]);
  const opacity = interpolate(enter, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Ticks alrededor del anillo
  const ticks = Array.from({ length: 60 });

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
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          fontFamily: FONT_KICKER,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: 8,
          color: COLORS.yellow,
          textTransform: "uppercase",
          marginBottom: 30,
        }}
      >
        {kicker}
      </div>

      <div style={{ position: "relative", width: size, height: size }}>
        <svg
          width={size}
          height={size}
          style={{ transform: "rotate(-90deg)", position: "absolute" }}
        >
          <defs>
            <linearGradient id="pctGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={COLORS.yellow} />
              <stop offset="100%" stopColor={COLORS.cyan} />
            </linearGradient>
          </defs>

          {/* Ticks */}
          {ticks.map((_, i) => {
            const angle = (i / ticks.length) * 2 * Math.PI;
            const r1 = radius + stroke / 2 + 8;
            const r2 = r1 + (i % 5 === 0 ? 16 : 8);
            const cx = size / 2;
            const cy = size / 2;
            return (
              <line
                key={i}
                x1={cx + r1 * Math.cos(angle)}
                y1={cy + r1 * Math.sin(angle)}
                x2={cx + r2 * Math.cos(angle)}
                y2={cy + r2 * Math.sin(angle)}
                stroke={i % 5 === 0 ? hexA(COLORS.white, 0.5) : hexA(COLORS.white, 0.2)}
                strokeWidth={2}
              />
            );
          })}

          {/* Pista de fondo */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.10)"
            strokeWidth={stroke}
            fill="none"
          />
          {/* Progreso */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#pctGrad)"
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ filter: `drop-shadow(0 0 20px ${hexA(COLORS.yellow, 0.6)})` }}
          />
        </svg>

        {/* Numero central */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT_DISPLAY,
            fontSize: 200,
            color: COLORS.white,
            textShadow: "0 8px 30px rgba(0,0,0,0.6)",
          }}
        >
          {Math.round(currentValue)}
          <span style={{ fontSize: 96, color: COLORS.yellow, marginTop: 30 }}>
            %
          </span>
        </div>
      </div>

      <div
        style={{
          fontFamily: FONT_KICKER,
          fontWeight: 600,
          fontSize: 44,
          color: COLORS.white,
          marginTop: 34,
          textAlign: "center",
          maxWidth: "70%",
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {label}
      </div>
    </div>
  );
};
