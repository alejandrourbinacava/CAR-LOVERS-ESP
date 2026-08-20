// ============================================================
// GRADACION DE COLOR CINEMATOGRAFICA
// Combina 3 capas: filtro CSS (contraste/saturacion) + overlay
// duotono con blend-mode + un realce de altas luces. Esto imita
// el "teal & orange" real de la edicion tipo Magnate.
// ============================================================

import React from "react";
import { AbsoluteFill } from "remotion";

type ColorGradeStyle = "teal-orange" | "desaturated-cold" | "warm-neutral" | "none";

const GRADES: Record<ColorGradeStyle, React.CSSProperties> = {
  "teal-orange": {
    filter: "contrast(1.22) saturate(1.35) hue-rotate(-5deg) brightness(0.98)",
  },
  "desaturated-cold": {
    filter: "contrast(1.16) saturate(0.5) hue-rotate(185deg) brightness(0.88)",
  },
  "warm-neutral": {
    filter: "contrast(1.1) saturate(1.18) sepia(0.14) brightness(1.03)",
  },
  none: {},
};

// Duotono: sombras frias (teal) + luces calidas (naranja), lo que
// da el look cinematografico que el filtro por si solo no logra.
const OVERLAYS: Record<ColorGradeStyle, string | null> = {
  "teal-orange":
    "linear-gradient(125deg, rgba(0,72,86,0.30) 0%, rgba(0,0,0,0) 42%, rgba(150,64,0,0.26) 100%)",
  "desaturated-cold":
    "linear-gradient(180deg, rgba(24,48,78,0.34), rgba(10,20,40,0.34))",
  "warm-neutral":
    "linear-gradient(180deg, rgba(96,52,0,0.14), rgba(96,52,0,0.14))",
  none: null,
};

export const ColorGrade: React.FC<{
  style?: ColorGradeStyle;
  children: React.ReactNode;
}> = ({ style = "teal-orange", children }) => {
  const overlay = OVERLAYS[style];
  return (
    <AbsoluteFill style={GRADES[style]}>
      {children}
      {overlay && (
        <AbsoluteFill
          style={{
            background: overlay,
            mixBlendMode: "overlay",
            pointerEvents: "none",
          }}
        />
      )}
      {/* Realce de altas luces: un leve "bloom" en el centro */}
      {style !== "none" && (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(70% 60% at 50% 42%, rgba(255,255,255,0.10), rgba(0,0,0,0) 70%)",
            mixBlendMode: "soft-light",
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
