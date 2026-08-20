// ============================================================
// scripts/build-scenes.mjs
//
// Lee input/script.txt + input/narration.mp3, mide la duracion real
// del audio, reparte el tiempo entre escenas, busca clips reales de
// coche en Pexels segun las palabras clave de cada bloque CLIP, los
// descarga, y escribe src/config.ts automaticamente.
//
// Uso:
//   PEXELS_API_KEY=tu_clave node scripts/build-scenes.mjs
// o crea un archivo .env con PEXELS_API_KEY=tu_clave y ejecuta:
//   npm run build-scenes
// ============================================================

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseFile } from "music-metadata";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SCRIPT_PATH = path.join(ROOT, "input", "script.txt");
const NARRATION_PATH = path.join(ROOT, "input", "narration.mp3");
const CLIPS_DIR = path.join(ROOT, "public", "assets", "clips");
const AUDIO_DIR = path.join(ROOT, "public", "assets", "audio");
const CONFIG_PATH = path.join(ROOT, "src", "config.ts");

const MIN_CLIP_SECONDS = 2.2;
const MIN_DATA_SECONDS = 2.0;

// ------------------------------------------------------------
// 0. Cargar .env de forma manual (sin dependencias extra)
// ------------------------------------------------------------
async function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  try {
    const content = await fs.readFile(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      if (key) process.env[key.trim()] = rest.join("=").trim();
    }
  } catch {
    // no pasa nada si no hay .env, se puede pasar por variable de entorno
  }
}

// ------------------------------------------------------------
// 1. Parsear el guion en bloques
// ------------------------------------------------------------
function parseScript(raw) {
  const blocks = raw
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
    .filter((b) => !b.startsWith("#"));

  return blocks.map((block, idx) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const first = lines[0];

    if (first.startsWith("CLIP:")) {
      const keywords = first.replace("CLIP:", "").trim();
      const rest = Object.fromEntries(
        lines.slice(1).map((l) => {
          const [k, ...v] = l.split(":");
          return [k.trim().toUpperCase(), v.join(":").trim()];
        })
      );
      const caption = rest.CAPTION ? rest.CAPTION.replace(/\\n/g, "\n") : undefined;
      return {
        id: `clip-${idx}`,
        type: "clip",
        keywords,
        caption,
        colorGrade: rest.GRADE || "teal-orange",
        kenBurns: rest.ZOOM || "in",
        weightText: caption || keywords,
      };
    }

    if (first.startsWith("DATA:")) {
      const parts = first.replace("DATA:", "").split("|").map((p) => p.trim());
      const kind = parts[0];
      if (kind === "counter") {
        const [, value, suffix, label] = parts;
        return {
          id: `data-${idx}`,
          type: "data",
          data: { kind: "counter", value: Number(value), suffix, label },
          weightText: label,
        };
      }
      if (kind === "percent") {
        const [, value, label] = parts;
        return {
          id: `data-${idx}`,
          type: "data",
          data: { kind: "percent", value: Number(value), label },
          weightText: label,
        };
      }
      if (kind === "bars") {
        const [, label, itemsRaw] = parts;
        const items = itemsRaw.split(",").map((pair) => {
          const [name, value] = pair.split(":");
          return { name: name.trim(), value: Number(value) };
        });
        return {
          id: `data-${idx}`,
          type: "data",
          data: { kind: "bars", label, items },
          weightText: label,
        };
      }
    }

    throw new Error(`Bloque de guion no reconocido:\n${block}`);
  });
}

// ------------------------------------------------------------
// 2. Duracion del audio + reparto proporcional por texto
// ------------------------------------------------------------
async function getAudioDurationSeconds(filePath) {
  const metadata = await parseFile(filePath);
  return metadata.format.duration ?? 30;
}

function assignDurations(blocks, totalSeconds) {
  const weights = blocks.map((b) => {
    const wordCount = (b.weightText || "").split(/\s+/).filter(Boolean).length;
    const min = b.type === "clip" ? MIN_CLIP_SECONDS : MIN_DATA_SECONDS;
    return Math.max(wordCount, 3) + min; // texto vacio no colapsa a 0
  });
  const weightSum = weights.reduce((a, b) => a + b, 0);

  return blocks.map((b, i) => {
    const raw = (weights[i] / weightSum) * totalSeconds;
    const min = b.type === "clip" ? MIN_CLIP_SECONDS : MIN_DATA_SECONDS;
    return { ...b, durationInSeconds: Math.max(raw, min) };
  });
}

