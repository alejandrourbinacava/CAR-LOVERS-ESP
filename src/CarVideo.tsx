import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { videoConfig, FPS } from "./config";
import { Broll } from "./aw/Broll";
import { Caption } from "./aw/Caption";
import { Stat } from "./aw/Stat";
import { HookCard } from "./aw/HookCard";
import { PinImage } from "./aw/PinImage";
import { DuoPin } from "./aw/DuoPin";
import { EngineTag } from "./aw/EngineTag";
import { ChapterBar } from "./aw/ChapterBar";
import { ModelCard } from "./aw/ModelCard";
import { ChapterWipe } from "./aw/ChapterWipe";
import { CutFX } from "./aw/CutFX";

// Estilo dinámico (opt-in por vídeo): config.fx = true activa transiciones de capítulo, efectos de corte y sonido
// "algorítmico" en los datos; config.cards = fichas de modelo/dato en capas (rejilla + coche recortado + textos).
type Card = { name: string; lines: string[]; cut?: string; side?: "left" | "right"; fromSeconds: number; durationInSeconds: number };

export const CarVideo: React.FC = () => {
  const { shots, overlays, narrationSrc, musicSrc, fx = false, cards = [] } = videoConfig as typeof videoConfig & { musicSrc?: string; fx?: boolean; cards?: Card[] };
  const pins = videoConfig.pins ?? [];
  const tags = videoConfig.tags ?? [];
  const chapters = videoConfig.chapters ?? [];

  // Pista de b-roll: cada shot va detras del anterior (corte cada ~3s)
  let cursor = 0;
  const brollSequences = shots.map((shot, i) => {
    const dur = Math.max(1, Math.round(shot.durationInSeconds * FPS));
    const from = cursor;
    cursor += dur;
    return (
      <React.Fragment key={`b${i}`}>
        <Sequence from={from} durationInFrames={dur}>
          <Broll shot={shot} index={i} />
        </Sequence>
        {fx && i > 0 && (
          <Sequence from={from} durationInFrames={8}>
            <CutFX variant={i} />
          </Sequence>
        )}
      </React.Fragment>
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {narrationSrc && <Audio src={staticFile(narrationSrc)} volume={1} />}
      {/* Musica de fondo del canal a ~-25 dB (0.056 lineal), en bucle, SOLO si
          existe el archivo. Se aplica a TODOS los videos. */}
      {musicSrc && <Audio src={staticFile(musicSrc)} loop volume={0.056} />}


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

      {/* PISTA 2a: fichas de modelo/dato en capas (rejilla + coche recortado + textos) */}
      {cards.map((c, i) => (
        <Sequence key={`c${i}`} from={Math.max(0, Math.round(c.fromSeconds * FPS))} durationInFrames={Math.max(1, Math.round(c.durationInSeconds * FPS))}>
          <ModelCard name={c.name} lines={c.lines} cut={c.cut} side={c.side} />
        </Sequence>
      ))}

      {/* PISTA 2b: motion graphics persistentes (barra de capitulos + etiqueta de motor) */}
      {chapters.length > 0 && <ChapterBar chapters={chapters} total={videoConfig.totalDurationInSeconds} />}
      {tags.map((g, i) => {
        const from = Math.max(0, Math.round(g.fromSeconds * FPS));
        const dur = Math.max(1, Math.round(g.durationInSeconds * FPS));
        return (
          <Sequence key={`t${i}`} from={from} durationInFrames={dur}>
            <EngineTag code={g.code} name={g.name} verdict={g.verdict} />
          </Sequence>
        );
      })}

      {/* transiciones de capítulo (estilo dinámico) */}
      {fx &&
        chapters.slice(1).map((c, i) => (
          <Sequence key={`w${i}`} from={Math.max(0, Math.round(c.fromSeconds * FPS))} durationInFrames={50}>
            <ChapterWipe n={i + 2} label={c.label} />
          </Sequence>
        ))}

      {/* PISTA 3: textos/datos anclados a su segundo del audio */}
      {overlays.map((o, i) => {
        const from = Math.max(0, Math.round(o.fromSeconds * FPS));
        const dur = Math.max(1, Math.round(o.durationInSeconds * FPS));
        return (
          <Sequence key={`o${i}`} from={from} durationInFrames={dur}>
            {o.kind === "caption" && <Caption text={o.text} />}
            {o.kind === "stat" && <Stat value={o.value} sub={o.sub} algo={fx} />}
            {o.kind === "hook" && <HookCard text={o.text} />}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
