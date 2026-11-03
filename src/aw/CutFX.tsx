// ============================================================
// CUT FX — efecto de corte de 8 fotogramas sobre el b-roll
// (sin sonido). Rota entre 4 variantes: destello, estela
// horizontal, ráfaga radial y glitch RGB.
// ============================================================
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const CutFX: React.FC<{ variant: number }> = ({ variant }) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [0, 8], [1, 0], { extrapolateRight: "clamp" });
  const v = variant % 4;
  if (v === 0) return <AbsoluteFill style={{ background: "#fff", opacity: 0.55 * k * k }} />;
  if (v === 1)
    return (
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,212,0,0.55) 45%, rgba(255,255,255,0.7) 50%, rgba(255,212,0,0.55) 55%, rgba(255,255,255,0) 100%)",
          transform: `translateX(${(1 - k) * 100 - 50}%)`,
          opacity: k,
        }}
      />
    );
  if (v === 2)
    return (
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 20%, rgba(255,255,255,0.65) 100%)",
          opacity: k,
          transform: `scale(${1 + (1 - k) * 0.25})`,
        }}
      />
    );
  const sh = (frame % 3) * 14 - 14;
  return (
    <AbsoluteFill style={{ opacity: k * 0.85, mixBlendMode: "screen" }}>
      <AbsoluteFill style={{ background: "rgba(255,0,60,0.35)", transform: `translateX(${sh}px)` }} />
      <AbsoluteFill style={{ background: "rgba(0,220,255,0.30)", transform: `translateX(${-sh}px)` }} />
    </AbsoluteFill>
  );
};
