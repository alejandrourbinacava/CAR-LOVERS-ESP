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
const PARTS = [
  { key: "intro", anchor: null, queries: ["used car dealership", "suv driving highway", "car key handover", "luxury car showroom"] },
  { key: "q7", anchor: "1. AUDI Q7", queries: ["luxury suv air suspension", "premium suv driving", "suv parked street", "car suspension repair"] },
  { key: "focus", anchor: "2. FORD FOCUS", queries: ["car gearbox transmission", "mechanic transmission oil leak", "hatchback driving road", "car under repair garage"] },
  { key: "brit", anchor: "3. LOS PRIMOS BRITÁNICOS", queries: ["car engine timing chain", "luxury suv engine bay", "mechanic engine repair", "premium suv road"] },
  { key: "qashqai", anchor: "4. NISSAN QASHQAI", queries: ["car dashboard touchscreen", "car infotainment screen", "suv interior dashboard", "car multimedia system"] },
  { key: "renault", anchor: "5. RENAULT CLIO V", queries: ["hybrid car engine", "car transmission gearbox", "hybrid car driving city", "car service garage"] },
  { key: "stellantis", anchor: "6. STELLANTIS", queries: ["car engine timing belt", "diesel engine bay", "car engine oil", "car exhaust pipe"] },
  { key: "tesla", anchor: "7. TESLA MODEL 3", queries: ["electric car assembly factory", "car body panel", "electric car charging", "car production line"] },
  { key: "vw", anchor: "8. GRUPO VOLKSWAGEN", queries: ["car touchscreen dashboard", "dual clutch gearbox", "car dashboard buttons", "car software screen"] },
  { key: "volvo", anchor: "9. VOLVO XC60", queries: ["car infotainment screen", "premium suv interior", "suv dashboard touchscreen", "premium suv driving"] },
  { key: "patron", anchor: "EL PATRÓN QUE CONECTA", queries: ["used car dealership", "car key handover", "mechanic inspecting car", "car driving road"] },
];

// Vídeo 10: clips reales de modelo (ENTITIES/SECTIONS), no imágenes sticky.
const MODELS = [];

// Modelos SUV para el POOL DE IMAGENES (relleno garantizado de SUV real cuando
// los clips no basten). Se usan como planos de b-roll (tarjeta + Ken Burns).
// Modelos con imagen ya en disco (evita depender de descargas nuevas, que
// Wikimedia esta limitando por IP en esta sesion).
// Vídeo 6 (LSPI) es conceptual: sin pool de imágenes de SUV (serían fuera de tema).
const SUV_MODELS = [];

