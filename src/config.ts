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
  totalDurationInSeconds: 746.63,
  shots: [
  { clipSrc: "assets/clips/v-18101989.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-8986894.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-8986482.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-8987272.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-8986475.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-8986476.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-14514835.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-14514790.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-6685054.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-33129205.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-8986488.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-33129031.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-6870347.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-6870344.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6312479.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-30752440.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-4223775.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-13850345.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-17770564.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-12680273.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-9174926.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-3913495.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6870334.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8987273.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8986479.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8986485.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-20693199.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-32329382.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-20693191.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8987276.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-14514403.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8986892.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8987010.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7565181.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6685051.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8986890.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6160044.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6160051.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6618036.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8078914.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-28722030.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-4783865.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6618025.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-30843746.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-18019165.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-4228873.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-29498801.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-5638014.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-29466433.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8986875.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-30418714.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-34437789.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8470382.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8987013.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6685024.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8987028.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6870346.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-18101981.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8987009.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6685035.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-20156190.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6870339.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8469665.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-20693201.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-32329403.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-14514800.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8986480.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8470298.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-14514407.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8986481.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7844143.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7564888.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8470292.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-33129175.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-3771729.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-4488735.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-31220643.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-32329385.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-4822919.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-30288951.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-30283097.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-1116131.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8104919.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-32083964.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-2075171.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-4707185.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-31220566.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-18911703.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-31220655.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-16685623.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-17193158.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-34593373.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-16304650.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7013918.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-35018126.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6157907.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6157908.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6157913.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-14514414.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6062877.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-14514791.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-18101976.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-14514411.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-36223293.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-14514415.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8987025.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6870333.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-14514409.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-26539174.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7220977.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8987015.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8987011.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8987014.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8470697.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-14514802.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8316564.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8439245.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-5778854.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8061370.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8439239.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7841634.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7685212.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-5519941.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-5311423.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8479055.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6685046.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7006654.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-9724172.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8986486.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-5637834.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7154208.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-29913843.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7565185.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7844146.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-38854050.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-13802596.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-1482055.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-5558025.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-28928755.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-29780004.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-33810551.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-2053420.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8469674.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8987071.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8987078.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8986484.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-14514405.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-14514413.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8987018.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8987026.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-9498286.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8986487.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8469681.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-20693179.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7006123.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8986893.mp4", durationInSeconds: 2.63, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false }
  ],
  overlays: [
  { kind: "hook", text: "5 AVERÍAS QUE\nEL TALLER INFLA", fromSeconds: 4.37, durationInSeconds: 2.6 },
  { kind: "stat", value: "684 €", sub: "COSTE MEDIO REPARACIÓN · ESPAÑA 2026 (+9%)", fromSeconds: 23.6, durationInSeconds: 2.8 },
  { kind: "hook", text: "AVERÍA 1\nEL TESTIGO DEL MOTOR", fromSeconds: 66.25, durationInSeconds: 2.6 },
  { kind: "caption", text: "CAMBIAN EL SENSOR SIN VERIFICAR LA CAUSA", fromSeconds: 90.96, durationInSeconds: 2.5 },
  { kind: "caption", text: "PREGUNTA: ¿ES LA CAUSA, O SOLO EL CÓDIGO APUNTA?", fromSeconds: 155.65, durationInSeconds: 2.5 },
  { kind: "caption", text: "LA MÁQUINA DICE DÓNDE MIRAR, NO QUÉ CAMBIAR", fromSeconds: 168.2, durationInSeconds: 2.5 },
  { kind: "hook", text: "AVERÍA 2\nEL FAP OBSTRUIDO", fromSeconds: 171.61, durationInSeconds: 2.6 },
  { kind: "stat", value: "17,9%", sub: "EMISIONES · LO QUE MÁS CRECE EN TALLER 2026", fromSeconds: 187.28, durationInSeconds: 2.8 },
  { kind: "stat", value: "1.000-2.000+ €", sub: "LO QUE PIDEN POR CAMBIAR EL FAP COMPLETO", fromSeconds: 206.44, durationInSeconds: 2.8 },
  { kind: "caption", text: "1º REGENERACIÓN FORZADA (barato o gratis)", fromSeconds: 232.1, durationInSeconds: 2.5 },
  { kind: "caption", text: "2º LIMPIEZA DEL FAP (una fracción del precio)", fromSeconds: 243.63, durationInSeconds: 2.5 },
  { kind: "caption", text: "PREGUNTA CLAVE: ¿POR QUÉ SE HA SATURADO?", fromSeconds: 275.06, durationInSeconds: 2.5 },
  { kind: "hook", text: "AVERÍA 3\nEL CONSUMO DE ACEITE", fromSeconds: 290.87, durationInSeconds: 2.6 },
  { kind: "stat", value: "VÁLVULA PCV", sub: "LA CAUSA BARATA QUE SE IGNORA", fromSeconds: 335.51, durationInSeconds: 2.8 },
  { kind: "stat", value: "20-80 €", sub: "CAMBIAR LA PCV (vs abrir el motor)", fromSeconds: 342.53, durationInSeconds: 2.8 },
  { kind: "caption", text: "DIAGNÓSTICO HONESTO: EMPIEZA POR LO BARATO", fromSeconds: 368.71, durationInSeconds: 2.5 },
  { kind: "hook", text: "AVERÍA 4\nTIRONES DE LA CAJA AUTOMÁTICA", fromSeconds: 374.43, durationInSeconds: 2.6 },
  { kind: "stat", value: "2.000-4.000 €", sub: "LO QUE PIDEN: RECONSTRUIR CAJA / MECATRÓNICA", fromSeconds: 400.18, durationInSeconds: 2.8 },
  { kind: "caption", text: "MUCHAS VECES = SOLO CAMBIO DE ACEITE Y FILTRO", fromSeconds: 417, durationInSeconds: 2.5 },
  { kind: "caption", text: "O SOFTWARE DESACTUALIZADO (ARREGLO BARATO)", fromSeconds: 429.01, durationInSeconds: 2.5 },
  { kind: "hook", text: "AVERÍA 5\nRUIDO EN LA SUSPENSIÓN", fromSeconds: 465.42, durationInSeconds: 2.6 },
  { kind: "caption", text: "CAMBIAN AMORTIGUADORES / BRAZOS ENTEROS", fromSeconds: 481.97, durationInSeconds: 2.5 },
  { kind: "caption", text: "SUELE SER: SILENTBLOCK · RÓTULA · BIELETA (barato)", fromSeconds: 500.78, durationInSeconds: 2.5 },
  { kind: "caption", text: "'EL CONJUNTO ENTERO POR SI ACASO' = TU DINERO", fromSeconds: 531.76, durationInSeconds: 2.5 },
  { kind: "hook", text: "TU MEJOR ARMA:\nEL PRESUPUESTO POR ESCRITO", fromSeconds: 545.68, durationInSeconds: 2.6 },
  { kind: "stat", value: "RD 1457/1986", sub: "TU DERECHO A PRESUPUESTO POR ESCRITO", fromSeconds: 553.19, durationInSeconds: 2.8 },
  { kind: "caption", text: "AVERÍAS CARAS: PIDE SIEMPRE UN 2º PRESUPUESTO", fromSeconds: 586.43, durationInSeconds: 2.5 },
  { kind: "hook", text: "CÓMO RECONOCER\nUN TALLER HONESTO", fromSeconds: 599.16, durationInSeconds: 2.6 },
  { kind: "caption", text: "HONESTO: EXPLICA LA CAUSA, NO SOLO LA PIEZA", fromSeconds: 607.87, durationInSeconds: 2.5 },
  { kind: "caption", text: "HONESTO: TE DEVUELVE LAS PIEZAS VIEJAS", fromSeconds: 626.71, durationInSeconds: 2.5 },
  { kind: "hook", text: "LA DEFENSA:\nLLEGAR SABIENDO", fromSeconds: 676.28, durationInSeconds: 2.6 },
  { kind: "hook", text: "SUSCRÍBETE", fromSeconds: 741.84, durationInSeconds: 2.6 }
  ],
  pins: [

  ],
};
