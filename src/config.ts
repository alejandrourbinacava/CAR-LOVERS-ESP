// GENERADO por scripts/build-video.mjs — no editar a mano.
export const FPS = 30;

export type Shot = {
  clipSrc: string;
  durationInSeconds: number;
  startFromSeconds?: number;
  kenBurns?: "in" | "out" | "none";
  framed?: boolean;
  isImage?: boolean;
  sfx?: boolean;
};

export type Overlay =
  | { kind: "caption"; text: string; fromSeconds: number; durationInSeconds: number }
  | { kind: "stat"; value: string; sub: string; fromSeconds: number; durationInSeconds: number }
  | { kind: "hook"; text: string; fromSeconds: number; durationInSeconds: number };

export type Pin =
  | { kind: "image"; src: string; label?: string; fromSeconds: number; durationInSeconds: number }
  | { kind: "duo"; srcA: string; srcB: string; labelA: string; labelB: string; fromSeconds: number; durationInSeconds: number };

export type VideoConfig = {
  width: number; height: number; fps: number;
  narrationSrc?: string; musicSrc?: string; totalDurationInSeconds: number;
  shots: Shot[]; overlays: Overlay[]; pins: Pin[];
};

// Tipos antiguos (compatibilidad; sin uso)
export type DataGraphic =
  | { kind: "percent"; value: number; label: string }
  | { kind: "counter"; value: number; label: string; prefix?: string; suffix?: string }
  | { kind: "bars"; label: string; items: { name: string; value: number }[] };
export type Scene = {
  id: string; durationInSeconds: number; type: "clip" | "data";
  clipSrc?: string; caption?: string;
  colorGrade?: "teal-orange" | "desaturated-cold" | "warm-neutral" | "none";
  kenBurns?: "in" | "out" | "in-out" | "none";
  data?: DataGraphic;
  transitionIn?: "slide-glitch" | "whoosh" | "shutter" | "none";
};

