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
  { key: "intro", anchor: null, queries: ["used car dealership lot", "mechanic inspecting car", "car inspection garage", "car keys handover"] },
  { key: "datos", anchor: "ANTES DE EMPEZAR: DE DÓNDE SALEN LOS DATOS", queries: ["mechanic checking car engine", "car diagnostic tool", "car service garage", "cars on highway traffic"] },
  { key: "lista", anchor: "NÚMERO 10: SMART FORTWO Y FORFOUR", queries: ["car engine bay", "mechanic working under car", "used car lot", "car dashboard warning light"] },
  { key: "premium", anchor: "NÚMERO 4: AUDI A4 Y A5", queries: ["car engine oil dipstick", "mechanic checking oil", "car engine repair", "car workshop"] },
  { key: "tesla", anchor: "NÚMERO 1: TESLA MODEL Y Y MODEL 3", queries: ["electric car charging", "car brake disc", "mechanic car brakes", "electric car driving"] },
  { key: "metodo", anchor: "CÓMO COMPRAR UN COCHE DE SEGUNDA MANO SIN ARRUINARTE", queries: ["person buying used car", "car test drive", "mechanic inspecting used car", "car dealership handshake"] },
  { key: "alternativas", anchor: "¿Y QUÉ COMPRO ENTONCES? LAS ALTERNATIVAS", queries: ["hybrid car driving", "car showroom customers", "family car driving road", "car dealership showroom"] },
  { key: "cierre", anchor: "CONCLUSIÓN: LA FIABILIDAD NO ESTÁ EN LA MARCA", queries: ["car keys handover", "driving highway sunset", "person choosing car", "cars on road traffic"] },
];


// Vídeo 16: clips reales de modelo (ENTITIES/SECTIONS), no imágenes sticky.
const MODELS = [];
const SUV_MODELS = [];