// VÍDEO 10 — COCHES QUE NUNCA DEBES COMPRAR (modelos y años). Anclas verificadas
// literalmente en input/guion-completo.txt.
const OVERLAYS = [
  // HOOK
  { anchor: "nombrar años exactos", kind: "hook", text: "COCHES QUE NUNCA\nDEBES COMPRAR" },
  { anchor: "más en reparaciones que el propio coche", kind: "caption", text: "REPARACIONES QUE CUESTAN MÁS QUE EL COCHE" },

  // 1. Audi Q7
  { anchor: "1. AUDI Q7", kind: "hook", text: "AUDI Q7 (2ª GEN)\n2019-2024" },
  { anchor: "la suspensión neumática", kind: "stat", value: "SUSPENSIÓN NEUMÁTICA", sub: "FUGAS + COMPRESOR QUEMADO" },
  { anchor: "el coche se inclina visiblemente hacia un lado", kind: "caption", text: "SÍNTOMA: APARCADO, SE INCLINA HACIA UN LADO" },
  { anchor: "Una factura de cuatro cifras", kind: "stat", value: "4 CIFRAS", sub: "RENOVAR EL SISTEMA NEUMÁTICO" },

  // 2. Ford Focus
  { anchor: "2. FORD FOCUS", kind: "hook", text: "FORD FOCUS (4ª GEN)\n2019-2021" },
  { anchor: "las fugas de aceite en la caja de cambios", kind: "stat", value: "FUGA DE ACEITE", sub: "EN LA CAJA (MANUAL Y AUTOMÁTICA)" },
  { anchor: "un desgaste catastrófico de los componentes internos", kind: "caption", text: "SIN ACEITE = CAJA DE CAMBIOS DESTROZADA" },

  // 3. Británicos (Ingenium)
  { anchor: "3. LOS PRIMOS BRITÁNICOS", kind: "hook", text: "JAGUAR E-PACE · DISCOVERY\nSPORT · EVOQUE (2019-24)" },
  { anchor: "los motores Ingenium", kind: "stat", value: "MOTOR INGENIUM", sub: "ACEITE + CALOR + CADENA" },
  { anchor: "problemas con la cadena de distribución", kind: "caption", text: "LO MÁS GRAVE: CADENA DE DISTRIBUCIÓN" },
  { anchor: "último puesto del ranking de fiabilidad de la OCU 2026 con sesenta y cuatro puntos", kind: "stat", value: "OCU 64/100", sub: "LAND ROVER · ÚLTIMO PUESTO" },

  // 4. Nissan Qashqai
  { anchor: "4. NISSAN QASHQAI", kind: "hook", text: "NISSAN QASHQAI (3ª GEN)\n2021-2022" },
  { anchor: "los fallos del sistema multimedia y la electrónica", kind: "stat", value: "ELECTRÓNICA", sub: "PANTALLAS QUE SE BLOQUEAN Y REINICIAN" },
  { anchor: "verifica que el software esté actualizado", kind: "caption", text: "SOLO 1ª SERIES · COMPRUEBA EL SOFTWARE AL DÍA" },

  // 5. Renault E-Tech
  { anchor: "5. RENAULT CLIO V", kind: "hook", text: "RENAULT CLIO V · CAPTUR II\nE-TECH (2020-2022)" },
  { anchor: "más de trescientos treinta y cuatro mil vehículos", kind: "stat", value: "+334.000", sub: "COCHES EN LA CAMPAÑA DE RENAULT" },
  { anchor: "junta de estanqueidad del circuito de lubricación", kind: "caption", text: "FUGA EN LA JUNTA DE LUBRICACIÓN DE LA CAJA" },
  { anchor: "verifica que haya pasado la operación técnica especial", kind: "caption", text: "EXIGE QUE HAYA PASADO LA CAMPAÑA RENAULT" },

  // 6. Stellantis
  { anchor: "6. STELLANTIS", kind: "hook", text: "STELLANTIS (CITROËN·FIAT·\nPEUGEOT·OPEL) 2019-24" },
  { anchor: "el motor 1.2 PureTech", kind: "stat", value: "1.2 PureTech", sub: "CORREA DE DISTRIBUCIÓN EN ACEITE" },
  { anchor: "el problema mecánico más extendido del mercado europeo", kind: "caption", text: "EL FALLO MECÁNICO MÁS EXTENDIDO DE EUROPA" },
  { anchor: "el sistema AdBlue de los diésel BlueHDi", kind: "stat", value: "BlueHDi + AdBlue", sub: "SENSORES · CRISTALIZACIÓN · ARRANQUE BLOQUEADO" },

  // 7. Tesla Model 3
  { anchor: "7. TESLA MODEL 3", kind: "hook", text: "TESLA MODEL 3\n(FREMONT 2019-2022)" },
  { anchor: "calidad de fabricación, ajuste y acabado", kind: "stat", value: "CALIDAD DE FABRICACIÓN", sub: "PANELES · MOLDURAS · SELLADO · PINTURA" },
  { anchor: "fabricadas en la fábrica de Berlín", kind: "caption", text: "LAS DE BERLÍN (EUROPA) VAN MEJOR" },

  // 8. Grupo VW
  { anchor: "8. GRUPO VOLKSWAGEN", kind: "hook", text: "GRUPO VW (AUDI·SEAT·VW)\nSOFTWARE + CAJA DSG" },
  { anchor: "el software de la plataforma MQB Evo", kind: "stat", value: "MQB EVO", sub: "SOFTWARE + INFOTAINMENT (2020-2022)" },
  { anchor: "El Golf 8 fue el ejemplo más sonado", kind: "caption", text: "GOLF 8: TANTAS QUEJAS QUE VOLVIERON LOS BOTONES" },
  { anchor: "la caja de cambios DSG", kind: "stat", value: "CAJA DSG", sub: "MECATRÓNICA CARA · ACEITE OBLIGATORIO" },

  // 9. Volvo XC60
  { anchor: "9. VOLVO XC60", kind: "hook", text: "VOLVO XC60 (2ª GEN)\nSENSUS 2019-2022" },
  { anchor: "el sistema Sensus", kind: "stat", value: "SISTEMA SENSUS", sub: "SE CUELGA · LENTO · SE REINICIA" },
  { anchor: "migró posteriormente a un sistema basado en Android", kind: "caption", text: "LOS POSTERIORES (ANDROID) VAN MEJOR" },

  // PATRÓN + LECCIÓN
  { anchor: "EL PATRÓN QUE CONECTA", kind: "hook", text: "EL PATRÓN:\nCOMPLEJIDAD + PRIMERAS SERIES" },
  { anchor: "casi todos son problemas de las PRIMERAS unidades", kind: "caption", text: "CASI TODO: FALLOS DE LAS PRIMERAS SERIES" },
  { anchor: "NUNCA COMPRES LA PRIMERA HORNADA", kind: "hook", text: "LA LECCIÓN:\nNUNCA LA PRIMERA HORNADA" },
  { anchor: "Dejar que pasen dos o tres años", kind: "caption", text: "ESPERA 2-3 AÑOS: COMPRA LA VERSIÓN DEPURADA" },
  { anchor: "Suscríbete para más", kind: "hook", text: "SUSCRÍBETE" },
];