export const videoConfig: VideoConfig = {
  width: 1920,
  height: 1080,
  fps: FPS,
  narrationSrc: "assets/audio/narration.mp3",
  musicSrc: "assets/audio/musica-fondo.mp3",
  totalDurationInSeconds: 707.00,
  shots: [
  { clipSrc: "assets/yt-oian/marca-corolla.mp4", durationInSeconds: 5, startFromSeconds: 45, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-oian/marca-crv.mp4", durationInSeconds: 4, startFromSeconds: 2.5, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-oian/marca-jogger.mp4", durationInSeconds: 6, startFromSeconds: 45, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-oian/marca-sandero.mp4", durationInSeconds: 4, startFromSeconds: 45, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-oian/marca-tucson.mp4", durationInSeconds: 5, startFromSeconds: 2.7, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-oian/marca-yariscross.mp4", durationInSeconds: 5, startFromSeconds: 45, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-oian/marca-corolla.mp4", durationInSeconds: 4, startFromSeconds: 52, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-oian/marca-crv.mp4", durationInSeconds: 6, startFromSeconds: 6.5, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-oian/marca-jogger.mp4", durationInSeconds: 4, startFromSeconds: 52, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-oian/marca-sandero.mp4", durationInSeconds: 5, startFromSeconds: 52, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-oian/marca-tucson.mp4", durationInSeconds: 5, startFromSeconds: 6.7, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-oian/marca-yariscross.mp4", durationInSeconds: 4, startFromSeconds: 52, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-oian/marca-sandero.mp4", durationInSeconds: 7, startFromSeconds: 59, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-oian/marca-sandero.mp4", durationInSeconds: 5, startFromSeconds: 66, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-sandero.mp4", durationInSeconds: 6, startFromSeconds: 73, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-sandero.mp4", durationInSeconds: 6, startFromSeconds: 80, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-sandero.mp4", durationInSeconds: 5, startFromSeconds: 87, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-sandero.mp4", durationInSeconds: 7, startFromSeconds: 94, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-sandero.mp4", durationInSeconds: 5, startFromSeconds: 101, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-sandero.mp4", durationInSeconds: 6, startFromSeconds: 108, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-sandero.mp4", durationInSeconds: 6, startFromSeconds: 115, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-sandero.mp4", durationInSeconds: 5, startFromSeconds: 122, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-sandero.mp4", durationInSeconds: 7, startFromSeconds: 129, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-sandero.mp4", durationInSeconds: 5, startFromSeconds: 136, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-sandero.mp4", durationInSeconds: 6, startFromSeconds: 143, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-sandero.mp4", durationInSeconds: 6, startFromSeconds: 150, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-sandero.mp4", durationInSeconds: 5, startFromSeconds: 157, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-sandero.mp4", durationInSeconds: 7, startFromSeconds: 164, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-sandero.mp4", durationInSeconds: 5, startFromSeconds: 171, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-corolla.mp4", durationInSeconds: 6, startFromSeconds: 59, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-corolla.mp4", durationInSeconds: 6, startFromSeconds: 66, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-corolla.mp4", durationInSeconds: 5, startFromSeconds: 73, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-corolla.mp4", durationInSeconds: 7, startFromSeconds: 80, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-corolla.mp4", durationInSeconds: 5, startFromSeconds: 87, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-corolla.mp4", durationInSeconds: 6, startFromSeconds: 94, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-corolla.mp4", durationInSeconds: 6, startFromSeconds: 101, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-corolla.mp4", durationInSeconds: 5, startFromSeconds: 108, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-corolla.mp4", durationInSeconds: 7, startFromSeconds: 115, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-corolla.mp4", durationInSeconds: 5, startFromSeconds: 122, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-corolla.mp4", durationInSeconds: 6, startFromSeconds: 129, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-corolla.mp4", durationInSeconds: 6, startFromSeconds: 136, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-corolla.mp4", durationInSeconds: 5, startFromSeconds: 143, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-corolla.mp4", durationInSeconds: 7, startFromSeconds: 150, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-corolla.mp4", durationInSeconds: 5, startFromSeconds: 157, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-corolla.mp4", durationInSeconds: 6, startFromSeconds: 164, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-corolla.mp4", durationInSeconds: 6, startFromSeconds: 171, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-yariscross.mp4", durationInSeconds: 5, startFromSeconds: 59, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-yariscross.mp4", durationInSeconds: 7, startFromSeconds: 66, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-yariscross.mp4", durationInSeconds: 5, startFromSeconds: 73, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-yariscross.mp4", durationInSeconds: 6, startFromSeconds: 80, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-yariscross.mp4", durationInSeconds: 6, startFromSeconds: 87, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-20693180.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-34118771.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-yariscross.mp4", durationInSeconds: 5, startFromSeconds: 94, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-yariscross.mp4", durationInSeconds: 6, startFromSeconds: 101, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-yariscross.mp4", durationInSeconds: 6, startFromSeconds: 108, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-39378296.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-29540797.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-yariscross.mp4", durationInSeconds: 5, startFromSeconds: 115, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-38452040.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-yariscross.mp4", durationInSeconds: 6, startFromSeconds: 122, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-yariscross.mp4", durationInSeconds: 5, startFromSeconds: 129, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-yariscross.mp4", durationInSeconds: 7, startFromSeconds: 136, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-jogger.mp4", durationInSeconds: 5, startFromSeconds: 59, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-jogger.mp4", durationInSeconds: 6, startFromSeconds: 66, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-jogger.mp4", durationInSeconds: 6, startFromSeconds: 73, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-jogger.mp4", durationInSeconds: 5, startFromSeconds: 80, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-jogger.mp4", durationInSeconds: 7, startFromSeconds: 87, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-jogger.mp4", durationInSeconds: 5, startFromSeconds: 94, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-jogger.mp4", durationInSeconds: 6, startFromSeconds: 101, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-jogger.mp4", durationInSeconds: 6, startFromSeconds: 108, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-sandero.mp4", durationInSeconds: 5, startFromSeconds: 178, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-sandero.mp4", durationInSeconds: 7, startFromSeconds: 185, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-jogger.mp4", durationInSeconds: 5, startFromSeconds: 115, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-jogger.mp4", durationInSeconds: 6, startFromSeconds: 122, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-jogger.mp4", durationInSeconds: 6, startFromSeconds: 129, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-jogger.mp4", durationInSeconds: 5, startFromSeconds: 136, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-crv.mp4", durationInSeconds: 7, startFromSeconds: 10.5, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-crv.mp4", durationInSeconds: 5, startFromSeconds: 14.5, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-crv.mp4", durationInSeconds: 6, startFromSeconds: 18.5, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-crv.mp4", durationInSeconds: 6, startFromSeconds: 22.5, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-crv.mp4", durationInSeconds: 5, startFromSeconds: 26.5, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-crv.mp4", durationInSeconds: 7, startFromSeconds: 30.5, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-crv.mp4", durationInSeconds: 5, startFromSeconds: 34.5, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-crv.mp4", durationInSeconds: 6, startFromSeconds: 38.5, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8865763.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-27658695.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-35555887.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-32182496.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-13371634.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-4319761.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-14490595.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6817047.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-35018126.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-15830663.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-4095619.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-28730389.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-tucson.mp4", durationInSeconds: 7, startFromSeconds: 10.7, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-tucson.mp4", durationInSeconds: 5, startFromSeconds: 14.7, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-tucson.mp4", durationInSeconds: 6, startFromSeconds: 18.7, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-tucson.mp4", durationInSeconds: 6, startFromSeconds: 22.7, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-tucson.mp4", durationInSeconds: 5, startFromSeconds: 26.7, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-tucson.mp4", durationInSeconds: 7, startFromSeconds: 30.7, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-tucson.mp4", durationInSeconds: 5, startFromSeconds: 34.7, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-tucson.mp4", durationInSeconds: 6, startFromSeconds: 38.7, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-tucson.mp4", durationInSeconds: 6, startFromSeconds: 42.7, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7875596.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8562464.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7154214.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7154208.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-sandero.mp4", durationInSeconds: 6, startFromSeconds: 192, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7154235.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-yariscross.mp4", durationInSeconds: 7, startFromSeconds: 143, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-jogger.mp4", durationInSeconds: 5, startFromSeconds: 143, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7154230.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6817044.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-3045064.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7154224.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-jogger.mp4", durationInSeconds: 4, startFromSeconds: 150, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-yariscross.mp4", durationInSeconds: 5, startFromSeconds: 150, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-jogger.mp4", durationInSeconds: 5, startFromSeconds: 157, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-yariscross.mp4", durationInSeconds: 4, startFromSeconds: 157, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-jogger.mp4", durationInSeconds: 6, startFromSeconds: 164, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-yariscross.mp4", durationInSeconds: 4, startFromSeconds: 164, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-jogger.mp4", durationInSeconds: 5, startFromSeconds: 171, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-yariscross.mp4", durationInSeconds: 5, startFromSeconds: 171, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-jogger.mp4", durationInSeconds: 4, startFromSeconds: 178, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-yariscross.mp4", durationInSeconds: 6, startFromSeconds: 178, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-jogger.mp4", durationInSeconds: 4, startFromSeconds: 185, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-yariscross.mp4", durationInSeconds: 5, startFromSeconds: 185, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-oian/marca-jogger.mp4", durationInSeconds: 3, startFromSeconds: 192, kenBurns: "in", framed: true, isImage: false, sfx: false }
  ],
  overlays: [
  { kind: "hook", text: "5 COCHES PARA LOS QUE\nODIAN COMPRAR COCHE", fromSeconds: 8.39, durationInSeconds: 2.6 },
  { kind: "caption", text: "COMPRA · OLVIDA · FUNCIONA 15 AÑOS", fromSeconds: 31.88, durationInSeconds: 2.5 },
  { kind: "hook", text: "1. DACIA SANDERO", fromSeconds: 55.72, durationInSeconds: 2.6 },
  { kind: "stat", value: "Nº1 EN VENTAS", sub: "EL COCHE NUEVO MÁS VENDIDO DE ESPAÑA", fromSeconds: 66.77, durationInSeconds: 2.8 },
  { kind: "stat", value: "DESDE 13.500 €", sub: "ECO-G GLP ~15.400 €", fromSeconds: 81.26, durationInSeconds: 2.8 },
  { kind: "caption", text: "MECÁNICA SIMPLE = PAZ MENTAL", fromSeconds: 116.83, durationInSeconds: 2.5 },
  { kind: "hook", text: "2. TOYOTA COROLLA\nHÍBRIDO", fromSeconds: 154.44, durationInSeconds: 2.6 },
  { kind: "stat", value: "IRROMPIBLE", sub: "HÍBRIDO SIN ENCHUFE", fromSeconds: 180.04, durationInSeconds: 2.8 },
  { kind: "stat", value: "HASTA 15 AÑOS", sub: "O 250.000 KM · GARANTÍA TOYOTA RELAX", fromSeconds: 208.89, durationInSeconds: 2.8 },
  { kind: "stat", value: "~4,5 L/100", sub: "CONSUMO REAL", fromSeconds: 224.16, durationInSeconds: 2.8 },
  { kind: "hook", text: "3. TOYOTA YARIS CROSS\nHÍBRIDO", fromSeconds: 254.45, durationInSeconds: 2.6 },
  { kind: "caption", text: "MISMO HÍBRIDO FIABLE DEL COROLLA", fromSeconds: 282.33, durationInSeconds: 2.5 },
  { kind: "stat", value: "SUV HÍBRIDO Nº1", sub: "EN VENTAS", fromSeconds: 304.24, durationInSeconds: 2.8 },
  { kind: "stat", value: "DESDE 25.900 €", sub: "FINANCIANDO", fromSeconds: 313.89, durationInSeconds: 2.8 },
  { kind: "hook", text: "4. DACIA JOGGER", fromSeconds: 343.86, durationInSeconds: 2.6 },
  { kind: "stat", value: "7 PLAZAS", sub: "EL MÁS BARATO DE ESPAÑA", fromSeconds: 368.1, durationInSeconds: 2.8 },
  { kind: "caption", text: "MÁS ESPACIO POR EURO QUE NINGUNO", fromSeconds: 374.4, durationInSeconds: 2.5 },
  { kind: "hook", text: "5. HONDA CR-V /\nTOYOTA RAV4 HÍBRIDO", fromSeconds: 427.63, durationInSeconds: 2.6 },
  { kind: "stat", value: "SUV FAMILIAR SERIO", sub: "RAV4 vs CR-V: ELIGE UNO", fromSeconds: 485.6, durationInSeconds: 2.8 },
  { kind: "caption", text: "CIUDAD → CR-V · MIXTO Y KM → RAV4", fromSeconds: 504.14, durationInSeconds: 2.5 },
  { kind: "hook", text: "+1. HYUNDAI TUCSON\nHÍBRIDO", fromSeconds: 532.49, durationInSeconds: 2.6 },
  { kind: "stat", value: "5 AÑOS DE GARANTÍA", sub: "SIN LÍMITE DE KM, INCLUIDA", fromSeconds: 563.87, durationInSeconds: 2.8 },
  { kind: "hook", text: "ELIGE EL TUYO\nEN 30 SEGUNDOS", fromSeconds: 595.32, durationInSeconds: 2.6 },
  { kind: "caption", text: "EL MEJOR ES EL QUE NO TE DA GUERRA", fromSeconds: 640.56, durationInSeconds: 2.5 },
  { kind: "hook", text: "SUSCRÍBETE", fromSeconds: 701.24, durationInSeconds: 2.6 }
  ],
  pins: [

  ],
};
