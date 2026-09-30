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
  totalDurationInSeconds: 725.00,
  shots: [
  { clipSrc: "assets/yt-ocu/marca-aygo.mp4", durationInSeconds: 5, startFromSeconds: 45, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-ocu/marca-chr.mp4", durationInSeconds: 4, startFromSeconds: 45, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-ocu/marca-mazda2.mp4", durationInSeconds: 6, startFromSeconds: 45, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-ocu/marca-niro.mp4", durationInSeconds: 4, startFromSeconds: 45, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-ocu/marca-rav4.mp4", durationInSeconds: 5, startFromSeconds: 45, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-ocu/marca-stonic.mp4", durationInSeconds: 5, startFromSeconds: 45, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-ocu/marca-vitara.mp4", durationInSeconds: 4, startFromSeconds: 45, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-ocu/marca-aygo.mp4", durationInSeconds: 6, startFromSeconds: 52, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-ocu/marca-chr.mp4", durationInSeconds: 4, startFromSeconds: 52, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-ocu/marca-mazda2.mp4", durationInSeconds: 5, startFromSeconds: 52, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-ocu/marca-niro.mp4", durationInSeconds: 5, startFromSeconds: 52, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-ocu/marca-rav4.mp4", durationInSeconds: 4, startFromSeconds: 52, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-ocu/marca-aygo.mp4", durationInSeconds: 7, startFromSeconds: 59, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-ocu/marca-aygo.mp4", durationInSeconds: 5, startFromSeconds: 66, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-aygo.mp4", durationInSeconds: 6, startFromSeconds: 73, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-aygo.mp4", durationInSeconds: 6, startFromSeconds: 80, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-aygo.mp4", durationInSeconds: 5, startFromSeconds: 87, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-aygo.mp4", durationInSeconds: 7, startFromSeconds: 94, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-aygo.mp4", durationInSeconds: 5, startFromSeconds: 101, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-aygo.mp4", durationInSeconds: 6, startFromSeconds: 108, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-aygo.mp4", durationInSeconds: 6, startFromSeconds: 115, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-aygo.mp4", durationInSeconds: 5, startFromSeconds: 122, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-aygo.mp4", durationInSeconds: 7, startFromSeconds: 129, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-aygo.mp4", durationInSeconds: 5, startFromSeconds: 136, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-aygo.mp4", durationInSeconds: 6, startFromSeconds: 143, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-aygo.mp4", durationInSeconds: 6, startFromSeconds: 150, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-aygo.mp4", durationInSeconds: 5, startFromSeconds: 157, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-aygo.mp4", durationInSeconds: 7, startFromSeconds: 164, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-aygo.mp4", durationInSeconds: 5, startFromSeconds: 171, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-rav4.mp4", durationInSeconds: 6, startFromSeconds: 59, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-rav4.mp4", durationInSeconds: 6, startFromSeconds: 66, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-rav4.mp4", durationInSeconds: 5, startFromSeconds: 73, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-rav4.mp4", durationInSeconds: 7, startFromSeconds: 80, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-rav4.mp4", durationInSeconds: 5, startFromSeconds: 87, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-rav4.mp4", durationInSeconds: 6, startFromSeconds: 94, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-rav4.mp4", durationInSeconds: 6, startFromSeconds: 101, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-rav4.mp4", durationInSeconds: 5, startFromSeconds: 108, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-rav4.mp4", durationInSeconds: 7, startFromSeconds: 115, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-rav4.mp4", durationInSeconds: 5, startFromSeconds: 122, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-rav4.mp4", durationInSeconds: 6, startFromSeconds: 129, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-rav4.mp4", durationInSeconds: 6, startFromSeconds: 136, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-rav4.mp4", durationInSeconds: 5, startFromSeconds: 143, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-chr.mp4", durationInSeconds: 7, startFromSeconds: 59, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-chr.mp4", durationInSeconds: 5, startFromSeconds: 66, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-chr.mp4", durationInSeconds: 6, startFromSeconds: 73, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-chr.mp4", durationInSeconds: 6, startFromSeconds: 80, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-chr.mp4", durationInSeconds: 5, startFromSeconds: 87, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-chr.mp4", durationInSeconds: 7, startFromSeconds: 94, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-chr.mp4", durationInSeconds: 5, startFromSeconds: 101, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-chr.mp4", durationInSeconds: 6, startFromSeconds: 108, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-chr.mp4", durationInSeconds: 6, startFromSeconds: 115, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-chr.mp4", durationInSeconds: 5, startFromSeconds: 122, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-chr.mp4", durationInSeconds: 7, startFromSeconds: 129, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-chr.mp4", durationInSeconds: 5, startFromSeconds: 136, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-niro.mp4", durationInSeconds: 6, startFromSeconds: 59, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-niro.mp4", durationInSeconds: 6, startFromSeconds: 66, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-niro.mp4", durationInSeconds: 5, startFromSeconds: 73, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-niro.mp4", durationInSeconds: 7, startFromSeconds: 80, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-niro.mp4", durationInSeconds: 5, startFromSeconds: 87, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-niro.mp4", durationInSeconds: 6, startFromSeconds: 94, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-niro.mp4", durationInSeconds: 6, startFromSeconds: 101, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-niro.mp4", durationInSeconds: 5, startFromSeconds: 108, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-niro.mp4", durationInSeconds: 7, startFromSeconds: 115, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-niro.mp4", durationInSeconds: 5, startFromSeconds: 122, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-niro.mp4", durationInSeconds: 6, startFromSeconds: 129, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-niro.mp4", durationInSeconds: 6, startFromSeconds: 136, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-niro.mp4", durationInSeconds: 5, startFromSeconds: 143, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-niro.mp4", durationInSeconds: 7, startFromSeconds: 150, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-niro.mp4", durationInSeconds: 5, startFromSeconds: 157, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-vitara.mp4", durationInSeconds: 6, startFromSeconds: 52, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-vitara.mp4", durationInSeconds: 6, startFromSeconds: 59, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-vitara.mp4", durationInSeconds: 5, startFromSeconds: 66, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-vitara.mp4", durationInSeconds: 7, startFromSeconds: 73, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-vitara.mp4", durationInSeconds: 5, startFromSeconds: 80, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-vitara.mp4", durationInSeconds: 6, startFromSeconds: 87, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-vitara.mp4", durationInSeconds: 6, startFromSeconds: 94, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-vitara.mp4", durationInSeconds: 5, startFromSeconds: 101, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-vitara.mp4", durationInSeconds: 7, startFromSeconds: 108, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-vitara.mp4", durationInSeconds: 5, startFromSeconds: 115, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-vitara.mp4", durationInSeconds: 6, startFromSeconds: 122, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-stonic.mp4", durationInSeconds: 6, startFromSeconds: 52, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-stonic.mp4", durationInSeconds: 5, startFromSeconds: 59, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-stonic.mp4", durationInSeconds: 7, startFromSeconds: 66, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-stonic.mp4", durationInSeconds: 5, startFromSeconds: 73, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-stonic.mp4", durationInSeconds: 6, startFromSeconds: 80, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-stonic.mp4", durationInSeconds: 6, startFromSeconds: 87, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-stonic.mp4", durationInSeconds: 5, startFromSeconds: 94, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-stonic.mp4", durationInSeconds: 7, startFromSeconds: 101, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-stonic.mp4", durationInSeconds: 5, startFromSeconds: 108, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-stonic.mp4", durationInSeconds: 6, startFromSeconds: 115, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-stonic.mp4", durationInSeconds: 6, startFromSeconds: 122, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-stonic.mp4", durationInSeconds: 5, startFromSeconds: 129, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-mazda2.mp4", durationInSeconds: 7, startFromSeconds: 59, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-mazda2.mp4", durationInSeconds: 5, startFromSeconds: 66, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-mazda2.mp4", durationInSeconds: 6, startFromSeconds: 73, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-mazda2.mp4", durationInSeconds: 6, startFromSeconds: 80, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-mazda2.mp4", durationInSeconds: 5, startFromSeconds: 87, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-mazda2.mp4", durationInSeconds: 7, startFromSeconds: 94, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-mazda2.mp4", durationInSeconds: 5, startFromSeconds: 101, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-mazda2.mp4", durationInSeconds: 6, startFromSeconds: 108, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-mazda2.mp4", durationInSeconds: 6, startFromSeconds: 115, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-mazda2.mp4", durationInSeconds: 5, startFromSeconds: 122, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-mazda2.mp4", durationInSeconds: 7, startFromSeconds: 129, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-mazda2.mp4", durationInSeconds: 5, startFromSeconds: 136, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-mazda2.mp4", durationInSeconds: 6, startFromSeconds: 143, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-vitara.mp4", durationInSeconds: 5, startFromSeconds: 129, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-stonic.mp4", durationInSeconds: 4, startFromSeconds: 136, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-vitara.mp4", durationInSeconds: 6, startFromSeconds: 136, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-aygo.mp4", durationInSeconds: 5, startFromSeconds: 178, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-aygo.mp4", durationInSeconds: 6, startFromSeconds: 185, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-chr.mp4", durationInSeconds: 5, startFromSeconds: 143, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-stonic.mp4", durationInSeconds: 4, startFromSeconds: 143, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-vitara.mp4", durationInSeconds: 6, startFromSeconds: 143, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-chr.mp4", durationInSeconds: 4, startFromSeconds: 150, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-mazda2.mp4", durationInSeconds: 5, startFromSeconds: 150, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-rav4.mp4", durationInSeconds: 5, startFromSeconds: 150, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-stonic.mp4", durationInSeconds: 4, startFromSeconds: 150, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-vitara.mp4", durationInSeconds: 6, startFromSeconds: 150, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-chr.mp4", durationInSeconds: 4, startFromSeconds: 157, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-mazda2.mp4", durationInSeconds: 5, startFromSeconds: 157, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-rav4.mp4", durationInSeconds: 5, startFromSeconds: 157, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-stonic.mp4", durationInSeconds: 4, startFromSeconds: 157, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-vitara.mp4", durationInSeconds: 6, startFromSeconds: 157, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-chr.mp4", durationInSeconds: 4, startFromSeconds: 164, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-mazda2.mp4", durationInSeconds: 5, startFromSeconds: 164, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-niro.mp4", durationInSeconds: 5, startFromSeconds: 164, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-aygo.mp4", durationInSeconds: 5, startFromSeconds: 192, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8986894.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-rav4.mp4", durationInSeconds: 4, startFromSeconds: 164, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-stonic.mp4", durationInSeconds: 5, startFromSeconds: 164, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-ocu/marca-vitara.mp4", durationInSeconds: 5, startFromSeconds: 164, kenBurns: "in", framed: true, isImage: false, sfx: false }
  ],
  overlays: [
  { kind: "hook", text: "7 COCHES CASI PERFECTOS\nSEGÚN LA OCU 2026", fromSeconds: 0, durationInSeconds: 2.6 },
  { kind: "stat", value: "85.590 CONDUCTORES", sub: "10 PAÍSES · 392 MODELOS ANALIZADOS", fromSeconds: 8.45, durationInSeconds: 2.8 },
  { kind: "caption", text: "96+ / 100 EN FIABILIDAD REAL", fromSeconds: 24.08, durationInSeconds: 2.5 },
  { kind: "hook", text: "1. TOYOTA AYGO X CROSS", fromSeconds: 53.37, durationInSeconds: 2.6 },
  { kind: "stat", value: "98/100", sub: "LA NOTA MÁS ALTA · Nº1 ABSOLUTO", fromSeconds: 68.8, durationInSeconds: 2.8 },
  { kind: "caption", text: "ATMOSFÉRICO · SIN TURBO = FIABLE", fromSeconds: 122.3, durationInSeconds: 2.5 },
  { kind: "hook", text: "2. TOYOTA RAV4\nHÍBRIDO", fromSeconds: 151.84, durationInSeconds: 2.6 },
  { kind: "stat", value: "96/100", sub: "LÍDER SUV GRANDE (HÍBRIDO Y PHEV)", fromSeconds: 168.72, durationInSeconds: 2.8 },
  { kind: "caption", text: "EL SUV MÁS EQUILIBRADO DEL MERCADO", fromSeconds: 182.15, durationInSeconds: 2.5 },
  { kind: "hook", text: "3. TOYOTA C-HR\nHÍBRIDO", fromSeconds: 230.75, durationInSeconds: 2.6 },
  { kind: "stat", value: "96/100", sub: "SUV COMPACTO HÍBRIDO (2016-2023)", fromSeconds: 244.78, durationInSeconds: 2.8 },
  { kind: "caption", text: "DISEÑO CON CARÁCTER + FIABILIDAD TOYOTA", fromSeconds: 270.76, durationInSeconds: 2.5 },
  { kind: "hook", text: "4. KIA NIRO\nELÉCTRICO", fromSeconds: 298.83, durationInSeconds: 2.6 },
  { kind: "stat", value: "96/100", sub: "EL ELÉCTRICO MEDIANO Nº1", fromSeconds: 315.6, durationInSeconds: 2.8 },
  { kind: "caption", text: "SIN LOS FALLOS DE SOFTWARE DE OTROS EV", fromSeconds: 346.14, durationInSeconds: 2.5 },
  { kind: "stat", value: "7 AÑOS", sub: "DE GARANTÍA KIA", fromSeconds: 358.74, durationInSeconds: 2.8 },
  { kind: "hook", text: "5. SUZUKI VITARA", fromSeconds: 379.29, durationInSeconds: 2.6 },
  { kind: "stat", value: "96/100", sub: "SUV PEQUEÑO · MECÁNICA PROBADA", fromSeconds: 396.44, durationInSeconds: 2.8 },
  { kind: "caption", text: "SUZUKI: TOP-4 MARCAS MÁS FIABLES (91)", fromSeconds: 406.2, durationInSeconds: 2.5 },
  { kind: "hook", text: "6. KIA STONIC", fromSeconds: 451.97, durationInSeconds: 2.6 },
  { kind: "stat", value: "96/100", sub: "ELECTRÓNICA SIN INCIDENCIAS", fromSeconds: 479.04, durationInSeconds: 2.8 },
  { kind: "caption", text: "HOY FALLA LA ELECTRÓNICA, NO LA MECÁNICA", fromSeconds: 491.9, durationInSeconds: 2.5 },
  { kind: "hook", text: "7. MAZDA 2", fromSeconds: 519.33, durationInSeconds: 2.6 },
  { kind: "stat", value: "96/100", sub: "UTILITARIO · TAMBIÉN i20, RIO, 108", fromSeconds: 534.92, durationInSeconds: 2.8 },
  { kind: "caption", text: "EL MÁS DIVERTIDO DE CONDUCIR", fromSeconds: 567.47, durationInSeconds: 2.5 },
  { kind: "hook", text: "EL PATRÓN:\nJAPONÉS + HÍBRIDO SIMPLE", fromSeconds: 591.48, durationInSeconds: 2.6 },
  { kind: "caption", text: "JAPONÉS + HÍBRIDO NO ENCHUFABLE", fromSeconds: 631.02, durationInSeconds: 2.5 },
  { kind: "caption", text: "MIRA EL MODELO Y EL MOTOR, NO SOLO LA MARCA", fromSeconds: 638.88, durationInSeconds: 2.5 },
  { kind: "hook", text: "SUSCRÍBETE", fromSeconds: 720.36, durationInSeconds: 2.6 }
  ],
  pins: [

  ],
};
