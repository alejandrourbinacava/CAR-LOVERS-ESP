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
  { key: "intro", anchor: null, queries: ["suv driving road", "car dealership showroom", "cars on highway traffic", "car keys handover"] },
  { key: "ventas", anchor: "PARTE 1: QUÉ COMPRA ESPAÑA", queries: ["cars parked street city", "car showroom customers", "traffic cars city aerial", "new cars lot dealership"] },
  { key: "fiab", anchor: "PARTE 2: LA FIABILIDAD REAL", queries: ["mechanic checking car engine", "suv driving highway", "car engine bay", "car service garage"] },
  { key: "consumo", anchor: "PARTE 3: CUÁNTO GASTA", queries: ["car fuel gas station", "hybrid car driving city", "car dashboard consumption display", "driving suv road trip"] },
  { key: "reventa", anchor: "PARTE 4: PRECIO DE COMPRA", queries: ["car dealership handshake", "person signing car contract", "calculator money car", "used car lot"] },
  { key: "ayudas", anchor: "PARTE 5: EL PLAN AUTO PLUS", queries: ["electric car charging", "ev charging home", "electric suv driving", "charging station cars"] },
  { key: "novedades", anchor: "PARTE 6: LO QUE LLEGA EN 2027", queries: ["new suv unveiling", "car factory production line", "electric suv driving road", "suv driving countryside"] },
  { key: "veredicto", anchor: "PARTE 7: EL VEREDICTO", queries: ["family suv driving", "couple buying car", "suv highway sunset", "car keys handover"] },
  { key: "cierre", anchor: "CONCLUSIÓN: COMPRA CON DATOS", queries: ["suv driving highway sunset", "car dealership showroom", "cars on road traffic", "person choosing car"] },
];


// Vídeo 10: clips reales de modelo (ENTITIES/SECTIONS), no imágenes sticky.
const MODELS = [];

// Modelos SUV para el POOL DE IMAGENES (relleno garantizado de SUV real cuando
// los clips no basten). Se usan como planos de b-roll (tarjeta + Ken Burns).
// Modelos con imagen ya en disco (evita depender de descargas nuevas, que
// Wikimedia esta limitando por IP en esta sesion).
// Vídeo 6 (LSPI) es conceptual: sin pool de imágenes de SUV (serían fuera de tema).
const SUV_MODELS = [];

