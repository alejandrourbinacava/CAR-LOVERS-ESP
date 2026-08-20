// ============================================================
// GRAFICO DE BARRAS COMPARATIVO (estilo Vox)
// Barras horizontales con entrada escalonada, valor que cuenta
// hacia arriba en la punta, rejilla de fondo, cabecera con barra
// de acento y resalte del valor maximo.
// ============================================================

import React from "react";
import {
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";
import { FONT_DISPLAY, FONT_KICKER, FONT_LABEL, FONT_UI, COLORS, hexA } from "../theme";

export const BarChart: React.FC<{
  label: string;
  items: { name: string; value: number }[];
}> = ({ label, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const maxValue = Math.max(...items.map((i) => i.value));

  const headerEnter = spring({ frame, fps, config: { damping: 18 } });
  const headerX = interpolate(headerEnter, [0, 1], [-40, 0]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        fontFamily: FONT_UI,
        padding: "0 12%",
      }}
    >
      {/* Cabecera */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          marginBottom: 54,
          transform: `translateX(${headerX}px)`,
          opacity: interpolate(headerEnter, [0, 0.6], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div style={{ width: 12, height: 54, background: COLORS.yellow }} />
        <div
          style={{
            fontFamily: FONT_KICKER,
            fontWeight: 700,
            fontSize: 50,
            color: COLORS.white,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {label}
        </div>
      </div>

      {/* Barras */}
      {items.map((item, idx) => {
        const delay = 8 + idx * 8;
        const progress = spring({
          frame: frame - delay,
          fps,
          config: { damping: 200 },
        });
        const widthPercent = interpolate(
          progress,
          [0, 1],
          [0, (item.value / maxValue) * 100]
        );
        const shownValue = interpolate(progress, [0, 1], [0, item.value]);
        const isMax = item.value === maxValue;
        const barColor = isMax ? COLORS.yellow : COLORS.cyan;

        return (
          <div key={item.name} style={{ marginBottom: 34 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_KICKER,
                  fontWeight: 600,
                  fontSize: 40,
                  color: COLORS.white,
                  textTransform: "uppercase",
                }}
              >
                {item.name}
              </span>
              <span
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 52,
                  color: barColor,
                }}
              >
                {shownValue.toLocaleString("es-ES", {
                  maximumFractionDigits: 1,
                })}
              </span>
            </div>
            <div
              style={{
                height: 42,
                width: "100%",
                background: "rgba(255,255,255,0.08)",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${widthPercent}%`,
                  background: `linear-gradient(90deg, ${hexA(
                    barColor,
                    0.75
                  )}, ${barColor})`,
                  borderRadius: 8,
                  boxShadow: `0 0 24px ${hexA(barColor, 0.55)}`,
                }}
              />
            </div>
          </div>
        );
      })}

      {/* Pie tipo fuente */}
      <div
        style={{
          fontFamily: FONT_LABEL,
          fontSize: 24,
          color: COLORS.muted,
          letterSpacing: 2,
          marginTop: 22,
          textTransform: "uppercase",
          opacity: interpolate(frame, [30, 45], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Fuente: datos del fabricante
      </div>
    </div>
  );
};
