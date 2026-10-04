// ============================================================
// STAT (dato destacado sobre b-roll, estilo Auto Wheels)
// Numero grande en amarillo + subetiqueta blanca en mayusculas,
// sobre un scrim oscuro. Para las cifras clave del guion.
// ============================================================

import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  AbsoluteFill,
  Audio,
  staticFile,
} from "remotion";
import { FONT_DISPLAY, FONT_KICKER } from "../theme";


// Cuenta hacia arriba cada numero del dato (no anima años tipo 2010).
const countUp = (value: string, progress: number): string =>
  value.replace(/\d[\d.,]*/g, (tok) => {
    const thousands = /^\d{1,3}(\.\d{3})+$/.test(tok);
    const decimal = /^\d+,\d+$/.test(tok);
    const num = thousands ? parseInt(tok.replace(/\./g, ""), 10) : decimal ? parseFloat(tok.replace(",", ".")) : parseInt(tok, 10);
    if (!isFinite(num)) return tok;
    if (!thousands && !decimal && num >= 1900 && num <= 2100) return tok; // años
    if (!thousands && !decimal && num < 10) return tok;
    const v = num * progress;
    if (thousands) return Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    if (decimal) return v.toFixed(tok.split(",")[1].length).replace(".", ",");
    return Math.round(v).toString();
  });

export const Stat: React.FC<{ value: string; sub: string }> = ({
  value,
  sub,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 15, stiffness: 150 } });
  const scale = interpolate(enter, [0, 1], [0.7, 1]);
  const opIn = interpolate(enter, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  const opOut = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp" }
  );
  const opacity = Math.min(opIn, opOut);
  const underline = spring({ frame: frame - 4, fps, config: { damping: 200 } });
  const prog = interpolate(frame, [4, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eased = 1 - Math.pow(1 - prog, 3);
  const shown = countUp(value, eased);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}
    >
      {/* Sonido al aparecer el dato (regla: sonar en datos importantes) */}
      <Audio src={staticFile("assets/sfx/glitch.mp3")} volume={0.5} />
      {/* Scrim para legibilidad */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(45% 45% at 50% 50%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 70%)",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 210,
            lineHeight: 0.9,
            color: "#FFD400",
            textShadow: "0 6px 30px rgba(0,0,0,0.7)",
          }}
        >
          {shown}
        </div>
        <div
          style={{
            height: 8,
            width: `${interpolate(underline, [0, 1], [0, 340])}px`,
            background: "#FFD400",
            borderRadius: 4,
            margin: "10px 0 14px",
          }}
        />
        <div
          style={{
            fontFamily: FONT_KICKER,
            fontWeight: 700,
            fontSize: 44,
            color: "#FFFFFF",
            textTransform: "uppercase",
            letterSpacing: 2,
            textShadow: "0 3px 14px rgba(0,0,0,0.8)",
            textAlign: "center",
            maxWidth: "80%",
          }}
        >
          {sub}
        </div>
      </div>
    </AbsoluteFill>
  );
};