// VÍDEO 15 — MEJORES SUV PARA COMPRAR EN 2027. Anclas literales de input/guion-completo.txt (= guion-suv.txt).
const OVERLAYS = [
  { anchor: "El segundo SUV más vendido de España", kind: "hook", text: "MG ZS: Nº2 EN VENTAS\nPENÚLTIMA MARCA EN FIABILIDAD" },
  { anchor: "Dieciséis mil setecientas ocho matriculaciones", kind: "stat", value: "16.708", sub: "MATRICULACIONES MG ZS · ENE-SEP 2026" },
  { anchor: "con 72 puntos sobre 100", kind: "stat", value: "72 / 100", sub: "MG · PENÚLTIMA EN FIABILIDAD (OCU 2026)" },
  { anchor: "Solo por delante de Land Rover", kind: "caption", text: "SOLO POR DELANTE DE LAND ROVER" },
  { anchor: "el SUV más vendido no es el mejor para ti", kind: "caption", text: "EL MÁS VENDIDO ≠ EL MEJOR PARA TI" },
  { anchor: "hay un SUV muy popular que está a punto de cambiar de generación", kind: "caption", text: "⚠ UN SUV POPULAR CAMBIA DE GENERACIÓN" },
  { anchor: "PARTE 1: QUÉ COMPRA ESPAÑA", kind: "hook", text: "PARTE 1\nQUÉ COMPRA ESPAÑA" },
  { anchor: "España ha matriculado 912.059 turismos", kind: "stat", value: "912.059", sub: "TURISMOS MATRICULADOS · ENE-SEP 2026" },
  { anchor: "el 64,3 por ciento del mercado", kind: "stat", value: "64,3 %", sub: "DEL MERCADO SON SUV" },
  { anchor: "En primer lugar, el Toyota c,h,r", kind: "caption", text: "1º TOYOTA C-HR · 18.051" },
  { anchor: "En segundo lugar, el m,g z,s", kind: "caption", text: "2º MG ZS · 16.708" },
  { anchor: "En tercer lugar, el Seat Arona", kind: "caption", text: "3º SEAT ARONA · 16.406" },
  { anchor: "Y en cuarto lugar, el Toyota Yaris Cross", kind: "caption", text: "4º TOYOTA YARIS CROSS · 15.738" },
  { anchor: "Completan el grupo de cabeza", kind: "caption", text: "5º 2008 · 6º TUCSON · 7º QASHQAI · 8º CAPTUR · 9º T-ROC · 10º ATTO 2" },
  { anchor: "Toyota coloca dos modelos entre los cuatro primeros", kind: "caption", text: "TOYOTA: 2 MODELOS EN EL TOP 4" },
  { anchor: "Las ventas del m,g z,s caen un 13,2 por ciento", kind: "stat", value: "-13,2 %", sub: "VENTAS MG ZS vs 2025" },
  { anchor: "el coche más vendido de todo el país fue el Tesla Model 3", kind: "stat", value: "2.528", sub: "TESLA MODEL 3 · Nº1 EN SEPTIEMBRE" },
  { anchor: "PARTE 2: LA FIABILIDAD REAL", kind: "hook", text: "PARTE 2\nLA FIABILIDAD REAL" },
  { anchor: "La ocu 2026 se basa en la experiencia de 85.590 conductores", kind: "stat", value: "85.590", sub: "CONDUCTORES · 10 PAÍSES · OCU 2026" },
  { anchor: "no te fíes solo de la marca", kind: "caption", text: "MIRA EL MODELO Y EL MOTOR, NO SOLO LA MARCA" },
  { anchor: "Lexus lidera con 93 puntos", kind: "stat", value: "93 / 100", sub: "LEXUS · LA MARCA MÁS FIABLE" },
  { anchor: "Land Rover con 64 y m,g con 72", kind: "caption", text: "LAND ROVER 64 · MG 72" },
  { anchor: "Es el líder de los SUV grandes, con 96 puntos", kind: "stat", value: "96 / 100", sub: "TOYOTA RAV4 HÍBRIDO · LÍDER SUV GRANDE" },
  { anchor: "Otros 96 puntos", kind: "stat", value: "96 / 100", sub: "SUZUKI VITARA 1.5 MHEV · SUV PEQUEÑO" },
  { anchor: "Además, Kia da siete años de garantía", kind: "stat", value: "7 AÑOS", sub: "DE GARANTÍA KIA" },
  { anchor: "96 puntos y líder de los eléctricos medianos", kind: "stat", value: "96 / 100", sub: "KIA NIRO EV · LÍDER ELÉCTRICOS MEDIANOS" },
  { anchor: "Audi, como marca, está en una posición intermedia con 84 puntos", kind: "stat", value: "84 → 96", sub: "AUDI (MARCA) vs Q2 1.5 TSI" },
  { anchor: "Y fíjate en quién no está en esta lista de excelencia", kind: "caption", text: "EL MG ZS NO ESTÁ EN LA LISTA" },
  { anchor: "los 96 puntos son de la generación anterior", kind: "caption", text: "C-HR: LOS 96 PUNTOS SON DE LA GENERACIÓN 2016-2023" },
  { anchor: "PARTE 3: CUÁNTO GASTA", kind: "hook", text: "PARTE 3\nCUÁNTO GASTA UN SUV HÍBRIDO" },
  { anchor: "Lo que importa es el consumo real", kind: "caption", text: "CONSUMO REAL, NO EL DEL FOLLETO" },
  { anchor: "El Toyota Yaris Cross se mueve entre 4,1 y 4,4", kind: "stat", value: "4,1 – 4,4 L", sub: "YARIS CROSS HÍBRIDO · /100 KM REALES" },
  { anchor: "El Hyundai Kona híbrido, entre 3,9 y 4,6", kind: "stat", value: "3,9 – 4,6 L", sub: "HYUNDAI KONA HÍBRIDO" },
  { anchor: "El Toyota c,h,r, unos 5 litros", kind: "stat", value: "≈ 5 L", sub: "TOYOTA C-HR HÍBRIDO" },
  { anchor: "El Renault Captur E-Tech, entre 4,7 y 5,0", kind: "stat", value: "4,7 – 5,0 L", sub: "RENAULT CAPTUR E-TECH" },
  { anchor: "Y el Hyundai Tucson híbrido, entre 5,0 y 5,3", kind: "stat", value: "5,0 – 5,3 L", sub: "HYUNDAI TUCSON HÍBRIDO" },
  { anchor: "Renault abrió una operación técnica sobre más de 334.000 coches", kind: "stat", value: "334.000", sub: "COCHES · OPERACIÓN TÉCNICA RENAULT E-TECH" },
  { anchor: "A 15.000 kilómetros al año", kind: "stat", value: "+1.000 L", sub: "DE DIFERENCIA EN 8 AÑOS (15.000 KM/AÑO)" },
  { anchor: "PARTE 4: PRECIO DE COMPRA", kind: "hook", text: "PARTE 4\nPRECIO DE COMPRA Y REVENTA" },
  { anchor: "Su precio de lista es de 35.750 euros", kind: "stat", value: "35.750 €", sub: "TOYOTA C-HR 140H · PRECIO DE LISTA" },
  { anchor: "desde unos 28.650 hasta 30.750 euros", kind: "stat", value: "28.650 – 30.750 €", sub: "PRECIO REAL CON DESCUENTOS" },
  { anchor: "nunca pagues el precio de lista", kind: "caption", text: "NUNCA PAGUES EL PRECIO DE LISTA" },
  { anchor: "conserva en torno al 68 por ciento de su valor", kind: "stat", value: "≈ 68 %", sub: "RAV4 HÍBRIDO · VALOR A LOS 3 AÑOS" },
  { anchor: "Has perdido unos 13.000 euros en tres años", kind: "stat", value: "-13.000 €", sub: "EN 3 AÑOS (COCHE DE 40.000 €)" },
  { anchor: "habría perdido 20.000", kind: "stat", value: "-20.000 €", sub: "SI SOLO CONSERVA EL 50 %" },
  { anchor: "el SUV más barato no siempre es el más rentable", kind: "caption", text: "EL MÁS BARATO NO SIEMPRE ES EL MÁS RENTABLE" },
  { anchor: "PARTE 5: EL PLAN AUTO PLUS", kind: "hook", text: "PARTE 5\nEL PLAN AUTO PLUS" },
  { anchor: "hasta 4.500 euros a particulares", kind: "stat", value: "4.500 €", sub: "AYUDA MÁXIMA · ELÉCTRICO PURO" },
  { anchor: "presupuesto de 400 millones", kind: "stat", value: "400 M€", sub: "PRESUPUESTO DEL PLAN" },
  { anchor: "solo los recibes si cumples tres condiciones a la vez", kind: "caption", text: "3 CONDICIONES A LA VEZ" },
  { anchor: "Que su precio esté por debajo de 35.000 euros", kind: "caption", text: "ELÉCTRICO PURO · < 35.000 € · FABRICADO EN EUROPA" },
  { anchor: "Por encima de 45.000 euros antes de impuestos", kind: "stat", value: "+45.000 €", sub: "SIN AYUDA" },
  { anchor: "descuento mínimo de 1.000 euros", kind: "stat", value: "1.000 €", sub: "DESCUENTO MÍNIMO DEL CONCESIONARIO" },
  { anchor: "los híbridos no enchufables, como el c,h,r", kind: "caption", text: "HÍBRIDOS NO ENCHUFABLES: SIN AYUDA" },
  { anchor: "PARTE 6: LO QUE LLEGA EN 2027", kind: "hook", text: "PARTE 6\nLO QUE LLEGA EN 2027" },
  { anchor: "El nuevo Hyundai Tucson. Es la novedad", kind: "hook", text: "NUEVO HYUNDAI TUCSON\n5ª GENERACIÓN" },
  { anchor: "crece hasta 4,70 metros", kind: "stat", value: "4,70 M", sub: "+19 CM RESPECTO AL ACTUAL" },
  { anchor: "pantalla grande de 17 pulgadas", kind: "stat", value: "17 PULG.", sub: "PANTALLA DEL NUEVO TUCSON" },
  { anchor: "desaparece el diésel", kind: "caption", text: "ADIÓS AL DIÉSEL: GASOLINA · HÍBRIDO · ENCHUFABLE" },
  { anchor: "A los concesionarios españoles a principios de 2027", kind: "caption", text: "EN CONCESIONARIOS: PRINCIPIOS DE 2027" },
  { anchor: "Comprar un coche justo antes de un cambio de generación sale peor", kind: "hook", text: "⚠ NO COMPRES JUSTO ANTES\nDEL CAMBIO DE GENERACIÓN" },
  { anchor: "descuentos que superan los 7.000 euros", kind: "stat", value: "-7.000 €", sub: "DESCUENTO DEL TUCSON ACTUAL SOBRE TARIFA" },
  { anchor: "El peor error es comprar el actual a precio casi de lista", kind: "caption", text: "EL PEOR ERROR: EL ACTUAL A PRECIO DE LISTA" },
  { anchor: "El Skoda Epiq", kind: "caption", text: "SKODA EPIQ · ELÉCTRICO URBANO · ≈ 25.000 €" },
  { anchor: "El nuevo Nissan Juke, que será solo eléctrico", kind: "caption", text: "NISSAN JUKE ELÉCTRICO · PRIMAVERA 2027 · 450 KM" },
  { anchor: "El Omoda 4, un SUV compacto chino", kind: "caption", text: "OMODA 4 · 224 CV HÍBRIDO / 211 CV ELÉCTRICO · 1T 2027" },
  { anchor: "de cuarta generación, a finales de 2027", kind: "caption", text: "BMW X1 4ª GENERACIÓN · FINALES DE 2027" },
  { anchor: "Y el Audi cu nueve", kind: "caption", text: "AUDI Q9 · MEDIADOS DE 2027 · 4-7 PLAZAS" },
  { anchor: "No cambies tu compra por una promesa de catálogo", kind: "caption", text: "NO CAMBIES TU COMPRA POR UNA PROMESA DE CATÁLOGO" },
  { anchor: "PARTE 7: EL VEREDICTO", kind: "hook", text: "PARTE 7\nEL VEREDICTO" },
  { anchor: "Si quieres la compra más segura y con mejor reventa", kind: "hook", text: "COMPRA MÁS SEGURA\nTOYOTA RAV4 HÍBRIDO" },
  { anchor: "Si haces sobre todo ciudad y quieres gastar lo mínimo", kind: "hook", text: "CIUDAD Y GASTAR MÍNIMO\nYARIS CROSS / KONA HÍBRIDO" },
  { anchor: "Si buscas fiabilidad al mejor precio", kind: "hook", text: "FIABILIDAD AL MEJOR PRECIO\nVITARA 1.5 MHEV / STONIC 1.0 MHEV" },
  { anchor: "Si puedes cargar en casa y quieres eléctrico", kind: "hook", text: "ELÉCTRICO\nKIA NIRO EV" },
  { anchor: "Si quieres el SUV más vendido del país", kind: "hook", text: "EL MÁS VENDIDO\nTOYOTA C-HR" },
  { anchor: "Si te gusta el Tucson", kind: "hook", text: "TUCSON\nACTUAL CON DESCUENTO O NUEVO ESPERANDO" },
  { anchor: "Y si estás tentado por el m,g z,s", kind: "hook", text: "¿TE TIENTA EL MG ZS?\nPRECIO A CAMBIO DE INCERTIDUMBRE" },
  { anchor: "CONCLUSIÓN: COMPRA CON DATOS", kind: "hook", text: "COMPRA CON DATOS\nNO CON LA LISTA DE LOS MÁS VENDIDOS" },
  { anchor: "lo más vendido no es lo mejor", kind: "caption", text: "LO MÁS VENDIDO NO ES LO MEJOR" },
  { anchor: "haz cuatro comprobaciones", kind: "caption", text: "4 COMPROBACIONES ANTES DE FIRMAR" },
  { anchor: "Suscríbete para más análisis", kind: "hook", text: "SUSCRÍBETE" },
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
// VÍDEO 13 — 7 COCHES CASI PERFECTOS (OCU): por MODELOS. `videos:[key]` usa el clip
// marca-<key>.mp4 (public/assets/yt-ocu) si existe; si no, cae a IMAGEN por `query`.
const ENTITIES = [
  { key: "general", label: "", query: "", videos: ["cx5", "rav4", "chr", "yariscross", "qashqai", "mgzs", "atto2", "stock"], anchors: [] },
  { key: "chr", label: "", query: "Toyota C-HR 2026", videos: ["chr"], anchors: ["c,h,r"] },
  { key: "mgzs", label: "", query: "MG ZS 2026", videos: ["mgzs"], anchors: ["m,g z,s"] },
  { key: "arona", label: "", query: "Seat Arona 2026", videos: ["arona"], anchors: ["Arona"] },
  { key: "yariscross", label: "", query: "Toyota Yaris Cross 2026", videos: ["yariscross"], anchors: ["Yaris Cross"] },
  { key: "t2008", label: "", query: "Peugeot 2008 2026", videos: ["t2008"], anchors: ["Peugeot 2008"] },
  { key: "tucson", label: "", query: "Hyundai Tucson 2026", videos: ["tucson"], anchors: ["Tucson"] },
  { key: "qashqai", label: "", query: "Nissan Qashqai 2026", videos: ["qashqai"], anchors: ["Qashqai"] },
  { key: "captur", label: "", query: "Renault Captur E-Tech 2026", videos: ["captur"], anchors: ["Captur"] },
  { key: "atto2", label: "", query: "BYD Atto 2 2026", videos: ["atto2"], anchors: ["b,y,d Atto 2", "Atto 2"] },
  { key: "rav4", label: "", query: "Toyota RAV4 hybrid 2026", videos: ["rav4"], anchors: ["Rav cuatro"] },
  { key: "vitara", label: "", query: "Suzuki Vitara 2026", videos: ["vitara"], anchors: ["Vitara"] },
  { key: "stonic", label: "", query: "Kia Stonic 2026", videos: ["stonic"], anchors: ["Stonic"] },
  { key: "niro", label: "", query: "Kia Niro EV 2026", videos: ["niro"], anchors: ["Niro"] },
  { key: "q2", label: "", query: "Audi Q2 2026", videos: ["q2"], anchors: ["Audi cu dos"] },
  { key: "kona", label: "", query: "Hyundai Kona hybrid 2026", videos: ["kona"], anchors: ["Kona"] },
  { key: "electrico", label: "", query: "", videos: ["atto2", "modely"], anchors: [] },
  { key: "cierre", label: "", query: "", videos: [], anchors: [] },
];


// SECCIONES: cada tramo tiene una MARCA principal. Mientras dura la sección, si no
// se menciona explícitamente otra cosa, se muestra el vídeo de ESA marca (no uno
// genérico). anchor = cabecera de sección en el guion. La intro (antes de TOYOTA)
// queda sin principal -> vídeo general.
// VÍDEO 10 — cada sección muestra el CLIP del modelo del que se habla. La sección
// de patrón/lección cae a "cierre" (rotación de todos los modelos).
// Anclas por "COCHE N:" (el prefijo NO cambia aunque el nombre se escriba fonético).
const SECTIONS = [
  { anchor: "El segundo SUV más vendido de España", primary: "mgzs" },
  { anchor: "Este vídeo es una guía completa", primary: "general" },
  { anchor: "PARTE 1: QUÉ COMPRA ESPAÑA", primary: "general" },
  { anchor: "En primer lugar, el Toyota c,h,r", primary: "chr" },
  { anchor: "En segundo lugar, el m,g z,s", primary: "mgzs" },
  { anchor: "En tercer lugar, el Seat Arona", primary: "arona" },
  { anchor: "Y en cuarto lugar, el Toyota Yaris Cross", primary: "yariscross" },
  { anchor: "Completan el grupo de cabeza", primary: "general" },
  { anchor: "Pero hay un dato que casi nadie menciona", primary: "mgzs" },
  { anchor: "Y hay otra curiosidad del último mes", primary: "electrico" },
  { anchor: "PARTE 2: LA FIABILIDAD REAL", primary: "general" },
  { anchor: "El Toyota Rav cuatro híbrido. Es el líder", primary: "rav4" },
  { anchor: "El Suzuki Vitara con motor 1,5", primary: "vitara" },
  { anchor: "El Kia Stonic con motor 1,0", primary: "stonic" },
  { anchor: "El Kia Niro eléctrico. 96 puntos", primary: "niro" },
  { anchor: "Y el Audi cu dos con motor", primary: "q2" },
  { anchor: "Y fíjate en quién no está en esta lista de excelencia", primary: "mgzs" },
  { anchor: "Y hay un matiz más sobre el Toyota c,h,r", primary: "chr" },
  { anchor: "PARTE 3: CUÁNTO GASTA", primary: "general" },
  { anchor: "El Toyota Yaris Cross se mueve entre 4,1 y 4,4", primary: "yariscross" },
  { anchor: "El Hyundai Kona híbrido, entre 3,9 y 4,6", primary: "kona" },
  { anchor: "El Toyota c,h,r, unos 5 litros", primary: "chr" },
  { anchor: "El Renault Captur E-Tech, entre 4,7 y 5,0", primary: "captur" },
  { anchor: "Y el Hyundai Tucson híbrido, entre 5,0 y 5,3", primary: "tucson" },
  { anchor: "Pero atención con el Captur E-Tech", primary: "captur" },
  { anchor: "La conclusión práctica es sencilla", primary: "general" },
  { anchor: "PARTE 4: PRECIO DE COMPRA", primary: "chr" },
  { anchor: "Ahora la otra mitad. ¿Cuánto vale tu coche", primary: "rav4" },
  { anchor: "PARTE 5: EL PLAN AUTO PLUS", primary: "electrico" },
  { anchor: "¿Qué implica esto para tu compra de SUV?", primary: "general" },
  { anchor: "Esto explica por qué el Tesla Model 3", primary: "electrico" },
  { anchor: "PARTE 6: LO QUE LLEGA EN 2027", primary: "general" },
  { anchor: "El nuevo Hyundai Tucson. Es la novedad", primary: "tucson" },
  { anchor: "El resto de novedades de 2027", primary: "general" },
  { anchor: "PARTE 7: EL VEREDICTO", primary: "general" },
  { anchor: "Si quieres la compra más segura y con mejor reventa", primary: "rav4" },
  { anchor: "Si haces sobre todo ciudad y quieres gastar lo mínimo", primary: "yariscross" },
  { anchor: "Si buscas fiabilidad al mejor precio", primary: "vitara" },
  { anchor: "Si puedes cargar en casa y quieres eléctrico", primary: "niro" },
  { anchor: "Si quieres el SUV más vendido del país", primary: "chr" },
  { anchor: "Si te gusta el Tucson", primary: "tucson" },
  { anchor: "Y si estás tentado por el m,g z,s", primary: "mgzs" },
  { anchor: "CONCLUSIÓN: COMPRA CON DATOS", primary: "cierre" },
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
const BLACKLIST_IDS = [26620319, 26620441, 8987271, 3010448, 39839659, 35661513, 6817044, 17854218, 9369898, 27974753, 19728719, 13790663, 4223775, 20693178, 29576552, 39112150, 20156194, 32329376, 20693196, 11785727, 29760618, 34960298];
const seenIds = new Set(BLACKLIST_IDS);

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


// Motion graphics (VÍDEO 14): etiqueta SÍ/NO + código de motor durante cada sección y barra
// de capítulos. La etiqueta entra DESPUÉS de la cartela de la sección (+2.8s).
const TAGS = [
  { anchor: "El Toyota Rav cuatro híbrido. Es el líder", end: "El Suzuki Vitara con motor 1,5", code: "RAV4 HÍBRIDO", name: "OCU 96/100 · SUV grande", verdict: "yes" },
  { anchor: "El Suzuki Vitara con motor 1,5", end: "El Kia Stonic con motor 1,0", code: "VITARA 1.5 MHEV", name: "OCU 96/100 · SUV pequeño", verdict: "yes" },
  { anchor: "El Kia Stonic con motor 1,0", end: "El Kia Niro eléctrico. 96 puntos", code: "STONIC 1.0 MHEV", name: "OCU 96/100 · 7 años garantía", verdict: "yes" },
  { anchor: "El Kia Niro eléctrico. 96 puntos", end: "Y el Audi cu dos con motor", code: "NIRO EV", name: "OCU 96/100 · eléctrico", verdict: "yes" },
  { anchor: "Y el Audi cu dos con motor", end: "Y fíjate en quién no está en esta lista de excelencia", code: "AUDI Q2 1.5 TSI", name: "OCU 96/100 · el tapado", verdict: "yes" },
  { anchor: "Y fíjate en quién no está en esta lista de excelencia", end: "Y hay un matiz más sobre el Toyota c,h,r", code: "MG ZS", name: "Marca MG: 72/100 (OCU)", verdict: "no" },
  { anchor: "Si quieres la compra más segura y con mejor reventa", end: "Si haces sobre todo ciudad y quieres gastar lo mínimo", code: "RAV4 HÍBRIDO", name: "La compra más segura", verdict: "yes" },
  { anchor: "Si haces sobre todo ciudad y quieres gastar lo mínimo", end: "Si buscas fiabilidad al mejor precio", code: "YARIS CROSS", name: "Ciudad · gasto mínimo", verdict: "yes" },
  { anchor: "Si buscas fiabilidad al mejor precio", end: "Si puedes cargar en casa y quieres eléctrico", code: "VITARA / STONIC", name: "Fiabilidad al mejor precio", verdict: "yes" },
  { anchor: "Si puedes cargar en casa y quieres eléctrico", end: "Si quieres el SUV más vendido del país", code: "KIA NIRO EV", name: "El eléctrico a elegir", verdict: "yes" },
  { anchor: "Si quieres el SUV más vendido del país", end: "Si te gusta el Tucson", code: "TOYOTA C-HR", name: "El más vendido · razonable", verdict: "yes" },
  { anchor: "Y si estás tentado por el m,g z,s", end: "CONCLUSIÓN: COMPRA CON DATOS", code: "MG ZS", name: "Precio a cambio de incertidumbre", verdict: "no" },
];
const CHAPTERS = [
  { anchor: "El segundo SUV más vendido de España", label: "La paradoja del MG ZS" },
  { anchor: "PARTE 1: QUÉ COMPRA ESPAÑA", label: "Qué compra España" },
  { anchor: "PARTE 2: LA FIABILIDAD REAL", label: "Fiabilidad OCU" },
  { anchor: "PARTE 3: CUÁNTO GASTA", label: "Consumo real" },
  { anchor: "PARTE 4: PRECIO DE COMPRA", label: "Precio y reventa" },
  { anchor: "PARTE 5: EL PLAN AUTO PLUS", label: "Plan Auto Plus" },
  { anchor: "PARTE 6: LO QUE LLEGA EN 2027", label: "Novedades 2027" },
  { anchor: "PARTE 7: EL VEREDICTO", label: "Veredicto" },
  { anchor: "CONCLUSIÓN: COMPRA CON DATOS", label: "Conclusión" },
];

// Reglas por clip (VÍDEO 14, yt-diesel): `allow` = solo estos tramos [s,e]; `skip` = tramos
// con presentador/rótulos/logos de otro canal que NO deben salir (detectados a mano + script).
const CLIP_RULES = {
  // SUV 2027: tucson = logo "Silent Drives" cada ~110s (13s); qashqai = rótulo inicial + captura de consumo;
  // modely = botón SUBSCRIBE/logo GDrives (~2:50-3:20); cx5 = marca de agua SPEEDHEADS fija (se desenfoca en prep-shots).
  "yt-suv": {
    tucson: { skip: [[0, 16], [107, 124], [223, 240], [331, 348], [439, 457], [548, 565], [664, 681], [772, 786]] },
    qashqai: { skip: [[0, 28], [645, 680]] },
    modely: { skip: [[0, 8], [170, 186], [600, 620], [1196, 1221]] },
    vitara: { skip: [[742, 775]] },
    kona: { skip: [[0, 30], [868, 918]] },
    t2008: { skip: [[0, 16]] },
    niro: { skip: [[76, 90], [120, 134], [312, 330], [448, 464]] },
  },
  "yt-diesel": {
    renault: { allow: [[6, 34], [63, 86], [90, 118]] },
    renault2: { allow: [[2, 155]] },
    renault3: { allow: [[2, 325]] },
    merc: { allow: [[10, 372]] },
    bluehdi: { allow: [[1, 40], [160, 516]] },
    bmw2: { skip: [[105, 135], [636, 652]] },
    vw19: { allow: [[2, 84], [121, 440]] },
    bmw1: { skip: [[0, 50], [76, 90], [131, 142], [149, 161], [202, 215], [231, 242], [244, 256], [264, 274], [310, 321], [361, 373], [516, 526], [531, 544], [559, 582], [587, 599], [603, 614], [625, 637], [641, 650], [656, 669], [696, 709], [737, 750], [766, 782], [785, 812]] },
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
    const margin = shortClip ? Math.min(6, dur * 0.05) : 45;
    const endMargin = shortClip ? 9 : 45;
    const step = shortClip ? 4 : 7;
    const rule = CLIP_RULES[YT_SUBDIR]?.[brand];
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
    if (usingYt && vpool && vpool.length) {
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
