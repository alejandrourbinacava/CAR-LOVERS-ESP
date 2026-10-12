// ============================================================
// build-video.mjs  — Orquestador estilo Auto Wheels (v2)
//  - Pool GRANDE de clips (varios por busqueda) -> sin repeticion.
//  - B-roll corta cada ~3s, sin repetir clip adyacente.
//  - Planos alternan full / framed (rejilla + esquinas redondeadas).
//  - Textos/datos/fechas anclados a la posicion del guion.
// ============================================================

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { parseFile } from "music-metadata";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const NARRATION = path.join(ROOT, "input", "narration.mp3");
const GUION = path.join(ROOT, "input", "guion-completo.txt");
const CLIPS_DIR = path.join(ROOT, "public", "assets", "clips");
const IMG_DIR = path.join(ROOT, "public", "assets", "img");
// Carpeta de biblioteca YouTube. Se puede aislar POR VÍDEO con la variable de
// entorno YT_SUBDIR (regla del cliente: cada vídeo con sus propios clips, sin
// reutilizar los de otros vídeos). Por defecto la biblioteca compartida.
const YT_SUBDIR = process.env.YT_SUBDIR || "youtube";
const YT_DIR = path.join(ROOT, "public", "assets", YT_SUBDIR);
const AUDIO_DIR = path.join(ROOT, "public", "assets", "audio");
const CONFIG_PATH = path.join(ROOT, "src", "config.ts");

const SHOT_SECONDS = 3;
const CLIPS_PER_QUERY = 8;

// Busquedas de b-roll SUV-estrictas (regla del cliente: solo SUV cuando habla
// de SUV; nada de deportivos ni escenas random). Los planos de peaton/prensa
// son tematicos de su seccion.
// VÍDEO 10 (COCHES QUE NUNCA DEBES COMPRAR): por MODELOS concretos. B-roll de
// coche/premium de Pexels de FONDO; cada modelo va como imagen "sticky" (MODELS).
// VÍDEO 11 — SECRETOS DEL TURBO (técnico/educativo, vía Pexels). Cada PARTE del
// guion tiene su pool de b-roll temático (turbo/motor/aceite/humo/autopista).
// VÍDEO 13 — b-roll de relleno (los modelos vienen de ENTITIES). Genérico de
// fiabilidad / taller / conducción por sección.
const PARTS = [
  { key: "intro", anchor: null, queries: ["car dealership showroom", "car keys handover", "person signing car contract", "calculator money car"] },
  { key: "metodo", anchor: "CÓMO SE MIDE EL VALOR RESIDUAL", queries: ["calculator money car", "car dealership handshake", "used car lot", "person signing car contract"] },
  { key: "ganan", anchor: "LOS 7 QUE MENOS VALOR PIERDEN", queries: ["hybrid car driving", "car showroom customers", "car dealership showroom", "suv driving highway"] },
  { key: "pierden", anchor: "LOS 7 QUE SE HUNDEN", queries: ["used car lot", "cars on highway traffic", "car dealership showroom", "car parked street"] },
  { key: "electricos", anchor: "EL MATIZ HONESTO", queries: ["electric car charging", "ev charging home", "electric car driving", "charging station cars"] },
  { key: "reglas", anchor: "CÓMO PROTEGER EL VALOR DE TU COCHE", queries: ["mechanic inspecting car", "car service garage", "car keys handover", "person buying used car"] },
  { key: "cierre", anchor: "CONCLUSIÓN", queries: ["car keys handover", "driving highway sunset", "person choosing car", "car dealership showroom"] },
];

const MODELS = [];
const SUV_MODELS = [];

