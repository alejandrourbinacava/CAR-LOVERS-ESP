// ============================================================
// DUO PIN — comparativa de DOS modelos lado a lado (ej. Golf vs
// T-Roc) anclada al momento en que se comparan. Dos tarjetas
// redondeadas sobre rejilla, con etiqueta de modelo cada una.
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
import { FONT_DISPLAY } from "../theme";

const GRID =
  "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)";

const Card: React.FC<{ src: string; label: string; from: number; sign: number }> = ({
  src,
  label,
  from,
  sign,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - from, fps, config: { damping: 20, stiffness: 140 } });
  const x = interpolate(enter, [0, 1], [sign * 120, 0]);
  const op = interpolate(enter, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "relative",
        width: "44%",
        height: "70%",
        borderRadius: 22,
        overflow: "hidden",
        transform: `translateX(${x}px)`,
        opacity: op,
        boxShadow: "0 24px 60px rgba(0,0,0,0.55), 0 0 0 2px rgba(255,255,255,0.07)",
      }}
    >
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "40px 20px 16px",
          background: "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0))",
          fontFamily: FONT_DISPLAY,
          color: "#FFFFFF",
          fontSize: 46,
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const DuoPin: React.FC<{
  srcA: string;
  srcB: string;
  labelA: string;
  labelB: string;
}> = ({ srcA, srcB, labelA, labelB }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opOut = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: opOut }}>
      <AbsoluteFill style={{ backgroundColor: "#0A0E1A" }} />
      <AbsoluteFill style={{ backgroundImage: GRID, backgroundSize: "64px 64px" }} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: "3%",
        }}
      >
        <Card src={srcA} label={labelA} from={0} sign={-1} />
        <Card src={srcB} label={labelB} from={4} sign={1} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