// ------------------------------------------------------------
// 3. Buscar y descargar clip real en Pexels
// ------------------------------------------------------------
async function searchAndDownloadClip(keywords, destFileName) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.warn(
      `[!] No hay PEXELS_API_KEY configurada. Se deja "${destFileName}" sin descargar; ponlo tu manualmente en public/assets/clips/.`
    );
    return null;
  }

  const searchUrl = `https://api.pexels.com/videos/search?query=${encodeURIComponent(
    keywords
  )}&per_page=5&orientation=landscape`;

  const res = await fetch(searchUrl, { headers: { Authorization: apiKey } });
  if (!res.ok) {
    console.warn(`[!] Busqueda en Pexels fallo para "${keywords}" (${res.status})`);
    return null;
  }
  const json = await res.json();
  const video = json.videos?.[0];
  if (!video) {
    console.warn(`[!] Sin resultados en Pexels para "${keywords}"`);
    return null;
  }

  // Elegimos el fichero de video de mayor calidad disponible (hd o similar)
  const files = video.video_files.sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  const chosen = files.find((f) => f.quality === "hd") ?? files[0];

  const videoRes = await fetch(chosen.link);
  const buffer = Buffer.from(await videoRes.arrayBuffer());
  const destPath = path.join(CLIPS_DIR, destFileName);
  await fs.writeFile(destPath, buffer);
  console.log(`[✓] Descargado: ${destFileName} ("${keywords}")`);
  // La ruta es relativa a public/. Los clips viven en public/assets/clips/
  return `assets/clips/${destFileName}`;
}

// ------------------------------------------------------------
// 4. Generar el contenido de src/config.ts
// ------------------------------------------------------------
function generateConfigFile(scenes, narrationRelPath) {
  const scenesCode = scenes
    .map((s) => {
      if (s.type === "clip") {
        return `  {
    id: ${JSON.stringify(s.id)},
    type: "clip",
    durationInSeconds: ${s.durationInSeconds.toFixed(2)},
    clipSrc: ${JSON.stringify(s.clipSrc ?? null)},
    caption: ${s.caption ? JSON.stringify(s.caption) : "undefined"},
    colorGrade: ${JSON.stringify(s.colorGrade)},
    kenBurns: ${JSON.stringify(s.kenBurns)},
    transitionIn: ${JSON.stringify(s.transitionIn ?? "slide-glitch")},
  }`;
      }
      return `  {
    id: ${JSON.stringify(s.id)},
    type: "data",
    durationInSeconds: ${s.durationInSeconds.toFixed(2)},
    data: ${JSON.stringify(s.data)},
    transitionIn: ${JSON.stringify(s.transitionIn ?? "slide-glitch")},
  }`;
    })
    .join(",\n");

  return `// ============================================================
// GENERADO AUTOMATICAMENTE por scripts/build-scenes.mjs
// a partir de input/script.txt + input/narration.mp3
// No edites este archivo a mano; vuelve a ejecutar el script.
// ============================================================

export const FPS = 30;

export type DataGraphic =
  | { kind: "percent"; value: number; label: string }
  | { kind: "counter"; value: number; label: string; prefix?: string; suffix?: string }
  | { kind: "bars"; label: string; items: { name: string; value: number }[] };

export type Scene = {
  id: string;
  durationInSeconds: number;
  type: "clip" | "data";
  clipSrc?: string;
  caption?: string;
  colorGrade?: "teal-orange" | "desaturated-cold" | "warm-neutral" | "none";
  kenBurns?: "in" | "out" | "in-out" | "none";
  data?: DataGraphic;
  transitionIn?: "slide-glitch" | "whoosh" | "shutter" | "none";
};

export const videoConfig = {
  width: 1920,
  height: 1080,
  fps: FPS,
  narrationSrc: ${JSON.stringify(narrationRelPath)},
  defaultScenes: [
${scenesCode}
  ] as Scene[],
  get totalDurationInFrames() {
    const totalSeconds = this.defaultScenes.reduce(
      (acc, s) => acc + s.durationInSeconds,
      0
    );
    return Math.round(totalSeconds * this.fps);
  },
};
`;
}

// ------------------------------------------------------------
// MAIN
// ------------------------------------------------------------
async function main() {
  await loadEnv();

  console.log("[1/5] Leyendo guion...");
  const rawScript = await fs.readFile(SCRIPT_PATH, "utf-8");
  const blocks = parseScript(rawScript);

  console.log("[2/5] Midiendo duracion del audio...");
  const totalSeconds = await getAudioDurationSeconds(NARRATION_PATH);
  console.log(`     Duracion total: ${totalSeconds.toFixed(1)}s`);

  console.log("[3/5] Repartiendo duracion entre escenas...");
  const timedBlocks = assignDurations(blocks, totalSeconds);

  console.log("[4/5] Buscando y descargando clips reales en Pexels...");
  await fs.mkdir(CLIPS_DIR, { recursive: true });
  const finalScenes = [];
  for (const block of timedBlocks) {
    if (block.type === "clip") {
      const fileName = `${block.id}.mp4`;
      const clipSrc = await searchAndDownloadClip(block.keywords, fileName);
      finalScenes.push({ ...block, clipSrc: clipSrc ? clipSrc : `assets/clips/${fileName}` });
    } else {
      finalScenes.push(block);
    }
  }

  console.log("[5/5] Copiando audio y escribiendo config.ts...");
  await fs.mkdir(AUDIO_DIR, { recursive: true });
  await fs.copyFile(NARRATION_PATH, path.join(AUDIO_DIR, "narration.mp3"));

  const configContent = generateConfigFile(finalScenes, "assets/audio/narration.mp3");
  await fs.writeFile(CONFIG_PATH, configContent, "utf-8");

  console.log("\n✅ Listo. Ejecuta 'npm run dev' para previsualizar o 'npm run render' para exportar.");
}

main().catch((err) => {
  console.error("\n❌ Error:", err.message);
  process.exit(1);
});
