// ============================================================
// FONDO DE RESERVA para escenas de clip sin video real cargado.
// Fondo cinematografico animado (degradado + foco de luz que se
// desplaza + lineas de velocidad) para que una escena sin clip no
// parezca un hueco vacio. Al cargar el clip real, esto no se ve.
// ============================================================

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS, hexA } from "../theme";

const PALETTES: Record<string, [string, string, string]> = {
  "teal-orange": ["#06232B", "#0B3A45", COLORS.orange],
  "desaturated-cold": ["#0A1524", "#132A44", COLORS.cyan],
  "warm-neutral": ["#241606", "#3A2A12", COLORS.orange],
  none: ["#0A0E1A", "#111726", COLORS.cyan],
};

export const ClipPlaceholder: React.FC<{ colorGrade?: string }> = ({
  colorGrade = "teal-orange",
}) => {
  const frame = useCurrentFrame();
  const [c1, c2, accent] = PALETTES[colorGrade] ?? PALETTES["teal-orange"];

  const glowX = interpolate(frame, [0, 90], [30, 70], {
    extrapolateRight: "extend",
  });

  return (
    <AbsoluteFill>
      {/* Base degradada */}
      <AbsoluteFill
        style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
      />
      {/* Foco de luz que se desplaza */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(45% 60% at ${glowX}% 40%, ${hexA(
            accent,
            0.4
          )} 0%, rgba(0,0,0,0) 65%)`,
          mixBlendMode: "screen",
        }}
      />
      {/* Lineas de velocidad diagonales */}
      <AbsoluteFill
        style={{
          opacity: 0.12,
          backgroundImage: `repeating-linear-gradient(115deg, ${COLORS.white} 0px, ${COLORS.white} 2px, transparent 2px, transparent 46px)`,
          transform: `translateX(${(frame % 46) - 46}px)`,
        }}
      />
    </AbsoluteFill>
  );
};