// VÍDEO 16 — COCHES DE SEGUNDA MANO QUE NO DEBES COMPRAR EN 2027. Anclas literales de input/guion-completo.txt.
const OVERLAYS = [
  { anchor: "más de uno de cada seis no pasa la revisión técnica", kind: "hook", text: "1 DE CADA 6 NO PASA\nLA REVISIÓN TÉCNICA" },
  { anchor: "analizó 9,5 millones de inspecciones", kind: "stat", value: "9,5 M", sub: "INSPECCIONES ANALIZADAS · TÜV 2026" },
  { anchor: "tiene un 17,3 por ciento de defectos", kind: "stat", value: "17,3 %", sub: "TESLA MODEL Y (2-3 AÑOS) · DEFECTOS TÜV 2026" },
  { anchor: "La media de su edad es del 6,5", kind: "stat", value: "6,5 %", sub: "MEDIA DE SU EDAD" },
  { anchor: "un Mercedes de diez años tiene un 18,5 por ciento", kind: "stat", value: "18,5 %", sub: "MERCEDES DE 10 AÑOS · TÜV 2026" },
  { anchor: "Algunos son los coches más vendidos de España", kind: "caption", text: "ALGUNOS SON LOS MÁS VENDIDOS DE ESPAÑA" },
  { anchor: "qué versión sí podrías comprar", kind: "caption", text: "QUÉ VERSIÓN SÍ PODRÍAS COMPRAR" },
  { anchor: "ANTES DE EMPEZAR: DE DÓNDE SALEN LOS DATOS", kind: "hook", text: "ANTES DE EMPEZAR\nDE DÓNDE SALEN LOS DATOS" },
  { anchor: "más de 85.000 conductores en diez países", kind: "stat", value: "85.000+", sub: "CONDUCTORES · 10 PAÍSES · OCU 2026" },
  { anchor: "Casi ningún coche de esta lista es malo en todas sus versiones", kind: "caption", text: "EVITA UNA COMBINACIÓN: MODELO + MOTOR + AÑO" },
  { anchor: "hazte siempre tres preguntas", kind: "caption", text: "¿QUÉ MOTOR? ¿QUÉ AÑO? ¿QUÉ HISTORIAL?" },

  { anchor: "NÚMERO 10: SMART FORTWO Y FORFOUR", kind: "hook", text: "Nº 10\nSMART FORTWO Y FORFOUR" },
  { anchor: "los de 2016 tienen 23,1", kind: "stat", value: "23,1", sub: "AVERÍAS / 1.000 · FORTWO 2016 (ADAC)" },
  { anchor: "Los de 2017, 26,4", kind: "stat", value: "26,4", sub: "AVERÍAS / 1.000 · FORTWO 2017" },
  { anchor: "El ForTwo de 2020 baja a 9,1", kind: "stat", value: "9,1", sub: "FORTWO 2020 · MEJORA MUCHO" },
  { anchor: "con apenas 1,1 averías por cada mil", kind: "stat", value: "1,1", sub: "FORTWO 2006 · EL MÁS FIABLE DEL ADAC" },
  { anchor: "la batería de arranque, la cerradura de contacto, el alternador y el motor de arranque", kind: "caption", text: "BATERÍA · CERRADURA · ALTERNADOR · ARRANQUE" },

  { anchor: "NÚMERO 9: PEUGEOT 208 / 2008 Y CITROËN C3", kind: "hook", text: "Nº 9\nPEUGEOT 208/2008 · CITROËN C3 PURETECH" },
  { anchor: "más de 15.000 matriculaciones hasta septiembre", kind: "stat", value: "15.000+", sub: "PEUGEOT 2008 · MATRICULACIONES ENE-SEP 2026" },
  { anchor: "la correa de distribución trabaja bañada en aceite", kind: "caption", text: "CORREA DE DISTRIBUCIÓN BAÑADA EN ACEITE" },
  { anchor: "Primero, exige facturas", kind: "caption", text: "EXIGE FACTURAS DEL ACEITE EXACTO" },

  { anchor: "NÚMERO 8: HYUNDAI I20 Y KIA CEED", kind: "hook", text: "Nº 8\nHYUNDAI I20 Y KIA CEED" },
  { anchor: "Los de 2011, 70,5", kind: "stat", value: "70,5", sub: "AVERÍAS / 1.000 · KIA CEED 2011 (ADAC)" },
  { anchor: "con 52,7 averías por cada mil vehículos", kind: "stat", value: "52,7", sub: "KIA CEED · EL MENOS FIABLE DE LA LISTA" },
  { anchor: "casi 18.000 coches en España", kind: "stat", value: "18.000", sub: "HYUNDAI I20/BAYON · REVISIÓN BOMBA DE COMBUSTIBLE" },
  { anchor: "busca los de 2015 en adelante", kind: "caption", text: "SI QUIERES UN COREANO: 2015 EN ADELANTE" },

  { anchor: "NÚMERO 7: NISSAN CASHCAI Y JUKE", kind: "hook", text: "Nº 7\nNISSAN QASHQAI Y JUKE 1.2 DIG-T" },
  { anchor: "traqueteo metálico al arrancar en frío", kind: "caption", text: "TRAQUETEO EN FRÍO = CADENA ESTIRADA" },
  { anchor: "entre 800 y 1.400 euros", kind: "stat", value: "800 – 1.400 €", sub: "CAMBIO DEL KIT DE DISTRIBUCIÓN" },
  { anchor: "con unos 83.000 kilómetros", kind: "stat", value: "83.000 KM", sub: "JUKE · CADENA CAMBIADA (CASOS REALES)" },
  { anchor: "como máximo cada 10.000 kilómetros", kind: "caption", text: "ACEITE CADA 10.000 KM COMO MÁXIMO" },

  { anchor: "NÚMERO 6: DACIA DUSTER", kind: "hook", text: "Nº 6\nDACIA DUSTER (2010-2018)" },
  { anchor: "el Duster tiene un 23,5 por ciento", kind: "stat", value: "23,5 %", sub: "DUSTER 6-7 AÑOS · MEDIA 13,6 % (TÜV)" },
  { anchor: "el Duster llega al 34,2 por ciento", kind: "stat", value: "34,2 %", sub: "DUSTER 10-11 AÑOS · MEDIA 22,9 %" },
  { anchor: "Tres años seguidos con el mismo patrón", kind: "caption", text: "TRES EDICIONES DEL TÜV · MISMO PATRÓN" },
  { anchor: "no averías de motor", kind: "caption", text: "EL TÜV MIDE DEFECTOS DE INSPECCIÓN, NO AVERÍAS DE MOTOR" },
  { anchor: "frenos, suspensión, silentblocks, rótulas y luces", kind: "caption", text: "REVISA FRENOS · SUSPENSIÓN · RÓTULAS · LUCES" },

  { anchor: "NÚMERO 5: VOLKSWAGEN GOLF Y SEAT LEÓN", kind: "hook", text: "Nº 5\nGOLF Y LEÓN · 1.2 Y 1.4 TSI (PRIMERAS SERIES)" },
  { anchor: "entre los 40.000 y los 100.000", kind: "stat", value: "40.000 – 100.000 KM", sub: "CADENA DE DISTRIBUCIÓN 1.2 / 1.4 TSI" },
  { anchor: "antes del 18 de junio de 2011", kind: "caption", text: "1.2 TSI ANTERIORES AL 18 JUN 2011: LOS MÁS EXPUESTOS" },
  { anchor: "entre 700 y 1.200 euros", kind: "stat", value: "700 – 1.200 €", sub: "KIT DE CADENA + TENSOR + GUÍAS" },
  { anchor: "Twincharger, con compresor y turbo", kind: "caption", text: "1.4 TSI TWINCHARGER · LA PEOR VARIANTE" },
  { anchor: "el mismo coche más vendido, pero con la versión equivocada", kind: "caption", text: "EL MISMO COCHE MÁS VENDIDO, CON LA VERSIÓN EQUIVOCADA" },

  { anchor: "NÚMERO 4: AUDI A4 Y A5", kind: "hook", text: "Nº 4\nAUDI A4 Y A5 · 2.0 TFSI (2008-2012)" },
  { anchor: "hasta un litro cada 2.000 kilómetros", kind: "stat", value: "1 L / 2.000 KM", sub: "CONSUMO DE ACEITE QUE AUDI DA POR NORMAL" },
  { anchor: "medio litro cada 10.000 kilómetros", kind: "stat", value: "0,5 L / 10.000 KM", sub: "CONSUMO DE ACEITE SANO" },
  { anchor: "mira la varilla en frío", kind: "caption", text: "MIRA LA VARILLA EN FRÍO" },

  { anchor: "NÚMERO 3: BMW 320D Y 520D", kind: "hook", text: "Nº 3\nBMW 320d Y 520d · MOTOR N47 (2007-2014)" },
  { anchor: "la cadena de distribución está en la parte trasera del motor", kind: "caption", text: "CADENA DE DISTRIBUCIÓN EN LA PARTE TRASERA" },
  { anchor: "entre 12 y 20 horas de trabajo", kind: "stat", value: "12 – 20 H", sub: "MANO DE OBRA SOLO PARA LLEGAR A LA CADENA" },
  { anchor: "de los 5.000 a los 9.000 euros", kind: "stat", value: "5.000 – 9.000 €", sub: "SI LA CADENA SE ROMPE" },
  { anchor: "entre 1.500 y 3.000 euros", kind: "stat", value: "1.500 – 3.000 €", sub: "KIT COMPLETO A TIEMPO · ESPECIALISTA" },
  { anchor: "guarda todas las facturas", kind: "caption", text: "GUARDA TODAS LAS FACTURAS" },

  { anchor: "NÚMERO 2: LAND ROVER EVOQUE Y DISCOVERY SPORT", kind: "hook", text: "Nº 2\nEVOQUE Y DISCOVERY SPORT · INGENIUM" },
  { anchor: "con 64 puntos sobre 100", kind: "stat", value: "64 / 100", sub: "LAND ROVER · ÚLTIMA MARCA OCU 2026" },
  { anchor: "el Juzgado de Primera Instancia número 5 de Gandía", kind: "caption", text: "SENTENCIA 2023 · JUZGADO Nº 5 DE GANDÍA" },
  { anchor: "entre 1.200 y 2.000 euros", kind: "stat", value: "1.200 – 2.000 €", sub: "CADENA INGENIUM · REPARADA A TIEMPO" },
  { anchor: "evita sobre todo las unidades de 2015 a 2018", kind: "caption", text: "EVITA 2015-2018 · DIÉSEL INGENIUM" },

  { anchor: "NÚMERO 1: TESLA MODEL Y Y MODEL 3", kind: "hook", text: "Nº 1\nTESLA MODEL Y Y MODEL 3" },
  { anchor: "con un 17,3 por ciento de defectos significativos", kind: "stat", value: "17,3 %", sub: "MODEL Y · EL PEOR DE 110 MODELOS" },
  { anchor: "El Model 3, un 13,1 por ciento", kind: "stat", value: "13,1 %", sub: "TESLA MODEL 3 · 2-3 AÑOS" },
  { anchor: "El Mini Cooper S,E, un 3,5 por ciento", kind: "stat", value: "3,5 %", sub: "MINI COOPER SE · EL MEJOR ELÉCTRICO DEL TÜV" },
  { anchor: "con 2.528 unidades", kind: "stat", value: "2.528", sub: "TESLA MODEL 3 · Nº1 EN ESPAÑA EN SEPTIEMBRE" },
  { anchor: "la suspensión y los ejes, los discos de freno y la iluminación", kind: "caption", text: "SUSPENSIÓN · DISCOS DE FRENO · ILUMINACIÓN" },

  { anchor: "CÓMO COMPRAR UN COCHE DE SEGUNDA MANO SIN ARRUINARTE", kind: "hook", text: "CÓMO COMPRAR UN USADO\nSIN ARRUINARTE" },
  { anchor: "Una: el código exacto del motor y la fecha de fabricación", kind: "caption", text: "1 · CÓDIGO DE MOTOR Y FECHA DE FABRICACIÓN" },
  { anchor: "Dos: campañas y operaciones técnicas del fabricante", kind: "caption", text: "2 · CAMPAÑAS DEL FABRICANTE (POR BASTIDOR)" },
  { anchor: "Tres: el arranque en frío, con el capó abierto", kind: "caption", text: "3 · ARRANQUE EN FRÍO CON EL CAPÓ ABIERTO" },
  { anchor: "Cuatro: el aceite", kind: "caption", text: "4 · NIVEL Y CONSUMO DE ACEITE" },
  { anchor: "Cinco: el historial de mantenimiento con facturas", kind: "caption", text: "5 · HISTORIAL CON FACTURAS" },
  { anchor: "Seis: el informe del vehículo y el historial de la ITV", kind: "caption", text: "6 · INFORME DEL VEHÍCULO E HISTORIAL ITV" },
  { anchor: "Siete: lector de diagnosis", kind: "caption", text: "7 · LECTOR DE DIAGNOSIS" },
  { anchor: "Ocho: prueba larga", kind: "caption", text: "8 · PRUEBA LARGA (MOTOR FRÍO Y CALIENTE)" },
  { anchor: "Nueve: revisión por un taller independiente", kind: "caption", text: "9 · REVISIÓN EN UN TALLER INDEPENDIENTE" },
  { anchor: "Y diez: el colchón", kind: "caption", text: "10 · COLCHÓN PARA EL PRIMER AÑO" },
  { anchor: "Si el precio parece demasiado bueno", kind: "caption", text: "SI EL PRECIO PARECE DEMASIADO BUENO, DESCONFÍA" },

  { anchor: "¿Y QUÉ COMPRO ENTONCES? LAS ALTERNATIVAS", kind: "hook", text: "¿Y QUÉ COMPRO ENTONCES?\nLAS ALTERNATIVAS CON MEJORES DATOS" },
  { anchor: "mira el Mazda 2", kind: "caption", text: "ALTERNATIVA: MAZDA 2" },

  { anchor: "CONCLUSIÓN: LA FIABILIDAD NO ESTÁ EN LA MARCA", kind: "hook", text: "LA FIABILIDAD NO ESTÁ EN LA MARCA\nESTÁ EN LOS DETALLES" },
  { anchor: "desconfía del chollo, investiga el motor y no te enamores del anuncio", kind: "caption", text: "DESCONFÍA DEL CHOLLO · INVESTIGA EL MOTOR" },
  { anchor: "LLAMADA A LA ACCIÓN", kind: "hook", text: "¿TIENES UNO DE ESTOS 10?\nCUÉNTALO EN LOS COMENTARIOS" },
  { anchor: "Suscríbete para no perderte los próximos análisis", kind: "hook", text: "SUSCRÍBETE" },
];


