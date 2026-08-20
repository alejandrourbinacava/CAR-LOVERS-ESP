// ============================================================
// TEMA VISUAL COMPARTIDO
// Paleta + tipografias cargadas una sola vez y reutilizadas por
// todos los efectos y graficos. Centralizar esto es lo que da
// coherencia de marca al canal.
// ============================================================

import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadBarlow } from "@remotion/google-fonts/BarlowCondensed";

// Anton: condensada, muy pesada -> titulares e impacto (Magnate + numeros Vox)
export const FONT_DISPLAY = loadAnton().fontFamily;
// Inter: legible, para etiquetas y cuerpo
export const FONT_UI = loadInter("normal", {
  weights: ["400", "600", "700", "800", "900"],
}).fontFamily;
// Oswald / Barlow condensada: subtitulos, kickers, ejes
export const FONT_KICKER = loadOswald("normal", {
  weights: ["500", "600", "700"],
}).fontFamily;
export const FONT_LABEL = loadBarlow("normal", {
  weights: ["500", "600", "700"],
}).fontFamily;

// Paleta unificada
export const COLORS = {
  // Acentos
  yellow: "#FFD400", // amarillo firma tipo Vox
  cyan: "#25E3EA", // teal frio (highlight Magnate)
  orange: "#FF7A2F", // naranja calido (teal-orange)
  red: "#FF3B57", // alerta / peor valor
  green: "#2FE6A0", // mejor valor

  // Neutros
  white: "#FFFFFF",
  ink: "#0A0E1A", // fondo navy muy oscuro
  inkSoft: "#111726",
  grid: "rgba(255,255,255,0.06)",
  muted: "#8A94A6",
};

// Sombra de texto reutilizable con glow suave
export const glow = (color: string, strength = 0.5) =>
  `0 0 24px rgba(255,255,255,${strength * 0.7}), 0 0 60px ${hexA(color, strength * 0.5)}`;

// Helper: convierte un hex #RRGGBB a rgba con alfa
export function hexA(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
