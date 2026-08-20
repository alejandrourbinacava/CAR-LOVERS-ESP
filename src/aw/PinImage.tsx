// ============================================================
// PIN IMAGE — imagen de un MODELO concreto anclada al momento en
// que se menciona. Tarjeta de esquinas redondeadas sobre rejilla
// + fondo borroso (estilo Auto Wheels), con leve zoom.
// ============================================================

import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

const GRID =
  "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)";

export const PinImage: React.FC<{ src: string; label?: string }> = ({
  src,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 150 } });
  const scaleIn = interpolate(enter, [0, 1], [0.9, 1]);
  const kb = interpolate(frame, [0, durationInFrames], [1.03, 1.1]);
  const opIn = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const opOut = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });
  const opacity = Math.min(opIn, opOut);

  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill style={{ backgroundColor: "#0A0E1A" }} />
      <AbsoluteFill style={{ transform: "scale(1.2)" }}>
        <Img
          src={staticFile(src)}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(30px) brightness(0.4)" }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundImage: GRID, backgroundSize: "64px 64px" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            width: "80%",
            height: "74%",
            borderRadius: 26,
            overflow: "hidden",
            transform: `scale(${scaleIn})`,
            boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.06)",
          }}
        >
          <Img
            src={staticFile(src)}
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb})` }}
          />
          {label && <Chip text={label} />}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Chip: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      position: "absolute",
      left: 22,
      top: 22,
      background: "#FFD400",
      color: "#0A0E1A",
      fontFamily: "Arial Black, Arial, sans-serif",
      fontWeight: 900,
      fontSize: 34,
      letterSpacing: 1,
      padding: "6px 16px",
      borderRadius: 6,
      textTransform: "uppercase",
    }}
  >
    {text}
  </div>
);
