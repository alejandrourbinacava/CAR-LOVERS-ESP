import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { videoConfig, FPS } from "./config";
import { Broll } from "./aw/Broll";
import { Caption } from "./aw/Caption";
import { Stat } from "./aw/Stat";
import { HookCard } from "./aw/HookCard";
import { PinImage } from "./aw/PinImage";
import { DuoPin } from "./aw/DuoPin";

export const CarVideo: React.FC = () => {
  const { shots, overlays, narrationSrc, musicSrc } = videoConfig as typeof videoConfig & { musicSrc?: string };
  const pins = videoConfig.pins ?? [];

  // Pista de b-roll: cada shot va detras del anterior (corte cada ~3s)
  let cursor = 0;
  const brollSequences = shots.map((shot, i) => {
    const dur = Math.max(1, Math.round(shot.durationInSeconds * FPS));
    const from = cursor;
    cursor += dur;
    return (
      <Sequence key={`b${i}`} from={from} durationInFrames={dur}>
        <Broll shot={shot} index={i} />
      </Sequence>
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {narrationSrc && <Audio src={staticFile(narrationSrc)} volume={1} />}
      {/* Musica de fondo a -30 dB, SOLO si existe el archivo (regla del cliente:
          normalmente se añade la música aparte con ducking, no incrustada). */}
      {musicSrc && <Audio src={staticFile(musicSrc)} loop volume={0.1} />}


      {/* PISTA 1: b-roll a pantalla completa */}
      {brollSequences}

      {/* PISTA 2: imagenes de MODELO concreto (cubren el b-roll) */}
      {pins.map((p, i) => {
        const from = Math.max(0, Math.round(p.fromSeconds * FPS));
        const dur = Math.max(1, Math.round(p.durationInSeconds * FPS));
        return (
          <Sequence key={`p${i}`} from={from} durationInFrames={dur}>
            {p.kind === "image" && <PinImage src={p.src} label={p.label} />}
            {p.kind === "duo" && (
              <DuoPin srcA={p.srcA} srcB={p.srcB} labelA={p.labelA} labelB={p.labelB} />
            )}
          </Sequence>
        );
      })}

      {/* PISTA 3: textos/datos anclados a su segundo del audio */}
      {overlays.map((o, i) => {
        const from = Math.max(0, Math.round(o.fromSeconds * FPS));
        const dur = Math.max(1, Math.round(o.durationInSeconds * FPS));
        return (
          <Sequence key={`o${i}`} from={from} durationInFrames={dur}>
            {o.kind === "caption" && <Caption text={o.text} />}
            {o.kind === "stat" && <Stat value={o.value} sub={o.sub} />}
            {o.kind === "hook" && <HookCard text={o.text} />}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