// VÍDEO 17 — LOS 7 COCHES QUE MENOS VALOR PIERDEN (Y LOS 7 QUE SE HUNDEN). Anclas literales de input/guion-completo.txt.
const OVERLAYS = [
  { anchor: "Un coche de 40.000 euros. Lo matriculas hoy", kind: "hook", text: "40.000 € · LO MATRICULAS HOY\nYA HAS PERDIDO ~8.000 €" },
  { anchor: "entre el 18 y el 22 por ciento de su valor", kind: "stat", value: "18 – 22 %", sub: "SE PIERDE SOLO POR MATRICULARLO (CARWOW)" },
  { anchor: "Después llega otro 10 o 12 por ciento cada año", kind: "stat", value: "10 – 12 %", sub: "MÁS CADA AÑO" },
  { anchor: "vale hoy, de media, entre 16.000 y 18.000", kind: "stat", value: "35.000 → 16.000 – 18.000 €", sub: "COCHE COMPRADO EN 2021" },
  { anchor: "no todos los coches pierden igual", kind: "caption", text: "NO TODOS LOS COCHES PIERDEN IGUAL" },
  { anchor: "Hoy te traigo los siete que mejor protegen tu dinero", kind: "caption", text: "7 QUE PROTEGEN TU DINERO · 7 QUE SE LO COMEN" },
  { anchor: "CÓMO SE MIDE EL VALOR RESIDUAL", kind: "hook", text: "CÓMO SE MIDE\nEL VALOR RESIDUAL" },
  { anchor: "Si compras un coche de 20.000 euros y a los tres años vale 12.000", kind: "stat", value: "20.000 → 12.000 €", sub: "VALOR RESIDUAL 60 % · DEPRECIACIÓN 40 %" },
  { anchor: "carVertical analiza el mercado español, pero mira cinco años", kind: "caption", text: "carVertical: ESPAÑA · 5 AÑOS" },
  { anchor: "midieron un periodo concreto: tres años y 45.000 kilómetros", kind: "caption", text: "OCU + BEUC: 3 AÑOS · 45.000 KM" },
  { anchor: "voy a usar rangos y no números secos", kind: "caption", text: "RANGOS, NO NÚMEROS SECOS" },
  { anchor: "un eléctrico pierde de media el 50 por ciento de su valor", kind: "stat", value: "-50 %", sub: "ELÉCTRICO · 3 AÑOS Y 45.000 KM (OCU/BEUC)" },
  { anchor: "Un híbrido enchufable, el 39", kind: "stat", value: "-39 %", sub: "HÍBRIDO ENCHUFABLE" },
  { anchor: "Un diésel, el 36. Y uno de gasolina, el 33", kind: "stat", value: "-36 % · -33 %", sub: "DIÉSEL · GASOLINA" },
  { anchor: "los híbridos no enchufables son hoy la motorización que mejor conserva su valor", kind: "stat", value: "≈ 65 %", sub: "VALOR RESIDUAL · HÍBRIDOS NO ENCHUFABLES (GANVAM/DAT)" },

  { anchor: "LOS 7 QUE MENOS VALOR PIERDEN", kind: "hook", text: "LOS 7 QUE\nMENOS VALOR PIERDEN" },
  { anchor: "NÚMERO 7: LEXUS NX Y LEXUS UX", kind: "hook", text: "Nº 7\nLEXUS NX Y LEXUS UX" },
  { anchor: "las fuentes hablan de entre el 58 y el 62", kind: "stat", value: "58 – 62 %", sub: "LEXUS UX · VALOR A 3 AÑOS" },
  { anchor: "hay estimaciones que van del 55 al 66", kind: "stat", value: "55 – 66 %", sub: "LEXUS NX · VALOR A 3 AÑOS" },
  { anchor: "con 93 puntos sobre 100", kind: "stat", value: "93 / 100", sub: "LEXUS · MARCA Nº1 EN FIABILIDAD (OCU 2026)" },
  { anchor: "hasta un 15 por ciento menos que los de combustión pura", kind: "stat", value: "-15 %", sub: "MENOS DEPRECIACIÓN CON ETIQUETA ECO/CERO" },
  { anchor: "Si un coche de 50.000 euros pierde el 40 por ciento, son 20.000 euros", kind: "stat", value: "-20.000 €", sub: "50.000 € × 40 %" },

  { anchor: "NÚMERO 6: DACIA SANDERO", kind: "hook", text: "Nº 6\nDACIA SANDERO" },
  { anchor: "conserva entre el 60 y el 64 por ciento a tres años", kind: "stat", value: "60 – 64 %", sub: "SANDERO · VALOR A 3 AÑOS (ESTIMACIÓN HIGHMOTOR)" },
  { anchor: "casi 26.000 Sandero en España", kind: "stat", value: "≈ 26.000", sub: "SANDERO MATRICULADOS · ENE-SEP 2026" },
  { anchor: "Ocho de cada diez", kind: "stat", value: "8 / 10", sub: "SANDERO CON GLP · ETIQUETA ECO" },
  { anchor: "Si pierde el 40 por ciento de un coche de 12.000 euros, son 4.800", kind: "stat", value: "-4.800 €", sub: "12.000 € × 40 %" },

  { anchor: "NÚMERO 5: TOYOTA RAV4", kind: "hook", text: "Nº 5\nTOYOTA RAV4" },
  { anchor: "conserva entre el 61 y el 68 por ciento de su valor", kind: "stat", value: "61 – 68 %", sub: "RAV4 · VALOR A 3 AÑOS" },
  { anchor: "96 puntos en la ocu", kind: "stat", value: "96 / 100", sub: "RAV4 HÍBRIDO · OCU 2026" },

  { anchor: "NÚMERO 4: TOYOTA COROLLA HÍBRIDO", kind: "hook", text: "Nº 4\nTOYOTA COROLLA HÍBRIDO" },
  { anchor: "conserva entre el 62 y el 65 por ciento a tres años", kind: "stat", value: "62 – 65 %", sub: "COROLLA HÍBRIDO · VALOR A 3 AÑOS (HIGHMOTOR)" },
  { anchor: "casi 19.300 unidades hasta septiembre", kind: "stat", value: "≈ 19.300", sub: "COROLLA HÍBRIDO MATRICULADOS · ENE-SEP 2026" },
  { anchor: "el rey absoluto de la reventa", kind: "caption", text: "“EL REY ABSOLUTO DE LA REVENTA” · CARWOW" },

  { anchor: "NÚMERO 3: PORSCHE MACAN", kind: "hook", text: "Nº 3\nPORSCHE MACAN" },
  { anchor: "entre el 60 y el 72 por ciento", kind: "stat", value: "60 – 72 %", sub: "MACAN · VALOR A 3 AÑOS (ESTIMACIONES)" },
  { anchor: "perder el 30 por ciento son 21.000 euros", kind: "stat", value: "-21.000 €", sub: "70.000 € × 30 %" },

  { anchor: "NÚMERO 2: DACIA DUSTER", kind: "hook", text: "Nº 2\nDACIA DUSTER" },
  { anchor: "conserva un 84,5 por ciento de su valor a tres años", kind: "stat", value: "84,5 %", sub: "DUSTER · 3 AÑOS · CAP HPI (DATO BRITÁNICO)" },
  { anchor: "en torno al 63 por ciento a tres años", kind: "stat", value: "≈ 63 %", sub: "DUSTER EN ESPAÑA · 3 AÑOS (ESTIMACIÓN)" },
  { anchor: "Valor de reventa y fiabilidad son cosas distintas", kind: "caption", text: "REVENTA ≠ FIABILIDAD" },

  { anchor: "NÚMERO 1: SUZUKI JIMNY", kind: "hook", text: "Nº 1\nSUZUKI JIMNY" },
  { anchor: "retiene un 107 por ciento de su valor a tres años", kind: "stat", value: "107 %", sub: "JIMNY · 3 AÑOS · CAP HPI (DATO BRITÁNICO)" },
  { anchor: "entre el 52 y el 61 por ciento a tres años", kind: "stat", value: "52 – 61 %", sub: "LO QUE CAP HPI PREVEÍA EN 2019" },
  { anchor: "El Jimny es un caso de escasez, no un método", kind: "caption", text: "ESCASEZ, NO UN MÉTODO" },

  { anchor: "MENCIONES HONORÍFICAS", kind: "hook", text: "MENCIONES HONORÍFICAS" },
  { anchor: "entre el 58 y el 62 por ciento a tres años. El Mazda CX-5", kind: "caption", text: "YARIS CROSS 58-62 % · CX-5 54-65 % · DEFENDER ≈ 60 %" },

  { anchor: "LOS 7 QUE SE HUNDEN", kind: "hook", text: "LOS 7\nQUE SE HUNDEN" },
  { anchor: "Los siete de esta lista no se miden igual", kind: "caption", text: "4 A 5 AÑOS (ESPAÑA) · 3 A 5 AÑOS (REINO UNIDO)" },
  { anchor: "NÚMERO 7: OPEL ASTRA", kind: "hook", text: "Nº 7\nOPEL ASTRA" },
  { anchor: "pierde de media un 56,6 por ciento", kind: "stat", value: "-56,6 %", sub: "OPEL ASTRA · 5 AÑOS · carVertical" },
  { anchor: "NÚMERO 6: PEUGEOT 508", kind: "hook", text: "Nº 6\nPEUGEOT 508" },
  { anchor: "pierde un 57,7 por ciento a cinco años", kind: "stat", value: "-57,7 %", sub: "PEUGEOT 508 · 5 AÑOS · carVertical" },
  { anchor: "los SUV ya suponen más del 64 por ciento", kind: "stat", value: "64 %", sub: "DE LAS MATRICULACIONES SON SUV" },
  { anchor: "NÚMERO 5: PEUGEOT 308", kind: "hook", text: "Nº 5\nPEUGEOT 308" },
  { anchor: "pierde un 57,8 por ciento a cinco años", kind: "stat", value: "-57,8 %", sub: "PEUGEOT 308 · 5 AÑOS · carVertical" },
  { anchor: "NÚMERO 4: OPEL INSIGNIA", kind: "hook", text: "Nº 4\nOPEL INSIGNIA" },
  { anchor: "pierde un 62,5 por ciento a cinco años", kind: "stat", value: "-62,5 %", sub: "OPEL INSIGNIA · 5 AÑOS · carVertical" },
  { anchor: "Opel confirmó en 2022", kind: "caption", text: "SIN SUCESOR: FIN DE PRODUCCIÓN CONFIRMADO EN 2022" },
  { anchor: "NÚMERO 3: POLESTAR 2", kind: "hook", text: "Nº 3\nPOLESTAR 2" },
  { anchor: "conserva el 42 por ciento de su valor a tres años", kind: "stat", value: "42 %", sub: "POLESTAR 2 · 3 AÑOS · CAP HPI (DATO BRITÁNICO)" },
  { anchor: "nueve de los diez coches que más se deprecian a tres años son eléctricos", kind: "stat", value: "9 / 10", sub: "LOS QUE MÁS SE DEPRECIAN SON ELÉCTRICOS O ENCHUFABLES" },
  { anchor: "NÚMERO 2: JAGUAR I-PACE", kind: "hook", text: "Nº 2\nJAGUAR I-PACE" },
  { anchor: "conserva solo el 27,7 por ciento de su valor a tres años", kind: "stat", value: "27,7 %", sub: "I-PACE · 3 AÑOS · CAP HPI (DATO BRITÁNICO)" },
  { anchor: "con una depreciación del 73,1 por ciento", kind: "stat", value: "-73,1 %", sub: "I-PACE · 5 AÑOS · carVertical ESPAÑA" },
  { anchor: "NÚMERO 1: NISSAN LEAF", kind: "hook", text: "Nº 1\nNISSAN LEAF" },
  { anchor: "conserva solo el 31,5 por ciento a tres años", kind: "stat", value: "31,5 %", sub: "LEAF · 3 AÑOS · CAP HPI" },
  { anchor: "pierde de media un 63,6 por ciento a cinco años", kind: "stat", value: "-63,6 %", sub: "LEAF · 5 AÑOS · carVertical ESPAÑA" },

  { anchor: "EL MATIZ HONESTO", kind: "hook", text: "EL MATIZ HONESTO\nLOS ELÉCTRICOS NO SON SOLO “LOS QUE SE HUNDEN”" },
  { anchor: "subió un 18,5 por ciento en Europa", kind: "stat", value: "+18,5 %", sub: "ELÉCTRICOS USADOS · ENE-JUN 2026 (AUTO1)" },
  { anchor: "el conjunto de coches usados europeos subió solo un 2,9", kind: "stat", value: "+2,9 %", sub: "TODO EL MERCADO USADO EUROPEO" },
  { anchor: "31.661 euros", kind: "stat", value: "31.661 €", sub: "PRECIO MEDIO ANUNCIADO · ELÉCTRICO USADO (JUN 2026)" },
  { anchor: "Lo que se hunde no es “el eléctrico”", kind: "caption", text: "SE HUNDE EL ELÉCTRICO CARO, ANTIGUO O DE 1ª GENERACIÓN" },
  { anchor: "por debajo de los 20.000 euros", kind: "stat", value: "< 20.000 €", sub: "ELÉCTRICO USADO CON POCO KILOMETRAJE (OCU)" },

  { anchor: "CÓMO PROTEGER EL VALOR DE TU COCHE", kind: "hook", text: "CÓMO PROTEGER\nEL VALOR DE TU COCHE" },
  { anchor: "Regla uno: elige la mecánica con mercado", kind: "caption", text: "1 · ELIGE LA MECÁNICA CON MERCADO" },
  { anchor: "Regla dos: historial de mantenimiento sellado", kind: "caption", text: "2 · HISTORIAL SELLADO EN LA RED OFICIAL" },
  { anchor: "puede subir el valor hasta un 10 por ciento", kind: "stat", value: "+10 %", sub: "LIBRO DE REVISIONES SELLADO EN OFICIAL (CARWOW)" },
  { anchor: "Regla tres: no fumar en el coche", kind: "caption", text: "3 · NO FUMAR EN EL COCHE" },
  { anchor: "Regla cuatro: nada de modificaciones", kind: "caption", text: "4 · NADA DE MODIFICACIONES" },
  { anchor: "Regla cinco: colores neutros", kind: "caption", text: "5 · COLORES NEUTROS" },
  { anchor: "Regla seis: vigila los kilómetros", kind: "caption", text: "6 · VIGILA LOS KILÓMETROS" },
  { anchor: "Y regla siete: cuidado con comprar justo antes de un cambio de generación", kind: "caption", text: "7 · NO COMPRES EN EL ÚLTIMO AÑO DE UN MODELO" },
  { anchor: "comprar un coche de entre dos y tres años", kind: "caption", text: "TRUCO: COMPRA UN COCHE DE 2-3 AÑOS" },

  { anchor: "CONCLUSIÓN", kind: "hook", text: "LO ESENCIAL" },
  { anchor: "cuánto vas a perder", kind: "caption", text: "LA PÉRDIDA ES UN COSTE, COMO EL COMBUSTIBLE" },
  { anchor: "LLAMADA A LA ACCIÓN", kind: "hook", text: "¿CUÁL TIENES?\n¿CUÁNTO TE DIERON?" },
  { anchor: "Suscríbete para no perderte los próximos análisis", kind: "hook", text: "SUSCRÍBETE" },
];


