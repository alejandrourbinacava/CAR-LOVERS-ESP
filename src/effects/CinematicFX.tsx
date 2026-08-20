// ============================================================
// EFECTOS CINEMATOGRAFICOS GLOBALES
// Grano de pelicula, destellos de luz y viñeteado que se
// superponen a CUALQUIER escena para unificar el look y quitarle
// el aspecto "digital limpio" que delata a un montaje amateur.
// ============================================================

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { hexA } from "../theme";

// --- Grano de pelicula animado (muy sutil) -------------------
export const FilmGrain: React.FC<{ opacity?: number }> = ({
  opacity = 0.04,
}) => {
  const frame = useCurrentFrame();
  // El seed cambia cada frame para que el grano "hierva" como pelicula real
  const seed = frame % 12;
  return (
    <AbsoluteFill
      style={{
        opacity,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    >
      <svg width="100%" height="100%">
        <filter id={`grain-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="1"
            stitchTiles="stitch"
            seed={seed}
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

// --- Destello de luz que cruza lentamente --------------------
export const LightLeak: React.FC<{ color?: string }> = ({
  color = "#25E3EA",
}) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 120], [-20, 120], {
    extrapolateRight: "extend",
  });
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        mixBlendMode: "screen",
        opacity: 0.25,
        background: `radial-gradient(60% 90% at ${x}% 30%, ${hexA(
          color,
          0.55
        )} 0%, rgba(0,0,0,0) 60%)`,
      }}
    />
  );
};

// --- Scrim: oscurecido superior/inferior para legibilidad ----
export const Scrim: React.FC<{ strength?: number }> = ({ strength = 0.85 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `linear-gradient(to bottom, rgba(0,0,0,${
        strength * 0.55
      }) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

// --- Viñeteado fuerte ----------------------------------------
export const Vignette: React.FC<{ strength?: number }> = ({
  strength = 0.6,
}) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      boxShadow: `inset 0 0 320px rgba(0,0,0,${strength})`,
    }}
  />
);
