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
  { clipSrc: "assets/clips/v-32329373.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-31220643.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-8986876.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-39112150.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-8986488.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-8986890.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-8469674.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-8986479.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-8986474.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-4101740.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-9737950.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-8987276.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-33931911.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: true },
  { clipSrc: "assets/clips/v-15775322.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-3010448.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-15828653.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-28950238.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-15291182.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-31901316.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-15341182.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-4707185.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-16685623.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8104919.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-17193158.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8104917.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-18911703.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-12206553.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6791697.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-9666932.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-9666933.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-5659685.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-31802320.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-17807763.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8828896.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7019384.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-18101985.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7019382.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7565186.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-30085672.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-1116141.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7541835.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-20156190.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-32067533.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-1116131.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-30391336.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-4101696.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-4101729.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-4101732.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-4101728.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-4101741.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-30391329.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-30391333.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-30391331.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-20693196.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-20693201.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-36381466.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-31220517.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-20693191.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-3771727.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-33129031.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-15556121.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-15556113.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-20693184.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-27028816.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-4101738.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-29576549.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-9109484.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8987271.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-33460121.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8986481.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-4912636.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6628398.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-4912633.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-26620441.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-26620319.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8470302.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-35535613.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-4725891.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-4725892.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7568443.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-29902177.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-9738109.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-5309321.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-14514802.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7361497.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6870339.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8987010.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-14514800.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-5911023.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-32083964.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-4565729.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6636563.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-2229697.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6817054.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-11330932.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-31220606.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-13802599.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-3913495.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-11269279.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-18616132.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-34593373.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-2075171.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-31220566.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6157907.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6157913.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8822534.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6157910.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-12194405.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-28044005.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-854536.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-9174926.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-3785380.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-12271230.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-16230094.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-5199292.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6628409.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8447510.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-28197087.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-30075966.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6628412.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-33129175.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-7844145.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8986885.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-14459242.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-4101739.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8986878.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-35666229.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-34539090.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6160044.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-9177142.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8986875.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-30843746.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-6160051.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-27974753.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-28722030.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-35661513.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-4783865.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-5638014.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-3941613.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-4404132.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-2053420.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-16067295.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-5038129.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-4999745.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-15341118.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-28821478.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-26733815.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-36017323.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-35186909.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-30911642.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-37505403.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-13798561.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-3723429.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-29910619.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-20589891.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-8630309.mp4", durationInSeconds: 5, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-13967042.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-13802596.mp4", durationInSeconds: 6, startFromSeconds: 0, kenBurns: "out", framed: false, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-15330792.mp4", durationInSeconds: 4, startFromSeconds: 0, kenBurns: "in", framed: true, isImage: false, sfx: false },
  { clipSrc: "assets/clips/v-3554563.mp4", durationInSeconds: 1.94, startFromSeconds: 0, kenBurns: "out", framed: true, isImage: false, sfx: false }
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
