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
  narrationSrc?: string; totalDurationInSeconds: number;
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
  totalDurationInSeconds: 957.73,
  shots: [
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 5, startFromSeconds: 45, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie1.mp4", durationInSeconds: 4, startFromSeconds: 45, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 6, startFromSeconds: 45, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-alemanes/marca-daciaduster.mp4", durationInSeconds: 4, startFromSeconds: 45, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-alemanes/marca-hondacrv.mp4", durationInSeconds: 5, startFromSeconds: 45, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-alemanes/marca-lexusis.mp4", durationInSeconds: 5, startFromSeconds: 45, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-alemanes/marca-mazdacx5.mp4", durationInSeconds: 4, startFromSeconds: 45, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasea.mp4", durationInSeconds: 6, startFromSeconds: 45, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 4, startFromSeconds: 45, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-alemanes/marca-suzukivitara.mp4", durationInSeconds: 5, startFromSeconds: 45, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-alemanes/marca-toyotarav4.mp4", durationInSeconds: 5, startFromSeconds: 45, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-alemanes/marca-vwgolftdi.mp4", durationInSeconds: 4, startFromSeconds: 45, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 7, startFromSeconds: 52, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 5, startFromSeconds: 59, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 6, startFromSeconds: 66, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 6, startFromSeconds: 73, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 5, startFromSeconds: 52, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 7, startFromSeconds: 52, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 5, startFromSeconds: 59, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 6, startFromSeconds: 59, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 6, startFromSeconds: 66, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 5, startFromSeconds: 66, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 7, startFromSeconds: 73, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 5, startFromSeconds: 80, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-toyotarav4.mp4", durationInSeconds: 6, startFromSeconds: 52, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-toyotarav4.mp4", durationInSeconds: 6, startFromSeconds: 59, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-lexusis.mp4", durationInSeconds: 5, startFromSeconds: 52, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-lexusis.mp4", durationInSeconds: 7, startFromSeconds: 59, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-lexusis.mp4", durationInSeconds: 5, startFromSeconds: 66, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 6, startFromSeconds: 73, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 6, startFromSeconds: 80, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 5, startFromSeconds: 80, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 7, startFromSeconds: 87, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 5, startFromSeconds: 87, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 6, startFromSeconds: 87, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 6, startFromSeconds: 94, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 5, startFromSeconds: 94, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 7, startFromSeconds: 94, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 5, startFromSeconds: 101, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 6, startFromSeconds: 101, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 6, startFromSeconds: 101, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 5, startFromSeconds: 108, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 7, startFromSeconds: 108, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-daciaduster.mp4", durationInSeconds: 5, startFromSeconds: 52, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-daciaduster.mp4", durationInSeconds: 6, startFromSeconds: 59, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 6, startFromSeconds: 108, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 5, startFromSeconds: 115, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 7, startFromSeconds: 115, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 5, startFromSeconds: 115, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 6, startFromSeconds: 122, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 6, startFromSeconds: 129, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 5, startFromSeconds: 136, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 7, startFromSeconds: 143, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 5, startFromSeconds: 122, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 6, startFromSeconds: 122, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 6, startFromSeconds: 150, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 5, startFromSeconds: 157, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 7, startFromSeconds: 129, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 5, startFromSeconds: 129, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 6, startFromSeconds: 136, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 6, startFromSeconds: 136, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 5, startFromSeconds: 143, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 7, startFromSeconds: 143, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 5, startFromSeconds: 150, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 6, startFromSeconds: 150, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 6, startFromSeconds: 157, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 5, startFromSeconds: 157, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 7, startFromSeconds: 164, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 5, startFromSeconds: 171, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 6, startFromSeconds: 164, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 6, startFromSeconds: 164, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 5, startFromSeconds: 171, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 7, startFromSeconds: 171, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 5, startFromSeconds: 178, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 6, startFromSeconds: 178, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 6, startFromSeconds: 178, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 5, startFromSeconds: 185, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 7, startFromSeconds: 192, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 5, startFromSeconds: 199, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 6, startFromSeconds: 185, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 6, startFromSeconds: 185, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 5, startFromSeconds: 192, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 7, startFromSeconds: 206, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 5, startFromSeconds: 199, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 6, startFromSeconds: 206, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 6, startFromSeconds: 192, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 5, startFromSeconds: 199, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 7, startFromSeconds: 206, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 5, startFromSeconds: 213, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 6, startFromSeconds: 213, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-vwgolftdi.mp4", durationInSeconds: 6, startFromSeconds: 52, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-vwgolftdi.mp4", durationInSeconds: 5, startFromSeconds: 59, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-vwgolftdi.mp4", durationInSeconds: 7, startFromSeconds: 66, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-vwgolftdi.mp4", durationInSeconds: 5, startFromSeconds: 73, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-vwgolftdi.mp4", durationInSeconds: 6, startFromSeconds: 80, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-vwgolftdi.mp4", durationInSeconds: 6, startFromSeconds: 87, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-vwgolftdi.mp4", durationInSeconds: 5, startFromSeconds: 94, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-vwgolftdi.mp4", durationInSeconds: 7, startFromSeconds: 101, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasea.mp4", durationInSeconds: 5, startFromSeconds: 52, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasea.mp4", durationInSeconds: 6, startFromSeconds: 59, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 6, startFromSeconds: 220, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie1.mp4", durationInSeconds: 5, startFromSeconds: 52, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie1.mp4", durationInSeconds: 7, startFromSeconds: 59, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-vwgolftdi.mp4", durationInSeconds: 5, startFromSeconds: 108, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-vwgolftdi.mp4", durationInSeconds: 6, startFromSeconds: 115, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-vwgolftdi.mp4", durationInSeconds: 6, startFromSeconds: 122, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-vwgolftdi.mp4", durationInSeconds: 5, startFromSeconds: 129, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-vwgolftdi.mp4", durationInSeconds: 7, startFromSeconds: 136, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-vwgolftdi.mp4", durationInSeconds: 5, startFromSeconds: 143, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mazdacx5.mp4", durationInSeconds: 6, startFromSeconds: 52, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mazdacx5.mp4", durationInSeconds: 6, startFromSeconds: 59, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mazdacx5.mp4", durationInSeconds: 5, startFromSeconds: 66, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mazdacx5.mp4", durationInSeconds: 7, startFromSeconds: 73, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mazdacx5.mp4", durationInSeconds: 5, startFromSeconds: 80, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mazdacx5.mp4", durationInSeconds: 6, startFromSeconds: 87, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mazdacx5.mp4", durationInSeconds: 6, startFromSeconds: 94, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-toyotarav4.mp4", durationInSeconds: 5, startFromSeconds: 66, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-toyotarav4.mp4", durationInSeconds: 7, startFromSeconds: 73, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-toyotarav4.mp4", durationInSeconds: 5, startFromSeconds: 80, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-toyotarav4.mp4", durationInSeconds: 6, startFromSeconds: 87, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-toyotarav4.mp4", durationInSeconds: 6, startFromSeconds: 94, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-toyotarav4.mp4", durationInSeconds: 5, startFromSeconds: 101, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-lexusis.mp4", durationInSeconds: 7, startFromSeconds: 73, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 5, startFromSeconds: 220, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-lexusis.mp4", durationInSeconds: 6, startFromSeconds: 80, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-lexusis.mp4", durationInSeconds: 6, startFromSeconds: 87, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-lexusis.mp4", durationInSeconds: 5, startFromSeconds: 94, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-lexusis.mp4", durationInSeconds: 7, startFromSeconds: 101, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-lexusis.mp4", durationInSeconds: 5, startFromSeconds: 108, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-lexusis.mp4", durationInSeconds: 6, startFromSeconds: 115, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-lexusis.mp4", durationInSeconds: 6, startFromSeconds: 122, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 5, startFromSeconds: 227, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 7, startFromSeconds: 234, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-lexusis.mp4", durationInSeconds: 5, startFromSeconds: 129, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-lexusis.mp4", durationInSeconds: 6, startFromSeconds: 136, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-hondacrv.mp4", durationInSeconds: 6, startFromSeconds: 52, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-hondacrv.mp4", durationInSeconds: 5, startFromSeconds: 59, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-hondacrv.mp4", durationInSeconds: 7, startFromSeconds: 66, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-daciaduster.mp4", durationInSeconds: 5, startFromSeconds: 66, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-suzukivitara.mp4", durationInSeconds: 6, startFromSeconds: 52, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-toyotarav4.mp4", durationInSeconds: 6, startFromSeconds: 108, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-toyotarav4.mp4", durationInSeconds: 5, startFromSeconds: 115, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-daciaduster.mp4", durationInSeconds: 7, startFromSeconds: 73, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-daciaduster.mp4", durationInSeconds: 5, startFromSeconds: 80, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 6, startFromSeconds: 213, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 6, startFromSeconds: 220, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 5, startFromSeconds: 241, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 7, startFromSeconds: 248, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 5, startFromSeconds: 227, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 6, startFromSeconds: 227, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 6, startFromSeconds: 234, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 5, startFromSeconds: 234, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 7, startFromSeconds: 241, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 5, startFromSeconds: 241, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 6, startFromSeconds: 248, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 6, startFromSeconds: 248, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 5, startFromSeconds: 255, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 7, startFromSeconds: 255, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 5, startFromSeconds: 255, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 6, startFromSeconds: 262, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 6, startFromSeconds: 262, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 5, startFromSeconds: 262, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 7, startFromSeconds: 269, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 5, startFromSeconds: 269, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 6, startFromSeconds: 269, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-bmwserie3.mp4", durationInSeconds: 6, startFromSeconds: 276, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-mercedesclasee.mp4", durationInSeconds: 5, startFromSeconds: 276, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/yt-alemanes/marca-audia6.mp4", durationInSeconds: 1.73, startFromSeconds: 276, kenBurns: "out", framed: true, isImage: false, sfx: false }
  ],
  overlays: [
  { kind: "hook", text: "LOS MECÁNICOS NO\nCOMPRAN ALEMÁN USADO", fromSeconds: 3.72, durationInSeconds: 2.6 },
  { kind: "caption", text: "NI BMW · NI MERCEDES · NI AUDI", fromSeconds: 10.55, durationInSeconds: 2.5 },
  { kind: "stat", value: "2,5/5", sub: "FIABILIDAD BMW · REPAIRPAL (30 DE 32)", fromSeconds: 95.27, durationInSeconds: 2.8 },
  { kind: "stat", value: "968 $/AÑO", sub: "REPARACIÓN BMW (MEDIA 652)", fromSeconds: 103.38, durationInSeconds: 2.8 },
  { kind: "stat", value: "908 $/AÑO", sub: "MERCEDES-BENZ", fromSeconds: 121.39, durationInSeconds: 2.8 },
  { kind: "stat", value: "987 $/AÑO", sub: "AUDI", fromSeconds: 124.34, durationInSeconds: 2.8 },
  { kind: "stat", value: "551 $/AÑO", sub: "LEXUS", fromSeconds: 127.29, durationInSeconds: 2.8 },
  { kind: "stat", value: "+65%", sub: "ALEMÁN vs LEXUS · MANTENIMIENTO", fromSeconds: 140.85, durationInSeconds: 2.8 },
  { kind: "stat", value: "16-17%", sub: "FALLO ESCAPE BMW/MERCEDES (MEDIA 5%)", fromSeconds: 213.38, durationInSeconds: 2.8 },
  { kind: "stat", value: "x3", sub: "PROBLEMAS ANTICONTAMINACIÓN", fromSeconds: 226.93, durationInSeconds: 2.8 },
  { kind: "caption", text: "UN SENSOR: 200-400 €", fromSeconds: 252.14, durationInSeconds: 2.5 },
  { kind: "stat", value: "70-90", sub: "MÓDULOS ELECTRÓNICOS EN UN BMW", fromSeconds: 266.46, durationInSeconds: 2.8 },
  { kind: "caption", text: "UN MÓDULO: 400-1.500 €", fromSeconds: 300.67, durationInSeconds: 2.5 },
  { kind: "stat", value: "40 CÓDIGOS", sub: "DIAGNÓSTICO OFICIAL: 400 €", fromSeconds: 358.06, durationInSeconds: 2.8 },
  { kind: "stat", value: "1.200-2.500 €", sub: "TURBOCOMPRESOR", fromSeconds: 402.28, durationInSeconds: 2.8 },
  { kind: "stat", value: "2.000-4.000 €", sub: "MECATRÓNICA ZF · CAJA AUTO", fromSeconds: 407.7, durationInSeconds: 2.8 },
  { kind: "stat", value: "22-25 MIL €", sub: "COSTE REAL 5 AÑOS (COMPRA 15.000)", fromSeconds: 439.89, durationInSeconds: 2.8 },
  { kind: "hook", text: "LOS ALEMANES\nQUE SÍ COMPRARÍAMOS", fromSeconds: 506.47, durationInSeconds: 2.6 },
  { kind: "caption", text: "VW GOLF 1.6/2.0 TDI · SIN BITURBO", fromSeconds: 518.46, durationInSeconds: 2.5 },
  { kind: "caption", text: "BMW SERIE 1 · MOTOR B47 (POST-2015)", fromSeconds: 573.32, durationInSeconds: 2.5 },
  { kind: "hook", text: "QUÉ COMPRAMOS\nEN SU LUGAR", fromSeconds: 604.25, durationInSeconds: 2.6 },
  { kind: "stat", value: "447 $/AÑO", sub: "MAZDA CX-5 · Nº1 REPAIRPAL", fromSeconds: 646.06, durationInSeconds: 2.8 },
  { kind: "stat", value: "+300.000 KM", sub: "TOYOTA HÍBRIDO", fromSeconds: 687.99, durationInSeconds: 2.8 },
  { kind: "stat", value: "60-65%", sub: "LEXUS RETIENE VALOR (BMW ~40%)", fromSeconds: 733.62, durationInSeconds: 2.8 },
  { kind: "stat", value: "+365 €/AÑO", sub: "BMW vs LEXUS · MANTENIMIENTO", fromSeconds: 749.53, durationInSeconds: 2.8 },
  { kind: "caption", text: "SUZUKI · TOP-4 FIABILIDAD OCU 2026", fromSeconds: 797.03, durationInSeconds: 2.5 },
  { kind: "hook", text: "NO VEMOS EL BADGE,\nVEMOS LA ARQUITECTURA", fromSeconds: 874.99, durationInSeconds: 2.6 },
  { kind: "hook", text: "SUSCRÍBETE", fromSeconds: 953.96, durationInSeconds: 2.6 }
  ],
  pins: [

  ],
};
