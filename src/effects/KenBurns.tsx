// ============================================================
// KEN BURNS
// Zoom + desplazamiento (pan) lento sobre clips o imagenes fijas.
// El pan ademas del zoom es lo que hace que una foto parezca un
// plano de video de verdad, no una imagen pegada.
// ============================================================

import React from "react";
import { interpolate, useCurrentFrame, Easing } from "remotion";

type Mode = "in" | "out" | "in-out" | "none";

// Direccion de pan por escena (sutil, en %). Se alterna para dar
// variedad sin que el usuario tenga que configurarlo.
const PANS: { x: number; y: number }[] = [
  { x: 3, y: -2 },
  { x: -3, y: 2 },
  { x: 2, y: 3 },
  { x: -2, y: -3 },
];

export const KenBurns: React.FC<{
  mode: Mode;
  durationInFrames: number;
  children: React.ReactNode;
  intensity?: number;
  seed?: number; // elige direccion de pan
}> = ({ mode, durationInFrames, children, intensity = 1.2, seed = 0 }) => {
  const frame = useCurrentFrame();
  const pan = PANS[seed % PANS.length];

  let scale = 1;
  const t = durationInFrames <= 0 ? 0 : frame;

  if (mode === "in") {
    scale = interpolate(t, [0, durationInFrames], [1, intensity], {
      easing: Easing.inOut(Easing.cubic),
      extrapolateRight: "clamp",
    });
  } else if (mode === "out") {
    scale = interpolate(t, [0, durationInFrames], [intensity, 1], {
      easing: Easing.inOut(Easing.cubic),
      extrapolateRight: "clamp",
    });
  } else if (mode === "in-out") {
    const half = durationInFrames / 2;
    scale = interpolate(t, [0, half, durationInFrames], [1, intensity, 1], {
      easing: Easing.inOut(Easing.cubic),
      extrapolateRight: "clamp",
    });
  }

  // Progreso 0->1 para el pan (siempre en la misma direccion)
  const p = interpolate(t, [0, durationInFrames], [0, 1], {
    easing: Easing.inOut(Easing.sin),
    extrapolateRight: "clamp",
  });
  const tx = pan.x * p;
  const ty = pan.y * p;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          // Escalamos el contenedor un poco mas para que el pan no
          // descubra bordes negros
          inset: "-6%",
          transform: `scale(${scale}) translate(${tx}%, ${ty}%)`,
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>
    </div>
  );
};