// PINS: imagen del MODELO exacto anclada a donde se menciona.
// kind "image" = un modelo; kind "duo" = comparativa de dos.
const PINS = [];

// ENTIDADES: de qué se habla en cada momento -> qué material poner.
// El sistema escanea el guion, y en cada tramo donde se menciona una
// entidad, pone material de ESA entidad (imagen del modelo/marca/tema).
// query = término de búsqueda de imágenes. anchors = subcadenas del guion
// (poner las específicas ANTES que las genéricas).
// Una ENTIDAD por MARCA. `videos` = lista de claves marca-<key>.mp4 disponibles
// (se rotan/intercalan para dar variedad dentro de la sección). Si `videos` está
// vacío, la marca cae a IMÁGENES (Wikimedia/SerpAPI) usando `query`.
// `anchors` = subcadenas del guion; se usan CÓDIGOS DE MOTOR porque son únicos
// por marca -> refuerzan la "regla roja" también en la síntesis final.
// VÍDEO 10 — COCHES QUE NUNCA COMPRAR: 1 CLIP real por modelo (marca-<key>.mp4 en
// public/assets/yt-nocompres). Cada modelo se ve EN MOVIMIENTO durante su sección.
const ENTITIES = [
  { key: "q7", label: "", query: "", videos: ["q7"], anchors: ["Audi Q7", "Q7"] },
  { key: "focus", label: "", query: "", videos: ["focus"], anchors: ["Ford Focus", "Focus"] },
  { key: "evoque", label: "", query: "", videos: ["evoque"],
    anchors: ["Evoque", "Discovery Sport", "E-Pace", "Ingenium"] },
  { key: "qashqai", label: "", query: "", videos: ["qashqai"], anchors: ["Qashqai"] },
  { key: "captur", label: "", query: "", videos: ["captur"],
    anchors: ["Clio V", "Captur", "E-Tech", "Arkana", "Mégane"] },
  { key: "peugeot", label: "", query: "", videos: ["peugeot"],
    anchors: ["Peugeot", "Citroën", "PureTech", "BlueHDi", "Opel", "Stellantis"] },
  { key: "tesla", label: "", query: "", videos: ["tesla"], anchors: ["Tesla", "Model 3", "Fremont"] },
  { key: "golf", label: "", query: "", videos: ["golf"], anchors: ["Golf 8", "MQB Evo", "DSG"] },
  { key: "volvo", label: "", query: "", videos: ["volvo"], anchors: ["Volvo", "XC60", "Sensus"] },
  { key: "cierre", label: "", query: "", videos: [], anchors: [] },
];

