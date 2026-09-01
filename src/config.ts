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
  totalDurationInSeconds: 764.94,
  shots: [
  { clipSrc: "assets/yt-lspi/marca-cambio.mp4", durationInSeconds: 5, startFromSeconds: 4, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-lspi/marca-carbonilla.mp4", durationInSeconds: 4, startFromSeconds: 45, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 6, startFromSeconds: 45, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-lspi/marca-ecoboost.mp4", durationInSeconds: 4, startFromSeconds: 6, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-lspi/marca-ecomode.mp4", durationInSeconds: 5, startFromSeconds: 45, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-lspi/marca-tsi.mp4", durationInSeconds: 6, startFromSeconds: 4.3, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 5, startFromSeconds: 52, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-lspi/marca-humo.mp4", durationInSeconds: 6, startFromSeconds: 45, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-lspi/marca-inyectores.mp4", durationInSeconds: 4, startFromSeconds: 45, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-lspi/marca-tsi.mp4", durationInSeconds: 6, startFromSeconds: 8.3, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 6, startFromSeconds: 59, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 5, startFromSeconds: 6, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 7, startFromSeconds: 10, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-cambio.mp4", durationInSeconds: 5, startFromSeconds: 8, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 6, startFromSeconds: 14, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 6, startFromSeconds: 18, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-cambio.mp4", durationInSeconds: 5, startFromSeconds: 12, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 7, startFromSeconds: 22, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-cambio.mp4", durationInSeconds: 5, startFromSeconds: 16, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 6, startFromSeconds: 26, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tsi.mp4", durationInSeconds: 6, startFromSeconds: 12.3, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tsi.mp4", durationInSeconds: 5, startFromSeconds: 16.3, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 7, startFromSeconds: 66, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 5, startFromSeconds: 73, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 6, startFromSeconds: 30, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 6, startFromSeconds: 34, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tsi.mp4", durationInSeconds: 5, startFromSeconds: 20.3, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 7, startFromSeconds: 80, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tsi.mp4", durationInSeconds: 5, startFromSeconds: 24.3, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 6, startFromSeconds: 87, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tsi.mp4", durationInSeconds: 6, startFromSeconds: 28.3, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 5, startFromSeconds: 94, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tsi.mp4", durationInSeconds: 7, startFromSeconds: 32.3, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 5, startFromSeconds: 101, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tsi.mp4", durationInSeconds: 6, startFromSeconds: 36.3, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 6, startFromSeconds: 38, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 5, startFromSeconds: 42, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 7, startFromSeconds: 108, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tsi.mp4", durationInSeconds: 5, startFromSeconds: 40.3, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-puretech.mp4", durationInSeconds: 6, startFromSeconds: 6, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 6, startFromSeconds: 115, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 5, startFromSeconds: 46, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 7, startFromSeconds: 50, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tsi.mp4", durationInSeconds: 5, startFromSeconds: 44.3, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tsi.mp4", durationInSeconds: 6, startFromSeconds: 48.3, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 6, startFromSeconds: 122, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 5, startFromSeconds: 129, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-ecoboost.mp4", durationInSeconds: 7, startFromSeconds: 10, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-puretech.mp4", durationInSeconds: 5, startFromSeconds: 10, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 6, startFromSeconds: 54, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 6, startFromSeconds: 58, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-ecoboost.mp4", durationInSeconds: 5, startFromSeconds: 14, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-ecoboost.mp4", durationInSeconds: 7, startFromSeconds: 18, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tsi.mp4", durationInSeconds: 5, startFromSeconds: 52.3, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tsi.mp4", durationInSeconds: 6, startFromSeconds: 56.3, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tsi.mp4", durationInSeconds: 6, startFromSeconds: 60.3, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-puretech.mp4", durationInSeconds: 5, startFromSeconds: 14, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 7, startFromSeconds: 136, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 5, startFromSeconds: 62, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 6, startFromSeconds: 66, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 6, startFromSeconds: 70, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 5, startFromSeconds: 74, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-carbonilla.mp4", durationInSeconds: 7, startFromSeconds: 52, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tsi.mp4", durationInSeconds: 5, startFromSeconds: 64.3, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 6, startFromSeconds: 143, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-carbonilla.mp4", durationInSeconds: 6, startFromSeconds: 59, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 5, startFromSeconds: 150, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 7, startFromSeconds: 157, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tsi.mp4", durationInSeconds: 5, startFromSeconds: 68.3, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 6, startFromSeconds: 164, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tsi.mp4", durationInSeconds: 6, startFromSeconds: 72.3, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-carbonilla.mp4", durationInSeconds: 5, startFromSeconds: 66, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-carbonilla.mp4", durationInSeconds: 7, startFromSeconds: 73, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 5, startFromSeconds: 171, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tsi.mp4", durationInSeconds: 6, startFromSeconds: 76.3, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-ecomode.mp4", durationInSeconds: 6, startFromSeconds: 52, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-ecomode.mp4", durationInSeconds: 5, startFromSeconds: 59, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-ecomode.mp4", durationInSeconds: 7, startFromSeconds: 66, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 5, startFromSeconds: 78, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-ecomode.mp4", durationInSeconds: 6, startFromSeconds: 73, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tsi.mp4", durationInSeconds: 6, startFromSeconds: 40.3, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-ecomode.mp4", durationInSeconds: 5, startFromSeconds: 80, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-ecomode.mp4", durationInSeconds: 7, startFromSeconds: 87, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-ecomode.mp4", durationInSeconds: 5, startFromSeconds: 94, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-ecomode.mp4", durationInSeconds: 6, startFromSeconds: 101, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-cambio.mp4", durationInSeconds: 6, startFromSeconds: 20, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 5, startFromSeconds: 82, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-cambio.mp4", durationInSeconds: 7, startFromSeconds: 24, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 5, startFromSeconds: 178, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-cambio.mp4", durationInSeconds: 6, startFromSeconds: 28, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 6, startFromSeconds: 86, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 5, startFromSeconds: 90, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 7, startFromSeconds: 94, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-cambio.mp4", durationInSeconds: 5, startFromSeconds: 32, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 6, startFromSeconds: 185, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 6, startFromSeconds: 192, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-cambio.mp4", durationInSeconds: 5, startFromSeconds: 36, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-carbonilla.mp4", durationInSeconds: 7, startFromSeconds: 80, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-carbonilla.mp4", durationInSeconds: 5, startFromSeconds: 87, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 6, startFromSeconds: 98, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 6, startFromSeconds: 102, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 5, startFromSeconds: 106, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-ecomode.mp4", durationInSeconds: 7, startFromSeconds: 108, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-ecomode.mp4", durationInSeconds: 5, startFromSeconds: 115, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-inyectores.mp4", durationInSeconds: 6, startFromSeconds: 52, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-inyectores.mp4", durationInSeconds: 6, startFromSeconds: 59, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 5, startFromSeconds: 199, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 7, startFromSeconds: 206, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 5, startFromSeconds: 213, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 6, startFromSeconds: 110, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 6, startFromSeconds: 6, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-humo.mp4", durationInSeconds: 5, startFromSeconds: 52, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-humo.mp4", durationInSeconds: 7, startFromSeconds: 59, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 5, startFromSeconds: 220, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-humo.mp4", durationInSeconds: 6, startFromSeconds: 66, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 6, startFromSeconds: 10, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-humo.mp4", durationInSeconds: 5, startFromSeconds: 73, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 7, startFromSeconds: 227, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 5, startFromSeconds: 234, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tsi.mp4", durationInSeconds: 6, startFromSeconds: 44.3, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tsi.mp4", durationInSeconds: 6, startFromSeconds: 48.3, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 5, startFromSeconds: 241, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 7, startFromSeconds: 248, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tacometro.mp4", durationInSeconds: 5, startFromSeconds: 14, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 6, startFromSeconds: 255, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 6, startFromSeconds: 262, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-cambio.mp4", durationInSeconds: 5, startFromSeconds: 40, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-cambio.mp4", durationInSeconds: 7, startFromSeconds: 44, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-combustion.mp4", durationInSeconds: 5, startFromSeconds: 269, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-cambio.mp4", durationInSeconds: 6, startFromSeconds: 48, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-cambio.mp4", durationInSeconds: 6, startFromSeconds: 52, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tsi.mp4", durationInSeconds: 5, startFromSeconds: 52.3, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-lspi/marca-tsi.mp4", durationInSeconds: 6.94, startFromSeconds: 56.3, kenBurns: "in", framed: true, isImage: false, sfx: false }
  ],
  overlays: [
  { kind: "caption", text: "AGUJEREA PISTONES · DOBLA BIELAS", fromSeconds: 24.48, durationInSeconds: 2.5 },
  { kind: "hook", text: "SE LLAMA\nLSPI", fromSeconds: 45.77, durationInSeconds: 2.6 },
  { kind: "hook", text: "EL GESTO QUE TODOS\nHACEMOS SIN PENSAR", fromSeconds: 56.83, durationInSeconds: 2.6 },
  { kind: "caption", text: "ACELERAR FUERTE + MARCHA ALTA + BAJAS RPM", fromSeconds: 99.53, durationInSeconds: 2.5 },
  { kind: "caption", text: "= RULETA RUSA MECÁNICA", fromSeconds: 113.53, durationInSeconds: 2.5 },
  { kind: "hook", text: "QUÉ ES\nEL LSPI", fromSeconds: 120.14, durationInSeconds: 2.6 },
  { kind: "stat", value: "LSPI", sub: "PRE-IGNICIÓN A BAJAS REVOLUCIONES", fromSeconds: 130.74, durationInSeconds: 2.8 },
  { kind: "caption", text: "SUENA COMO UN MARTILLAZO EN EL MOTOR", fromSeconds: 191.86, durationInSeconds: 2.5 },
  { kind: "caption", text: "PISTÓN AGUJEREADO · SEGMENTOS ROTOS · BIELA DOBLADA", fromSeconds: 206.81, durationInSeconds: 2.5 },
  { kind: "hook", text: "SOLO AFECTA A LOS\nMOTORES MODERNOS", fromSeconds: 215.88, durationInSeconds: 2.6 },
  { kind: "caption", text: "ALTA COMPRESIÓN + TURBO + INYECCIÓN DIRECTA", fromSeconds: 233.21, durationInSeconds: 2.5 },
  { kind: "caption", text: "ZONA DE RIESGO: PureTech · EcoBoost", fromSeconds: 294.68, durationInSeconds: 2.5 },
  { kind: "caption", text: "TSI · TFSI · TCe · DIG-T · T-GDI", fromSeconds: 303.02, durationInSeconds: 2.5 },
  { kind: "hook", text: "LOS 3 FACTORES\nQUE DISPARAN EL LSPI", fromSeconds: 320.2, durationInSeconds: 2.6 },
  { kind: "stat", value: "< 2.500 RPM", sub: "ZONA DE MÁXIMO RIESGO", fromSeconds: 348.73, durationInSeconds: 2.8 },
  { kind: "caption", text: "FACTOR 2 · CARBONILLA Y SEDIMENTOS", fromSeconds: 354.27, durationInSeconds: 2.5 },
  { kind: "caption", text: "FACTOR 3 · ACEITE INCORRECTO", fromSeconds: 380.3, durationInSeconds: 2.5 },
  { kind: "stat", value: "API SP · ACEA C6 · GF-6", sub: "ACEITES CON TEST ANTI-LSPI", fromSeconds: 406.92, durationInSeconds: 2.8 },
  { kind: "hook", text: "EL ERROR DENTRO\nDEL ERROR: EL MODO ECO", fromSeconds: 421.97, durationInSeconds: 2.6 },
  { kind: "caption", text: "MODO ECO = BAJAS RPM SISTEMÁTICAS", fromSeconds: 441.71, durationInSeconds: 2.5 },
  { kind: "caption", text: "TURBO + CIUDAD → DESACTIVA EL MODO ECO", fromSeconds: 473.4, durationInSeconds: 2.5 },
  { kind: "hook", text: "CÓMO DEJAR DE\nDESTRUIR TU MOTOR", fromSeconds: 479.1, durationInSeconds: 2.6 },
  { kind: "caption", text: "REGLA 1 · NUNCA ACELERAR FUERTE < 2.500 RPM", fromSeconds: 488.92, durationInSeconds: 2.5 },
  { kind: "caption", text: "¿POTENCIA? BAJA UNA MARCHA PRIMERO", fromSeconds: 509.84, durationInSeconds: 2.5 },
  { kind: "caption", text: "REGLA 2 · EL ACEITE EXACTO DEL FABRICANTE", fromSeconds: 530.16, durationInSeconds: 2.5 },
  { kind: "caption", text: "REGLA 3 · CÁMARA LIMPIA (LIMPIEZA ITALIANA)", fromSeconds: 555.24, durationInSeconds: 2.5 },
  { kind: "caption", text: "REGLA 4 · DESACTIVA EL MODO ECO EN CIUDAD", fromSeconds: 585.88, durationInSeconds: 2.5 },
  { kind: "caption", text: "REGLA 5 · LIMPIA INYECTORES /15-20.000 KM", fromSeconds: 597.59, durationInSeconds: 2.5 },
  { kind: "hook", text: "¿YA ESTÁ PASANDO\nEN TU MOTOR?", fromSeconds: 609.84, durationInSeconds: 2.6 },
  { kind: "caption", text: "SÍNTOMA · MARTILLAZO METÁLICO SECO", fromSeconds: 621.85, durationInSeconds: 2.5 },
  { kind: "caption", text: "HUMO AZUL = DAÑO HECHO · AL TALLER", fromSeconds: 645.48, durationInSeconds: 2.5 },
  { kind: "stat", value: "80%", sub: "NO SABE QUE LO HACE", fromSeconds: 699.09, durationInSeconds: 2.8 },
  { kind: "hook", text: "LA SOLUCIÓN:\nBAJA UNA MARCHA", fromSeconds: 725.27, durationInSeconds: 2.6 },
  { kind: "hook", text: "SUSCRÍBETE", fromSeconds: 760.08, durationInSeconds: 2.6 }
  ],
  pins: [

  ],
};
