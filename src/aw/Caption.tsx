// ============================================================
// CAPTION (etiqueta estilo Auto Wheels)
// Texto blanco en negrita, mayusculas, abajo-centro, sobre una
// placa oscura semitransparente para legibilidad. Entra con pop.
// ============================================================

import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { FONT_DISPLAY } from "../theme";

export const Caption: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 160 } });
  const scale = interpolate(enter, [0, 1], [0.86, 1]);
  const opIn = interpolate(enter, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  const opOut = interpolate(
    frame,
    [durationInFrames - 7, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp" }
  );
  const opacity = Math.min(opIn, opOut);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: "11%",
        display: "flex",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          background: "rgba(0,0,0,0.42)",
          borderBottom: "5px solid #FFD400",
          padding: "14px 34px",
          borderRadius: 4,
          backdropFilter: "blur(2px)",
        }}
      >
        <span
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 66,
            lineHeight: 1,
            color: "#FFFFFF",
            textTransform: "uppercase",
            letterSpacing: 1,
            textShadow: "0 4px 16px rgba(0,0,0,0.7)",
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
