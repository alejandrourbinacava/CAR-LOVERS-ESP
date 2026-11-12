// ============================================================
// QUOTE CARD — cita/afirmación real a pantalla completa, tecleada letra a letra
// sobre fondo de papel/hormigón (estilo the SUV geek), con la fuente debajo.
// ============================================================
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { FONT_UI, FONT_KICKER } from "../theme";

export const QuoteCard: React.FC<{ text: string; source?: string }> = ({ text, source }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // teclea en ~55 % del tiempo (máx. 2,2 s) y deja leer el resto
  const typeFrames = Math.min(66, Math.max(18, Math.round(durationInFrames * 0.55)));
  const shownChars = Math.round(interpolate(frame, [4, 4 + typeFrames], [0, text.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const opIn = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const opOut = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const zoom = interpolate(frame, [0, durationInFrames], [1.0, 1.05]);
  const srcOp = interpolate(frame, [6 + typeFrames, 14 + typeFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const caret = frame < 6 + typeFrames && Math.floor(frame / 4) % 2 === 0;
  const size = text.length > 120 ? 58 : text.length > 70 ? 68 : 82;
  return (
    <AbsoluteFill style={{ opacity: Math.min(opIn, opOut) }}>
      <Audio src={staticFile("assets/sfx/tick.mp3")} volume={0.35} />
      {/* papel / hormigón: base cálida + ruido + viñeta */}
      <AbsoluteFill style={{ background: "#e7e3da", transform: `scale(${zoom})` }}>
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.55 }}>
          <filter id="qnoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="7" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#qnoise)" opacity="0.45" />
        </svg>
        <AbsoluteFill style={{ background: "radial-gradient(70% 70% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.38) 100%)" }} />
        <AbsoluteFill style={{ inset: 60, border: "3px solid rgba(40,36,30,0.18)", borderRadius: 6 }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", padding: "0 190px" }}>
        <div style={{ fontFamily: FONT_UI, fontWeight: 900, fontSize: 150, lineHeight: 0.6, color: "#d6262f", alignSelf: "flex-start", marginBottom: 18 }}>“</div>
        <div
          style={{
            fontFamily: FONT_UI,
            fontWeight: 800,
            fontSize: size,
            lineHeight: 1.18,
            color: "#1b1a18",
            textTransform: "uppercase",
            textAlign: "center",
            letterSpacing: 0.5,
          }}
        >
          {text.slice(0, shownChars)}
          <span style={{ opacity: caret ? 1 : 0, color: "#d6262f" }}>▌</span>
          {/* reserva el sitio del texto completo para que no salte la maquetación */}
          <span style={{ visibility: "hidden" }}>{text.slice(shownChars)}</span>
        </div>
        {source ? (
          <div
            style={{
              marginTop: 40,
              opacity: srcOp,
              fontFamily: FONT_KICKER,
              fontWeight: 700,
              fontSize: 40,
              letterSpacing: 4,
              color: "#fff",
              background: "#d6262f",
              padding: "6px 22px",
              textTransform: "uppercase",
            }}
          >
            — {source}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