// PINS: imagen del MODELO exacto anclada a donde se menciona.
const PINS = [];

// ENTIDADES: de qué se habla en cada momento -> qué material poner. `videos` = claves marca-<key>.mp4
// (public/assets/yt-usados). Sin vídeo -> IMÁGENES del modelo por `query` (Wikimedia/SerpAPI).
const ENTITIES = [
  { key: "general", label: "", query: "", videos: ["smart", "smartb", "puretech", "puretechb", "ceed", "qashqai", "qashqaib", "duster", "dusterb", "golf", "golfb", "a4", "a4b", "bmw320", "bmw320b", "evoque", "evoqueb", "modely", "modelyb", "stock"], anchors: [] },
  // con vídeo propio
  { key: "smart", label: "", query: "Smart fortwo 2017", videos: ["smart", "smartb"], imgEvery: 4, anchors: ["ForTwo"] },
  { key: "puretech", label: "", query: "Peugeot 2008 2015", videos: ["puretech", "puretechb"], imgEvery: 4, anchors: ["PureTech", "Peugeot 2008"] },
  { key: "ceed", label: "", query: "Kia Ceed 2011", videos: ["ceed"], imgEvery: 4, anchors: ["Kia Ceed", "Ceed"] },
  { key: "qashqai", label: "", query: "Nissan Qashqai 2015", videos: ["qashqai", "qashqaib"], imgEvery: 4, anchors: ["Cashcai"] },
  { key: "duster", label: "", query: "Dacia Duster 2015", videos: ["duster", "dusterb"], imgEvery: 4, anchors: ["Duster"] },
  { key: "golf", label: "", query: "Volkswagen Golf VI 2012", videos: ["golf", "golfb"], imgEvery: 4, anchors: ["Golf"] },
  { key: "a4", label: "", query: "Audi A4 B8 2010", videos: ["a4", "a4b"], imgEvery: 4, anchors: ["Audi A4"] },
  { key: "bmw320", label: "", query: "BMW 320d E90", videos: ["bmw320", "bmw320b"], imgEvery: 4, anchors: ["tres veinte d", "n,47"] },
  { key: "evoque", label: "", query: "Range Rover Evoque 2016", videos: ["evoque", "evoqueb"], imgEvery: 4, anchors: ["Evoque"] },
  { key: "modely", label: "", query: "Tesla Model Y", videos: ["modely", "modelyb"], imgEvery: 4, anchors: ["Tesla Model Y", "Model Y"] },
  // solo imagen (el 2º modelo de cada pareja y las alternativas)
  { key: "forfour", label: "", query: "Smart forfour 2017", videos: [], anchors: ["ForFour"] },
  { key: "p208", label: "", query: "Peugeot 208 2015", videos: [], anchors: ["Peugeot 208"] },
  { key: "c3", label: "", query: "Citroën C3 2018", videos: [], anchors: ["Citroën C3"] },
  { key: "i20", label: "", query: "Hyundai i20 2012", videos: [], anchors: ["Hyundai i20", "el i20"] },
  { key: "juke", label: "", query: "Nissan Juke 2014", videos: [], anchors: ["Juke"] },
  { key: "leon", label: "", query: "Seat Leon 2012", videos: [], anchors: ["el León", "un León"] },
  { key: "a5", label: "", query: "Audi A5 2010", videos: [], anchors: ["el A5", "A5 con"] },
  { key: "bmw520", label: "", query: "BMW 520d F10", videos: [], anchors: ["cinco veinte d"] },
  { key: "discsport", label: "", query: "Land Rover Discovery Sport 2016", videos: [], anchors: ["Discovery Sport con"] },
  { key: "model3", label: "", query: "Tesla Model 3 2019", videos: [], anchors: ["Tesla Model 3", "El Model 3"] },
  { key: "mini", label: "", query: "Mini Cooper SE", videos: [], anchors: ["Mini Cooper S,E"] },
  { key: "fiat500e", label: "", query: "Fiat 500e 2021", videos: [], anchors: ["Fiat 500e"] },
  { key: "q4", label: "", query: "Audi Q4 e-tron", videos: [], anchors: ["Audi Q4 e-tron"] },
  { key: "id3", label: "", query: "Volkswagen ID.3", videos: [], anchors: ["Volkswagen ID.3"] },
  { key: "mazda2", label: "", query: "Mazda 2 2019", videos: [], anchors: ["Mazda 2"] },
  { key: "yaris", label: "", query: "Toyota Yaris Hybrid 2018", videos: [], anchors: ["Toyota Yaris Hybrid"] },
  { key: "vitara", label: "", query: "Suzuki Vitara 2018", videos: [], anchors: ["Suzuki Vitara"] },
  { key: "stonic", label: "", query: "Kia Stonic 2020", videos: [], anchors: ["Kia Stonic"] },
  { key: "auris", label: "", query: "Toyota Auris Hybrid 2015", videos: [], anchors: ["Toyota Auris"] },
  { key: "civic", label: "", query: "Honda Civic 1.6 i-DTEC 2015", videos: [], anchors: ["Honda Civic"] },
  { key: "lexus", label: "", query: "Lexus NX 300h", videos: [], anchors: ["Lexus NX"] },
  { key: "merc", label: "", query: "Mercedes-Benz E-Class W212", videos: [], anchors: ["un Mercedes con el motor"] },
  { key: "cx5", label: "", query: "Mazda CX-5 2016", videos: [], anchors: ["Mazda CX-5"] },
  { key: "chr", label: "", query: "Toyota C-HR 2018", videos: [], anchors: ["Toyota C-HR"] },
  { key: "cierre", label: "", query: "", videos: [], anchors: [] },
];