const PINS = [];

// ENTIDADES: `videos` = claves marca-<key>.mp4 (public/assets/yt-valor). Sin vídeo -> FOTOS por `query`.
const ENTITIES = [
  { key: "general", label: "", query: "", videos: ["lexus", "sandero", "rav4", "corolla", "macan", "duster", "jimny", "leaf", "ipace", "polestar", "stock"], anchors: [] },
  { key: "lexus", label: "", query: "Lexus NX 300h", videos: ["lexus"], imgEvery: 4, anchors: ["Lexus n,x"] },
  { key: "lexusux", label: "", query: "Lexus UX 250h", videos: [], anchors: ["Lexus u,x", "el u,x"] },
  { key: "sandero", label: "", query: "Dacia Sandero 2021", videos: ["sandero"], imgEvery: 4, anchors: ["Sandero"] },
  { key: "rav4", label: "", query: "Toyota RAV4 hybrid 2020", videos: ["rav4"], imgEvery: 4, anchors: ["Rav cuatro"] },
  { key: "corolla", label: "", query: "Toyota Corolla hybrid 2020", videos: ["corolla"], imgEvery: 3, anchors: ["Corolla"] },
  { key: "macan", label: "", query: "Porsche Macan 2020", videos: ["macan"], imgEvery: 3, anchors: ["Macan"] },
  { key: "duster", label: "", query: "Dacia Duster 2023", videos: ["duster"], imgEvery: 4, anchors: ["Duster"] },
  { key: "jimny", label: "", query: "Suzuki Jimny 2019", videos: ["jimny"], imgEvery: 4, anchors: ["Jimny"] },
  { key: "yariscross", label: "", query: "Toyota Yaris Cross 2022", videos: [], anchors: ["Yaris Cross"] },
  { key: "cx5", label: "", query: "Mazda CX-5 2020", videos: [], anchors: ["Mazda CX-5"] },
  { key: "defender", label: "", query: "Land Rover Defender 2021", videos: [], anchors: ["Land Rover Defender"] },
  { key: "astra", label: "", query: "Opel Astra 2019", videos: [], anchors: ["Astra"] },
  { key: "p508", label: "", query: "Peugeot 508 2019", videos: [], anchors: ["508"] },
  { key: "p308", label: "", query: "Peugeot 308 2018", videos: [], anchors: ["308"] },
  { key: "insignia", label: "", query: "Opel Insignia 2018", videos: [], anchors: ["Insignia"] },
  { key: "polestar", label: "", query: "Polestar 2", videos: ["polestar"], imgEvery: 4, anchors: ["Polestar"] },
  { key: "ipace", label: "", query: "Jaguar I-Pace", videos: ["ipace"], imgEvery: 4, anchors: ["I-Pace", "I-PACE"] },
  { key: "leaf", label: "", query: "Nissan Leaf 2019", videos: ["leaf"], imgEvery: 3, anchors: ["Leaf"] },
  { key: "taycan", label: "", query: "Porsche Taycan", videos: [], anchors: ["Taycan"] },
  { key: "cierre", label: "", query: "", videos: [], anchors: [] },
];


const SECTIONS = [
  { anchor: "Un coche de 40.000 euros", primary: "general" },
  { anchor: "CÓMO SE MIDE EL VALOR RESIDUAL", primary: "general" },
  { anchor: "LOS 7 QUE MENOS VALOR PIERDEN", primary: "general" },
  { anchor: "NÚMERO 7: LEXUS NX Y LEXUS UX", primary: "lexus" },
  { anchor: "NÚMERO 6: DACIA SANDERO", primary: "sandero" },
  { anchor: "NÚMERO 5: TOYOTA RAV4", primary: "rav4" },
  { anchor: "NÚMERO 4: TOYOTA COROLLA HÍBRIDO", primary: "corolla" },
  { anchor: "NÚMERO 3: PORSCHE MACAN", primary: "macan" },
  { anchor: "NÚMERO 2: DACIA DUSTER", primary: "duster" },
  { anchor: "NÚMERO 1: SUZUKI JIMNY", primary: "jimny" },
  { anchor: "MENCIONES HONORÍFICAS", primary: "yariscross" },
  { anchor: "LOS 7 QUE SE HUNDEN", primary: "general" },
  { anchor: "NÚMERO 7: OPEL ASTRA", primary: "astra" },
  { anchor: "NÚMERO 6: PEUGEOT 508", primary: "p508" },
  { anchor: "NÚMERO 5: PEUGEOT 308", primary: "p308" },
  { anchor: "NÚMERO 4: OPEL INSIGNIA", primary: "insignia" },
  { anchor: "NÚMERO 3: POLESTAR 2", primary: "polestar" },
  { anchor: "NÚMERO 2: JAGUAR I-PACE", primary: "ipace" },
  { anchor: "NÚMERO 1: NISSAN LEAF", primary: "leaf" },
  { anchor: "EL MATIZ HONESTO", primary: "leaf" },
  { anchor: "CÓMO PROTEGER EL VALOR DE TU COCHE", primary: "general" },
  { anchor: "CONCLUSIÓN", primary: "general" },
];


async function loadEnv() {
  try {
    const content = await fs.readFile(path.join(ROOT, ".env"), "utf-8");
    for (const line of content.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const [k, ...rest] = t.split("=");
      if (k) process.env[k.trim()] = rest.join("=").trim();
    }
  } catch {}
}

async function fileExists(p) { try { await fs.access(p); return true; } catch { return false; } }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function validImage(p) {
  try { const st = await fs.stat(p); return st.size > 20000; } catch { return false; }
}
// Nombre de archivo de imagen de modelo (k=0 usa nombre simple para reutilizar
// descargas previas). Fuente unificada Wikimedia + SerpAPI.
const imgName = (base, k) => (k === 0 ? `img-${base}.jpg` : `img-${base}-${k}.jpg`);
const isJpeg = (b) => b.length > 20000 && b[0] === 0xff && b[1] === 0xd8;
async function freeSlot(base) {
  let k = 0;
  while (k < 40 && (await validImage(path.join(IMG_DIR, imgName(base, k))))) k++;
  return k;
}

// SerpAPI (Google Imagenes) — complemento a Wikimedia para tener MAS y mejores
// imagenes por modelo. Devuelve rutas relativas nuevas.
async function serpImages(query, base, need) {
  const key = process.env.SERPAPI_KEY;
  if (!key || need <= 0) return [];
  const url = `https://serpapi.com/search.json?engine=google_images&q=${encodeURIComponent(query)}&api_key=${key}`;
  let results = [];
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (res.ok) results = (await res.json()).images_results || [];
  } catch { return []; }
  const cands = results.filter(
    (r) => r.original && /\.jpe?g($|\?)/i.test(r.original) &&
      (r.original_width || 0) >= 900 && (r.original_width || 0) >= (r.original_height || 0)
  );
  const out = [];
  for (const c of cands) {
    if (out.length >= need) break;
    const k = await freeSlot(base);
    const dest = path.join(IMG_DIR, imgName(base, k));
    try {
      const ir = await fetch(c.original, {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(20000),
      });
      const b = Buffer.from(await ir.arrayBuffer());
      if (!isJpeg(b)) continue;
      await fs.writeFile(dest, b);
      console.log(`[SERP] ${imgName(base, k)} "${query}"`);
      out.push(`assets/img/${imgName(base, k)}`);
    } catch { /* siguiente */ }
  }
  return out;
}

// Clips Pexels vetados (colaron fuera de tema, p.ej. aceite de COCINA en el vídeo
// de averías). Se pre-siembran en seenIds para que getClips no los use nunca.
const BLACKLIST_IDS = [30283095, 5450251, 17026821, 29740277, 32386567, 26620319, 26620441, 8987271, 3010448, 39839659, 35661513, 6817044, 17854218, 9369898, 27974753, 19728719, 13790663, 4223775, 20693178, 29576552, 39112150, 20156194, 32329376, 20693196, 11785727, 29760618, 34960298];
const seenIds = new Set(BLACKLIST_IDS);
// Fotos de modelo descartadas tras revisarlas (marca de agua de webs, carteles de concesionario, modelo equivocado, personas).
let BAD_IMGS = new Set();
try { BAD_IMGS = new Set(JSON.parse(await fs.readFile(path.join(ROOT, "scripts", "bad-images.json"), "utf-8"))); } catch {}

// Palabras que delatan un clip FUERA DE TEMA (la URL de Pexels lleva el slug
// descriptivo, p.ej. .../wind-turbines-on-a-field/). Si el slug contiene alguna,
// se descarta el clip aunque la query lo devuelva. Clave para evitar molinos de
// viento con "turbine", dunas, playas, chimeneas industriales, etc.
const REJECT_WORDS = [
  "windmill", "wind-turbine", "wind-mill", "wind-farm", "wind-power", "wind-energy",
  "turbines", "aerogenerator", "propeller", "helicopter", "airplane", "aircraft", "jet-engine",
  "desert", "dune", "sahara", "arid", "canyon", "steppe", "savanna", "safari", "prairie", "badland", "mesa", "dusty",
  "beach", "ocean", "sea-", "seascape", "coast", "waterfall", "river",
  "solar", "agricultur", "farm", "meadow", "wheat", "forest", "mountain-landscape", "windy",
  "chimney", "smokestack", "power-plant", "cooling-tower", "factory-", "refinery", "nuclear",
  "fan-", "ceiling-fan", "cooking", "kitchen", "food",
];
function offTopic(video) {
  const meta = (video.url || "").toLowerCase();
  return REJECT_WORDS.some((w) => meta.includes(w));
}

