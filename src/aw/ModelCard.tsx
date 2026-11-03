// ============================================================
// MODEL CARD — ficha de un modelo o dato concreto, en capas:
//   capa 1: rejilla en movimiento (GridBG)
//   capa 2: nombre del modelo gigante, fantasma, detrás del coche
//   capa 3: coche recortado (PNG con alfa) entrando con parallax
//   capa 4+: textos cinéticos (nombre, líneas de datos escalonadas)
// Sonidos: barrido al entrar, impacto al asentarse el coche y
// pitidos "algorítmicos" al salir el primer dato (tick en los demás).
// ============================================================
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { GridBG } from "./GridBG";
import { KText } from "./KText";
import { FONT_KINETIC, FONT_UI } from "../theme";

export const ModelCard: React.FC<{
  name: string;
  lines: string[];
  cut?: string; // PNG recortado (assets/cut/...)
  side?: "left" | "right"; // lado del coche (el texto va al contrario)
}> = ({ name, lines, cut, side = "right" }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const dir = side === "right" ? 1 : -1;

  const enter = spring({ frame, fps, config: { damping: 15, stiffness: 90, mass: 0.9 } });
  const carX = interpolate(enter, [0, 1], [dir * 900, 0]);
  const carRot = interpolate(enter, [0, 1], [dir * 6, 0]);
  const drift = Math.sin(frame / 26) * 10; // flotación suave
  const par = interpolate(frame, [0, durationInFrames], [-26, 26]) * dir; // parallax lento
  const outP = interpolate(frame, [durationInFrames - 12, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = interpolate(frame, [0, 5], [0, 1], { extrapolateRight: "clamp" }) * (1 - outP);

  return (
    <AbsoluteFill style={{ opacity }}>
      <Audio src={staticFile("assets/sfx/swipe.mp3")} volume={0.55} />
      <Sequence from={9}>
        <Audio src={staticFile("assets/sfx/impact.mp3")} volume={0.7} />
      </Sequence>
      <GridBG speed={1.4} />

      {/* capa 2: nombre fantasma */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `translateX(${par * 1.6}px)` }}>
        <div
          style={{
            fontFamily: FONT_KINETIC,
            fontStyle: "italic",
            fontWeight: 900,
            fontSize: 330,
            lineHeight: 0.9,
            textTransform: "uppercase",
            color: "transparent",
            WebkitTextStroke: "3px rgba(255,255,255,0.13)",
            whiteSpace: "nowrap",
          }}
        >
          {name.split(" ")[0]}
        </div>
      </AbsoluteFill>

      {/* capa 3: coche recortado */}
      {cut && (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: side === "right" ? "flex-end" : "flex-start", padding: "0 40px 90px" }}>
          <div style={{ position: "relative", width: 1120, transform: `translateX(${carX + par}px) translateY(${drift}px) rotate(${carRot}deg)` }}>
            <div
              style={{
                position: "absolute",
                left: "8%",
                right: "8%",
                bottom: -14,
                height: 60,
                borderRadius: "50%",
                background: "radial-gradient(closest-side, rgba(0,0,0,0.75), rgba(0,0,0,0))",
                filter: "blur(8px)",
              }}
            />
            <Img src={staticFile(cut)} style={{ position: "relative", width: "100%", filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.65))" }} />
          </div>
        </AbsoluteFill>
      )}

      {/* capas de texto: lado contrario al coche */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: side === "right" ? "flex-start" : "flex-end", padding: "0 90px 120px" }}>
        <div style={{ width: 880, display: "flex", flexDirection: "column", alignItems: side === "right" ? "flex-start" : "flex-end", gap: 26 }}>
          <KText text={name} size={104} align={side === "right" ? "left" : "right"} delay={6} outAt={durationInFrames - 12} />
          <div
            style={{
              height: 8,
              borderRadius: 4,
              background: "#FFD400",
              width: interpolate(spring({ frame: frame - 14, fps, config: { damping: 200 } }), [0, 1], [0, 420]),
            }}
          />
          {lines.map((l, i) => {
            const t0 = 22 + i * 12;
            const p = spring({ frame: frame - t0, fps, config: { damping: 18, stiffness: 160 } });
            return (
              <div
                key={i}
                style={{
                  fontFamily: FONT_UI,
                  fontWeight: 800,
                  fontSize: 52,
                  color: "#fff",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  textShadow: "0 4px 18px rgba(0,0,0,0.8)",
                  padding: "8px 22px",
                  borderLeft: "8px solid #FFD400",
                  background: "rgba(255,255,255,0.06)",
                  transform: `translateX(${interpolate(p, [0, 1], [-dir * 220, 0])}px)`,
                  opacity: interpolate(p, [0, 0.5], [0, 1], { extrapolateRight: "clamp" }),
                  clipPath: `inset(0 ${interpolate(p, [0, 1], [100, 0])}% 0 0)`,
                }}
              >
                <Sequence from={t0} durationInFrames={30}>
                  <Audio src={staticFile(i === 0 ? "assets/sfx/algo.mp3" : "assets/sfx/tick.mp3")} volume={i === 0 ? 0.5 : 0.45} />
                </Sequence>
                {l}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
