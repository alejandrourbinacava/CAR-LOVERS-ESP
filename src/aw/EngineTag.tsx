// ============================================================
// ENGINE TAG (motion graphic): etiqueta lateral que acompaña TODA la
// sección de un motor. Sello SÍ / NO que entra con "stamp" + código de
// motor gigante + nombre del coche. Entra deslizándose desde la
// izquierda y sale al terminar la sección.
// ============================================================

import React from "react";
import {
  AbsoluteFill,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { FONT_DISPLAY, FONT_KICKER, COLORS } from "../theme";

export const EngineTag: React.FC<{
  code: string;
  name: string;
  verdict: "yes" | "no";
}> = ({ code, name, verdict }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const yes = verdict === "yes";
  const color = yes ? COLORS.green : COLORS.red;

  const slide = spring({ frame, fps, config: { damping: 18, stiffness: 140 } });
  const x = interpolate(slide, [0, 1], [-520, 0]);
  const out = interpolate(frame, [durationInFrames - 10, durationInFrames], [0, -520], {
    extrapolateLeft: "clamp",
  });
  // Sello: cae desde grande con rotacion y rebote
  const stamp = spring({ frame: frame - 6, fps, config: { damping: 9, stiffness: 190, mass: 0.8 } });
  const stampScale = interpolate(stamp, [0, 1], [3.2, 1]);
  const stampRot = interpolate(stamp, [0, 1], [-18, -6]);
  const stampOp = interpolate(frame, [6, 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Pulso suave del brillo mientras dura la seccion
  const pulse = 0.5 + 0.5 * Math.sin(frame / 9);
  // Barra de color que se "dibuja" a lo largo de la etiqueta
  const bar = interpolate(slide, [0, 1], [0, 100]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {frame === 6 && <Audio src={staticFile("assets/sfx/camera-shutter.mp3")} volume={0.35} />}
      <div
        style={{
          position: "absolute",
          left: 56,
          top: 78,
          transform: `translateX(${x + out}px)`,
          display: "flex",
          alignItems: "center",
          gap: 22,
        }}
      >
        {/* Sello SI / NO */}
        <div
          style={{
            width: 118,
            height: 118,
            borderRadius: 24,
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${stampScale}) rotate(${stampRot}deg)`,
            opacity: stampOp,
            boxShadow: `0 0 ${24 + pulse * 26}px ${color}, 0 10px 30px rgba(0,0,0,0.55)`,
            border: "4px solid rgba(255,255,255,0.9)",
          }}
        >
          <svg width="74" height="74" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
            {yes ? <path d="M4 12.5l5 5L20 6.5" /> : <path d="M5 5l14 14M19 5L5 19" />}
          </svg>
        </div>
        {/* Placa con codigo + nombre */}
        <div
          style={{
            position: "relative",
            background: "rgba(8,10,20,0.78)",
            backdropFilter: "blur(4px)",
            padding: "14px 34px 16px 30px",
            borderRadius: 10,
            overflow: "hidden",
            boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 9,
              height: `${bar}%`,
              background: color,
            }}
          />
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 84,
              lineHeight: 1,
              color: "#fff",
              letterSpacing: 1,
              textTransform: "uppercase",
              textShadow: "0 4px 14px rgba(0,0,0,0.6)",
            }}
          >
            {code}
          </div>
          <div
            style={{
              fontFamily: FONT_KICKER,
              fontWeight: 600,
              fontSize: 34,
              color: color,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            {name}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