// Descarga hasta `max` clips de una busqueda. Devuelve [{src,duration}].
async function getClips(query, max) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return [];
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=15&orientation=landscape&size=medium`;
  let json;
  try {
    const res = await fetch(url, { headers: { Authorization: apiKey } });
    if (!res.ok) { console.warn(`\n[!] Pexels ${res.status} "${query}"`); return []; }
    json = await res.json();
  } catch (e) { console.warn(`\n[!] red "${query}": ${e.message}`); return []; }

  const out = [];
  for (const video of json.videos || []) {
    if (out.length >= max) break;
    if (seenIds.has(video.id)) continue;
    if (offTopic(video)) { seenIds.add(video.id); continue; }
    const fileName = `v-${video.id}.mp4`;
    const dest = path.join(CLIPS_DIR, fileName);
    const rel = `assets/clips/${fileName}`;
    const duration = video.duration || 6;
    if (!(await fileExists(dest))) {
      const files = (video.video_files || [])
        .filter((f) => (f.file_type || "").includes("mp4"))
        .sort((a, b) => (a.width ?? 0) - (b.width ?? 0));
      const chosen = files.filter((f) => (f.width ?? 0) <= 1366).pop() || files[0];
      if (!chosen) continue;
      try {
        const vr = await fetch(chosen.link);
        const buf = Buffer.from(await vr.arrayBuffer());
        await fs.writeFile(dest, buf);
        process.stdout.write(".");
      } catch { continue; }
    }
    seenIds.add(video.id);
    out.push({ src: rel, duration });
  }
  return out;
}

function slug(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Descarga hasta `n` IMAGENES de un modelo desde Wikimedia Commons (licencias
// claras). Devuelve array de rutas relativas a public/. Con reintentos y
// back-off por el rate-limit del servidor de miniaturas.
const WUA = { "User-Agent": "car-channel-editor/1.0 (educational project)" };
const wikiCache = new Map();
async function getWikiImages(term, n = 1) {
  if (wikiCache.has(term)) return wikiCache.get(term).slice(0, n);
  const base = slug(term);
  const nameFor = (k) => imgName(base, k);
  const out = [];

  // 1) REUTILIZAR lo ya descargado en disco SIN tocar la red (determinista).
  for (let k = 0; k < 20 && out.length < n; k++) {
    if (await validImage(path.join(IMG_DIR, nameFor(k)))) out.push(`assets/img/${nameFor(k)}`);
  }
  if (out.length >= n) { wikiCache.set(term, out); return out.slice(0, n); }

  // 2) Falta descargar. Buscar en Commons y bajar el ORIGINAL (archivo estatico).
  const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(term + " car")}%20filetype:bitmap&gsrnamespace=6&gsrlimit=15&prop=imageinfo&iiprop=url|mime|size`;
  let pages = [];
  for (let a = 0; a < 3 && !pages.length; a++) {
    await sleep(a === 0 ? 250 : 1000 * a);
    try {
      const res = await fetch(api, { headers: WUA });
      if (res.ok) pages = Object.values((await res.json())?.query?.pages || {});
    } catch { /* reintentar */ }
  }
  const candidates = pages
    .map((p) => p.imageinfo?.[0])
    .filter((ii) => ii && ii.url && /jpe?g/i.test(ii.mime) && (ii.width || 0) >= 1000 && (ii.width || 0) >= (ii.height || 0) && (ii.size || 0) > 60000 && (ii.size || 0) < 30000000)
    .sort((a, b) => (a.size || 0) - (b.size || 0));

  let k = 0;
  for (const c of candidates) {
    if (out.length >= n) break;
    while (k < 30 && (await validImage(path.join(IMG_DIR, nameFor(k))))) k++; // hueco libre
    const dest = path.join(IMG_DIR, nameFor(k));
    let buf = null;
    for (let a = 0; a < 2; a++) {
      await sleep(200);
      try {
        const ir = await fetch(c.url, { headers: WUA });
        const b = Buffer.from(await ir.arrayBuffer());
        if (b.length > 20000 && b[0] === 0xff && b[1] === 0xd8) { buf = b; break; }
      } catch { /* reintentar */ }
    }
    if (!buf) continue;
    await fs.writeFile(dest, buf);
    console.log(`[IMG] ${nameFor(k)} "${term}"`);
    out.push(`assets/img/${nameFor(k)}`);
    k++;
  }

  // 3) Si aun faltan, completar con SerpAPI (Google Imagenes).
  if (out.length < n) {
    const extra = await serpImages(term, base, n - out.length);
    out.push(...extra);
  }

  wikiCache.set(term, out);
  return out;
}
async function getWikiImage(term) {
  const arr = await getWikiImages(term, 1);
  return arr[0] || null;
}

// CALIBRACION DE TIEMPO (anti-drift). Alinea la transcripción Whisper
// (out/_align.json: [{start,text}...]) con el guion y devuelve timeAt(idx) que
// interpola por tramos posición_de_texto -> segundo_hablado. Si no hay alineación
// válida, cae al modelo lineal idx/L*total.
async function buildTimeAt(guion, total, alignPath) {
  const L = guion.length;
  const linear = (idx) => (idx < 0 ? null : (idx / L) * total);
  let segs;
  try { segs = JSON.parse(await fs.readFile(alignPath, "utf-8")); } catch { return linear; }
  if (!Array.isArray(segs) || segs.length < 10) { console.log("     [align] sin transcripción -> tiempo lineal"); return linear; }

  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ]+/g, " ").trim();
  // Palabras del guion con su posición de carácter original.
  const gwords = [];
  { const re = /\S+/g; let m; while ((m = re.exec(guion))) { const w = norm(m[0]); if (w) gwords.push({ w, pos: m.index }); } }

  const anchors = [{ pos: 0, t: 0 }];
  let gi = 0; // puntero monótono en gwords
  // Salto máximo por segmento: un segmento avanza ~7-20 palabras del guion. Frases
  // repetidas ("de por vida", "el aceite", "cada X mil km") harían saltar el puntero
  // cientos de palabras hacia una ocurrencia posterior y colapsarían el resto de la
  // alineación. Acotamos la ventana de búsqueda para rechazar esos saltos falsos.
  const MAXSTEP = 80;
  for (const seg of segs) {
    const sw = norm(seg.text || "").split(" ").filter(Boolean);
    if (sw.length < 3) continue;
    let found = -1;
    const jhi = Math.min(gwords.length - 2, gi + MAXSTEP);
    for (let j = gi; j < jhi; j++) {
      if (gwords[j].w === sw[0] && gwords[j + 1].w === sw[1] && gwords[j + 2].w === sw[2]) { found = j; break; }
    }
    if (found >= 0) { anchors.push({ pos: gwords[found].pos, t: +seg.start }); gi = found + 1; }
  }
  anchors.push({ pos: L, t: total });

  // Monótona estricta en ambas dimensiones.
  const mono = [anchors[0]];
  for (const a of anchors.slice(1)) { const last = mono[mono.length - 1]; if (a.pos > last.pos && a.t > last.t) mono.push(a); }
  if (mono.length < 5) { console.log(`     [align] pocas anclas (${mono.length}) -> tiempo lineal`); return linear; }

  // Diagnóstico de drift.
  let maxDrift = 0;
  for (const a of mono) maxDrift = Math.max(maxDrift, Math.abs(a.t - linear(a.pos)));
  console.log(`     [align] ${mono.length} anclas · drift máx ≈ ${maxDrift.toFixed(1)}s -> tiempo CALIBRADO`);

  return (idx) => {
    if (idx < 0) return null;
    if (idx <= mono[0].pos) return mono[0].t;
    if (idx >= mono[mono.length - 1].pos) return mono[mono.length - 1].t;
    let lo = 0, hi = mono.length - 1;
    while (lo + 1 < hi) { const mid = (lo + hi) >> 1; if (mono[mid].pos <= idx) lo = mid; else hi = mid; }
    const a = mono[lo], b = mono[hi];
    return a.t + ((idx - a.pos) / (b.pos - a.pos)) * (b.t - a.t);
  };
}