// SECCIONES: cada tramo tiene una MARCA principal. Mientras dura la sección, si no
// se menciona explícitamente otra cosa, se muestra el vídeo de ESA marca (no uno
// genérico). anchor = cabecera de sección en el guion. La intro (antes de TOYOTA)
// queda sin principal -> vídeo general.
// VÍDEO 10 — cada sección muestra el CLIP del modelo del que se habla. La sección
// de patrón/lección cae a "cierre" (rotación de todos los modelos).
const SECTIONS = [
  { anchor: "1. AUDI Q7", primary: "q7" },
  { anchor: "2. FORD FOCUS", primary: "focus" },
  { anchor: "3. LOS PRIMOS BRITÁNICOS", primary: "evoque" },
  { anchor: "4. NISSAN QASHQAI", primary: "qashqai" },
  { anchor: "5. RENAULT CLIO V", primary: "captur" },
  { anchor: "6. STELLANTIS", primary: "peugeot" },
  { anchor: "7. TESLA MODEL 3", primary: "tesla" },
  { anchor: "8. GRUPO VOLKSWAGEN", primary: "golf" },
  { anchor: "9. VOLVO XC60", primary: "volvo" },
  { anchor: "EL PATRÓN QUE CONECTA", primary: "cierre" },
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
const BLACKLIST_IDS = [26620319, 26620441, 8987271];
const seenIds = new Set(BLACKLIST_IDS);

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
    const margin = shortClip ? Math.min(6, dur * 0.05) : 45;
    const endMargin = shortClip ? 9 : 45;
    const step = shortClip ? 4 : 7;
    for (let t = margin; t < dur - endMargin; t += step) {
      wins.push({ src, key: `${src}#${Math.round(t)}`, file: src, fixedStart: +t.toFixed(1), brand });
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
    if (entHasVideo(e)) continue; // esta marca ya tiene VÍDEO, no necesita imagen
    if (!e.query) continue;       // entidad "cierre" -> vídeo general, sin imagen
    const imgs = await getWikiImages(e.query, 8);
    e.images = imgs.map((src) => ({ src }));
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
  if (!usingYt) {
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
    if (!allClips.length) throw new Error("No se descargo ningun clip ni hay YouTube.");
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
  const usedWin = new Set();
  let repeats = 0;
  const winKey = (w) => `${w.src}@${w.fixedStart ?? "img"}`;
  const takeUnused = (pool, startK) => {
    const n = pool.length;
    for (let s = 0; s < n; s++) {
      const w = pool[((startK % n) + s) % n];
      if (!usedWin.has(winKey(w))) { usedWin.add(winKey(w)); return w; }
    }
    repeats++; return pool[startK % n]; // agotado -> repite (raro)
  };
  const DUR_BRAND = [6, 5, 7, 5, 6];   // vídeo de marca: cortes largos (5-7s)
  const DUR_IMG = [4, 5, 4];           // imagen de rival/tema (4-5s)
  const DUR_GEN = [5, 4, 6, 4, 5];     // vídeo general (4-6s)
  let brandShots = 0;
  let t = 0, i = 0;
  while (t < total - 0.15) {
    // De qué se habla: mención explícita, o si no, la MARCA PRINCIPAL de la sección.
    const ent = usingYt ? activeEntity(t) || sectionPrimary(t) : null;
    const vpool = ent ? entVideoPool(ent) : null;
    let clipSrc, startFrom, isImage, framed, d;
    if (usingYt && vpool && vpool.length) {
      // VÍDEO(S) de esa marca: pool intercalado de sus varios modelos.
      const k = (brandIdx[ent.key] = (brandIdx[ent.key] ?? -1) + 1);
      const w = takeUnused(vpool, k);
      clipSrc = w.src; startFrom = w.fixedStart; isImage = false; framed = true;
      d = DUR_BRAND[i % DUR_BRAND.length];
      brandShots++;
    } else if (usingYt && ent && ent.images && ent.images.length) {
      // IMAGEN correcta del rival/tema (no hay vídeo de esa marca). Sin repetir.
      const k = (entImgIdx[ent.key] = (entImgIdx[ent.key] ?? -1) + 1);
      const w = takeUnused(ent.images, k);
      clipSrc = w.src; isImage = true; framed = true; startFrom = 0;
      d = DUR_IMG[i % DUR_IMG.length];
    } else if (usingYt) {
      // Genérico (intro/conclusión/transiciones). Si no hay clips generales
      // propios (yt-*), rota entre TODAS las marcas del vídeo (variedad máxima).
      const w = generalWindows.length
        ? pick(generalWindows)
        : (genInterleaved.length ? takeUnused(genInterleaved, genIdx++) : pick(ytWindows));
      clipSrc = w.src; startFrom = w.fixedStart; isImage = false; framed = true;
      d = DUR_GEN[i % DUR_GEN.length];
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
      framed,
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

  await fs.copyFile(NARRATION, path.join(AUDIO_DIR, "narration.mp3"));
  // Música de fondo: solo si el cliente la ha puesto en el proyecto (regla:
  // normalmente se añade aparte con ducking; en la nube no está y no se incrusta).
  const hasMusic = await fileExists(path.join(AUDIO_DIR, "musica-fondo.mp3"));
  await fs.writeFile(CONFIG_PATH, emitConfig(total, shots, overlays, pins, hasMusic), "utf-8");
  console.log(`\n✅ Listo. total=${total.toFixed(1)}s · ${shots.length} planos · ${overlays.length} overlays · ${pins.length} pins.`);
}

function emitConfig(total, shots, overlays, pins, hasMusic) {
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
};
`;
}

main().catch((e) => { console.error("\n❌ Error:", e.message); process.exit(1); });
