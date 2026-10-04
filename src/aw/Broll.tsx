// ============================================================
// B-ROLL SHOT
// - full:   clip a pantalla completa (color natural).
// - framed: clip en tarjeta redondeada sobre FONDO NEGRO + REJILLA
//   BLANCA (estilo canales top). El encuadre recorta los bordes y
//   se sesga hacia arriba para tapar el texto quemado de la fuente.
// Sonido de corte solo si shot.sfx. Puede ser clip o imagen.
// ============================================================

import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Img,
  staticFile,
  Audio,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { Shot, FPS } from "../config";
import { KenBurns } from "../effects/KenBurns";

const CUT_SFX = [
  "assets/sfx/whoosh.mp3",
  "assets/sfx/glitch.mp3",
  "assets/sfx/camera-shutter.mp3",
];

const GRID =
  "linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)";
const SCAN =
  "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 1px, transparent 1px, transparent 4px)";

export const Broll: React.FC<{ shot: Shot; index: number }> = ({
  shot,
  index,
}) => {
  const dur = Math.round(shot.durationInSeconds * FPS);
  const frame = useCurrentFrame();
  const startFromFrames = Math.round((shot.startFromSeconds ?? 0) * FPS);
  const kb = shot.kenBurns ?? (index % 2 === 0 ? "in" : "out");
  // Transicion de entrada VARIADA (cada corte distinto): zoom-punch, slide con
  // desenfoque, flash blanco o whip-zoom con giro. Rota por indice de plano.
  const fx = index % 4;
  const e = (a: number, b: number, from: number, to: number) =>
    interpolate(frame, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const punch = fx === 0 ? e(0, 6, 1.14, 1) : fx === 2 ? e(0, 5, 1.05, 1) : fx === 3 ? e(0, 8, 0.93, 1) : 1;
  const tx = fx === 1 ? e(0, 7, (index % 8 < 4 ? 1 : -1) * 90, 0) : 0;
  const rot = fx === 3 ? e(0, 8, (index % 8 < 4 ? 1 : -1) * 2.2, 0) : 0;
  const blur = fx === 1 ? e(0, 7, 9, 0) : fx === 3 ? e(0, 6, 5, 0) : 0;
  const flash = fx === 2 ? e(0, 5, 0.75, 0) : 0;
  const entry = `translateX(${tx}px) scale(${punch}) rotate(${rot}deg)`;
  const framed = shot.isImage ? true : !!shot.framed;

  // objPos: en framed sesgamos hacia arriba (42%) para recortar el
  // texto que las fuentes suelen quemar en la parte baja.
  const asset = (grade: string, objPos: string) => {
    if (shot.isImage && shot.clipSrc) {
      return (
        <Img
          src={staticFile(shot.clipSrc)}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: objPos, filter: grade }}
        />
      );
    }
    if (shot.clipSrc) {
      return (
        <OffthreadVideo
          src={staticFile(shot.clipSrc)}
          muted
          startFrom={startFromFrames}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: objPos, filter: grade }}
        />
      );
    }
    return <AbsoluteFill style={{ background: "linear-gradient(135deg,#12202e,#0a1622)" }} />;
  };

  if (framed) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#07070c" }}>
        {shot.sfx && <Audio src={staticFile(CUT_SFX[index % CUT_SFX.length])} volume={0.4} />}
        {/* Rejilla blanca sobre negro */}
        <AbsoluteFill style={{ backgroundImage: GRID, backgroundSize: "66px 66px" }} />
        <AbsoluteFill style={{ backgroundImage: SCAN, opacity: 0.35 }} />
        {/* Resplandor sutil */}
        <AbsoluteFill
          style={{ background: "radial-gradient(60% 55% at 50% 45%, rgba(37,227,234,0.06), rgba(0,0,0,0) 70%)" }}
        />
        {/* Tarjeta con el clip */}
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: entry, filter: blur ? `blur(${blur}px)` : undefined }}>
          <div
            style={{
              position: "relative",
              width: "82%",
              height: "76%",
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 30px 80px rgba(0,0,0,0.7), 0 0 0 2px rgba(255,255,255,0.08)",
            }}
          >
            <KenBurns mode={kb} durationInFrames={dur} seed={index} intensity={1.1}>
              {asset("contrast(1.05) saturate(1.08)", "center 42%")}
            </KenBurns>
          </div>
        </AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none", boxShadow: "inset 0 0 260px rgba(0,0,0,0.6)" }} />
        {flash > 0 && <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} />}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#07070c" }}>
      {shot.sfx && <Audio src={staticFile(CUT_SFX[index % CUT_SFX.length])} volume={0.4} />}
      <AbsoluteFill style={{ transform: entry, filter: blur ? `blur(${blur}px)` : undefined }}>
        <KenBurns mode={kb} durationInFrames={dur} seed={index} intensity={1.09}>
          {asset("contrast(1.06) saturate(1.10)", "center")}
        </KenBurns>
      </AbsoluteFill>
      <AbsoluteFill style={{ pointerEvents: "none", boxShadow: "inset 0 0 200px rgba(0,0,0,0.35)" }} />
      {flash > 0 && <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} />}
    </AbsoluteFill>
  );
};
