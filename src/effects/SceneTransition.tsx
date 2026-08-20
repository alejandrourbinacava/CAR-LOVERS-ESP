// ============================================================
// TRANSICION DE ENTRADA (sonido + efecto visual)
// Tres estilos diferenciados, cada uno con su propio movimiento y
// desenfoque, + un flash en el golpe del corte, sincronizados con
// su efecto de sonido correspondiente.
// ============================================================

import React from "react";
import { Audio, interpolate, useCurrentFrame, staticFile, Easing } from "remotion";

type TransitionType = "slide-glitch" | "whoosh" | "shutter" | "none";

const SFX_MAP: Record<Exclude<TransitionType, "none">, string> = {
  "slide-glitch": "assets/sfx/glitch.mp3",
  whoosh: "assets/sfx/whoosh.mp3",
  shutter: "assets/sfx/camera-shutter.mp3",
};

export const TRANSITION_DURATION = 14;

export const SceneTransition: React.FC<{
  type: TransitionType;
  children: React.ReactNode;
}> = ({ type, children }) => {
  const frame = useCurrentFrame();

  if (type === "none") {
    return <>{children}</>;
  }

  const D = TRANSITION_DURATION;
  // progress: 1 al inicio del corte -> 0 cuando la escena ya esta asentada
  const progress = interpolate(frame, [0, D], [1, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const flashOpacity = interpolate(frame, [0, 3, D], [0, 0.6, 0], {
    extrapolateRight: "clamp",
  });

  // Parametros que cambian por tipo de transicion
  const slideX = type === "whoosh" ? 100 : type === "slide-glitch" ? 55 : 0;
  const startScale = type === "shutter" ? 1.18 : 1;
  const blurMax = type === "whoosh" ? 22 : type === "shutter" ? 10 : 8;
  const chroma = type === "slide-glitch" ? interpolate(progress, [0, 1], [0, 16]) : 0;

  const translateX = interpolate(progress, [0, 1], [0, slideX]);
  const scale = interpolate(progress, [0, 1], [1, startScale]);
  const blur = interpolate(progress, [0, 1], [0, blurMax]);

  return (
    <>
      {/* El sonido se monta durante toda la escena para que suene entero
          (antes se montaba solo en frame 0 y se cortaba al instante). */}
      <Audio src={staticFile(SFX_MAP[type])} volume={0.9} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${translateX}%) scale(${scale})`,
          filter: `blur(${blur}px)`,
        }}
      >
        {chroma > 0.5 ? (
          <>
            {/* Copia roja */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: `translateX(${chroma}px)`,
                filter: "url(#chroma-red)",
                mixBlendMode: "screen",
              }}
            >
              {children}
            </div>
            {/* Copia cian */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: `translateX(${-chroma}px)`,
                filter: "url(#chroma-cyan)",
                mixBlendMode: "screen",
              }}
            >
              {children}
            </div>
            {/* Base */}
            <div style={{ position: "absolute", inset: 0 }}>{children}</div>
          </>
        ) : (
          children
        )}
      </div>

      {/* Flash blanco en el golpe */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "white",
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Filtros SVG para la aberracion cromatica */}
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <filter id="chroma-red">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id="chroma-cyan">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
};
