// ============================================================
// GRID BG — capa 1 de las fichas: fondo negro con rejilla en
// movimiento (deriva diagonal) y un resplandor que respira.
// ============================================================
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

export const GridBG: React.FC<{ speed?: number; glow?: string }> = ({ speed = 1, glow = "rgba(255,212,0,0.10)" }) => {
  const frame = useCurrentFrame();
  const off = (frame * 1.1 * speed) % 90;
  const pulse = 0.75 + 0.25 * Math.sin(frame / 18);
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070c" }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.11) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.11) 2px, transparent 2px)",
          backgroundSize: "90px 90px",
          backgroundPosition: `${off}px ${off * 0.6}px`,
        }}
      />
      <AbsoluteFill
        style={{ background: `radial-gradient(60% 55% at 50% 55%, ${glow} 0%, rgba(0,0,0,0) 70%)`, opacity: pulse }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(90% 90% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 100%)" }} />
    </AbsoluteFill>
  );
};
