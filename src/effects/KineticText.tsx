// ============================================================
// TIPOGRAFIA CINETICA (estilo Magnate Media)
// Titular en Anton condensada, mayusculas, que entra palabra a
// palabra con revelado de mascara (cada palabra sube desde abajo
// tras un "telon") + muelle. Una palabra de acento se resalta.
// ============================================================

import React from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
} from "remotion";
import { FONT_DISPLAY, FONT_KICKER, COLORS, hexA } from "../theme";

export const KineticText: React.FC<{
  text: string; // admite \n para saltos de linea
  fontSize?: number;
  startFrame?: number;
  accentColor?: string;
  highlightWord?: string;
  kicker?: string; // etiqueta pequeña sobre el titular (opcional)
}> = ({
  text,
  fontSize = 118,
  startFrame = 0,
  accentColor = COLORS.cyan,
  highlightWord,
  kicker,
}) => {
  const frame = useCurrentFrame() - startFrame;
  const { fps } = useVideoConfig();
  const lines = text.split("\n");

  let wordCounter = 0;

  return (
    <div
      style={{
        position: "absolute",
        left: "6%",
        right: "6%",
        bottom: "11%",
        fontFamily: FONT_DISPLAY,
        textAlign: "left",
        lineHeight: 0.98,
        textTransform: "uppercase",
      }}
    >
      {kicker && (
        <KickerTag text={kicker} frame={frame} accentColor={accentColor} />
      )}
      {lines.map((line, lineIdx) => {
        const words = line.split(" ").filter(Boolean);
        return (
          <div
            key={lineIdx}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0 0.26em",
              overflow: "hidden",
              paddingBottom: "0.06em",
            }}
          >
            {words.map((word, wordIdx) => {
              const idx = wordCounter++;
              const delay = idx * 3.5;
              const reveal = spring({
                frame: frame - delay,
                fps,
                config: { damping: 18, stiffness: 140, mass: 0.7 },
              });
              const translateY = interpolate(reveal, [0, 1], [118, 0]);
              const opacity = interpolate(reveal, [0, 0.4], [0, 1], {
                extrapolateRight: "clamp",
              });
              const isHi =
                highlightWord &&
                word.toUpperCase().includes(highlightWord.toUpperCase());

              return (
                <div key={wordIdx} style={{ overflow: "hidden" }}>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize,
                      fontWeight: 400,
                      color: isHi ? accentColor : COLORS.white,
                      transform: `translateY(${translateY}%)`,
                      opacity,
                      textShadow: isHi
                        ? `0 0 30px ${hexA(accentColor, 0.6)}, 0 4px 18px rgba(0,0,0,0.7)`
                        : "0 4px 20px rgba(0,0,0,0.75)",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {word}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
      {/* Barra de acento que crece bajo el titular */}
      <AccentBar frame={frame} fps={fps} color={accentColor} />
    </div>
  );
};

const KickerTag: React.FC<{
  text: string;
  frame: number;
  accentColor: string;
}> = ({ text, frame, accentColor }) => {
  const opacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });
  const x = interpolate(frame, [0, 10], [-30, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        display: "inline-block",
        transform: `translateX(${x}px)`,
        opacity,
        background: accentColor,
        color: COLORS.ink,
        fontFamily: FONT_KICKER,
        fontWeight: 700,
        fontSize: 30,
        letterSpacing: 2,
        padding: "6px 16px",
        marginBottom: 18,
        textTransform: "uppercase",
      }}
    >
      {text}
    </div>
  );
};

const AccentBar: React.FC<{ frame: number; fps: number; color: string }> = ({
  frame,
  fps,
  color,
}) => {
  const grow = spring({ frame: frame - 6, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        marginTop: 22,
        height: 8,
        width: `${interpolate(grow, [0, 1], [0, 220])}px`,
        maxWidth: "40%",
        background: `linear-gradient(90deg, ${color}, ${hexA(color, 0)})`,
        borderRadius: 4,
      }}
    />
  );
};