// Duracion de un video (seg) parseando la salida de ffmpeg.
function videoDurationSec(file) {
  // 1) ffprobe del sistema (rápido y fiable; está en el runner de CI y en winget).
  for (const bin of ["ffprobe", process.env.FFPROBE || ""]) {
    if (!bin) continue;
    try {
      const out = execSync(`"${bin}" -v error -show_entries format=duration -of default=nk=1:nw=1 "${file}"`, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
      const d = parseFloat(out);
      if (d > 0) return d;
    } catch {}
  }
  // 2) Fallback: parsear la salida de "npx remotion ffmpeg -i".
  try {
    execSync(`npx remotion ffmpeg -hide_banner -i "${file}"`, { stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    const s = ((e.stderr || "") + (e.stdout || "")).toString();
    const m = s.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
    if (m) return +m[1] * 3600 + +m[2] * 60 + parseFloat(m[3]);
  }
  return 0;
}


// Motion graphics (VÍDEO 17): etiqueta SÍ (ganadores) / NO (los que se hunden) + barra de capítulos.
const TAGS = [
  { anchor: "NÚMERO 7: LEXUS NX Y LEXUS UX", end: "NÚMERO 6: DACIA SANDERO", code: "LEXUS NX / UX", name: "Valor a 3 años: 55-66 %", verdict: "yes" },
  { anchor: "NÚMERO 6: DACIA SANDERO", end: "NÚMERO 5: TOYOTA RAV4", code: "DACIA SANDERO", name: "Valor a 3 años: 60-64 %", verdict: "yes" },
  { anchor: "NÚMERO 5: TOYOTA RAV4", end: "NÚMERO 4: TOYOTA COROLLA", code: "TOYOTA RAV4", name: "Valor a 3 años: 61-68 %", verdict: "yes" },
  { anchor: "NÚMERO 4: TOYOTA COROLLA", end: "NÚMERO 3: PORSCHE MACAN", code: "COROLLA HÍBRIDO", name: "Valor a 3 años: 62-65 %", verdict: "yes" },
  { anchor: "NÚMERO 3: PORSCHE MACAN", end: "NÚMERO 2: DACIA DUSTER", code: "PORSCHE MACAN", name: "Valor a 3 años: 60-72 %", verdict: "yes" },
  { anchor: "NÚMERO 2: DACIA DUSTER", end: "NÚMERO 1: SUZUKI JIMNY", code: "DACIA DUSTER", name: "ES: ≈63 % · UK: 84,5 %", verdict: "yes" },
  { anchor: "NÚMERO 1: SUZUKI JIMNY", end: "MENCIONES HONORÍFICAS", code: "SUZUKI JIMNY", name: "UK: 107 % (escasez)", verdict: "yes" },
  { anchor: "NÚMERO 7: OPEL ASTRA", end: "NÚMERO 6: PEUGEOT 508", code: "OPEL ASTRA", name: "-56,6 % a 5 años", verdict: "no" },
  { anchor: "NÚMERO 6: PEUGEOT 508", end: "NÚMERO 5: PEUGEOT 308", code: "PEUGEOT 508", name: "-57,7 % a 5 años", verdict: "no" },
  { anchor: "NÚMERO 5: PEUGEOT 308", end: "NÚMERO 4: OPEL INSIGNIA", code: "PEUGEOT 308", name: "-57,8 % a 5 años", verdict: "no" },
  { anchor: "NÚMERO 4: OPEL INSIGNIA", end: "NÚMERO 3: POLESTAR 2", code: "OPEL INSIGNIA", name: "-62,5 % a 5 años", verdict: "no" },
  { anchor: "NÚMERO 3: POLESTAR 2", end: "NÚMERO 2: JAGUAR I-PACE", code: "POLESTAR 2", name: "Conserva 42 % a 3 años", verdict: "no" },
  { anchor: "NÚMERO 2: JAGUAR I-PACE", end: "NÚMERO 1: NISSAN LEAF", code: "JAGUAR I-PACE", name: "Conserva 27,7 % a 3 años", verdict: "no" },
  { anchor: "NÚMERO 1: NISSAN LEAF", end: "EL MATIZ HONESTO", code: "NISSAN LEAF", name: "Conserva 31,5 % a 3 años", verdict: "no" },
];
// OJO: ChapterBar antepone el índice (1, 2, 3…) -> las etiquetas NO llevan número.
const CHAPTERS = [
  { anchor: "Un coche de 40.000 euros", label: "El golpe de la matrícula" },
  { anchor: "CÓMO SE MIDE EL VALOR RESIDUAL", label: "Cómo se mide el valor residual" },
  { anchor: "LOS 7 QUE MENOS VALOR PIERDEN", label: "Los 7 que menos pierden" },
  { anchor: "NÚMERO 7: LEXUS NX Y LEXUS UX", label: "Lexus NX y UX" },
  { anchor: "NÚMERO 6: DACIA SANDERO", label: "Dacia Sandero" },
  { anchor: "NÚMERO 5: TOYOTA RAV4", label: "Toyota RAV4" },
  { anchor: "NÚMERO 4: TOYOTA COROLLA HÍBRIDO", label: "Toyota Corolla híbrido" },
  { anchor: "NÚMERO 3: PORSCHE MACAN", label: "Porsche Macan" },
  { anchor: "NÚMERO 2: DACIA DUSTER", label: "Dacia Duster" },
  { anchor: "NÚMERO 1: SUZUKI JIMNY", label: "Suzuki Jimny" },
  { anchor: "LOS 7 QUE SE HUNDEN", label: "Los 7 que se hunden" },
  { anchor: "NÚMERO 7: OPEL ASTRA", label: "Opel Astra" },
  { anchor: "NÚMERO 6: PEUGEOT 508", label: "Peugeot 508" },
  { anchor: "NÚMERO 5: PEUGEOT 308", label: "Peugeot 308" },
  { anchor: "NÚMERO 4: OPEL INSIGNIA", label: "Opel Insignia" },
  { anchor: "NÚMERO 3: POLESTAR 2", label: "Polestar 2" },
  { anchor: "NÚMERO 2: JAGUAR I-PACE", label: "Jaguar I-Pace" },
  { anchor: "NÚMERO 1: NISSAN LEAF", label: "Nissan Leaf" },
  { anchor: "EL MATIZ HONESTO", label: "El matiz de los eléctricos" },
  { anchor: "CÓMO PROTEGER EL VALOR DE TU COCHE", label: "7 reglas para proteger tu coche" },
  { anchor: "CONCLUSIÓN", label: "Conclusión" },
];

// Reglas por clip (yt-valor): se rellenan tras revisar presentador/rótulos/logos de cada clip.
const CLIP_RULES = {
  // m0/m1 = margen inicial/final; skip = logos/intro, anuncios, botones "Subscribe", tarjetas finales, presentador.
  "yt-valor": {
    lexus: { m0: 0, m1: 8, skip: [[0, 11]] },
    sandero: { m0: 0, m1: 8, skip: [[0, 12], [508, 536]] },
    rav4: { m0: 0, m1: 8, skip: [[0, 8], [28, 48], [52, 62], [130, 150]] },
    corolla: { m0: 0, m1: 8, skip: [[0, 6]] },
    macan: { m0: 0, m1: 8, skip: [[0, 30], [912, 950]] },
    duster: { m0: 0, m1: 8 },
    jimny: { m0: 0, m1: 8, skip: [[0, 6], [117, 129]] },
    leaf: { m0: 0, m1: 8, skip: [[8, 15]] },
    ipace: { m0: 0, m1: 8, skip: [[0, 3], [704, 720]] },
    polestar: { m0: 0, m1: 8 },
  },
};

// Biblioteca de YouTube -> ventanas de 3s (b-roll real). Cada ventana apunta al
// mismo fichero con un startFrom distinto (no hay que trocear a disco).
async function getYtWindows() {
  let files = [];
  try { files = (await fs.readdir(YT_DIR)).filter((f) => /\.(mp4|webm|mkv)$/i.test(f)); } catch { return []; }
  const wins = [];
  for (const f of files) {
    const dur = videoDurationSec(path.join(YT_DIR, f));
    if (dur < 25) continue;
    const src = `assets/${YT_SUBDIR}/${f}`;
    // "marca-<key>.mp4" -> vídeo etiquetado de esa marca/modelo.
    const mm = f.match(/^marca-([a-z0-9]+)\./i);
    const brand = mm ? mm[1].toLowerCase() : null;
    // Margen/paso adaptativos: los vídeos LARGOS de YouTube suelen tener careta
    // (saltar 45s intro/outro); los CORTOS de stock (tacómetro, cambio de marcha,
    // animación TSI) no tienen careta -> margen pequeño para no quedarnos sin
    // ventanas. Se deja siempre ≥8s de cola para que quepa el plano (hasta 7s).
    const shortClip = dur < 200;
    const rule = CLIP_RULES[YT_SUBDIR]?.[brand];
    const margin = rule?.m0 ?? (shortClip ? Math.min(6, dur * 0.05) : 45);
    const endMargin = rule?.m1 ?? (shortClip ? 9 : 45);
    const step = shortClip ? 4 : 7;
    const overlaps = (t) => (rule?.skip || []).some(([a, b]) => t < b && t + 5 > a);
    if (rule?.allow) {
      for (const [a, b] of rule.allow)
        for (let t = a; t + 5 <= b; t += 2.5) wins.push({ src, key: `${src}#${t.toFixed(1)}`, file: src, fixedStart: +t.toFixed(1), brand });
      continue;
    }
    for (let t = margin; t + 5 < dur - endMargin + 5; t += 2.5) {
      if (overlaps(t)) continue;
      wins.push({ src, key: `${src}#${t.toFixed(1)}`, file: src, fixedStart: +t.toFixed(1), brand });
    }
  }
  return wins;
}

async function main() {
  await loadEnv();
  await fs.mkdir(CLIPS_DIR, { recursive: true });
  await fs.mkdir(IMG_DIR, { recursive: true });
  await fs.mkdir(AUDIO_DIR, { recursive: true });

  console.log("[1/5] Audio + guion...");
  const meta = await parseFile(NARRATION);
  const total = meta.format.duration ?? 60;
  const guion = await fs.readFile(GUION, "utf-8");
  const L = guion.length;
  // timeAt(idx): posición en el guion -> segundo del audio. Por defecto lineal
  // (asume ritmo TTS constante). Si existe out/_align.json (transcripción Whisper),
  // se CALIBRA con anclas reales (posición de texto -> tiempo hablado) e interpola
  // por tramos: corrige el "drift" (voz que dice X mientras se ve otra marca).
  const timeAt = await buildTimeAt(guion, total, path.join(ROOT, "out", "_align.json"));
  console.log(`     audio=${total.toFixed(1)}s  guion=${L} chars`);

  // TITULO del video: primera linea "TITULO: ..." del guion, o input/titulo.txt.
  // Se escribe en out/_titulo.txt para nombrar el mp4 final.
  let titulo = "video";
  const firstLine = (guion.split("\n")[0] || "").trim();
  if (/^TITULO:/i.test(firstLine)) titulo = firstLine.replace(/^TITULO:/i, "").trim();
  else {
    try { titulo = (await fs.readFile(path.join(ROOT, "input", "titulo.txt"), "utf-8")).trim() || titulo; } catch {}
  }
  const safe = titulo.replace(/[\\/:*?"<>|]/g, " ").replace(/\s+/g, " ").trim().slice(0, 120) || "video";
  await fs.mkdir(path.join(ROOT, "out"), { recursive: true });
  await fs.writeFile(path.join(ROOT, "out", "_titulo.txt"), safe, "utf-8");
  console.log(`     titulo del video: "${safe}"`);

  console.log("[2] Biblioteca de YouTube (b-roll real)...");
  const ytWindows = await getYtWindows();
  const usingYt = ytWindows.length > 40;
  // Separar vídeos de MARCA (marca-<key>) de la biblioteca general.
  const generalWindows = ytWindows.filter((w) => !w.brand);
  const brandPools = {};   // clave marca-<key> -> ventanas de ESE fichero
  for (const w of ytWindows) if (w.brand) (brandPools[w.brand] ??= []).push(w);
  // ¿Tiene la MARCA (entidad) al menos un vídeo disponible en la biblioteca?
  const entHasVideo = (e) => !!(e && e.videos && e.videos.some((k) => brandPools[k] && brandPools[k].length));
  // Pool combinado de una marca: intercala las ventanas de sus varios vídeos
  // (corolla, camry, rav4...) en round-robin -> planos consecutivos alternan
  // modelo distinto de la MISMA marca = variedad sin romper la regla roja.
  const entPoolCache = {};
  const entVideoPool = (e) => {
    if (entPoolCache[e.key]) return entPoolCache[e.key];
    const lists = (e.videos || []).map((k) => brandPools[k]).filter((l) => l && l.length);
    const merged = [];
    for (let j = 0; lists.some((l) => j < l.length); j++)
      for (const l of lists) if (j < l.length) merged.push(l[j]);
    return (entPoolCache[e.key] = merged);
  };
  console.log(`     ${ytWindows.length} ventanas · marcas con vídeo: ${Object.keys(brandPools).join(", ") || "ninguna"} · generales: ${generalWindows.length}`);

  // PINS de modelo (Wikimedia + SerpAPI) — siempre.
  console.log("[2a] Imagenes de modelo y anclado de pins...");
  const DURP = { image: 3.2, duo: 3.6 };
  const pins = [];
  for (const p of PINS) {
    const idx = guion.indexOf(p.anchor);
    if (idx < 0) { console.warn(`[!] pin ancla no encontrada: "${p.anchor}"`); continue; }
    const from = Math.max(0, timeAt(idx) ?? 0);
    if (p.kind === "duo") {
      const a = await getWikiImage(p.a);
      const b = await getWikiImage(p.b);
      if (!a || !b) { console.warn(`[!] duo sin imagenes: ${p.a}/${p.b}`); continue; }
      pins.push({ kind: "duo", srcA: a, srcB: b, labelA: p.la, labelB: p.lb, fromSeconds: +from.toFixed(2), durationInSeconds: DURP.duo });
    } else {
      const s = await getWikiImage(p.model);
      if (!s) { console.warn(`[!] imagen no encontrada: ${p.model}`); continue; }
      pins.push({ kind: "image", src: s, label: p.label, fromSeconds: +from.toFixed(2), durationInSeconds: DURP.image });
    }
  }
  console.log(`     ${pins.length} pins de modelo (comparativas/duos)`);

  // IMÁGENES STICKY DE MODELO (tier list): cada modelo se ve DESDE que se nombra
  // HASTA el siguiente límite (otro modelo o cabecera de tier). Entre la cabecera
  // de un tier y su primer modelo NO hay pin -> b-roll SUV genérico. Cada tramo se
  // trocea en subplanos de ~7s ciclando varias fotos del modelo (variedad + regla
  // roja: se ve el modelo del que se habla).
  if (typeof MODELS !== "undefined" && MODELS.length) {
    // Límites extra (además de los propios MODELS): dónde deja de verse el último
    // modelo. Aquí, cuando empieza la sección de patrón/lección.
    const tierHeaders = ["EL PATRÓN QUE CONECTA"];
    const bnds = [];
    for (const m of MODELS) { const i = guion.indexOf(m.anchor); if (i >= 0) bnds.push(timeAt(i) ?? 0); }
    for (const h of tierHeaders) { const i = guion.indexOf(h); if (i >= 0) bnds.push(timeAt(i) ?? 0); }
    bnds.sort((a, b) => a - b);
    const nextBnd = (t) => { for (const b of bnds) if (b > t + 0.5) return b; return total; };
    let mp = 0;
    for (const m of MODELS) {
      const i = guion.indexOf(m.anchor);
      if (i < 0) { console.warn(`[!] modelo ancla no encontrada: "${m.anchor}"`); continue; }
      const from = Math.max(0, timeAt(i) ?? 0);
      const end = Math.min(nextBnd(from), total);
      const span = end - from;
      if (span < 1.5) continue;
      const imgs = await getWikiImages(m.query, 5);
      if (!imgs.length) { console.warn(`[!] modelo sin imagen: ${m.query}`); continue; }
      const CHUNK = 7;
      const n = Math.max(1, Math.round(span / CHUNK));
      const d = span / n;
      for (let k = 0; k < n; k++) {
        pins.push({ kind: "image", src: imgs[k % imgs.length], label: m.label,
          fromSeconds: +(from + k * d).toFixed(2), durationInSeconds: +d.toFixed(2) });
        mp++;
      }
    }
    console.log(`     ${mp} planos de modelo STICKY para ${MODELS.length} modelos`);
  }

  // ENTIDADES: escaneo del guion + material (8 imagenes/entidad para no repetir).
  console.log("[2a2] Escaneando entidades y buscando su material...");
  const mentions = [];
  for (const e of ENTITIES) {
    for (const a of e.anchors) {
      let idx = guion.indexOf(a);
      while (idx >= 0) { mentions.push({ t: timeAt(idx) ?? 0, e }); idx = guion.indexOf(a, idx + a.length); }
    }
  }
  mentions.sort((x, y) => x.t - y.t);
  const usedKeys = new Set(mentions.map((m) => m.e.key));
  for (const e of ENTITIES) {
    if (!usedKeys.has(e.key)) continue;
    if (entHasVideo(e) && !e.imgEvery) continue; // con VÍDEO no necesita imagen, salvo que pida fotos intercaladas (imgEvery)
    if (!e.query) continue;       // entidad "cierre" -> vídeo general, sin imagen
    const imgs = await getWikiImages(e.query, 12);
    e.images = imgs.filter((src) => !BAD_IMGS.has(path.basename(src))).map((src) => ({ src }));
  }
  console.log(`     marcas con vídeo + temas con imagen. (imagen: ${ENTITIES.filter((e) => e.images && e.images.length).map((e) => e.key).join(", ")})`);
  // Entidad activa (mención) + coche PRINCIPAL de la sección.
  const entByKey = Object.fromEntries(ENTITIES.map((e) => [e.key, e]));
  const activeEntity = (tt) => {
    let best = null;
    for (const m of mentions) { if (m.t - 3 <= tt && tt <= m.t + 8) best = m.e; else if (m.t - 3 > tt) break; }
    return best;
  };
  const sectionMarks = SECTIONS
    .map((s) => ({ start: timeAt(guion.indexOf(s.anchor)) ?? -1, e: entByKey[s.primary] }))
    .filter((s) => s.start >= 0 && s.e)
    .sort((a, b) => a.start - b.start);
  const sectionPrimary = (tt) => {
    let e = null;
    for (const s of sectionMarks) { if (s.start <= tt) e = s.e; else break; }
    return e; // null en la intro (antes de COCHE 1)
  };
  // Aviso: entidades mencionadas SIN vídeo de marca (solo imagen).
  const soloImagen = ENTITIES.filter((e) => usedKeys.has(e.key) && !entHasVideo(e) && e.images && e.images.length);
  await fs.writeFile(path.join(ROOT, "out", "_faltan_video.txt"), soloImagen.map((e) => `${e.key} — "${e.label}"`).join("\n"), "utf-8").catch(() => {});
  console.log(`     SOLO IMAGEN (sin vídeo de marca): ${soloImagen.map((e) => e.key).join(", ") || "ninguna"}`);

  // STOCK (Pexels + imagenes de SUV) SOLO si no hay biblioteca de YouTube.
  let allClips = [];
  let suvImages = [];
  let marks = [];
  { // Pool Pexels SIEMPRE: en vídeos de MARCA sirve de RELLENO temático cuando un
    // clip corto se agota (evita repetir el mismo clip -> regla del cliente).
    console.log("[2b] Pool de clips Pexels...");
    const qCache = new Map();
    for (const part of PARTS) {
      part.pool = [];
      for (const q of part.queries) {
        if (!qCache.has(q)) qCache.set(q, await getClips(q, CLIPS_PER_QUERY));
        part.pool.push(...qCache.get(q));
      }
      part.pool = [...new Map(part.pool.map((c) => [c.src, c])).values()];
    }
    allClips = [...new Map([...qCache.values()].flat().map((c) => [c.src, c])).values()];
    if (!allClips.length && !usingYt) throw new Error("No se descargo ningun clip ni hay YouTube.");
    console.log(`     ${allClips.length} clips Pexels`);
    console.log("[2c] Pool de imagenes de SUV...");
    for (const m of SUV_MODELS) {
      const arr = await getWikiImages(m, 4);
      for (const s of arr) suvImages.push({ src: s, isImage: true, duration: 6 });
      await sleep(120);
    }
    console.log(`     ${suvImages.length} imagenes de SUV`);
    marks = PARTS.map((p) => ({
      key: p.key,
      start: p.anchor ? timeAt(guion.indexOf(p.anchor)) ?? 0 : 0,
      pool: p.pool.length >= 14 ? p.pool : allClips,
    })).sort((a, b) => a.start - b.start);
  }
  const activePart = (t) => {
    if (!marks.length) return { pool: allClips };
    let c = marks[0];
    for (const m of marks) if (m.start <= t + 0.001) c = m;
    return c;
  };

  console.log("[4/5] Generando b-roll (corte 3s, sin repetir adyacente)...");
  const usedCount = {};
  let prevFile = null;
  const keyOf = (c) => c.key ?? c.src;
  const fileOf = (c) => c.file ?? c.src;
  const pick = (pool) => {
    // Regla del cliente: NINGÚN clip aparece 2 veces en el mismo vídeo.
    // 1) clips NO usados aún de la parte activa (temáticos).
    let cand = pool.filter((c) => !usedCount[keyOf(c)] && fileOf(c) !== prevFile);
    // 2) si la parte agotó sus clips nuevos, tirar del pool GLOBAL sin usar.
    if (!cand.length) cand = allClips.filter((c) => !usedCount[keyOf(c)] && fileOf(c) !== prevFile);
    // 3) último recurso (agotados los 236 únicos): el menos usado, no adyacente.
    if (!cand.length) { cand = pool.filter((c) => fileOf(c) !== prevFile); if (!cand.length) cand = pool.slice(); }
    cand.sort((a, b) => (usedCount[keyOf(a)] || 0) - (usedCount[keyOf(b)] || 0));
    const c = cand[0];
    usedCount[keyOf(c)] = (usedCount[keyOf(c)] || 0) + 1;
    prevFile = fileOf(c);
    return c;
  };
  const shots = [];
  const brandIdx = {};
  const entImgIdx = {};
  // STOCK Pexels como "marca" genérica: ventanas de 5s de cada clip de stock. Se mezclan con el
  // material propio SOLO en tramos genéricos (intro, reglas, consejos) para dar variedad real.
  brandPools.stock = [];
  for (const c of allClips) {
    if (c.isImage || !c.duration) continue;
    for (let s0 = 0; s0 + 5 <= c.duration; s0 += 5)
      brandPools.stock.push({ src: c.src, key: `${c.src}#${s0}`, file: c.src, fixedStart: s0, brand: "stock" });
  }
  console.log(`     stock Pexels: ${brandPools.stock.length} ventanas`);
  // Pool GENERAL (intro/cierre) cuando no hay clips "yt-*" propios: intercala una
  // ventana de CADA marca en round-robin -> máxima variedad de coches del vídeo,
  // sin reutilizar nada de otros vídeos.
  const brandListsAll = Object.values(brandPools).filter((l) => l && l.length);
  const genInterleaved = [];
  for (let j = 0; brandListsAll.some((l) => j < l.length); j++)
    for (const l of brandListsAll) if (j < l.length) genInterleaved.push(l[j]);
  let genIdx = 0;
  // NO REPETIR CLIP en el mismo vídeo (regla del cliente): registro global de
  // ventanas ya usadas. `takeUnused` devuelve la siguiente ventana NO usada del
  // pool (empezando en startK) y la marca; si el pool se agota, repite como
  // último recurso y lo cuenta.
  // CORTES DINAMICOS (pedido del cliente): cada plano dura 3-5s y cada plano
  // sale de OTRO punto del material: se prefiere cambiar de fichero y, dentro del
  // mismo fichero, saltar lo MAS LEJOS posible del ultimo tramo usado. Nunca se
  // solapan dos tramos del mismo fichero.
  const WIN = 5;
  const usedRanges = {};            // src -> [[ini, fin], ...]
  const lastStartBySrc = {};
  let lastSrcUsed = null;
  let repeats = 0;
  const hashW = (w) => { let h = 0; for (const c of String(w.key ?? w.src)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return (h % 1000) / 1000; };
  const usedImgs = new Set();
  const isFree = (w) => w.fixedStart === undefined ? !usedImgs.has(w.src) : !(usedRanges[w.src] || []).some(([a, b]) => w.fixedStart < b && w.fixedStart + WIN > a);
  const takeUnused = (pool, _startK, pref) => {
    let best = null, bestScore = -1;
    for (const w of pool) {
      if (!isFree(w)) continue;
      const dist = (lastStartBySrc[w.src] === undefined || w.fixedStart === undefined) ? 400 : Math.abs(w.fixedStart - lastStartBySrc[w.src]);
      let score = (w.src === lastSrcUsed ? 0 : 1000) + Math.min(dist, 400) + hashW(w) * 60;
      if (pref === "stock") score += w.brand === "stock" ? 3000 : 0;
      else if (pref === "car") score -= w.brand === "stock" ? 3000 : 0;
      if (score > bestScore) { bestScore = score; best = w; }
    }
    if (!best) return null; // agotado -> el llamante usa relleno temático (no repite)
    if (best.fixedStart === undefined) { usedImgs.add(best.src); lastSrcUsed = best.src; return best; }
    (usedRanges[best.src] ??= []).push([best.fixedStart, best.fixedStart + WIN]);
    lastStartBySrc[best.src] = best.fixedStart;
    lastSrcUsed = best.src;
    return best;
  };
  const DUR_BRAND = [4, 3.5, 5, 3, 4.5, 4, 3.5, 5, 3, 4];   // cortes DINÁMICOS 3-5s
  const DUR_IMG = [4, 3.5, 4];
  const DUR_GEN = [4, 3, 5, 3.5, 4.5];     // 3-5s
  // Relleno de b-roll temático de coche (Pexels de la sección activa) para cuando
  // el clip de una MARCA corta se agota -> variedad sin repetir el mismo clip.
  const pickFiller = (tt) => {
    const ap = activePart(tt);
    const pool = ap && ap.pool && ap.pool.length ? ap.pool : allClips;
    if (!pool || !pool.length) return null;
    const a = pick(pool);
    const maxStart = Math.max(0, (a.duration || 6) - 3 - 0.2);
    const sf = !a.isImage && maxStart > 0.2 ? +(((usedCount[keyOf(a)] - 1) * 1.7) % maxStart).toFixed(2) : 0;
    return { src: a.src, startFrom: sf, isImage: !!a.isImage };
  };
  let brandShots = 0;
  let t = 0, i = 0;
  while (t < total - 0.15) {
    // De qué se habla: mención explícita, o si no, la MARCA PRINCIPAL de la sección.
    const ent = usingYt ? activeEntity(t) || sectionPrimary(t) : null;
    const vpool = ent ? entVideoPool(ent) : null;
    let clipSrc, startFrom, isImage, framed, d;
    // FOTO de exterior del modelo intercalada cada `imgEvery` planos (variedad: no todo es salpicadero).
    if (usingYt && ent && ent.imgEvery && ent.images && ent.images.length && vpool && vpool.length) {
      const nextK = (brandIdx[ent.key] ?? -1) + 1;
      if (nextK % ent.imgEvery === ent.imgEvery - 1) {
        const wi = takeUnused(ent.images, nextK);
        if (wi) { brandIdx[ent.key] = nextK; clipSrc = wi.src; isImage = true; framed = true; startFrom = 0; d = DUR_IMG[i % DUR_IMG.length]; }
        else ent.imgEvery = 0; // fotos agotadas: solo vídeo
      }
    }
    if (clipSrc) { /* plano de foto ya decidido */ }
    else if (usingYt && vpool && vpool.length) {
      // VÍDEO(S) de esa marca: pool intercalado de sus varios modelos.
      const k = (brandIdx[ent.key] = (brandIdx[ent.key] ?? -1) + 1);
      const w = takeUnused(vpool, k, ent.key === "general" ? (i % 4 === 3 ? "stock" : "car") : undefined);
      if (w) {
        clipSrc = w.src; startFrom = w.fixedStart; isImage = false; framed = true;
        d = DUR_BRAND[i % DUR_BRAND.length]; brandShots++;
      } else {
        // pool de la marca AGOTADO -> b-roll de coche temático (no repetir).
        const f = pickFiller(t);
        if (f) { clipSrc = f.src; startFrom = f.startFrom; isImage = f.isImage; framed = true; d = DUR_GEN[i % DUR_GEN.length]; }
        else { const w2 = vpool[k % vpool.length]; clipSrc = w2.src; startFrom = w2.fixedStart; isImage = false; framed = true; d = DUR_BRAND[i % DUR_BRAND.length]; brandShots++; repeats++; }
      }
    } else if (usingYt && ent && ent.images && ent.images.length) {
      // IMAGEN correcta del rival/tema (no hay vídeo de esa marca). Sin repetir.
      const k = (entImgIdx[ent.key] = (entImgIdx[ent.key] ?? -1) + 1);
      const w = takeUnused(ent.images, k);
      if (w) { clipSrc = w.src; isImage = true; framed = true; startFrom = 0; d = DUR_IMG[i % DUR_IMG.length]; }
      else if ((() => { const pe = sectionPrimary(t); const pp = pe ? entVideoPool(pe) : null; const w3 = pp && pp.length ? takeUnused(pp, 0) : null; if (w3) { clipSrc = w3.src; startFrom = w3.fixedStart; isImage = false; framed = true; d = DUR_BRAND[i % DUR_BRAND.length]; brandShots++; return true; } return false; })()) { /* clip del modelo principal de la sección */ }
      else { const f = pickFiller(t); if (f) { clipSrc = f.src; startFrom = f.startFrom; isImage = f.isImage; framed = true; d = DUR_GEN[i % DUR_GEN.length]; } else { const w2 = ent.images[k % ent.images.length]; clipSrc = w2.src; isImage = true; framed = true; startFrom = 0; d = DUR_IMG[i % DUR_IMG.length]; repeats++; } }
    } else if (usingYt) {
      // Genérico (intro/conclusión/transiciones): rota entre TODAS las marcas;
      // al agotarse, b-roll de coche temático.
      const w = generalWindows.length ? pick(generalWindows)
        : (genInterleaved.length ? takeUnused(genInterleaved, genIdx++, i % 4 === 3 ? "stock" : "car") : null);
      if (w) { clipSrc = w.src; startFrom = w.fixedStart; isImage = false; framed = true; d = DUR_GEN[i % DUR_GEN.length]; }
      else { const f = pickFiller(t); if (f) { clipSrc = f.src; startFrom = f.startFrom; isImage = f.isImage; framed = true; d = DUR_GEN[i % DUR_GEN.length]; } else { const w2 = (genInterleaved.length ? genInterleaved : ytWindows)[i % (genInterleaved.length || ytWindows.length)]; clipSrc = w2.src; startFrom = w2.fixedStart; isImage = false; framed = true; d = DUR_GEN[i % DUR_GEN.length]; repeats++; } }
    } else {
      const useImg = suvImages.length && i % 6 === 5;
      const asset = useImg ? pick(suvImages) : pick(activePart(t).pool);
      clipSrc = asset.src; isImage = !!asset.isImage;
      framed = asset.isImage ? true : Math.floor(i / 2) % 2 === 1;
      const maxStart = Math.max(0, (asset.duration || 6) - 3 - 0.2);
      startFrom = !asset.isImage && maxStart > 0.2 ? +(((usedCount[keyOf(asset)] - 1) * 1.7) % maxStart).toFixed(2) : 0;
      d = DUR_GEN[i % DUR_GEN.length];
    }
    d = Math.min(d, total - t);
    shots.push({
      clipSrc,
      durationInSeconds: +d.toFixed(2),
      startFromSeconds: startFrom,
      kenBurns: i % 2 === 0 ? "in" : "out",
      framed: framed && !(i % 3 === 2 && !isImage),
      isImage,
      sfx: t < 60,
    });
    t += d; i++;
  }
  console.log(`     ${shots.length} planos · ${brandShots} de vídeo de MARCA · ${shots.length - brandShots} otros · dur media ${(total / shots.length).toFixed(1)}s · clips repetidos: ${repeats}`);

  console.log("[5/5] Anclando textos y evitando solapes...");
  const DUR = { hook: 2.6, stat: 2.8, caption: 2.5 };
  const overlays = [];
  for (const o of OVERLAYS) {
    const idx = guion.indexOf(o.anchor);
    if (idx < 0) { console.warn(`[!] ancla no encontrada: "${o.anchor}"`); continue; }
    const from = Math.max(0, (timeAt(idx) ?? 0) + (o.offset ?? 0));
    const base = { fromSeconds: +from.toFixed(2), durationInSeconds: DUR[o.kind] };
    if (o.kind === "stat") overlays.push({ kind: "stat", value: o.value, sub: o.sub, ...base });
    else if (o.kind === "hook") overlays.push({ kind: "hook", text: o.text, ...base });
    else overlays.push({ kind: "caption", text: o.text, ...base });
  }
  overlays.sort((a, b) => a.fromSeconds - b.fromSeconds);
  let prevEnd = -1;
  for (const o of overlays) {
    if (o.fromSeconds < prevEnd) o.fromSeconds = +(prevEnd + 0.15).toFixed(2);
    prevEnd = o.fromSeconds + o.durationInSeconds;
  }
  console.log(`     ${overlays.length} overlays`);

  const tags = [];
  for (const g of TAGS) {
    const a = guion.indexOf(g.anchor), b = guion.indexOf(g.end);
    if (a < 0 || b < 0) { console.warn(`[!] tag sin ancla: ${g.code}`); continue; }
    const from = (timeAt(a) ?? 0) + 2.8, to = (timeAt(b) ?? total) - 0.2;
    if (to - from > 3) tags.push({ code: g.code, name: g.name, verdict: g.verdict, fromSeconds: +from.toFixed(2), durationInSeconds: +(to - from).toFixed(2) });
  }
  const chapters = [];
  for (const c of CHAPTERS) {
    const a = guion.indexOf(c.anchor);
    if (a < 0) { console.warn(`[!] capítulo sin ancla: ${c.label}`); continue; }
    chapters.push({ label: c.label, fromSeconds: +(Math.max(0, timeAt(a) ?? 0)).toFixed(2) });
  }
  console.log(`     ${tags.length} etiquetas de motor · ${chapters.length} capítulos`);
  await fs.writeFile(path.join(ROOT, "out", "_shots-plan.json"), JSON.stringify(shots.map((s, k) => ({ i: k, clipSrc: s.clipSrc, startFrom: s.startFromSeconds, dur: s.durationInSeconds, isImage: !!s.isImage })), null, 1), "utf-8");

  await fs.copyFile(NARRATION, path.join(AUDIO_DIR, "narration.mp3"));
  // Música de fondo: solo si el cliente la ha puesto en el proyecto (regla:
  // normalmente se añade aparte con ducking; en la nube no está y no se incrusta).
  const hasMusic = await fileExists(path.join(AUDIO_DIR, "musica-fondo.mp3"));
  await fs.writeFile(CONFIG_PATH, emitConfig(total, shots, overlays, pins, hasMusic, tags, chapters), "utf-8");
  console.log(`\n✅ Listo. total=${total.toFixed(1)}s · ${shots.length} planos · ${overlays.length} overlays · ${pins.length} pins.`);
}

function emitConfig(total, shots, overlays, pins, hasMusic, tags, chapters) {
  const shotsCode = shots
    .map((s) => `  { clipSrc: ${JSON.stringify(s.clipSrc)}, durationInSeconds: ${s.durationInSeconds}, startFromSeconds: ${s.startFromSeconds}, kenBurns: ${JSON.stringify(s.kenBurns)}, framed: ${s.framed}, isImage: ${!!s.isImage}, sfx: ${!!s.sfx} }`)
    .join(",\n");
  const pinsCode = (pins || [])
    .map((p) => {
      if (p.kind === "duo") return `  { kind: "duo", srcA: ${JSON.stringify(p.srcA)}, srcB: ${JSON.stringify(p.srcB)}, labelA: ${JSON.stringify(p.labelA)}, labelB: ${JSON.stringify(p.labelB)}, fromSeconds: ${p.fromSeconds}, durationInSeconds: ${p.durationInSeconds} }`;
      return `  { kind: "image", src: ${JSON.stringify(p.src)}, label: ${JSON.stringify(p.label)}, fromSeconds: ${p.fromSeconds}, durationInSeconds: ${p.durationInSeconds} }`;
    })
    .join(",\n");
  const ovCode = overlays
    .map((o) => {
      if (o.kind === "stat") return `  { kind: "stat", value: ${JSON.stringify(o.value)}, sub: ${JSON.stringify(o.sub)}, fromSeconds: ${o.fromSeconds}, durationInSeconds: ${o.durationInSeconds} }`;
      if (o.kind === "hook") return `  { kind: "hook", text: ${JSON.stringify(o.text)}, fromSeconds: ${o.fromSeconds}, durationInSeconds: ${o.durationInSeconds} }`;
      return `  { kind: "caption", text: ${JSON.stringify(o.text)}, fromSeconds: ${o.fromSeconds}, durationInSeconds: ${o.durationInSeconds} }`;
    })
    .join(",\n");

  return `// GENERADO por scripts/build-video.mjs — no editar a mano.
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

export type Tag = { code: string; name: string; verdict: "yes" | "no"; fromSeconds: number; durationInSeconds: number };
export type Chapter = { label: string; fromSeconds: number };

export type VideoConfig = {
  width: number; height: number; fps: number;
  narrationSrc?: string; musicSrc?: string; totalDurationInSeconds: number;
  shots: Shot[]; overlays: Overlay[]; pins: Pin[]; tags?: Tag[]; chapters?: Chapter[];
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
  narrationSrc: "assets/audio/narration.mp3",${hasMusic ? '\n  musicSrc: "assets/audio/musica-fondo.mp3",' : ""}
  totalDurationInSeconds: ${total.toFixed(2)},
  shots: [
${shotsCode}
  ],
  overlays: [
${ovCode}
  ],
  pins: [
${pinsCode}
  ],
  tags: ${JSON.stringify(tags)},
  chapters: ${JSON.stringify(chapters)},
};
`;
}

main().catch((e) => { console.error("\n❌ Error:", e.message); process.exit(1); });