// SECCIONES: cada tramo tiene un modelo principal con CLIP propio.
const SECTIONS = [
  { anchor: "Un coche de dos años", primary: "modely" },
  { anchor: "ANTES DE EMPEZAR: DE DÓNDE SALEN LOS DATOS", primary: "general" },
  { anchor: "NÚMERO 10: SMART FORTWO Y FORFOUR", primary: "smart" },
  { anchor: "NÚMERO 9: PEUGEOT 208 / 2008 Y CITROËN C3", primary: "puretech" },
  { anchor: "NÚMERO 8: HYUNDAI I20 Y KIA CEED", primary: "ceed" },
  { anchor: "NÚMERO 7: NISSAN CASHCAI Y JUKE", primary: "qashqai" },
  { anchor: "NÚMERO 6: DACIA DUSTER", primary: "duster" },
  { anchor: "NÚMERO 5: VOLKSWAGEN GOLF Y SEAT LEÓN", primary: "golf" },
  { anchor: "NÚMERO 4: AUDI A4 Y A5", primary: "a4" },
  { anchor: "NÚMERO 3: BMW 320D Y 520D", primary: "bmw320" },
  { anchor: "NÚMERO 2: LAND ROVER EVOQUE Y DISCOVERY SPORT", primary: "evoque" },
  { anchor: "NÚMERO 1: TESLA MODEL Y Y MODEL 3", primary: "modely" },
  { anchor: "CÓMO COMPRAR UN COCHE DE SEGUNDA MANO SIN ARRUINARTE", primary: "general" },
  { anchor: "¿Y QUÉ COMPRO ENTONCES? LAS ALTERNATIVAS", primary: "general" },
  { anchor: "CONCLUSIÓN: LA FIABILIDAD NO ESTÁ EN LA MARCA", primary: "general" },
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


// Motion graphics (VÍDEO 16): etiqueta "NO" + modelo/motor durante cada sección y barra de capítulos.
// La etiqueta entra DESPUÉS de la cartela de la sección (+2.8s).
const TAGS = [
  { anchor: "NÚMERO 10: SMART FORTWO Y FORFOUR", end: "NÚMERO 9: PEUGEOT", code: "SMART FORTWO / FORFOUR", name: "ADAC 2016-19 · 20-27 averías/1.000", verdict: "no" },
  { anchor: "NÚMERO 9: PEUGEOT", end: "NÚMERO 8: HYUNDAI", code: "208/2008 · C3 1.2 PURETECH", name: "Correa en baño de aceite", verdict: "no" },
  { anchor: "NÚMERO 8: HYUNDAI", end: "NÚMERO 7: NISSAN", code: "KIA CEED / HYUNDAI I20", name: "2009-2014 · batería y arranque", verdict: "no" },
  { anchor: "NÚMERO 7: NISSAN", end: "NÚMERO 6: DACIA", code: "QASHQAI / JUKE 1.2 DIG-T", name: "Cadena de distribución", verdict: "no" },
  { anchor: "NÚMERO 6: DACIA", end: "NÚMERO 5: VOLKSWAGEN", code: "DACIA DUSTER 2010-2018", name: "TÜV: 23,5 % a los 6-7 años", verdict: "no" },
  { anchor: "NÚMERO 5: VOLKSWAGEN", end: "NÚMERO 4: AUDI", code: "GOLF / LEÓN 1.2 · 1.4 TSI", name: "Primeras series (EA111)", verdict: "no" },
  { anchor: "NÚMERO 4: AUDI", end: "NÚMERO 3: BMW", code: "AUDI A4 / A5 2.0 TFSI", name: "2008-2012 · consumo de aceite", verdict: "no" },
  { anchor: "NÚMERO 3: BMW", end: "NÚMERO 2: LAND ROVER", code: "BMW 320d / 520d N47", name: "2007-2014 · cadena trasera", verdict: "no" },
  { anchor: "NÚMERO 2: LAND ROVER", end: "NÚMERO 1: TESLA", code: "EVOQUE / DISCOVERY SPORT", name: "Ingenium · OCU 64/100", verdict: "no" },
  { anchor: "NÚMERO 1: TESLA", end: "CÓMO COMPRAR UN COCHE DE SEGUNDA MANO", code: "TESLA MODEL Y / MODEL 3", name: "TÜV 2026: 17,3 % / 13,1 %", verdict: "no" },
];
const CHAPTERS = [
  { anchor: "Un coche de dos años", label: "El dato que lo cambia todo" },
  { anchor: "ANTES DE EMPEZAR: DE DÓNDE SALEN LOS DATOS", label: "De dónde salen los datos" },
  { anchor: "NÚMERO 10: SMART FORTWO Y FORFOUR", label: "10 · Smart ForTwo y ForFour" },
  { anchor: "NÚMERO 9: PEUGEOT 208 / 2008 Y CITROËN C3", label: "9 · Peugeot 208/2008 PureTech" },
  { anchor: "NÚMERO 8: HYUNDAI I20 Y KIA CEED", label: "8 · Hyundai i20 y Kia Ceed" },
  { anchor: "NÚMERO 7: NISSAN CASHCAI Y JUKE", label: "7 · Nissan Qashqai y Juke" },
  { anchor: "NÚMERO 6: DACIA DUSTER", label: "6 · Dacia Duster" },
  { anchor: "NÚMERO 5: VOLKSWAGEN GOLF Y SEAT LEÓN", label: "5 · Golf y León TSI" },
  { anchor: "NÚMERO 4: AUDI A4 Y A5", label: "4 · Audi A4 y A5 TFSI" },
  { anchor: "NÚMERO 3: BMW 320D Y 520D", label: "3 · BMW 320d y 520d" },
  { anchor: "NÚMERO 2: LAND ROVER EVOQUE Y DISCOVERY SPORT", label: "2 · Evoque y Discovery Sport" },
  { anchor: "NÚMERO 1: TESLA MODEL Y Y MODEL 3", label: "1 · Tesla Model Y y Model 3" },
  { anchor: "CÓMO COMPRAR UN COCHE DE SEGUNDA MANO SIN ARRUINARTE", label: "Cómo comprar sin arruinarte" },
  { anchor: "¿Y QUÉ COMPRO ENTONCES? LAS ALTERNATIVAS", label: "Qué comprar en su lugar" },
  { anchor: "CONCLUSIÓN: LA FIABILIDAD NO ESTÁ EN LA MARCA", label: "Conclusión" },
];

// Reglas por clip (yt-usados): se rellenan tras revisar cada clip (presentador/rótulos/logos de otro canal).
const CLIP_RULES = {
  // m0/m1 = margen inicial/final (los walkarounds empiezan con el exterior: NO saltar 45 s).
  // skip = presentador, rótulos/capturas de otro canal, tramos corruptos o motor equivocado (TDI).
  "yt-usados": {
    smart: { m0: 0, m1: 8 }, puretech: { m0: 0, m1: 8 }, a4: { m0: 0, m1: 8 }, golf: { m0: 0, m1: 8 }, qashqai: { m0: 0, m1: 8 },
    bmw320: { m0: 0, m1: 8, skip: [[535, 641]] },
    modely: { m0: 0, m1: 8, skip: [[880, 907]] },
    evoque: { m0: 0, m1: 8, skip: [[0, 6], [18, 30], [662, 682], [975, 990], [1004, 1013]] },
    duster: { m0: 0, m1: 8, skip: [[205, 222], [655, 687]] },
    smartb: { m0: 0, m1: 8, skip: [[0, 10], [22, 38]] },
    puretechb: { m0: 0, m1: 8, skip: [[0, 10]] }, ceed: { m0: 0, m1: 8 }, qashqaib: { m0: 0, m1: 8 }, modelyb: { m0: 0, m1: 8 },
    dusterb: { m0: 0, m1: 8, skip: [[20, 68], [452, 501]] },
    evoqueb: { m0: 0, m1: 8, skip: [[55, 79], [83, 88], [94, 109], [115, 121], [124, 130], [139, 145], [151, 166], [170, 175], [182, 206], [800, 832]] },
    a4b: { m0: 0, m1: 8, skip: [[798, 810]] },
    golfb: { m0: 0, m1: 8, skip: [[748, 783]] },
    bmw320b: { m0: 0, m1: 8, skip: [[0, 10], [18, 36], [72, 84], [96, 126], [384, 421]] },
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
