// ============================================================
// FONDO PARA ESCENAS DE DATOS (estilo Vox)
// Navy oscuro + rejilla tecnica sutil + resplandor de acento.
// Da el aire "editorial/informativo" a los graficos.
// ============================================================

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS, hexA } from "../theme";

export const DataBackground: React.FC<{ accent?: string }> = ({
  accent = COLORS.yellow,
}) => {
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      {/* Rejilla */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${COLORS.grid} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.grid} 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(80% 80% at 50% 45%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(80% 80% at 50% 45%, black 40%, transparent 100%)",
        }}
      />
      {/* Resplandor de acento detras del grafico */}
      <AbsoluteFill
        style={{
          opacity: glow,
          background: `radial-gradient(50% 45% at 50% 42%, ${hexA(
            accent,
            0.16
          )} 0%, rgba(0,0,0,0) 70%)`,
        }}
      />
      {/* Viñeteado */}
      <AbsoluteFill
        style={{ boxShadow: "inset 0 0 300px rgba(0,0,0,0.7)" }}
      />
    </AbsoluteFill>
  );
};
