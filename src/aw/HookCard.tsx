// ============================================================
// HOOK CARD (cartela de gancho a pantalla completa, estilo Auto
// Wheels): fondo oscuro con rejilla + scanlines y texto GIGANTE
// amarillo en mayusculas. Con whoosh al entrar.
// ============================================================

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
  staticFile,
} from "remotion";
import { FONT_DISPLAY } from "../theme";

export const HookCard: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 170 } });
  const scale = interpolate(enter, [0, 1], [0.8, 1]);
  const opIn = interpolate(frame, [0, 5], [0, 1], { extrapolateRight: "clamp" });
  const opOut = interpolate(
    frame,
    [durationInFrames - 6, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp" }
  );
  const opacity = Math.min(opIn, opOut);
  const lines = text.split("\n");

  return (
    <AbsoluteFill style={{ opacity }}>
      <Audio src={staticFile("assets/sfx/whoosh.mp3")} volume={0.8} />
      {/* Fondo oscuro */}
      <AbsoluteFill style={{ backgroundColor: "#0A0E1A" }} />
      {/* Rejilla */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />
      {/* Scanlines */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 1px, transparent 1px, transparent 4px)",
          opacity: 0.5,
        }}
      />
      {/* Resplandor */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(255,212,0,0.12) 0%, rgba(0,0,0,0) 70%)",
        }}
      />
      {/* Texto */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 150,
            lineHeight: 0.98,
            color: "#FFD400",
            textTransform: "uppercase",
            textAlign: "center",
            letterSpacing: 1,
            padding: "0 6%",
            textShadow: "0 8px 34px rgba(0,0,0,0.6)",
          }}
        >
          {lines.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
