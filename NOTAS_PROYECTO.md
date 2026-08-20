# NOTAS DEL PROYECTO — Car Channel Editor

> Documento de traspaso. Si abres un chat nuevo, **lee esto primero**: resume
> qué es el proyecto, cómo funciona el pipeline nuevo y —MUY IMPORTANTE— las
> **reglas y preferencias del cliente** que hay que respetar sí o sí.
> Última actualización: 2026-08-04.

## CÓMO CONTINUAR EN UN CHAT NUEVO (leer primero)
1. Abre Claude Code en la carpeta `C:\Users\aleja\Desktop\car-channel-editor`.
   Mi memoria persistente ya carga sola; además LEE ESTE ARCHIVO entero.
2. Estado ahora mismo (2026-08-12): **VÍDEO 3 TERMINADO (v2, clips propios)** →
   `out/MEJORES MOTORES DE CADA MARCA.mp4` (23:24, 733 MB, 1080p). Documental de
   motor fiable por marca: Toyota, Honda, Mazda, VW, BMW, Mercedes, Hyundai/Kia,
   Renault, Ford, Subaru. VÍDEO 1 y 2 también en `out/`.
   - **10/10 marcas en VÍDEO real** (incl. Hyundai/Kia y Renault). TODOS los clips
     son PROPIOS de este vídeo, descargados frescos en HD a `public/assets/yt-motores/`
     (regla del cliente: no reutilizar clips de otros vídeos). El PO Token de
     YouTube quedó RESUELTO (ver sección abajo). Intro/cierre rotan las 12 marcas.
   - **Timing CALIBRADO con Whisper** (anti-drift): cada marca/stat cae sobre su
     tramo hablado real (antes había ~37s de deriva → salía la marca equivocada).
   - Vídeos NORMALIZADOS a CFR 30fps (evita "no frame found" de Remotion).
   - **NO REPETIR CLIP** en el mismo vídeo: de-dup global (`usedWin`/`takeUnused`
     en build-video.mjs) → 0 ventanas repetidas (log "clips repetidos: 0"). El mp4
     ENTREGADO se hizo antes de esta regla (tenía 31 repeticiones, sobre todo el
     @45 de cada marca); el cliente pidió dejarlo así. El motor ya cumple la regla
     para los próximos vídeos (config.ts regenerado, pero ese mp4 NO se re-renderizó).
   - Regenerar TODO de cero: `bash scripts/_finish_render.sh` (normaliza + build
     + render). O por pasos: `_transcribe.py` → `YT_SUBDIR=yt-motores build-video`
     → `_normalize.sh` (si hay vídeos nuevos) → `npm run render`.
   - (Hubo v1 con Hyundai/Renault en imágenes y una v2 con drift; ambas sustituidas.)
   - NUEVO en el motor: cada ENTIDAD de marca lleva `videos: [keys...]` y el
     orquestador INTERCALA varios modelos de la misma marca (corolla+camry+rav4+
     landcruiser para Toyota, etc.) → variedad sin romper la regla roja. Anclas =
     CÓDIGOS DE MOTOR (1NZ-FE, B58, K9K...) porque son únicos por marca.
   - El guion venía en PDF: extraído con **pdf-parse v2** (API nueva:
     `new PDFParse({data}).getText()`, no `pdf(buf)`). Se limpiaron los
     marcadores "-- N of 11 --" del PDF (no se narran) para no descuadrar timing.
3. **IMPORTANTE (config por vídeo):** `scripts/build-video.mjs` tiene los arrays
   `ENTITIES`, `OVERLAYS`, `PINS` HARDCODEADOS para el vídeo que se esté montando.
   Ahora contienen los del vídeo 2. Para montar OTRO vídeo hay que reescribir esos
   3 arrays según su guion (marcas/modelos + datos). El guion va en
   `input/guion-completo.txt` (+ `input/titulo.txt`), la voz en `input/narration.mp3`.
4. Flujo de un vídeo nuevo: (a) cliente da guion PDF/txt + voz mp3; (b) extraer
   texto del PDF con pdf-parse (en scratchpad); (c) identificar marcas/modelos y
   BUSCARLE al cliente enlaces de YouTube por marca (`yt-dlp "ytsearchN:..."`);
   (d) el cliente los descarga con un `.bat` tipo `DESCARGAR_MARCAS.bat` a
   `public/assets/youtube/marca-<key>.mp4`; (e) reescribir ENTITIES/OVERLAYS/PINS;
   (f) `node scripts/build-video.mjs` + `npm run render`.
5. Si el render del vídeo 2 se cortó al cerrar el chat: `npm run render` lo rehace.

## Qué es
Pipeline en **Remotion** para montar automáticamente vídeos **horizontales 16:9
(YouTube)** de un canal de coches, **estilo "Auto Wheels"** (listicle/documental
con voz IA): b-roll a pantalla completa como base + textos/datos encima. El
cliente da **guion (texto) + voz (mp3)** y el sistema monta el vídeo.

## Reglas del cliente (INAMOVIBLES)
1. **REGLA ROJA:** en pantalla tiene que verse **de lo que se está hablando**.
   Si el guion nombra un modelo (Golf, T-Roc, Tiguan, Corolla, Mondeo…), tiene
   que aparecer **ESE** modelo, no un coche genérico.
2. **Solo SUV cuando habla de SUV.** Nada de coches deportivos ni escenas random.
   Si no hay clip de SUV, **poner IMÁGENES de SUV** (no clips aleatorios).
3. **Sonido de transición reducido:** NO en cada corte. Solo durante el **primer
   minuto**, y después **solo en datos/números importantes** (stats) y momentos
   clave (hooks).
4. **Ortografía impecable** (tildes, ñ, ¿¡).
5. **Corte de b-roll cada ~3 s** (no monótono, sin repetir clip adyacente).
6. **Estilo framed:** algunos planos van en **tarjeta de esquinas redondeadas
   sobre rejilla** + fondo borroso (como Auto Wheels). Las imágenes también.
7. **Música de fondo:** el cliente la elige aparte (YouTube Audio Library /
   Pixabay). NO incrustarla; se añadiría luego con **ducking**.
8. **Clips con copyright:** NO buscar/descargar yo clips con copyright de otros
   canales. Fuentes legales: Pexels (clips), Wikimedia Commons (imágenes), y
   URLs que aporte el cliente.

## Título del archivo de salida
- El mp4 final se nombra con el TÍTULO del vídeo. Fuentes del título (por orden):
  1) primera línea del guion con formato `TITULO: <título>`, o
  2) el archivo `input/titulo.txt`.
- `build-video.mjs` lo escribe en `out/_titulo.txt`; `render.mjs` (npm run render)
  nombra el mp4 como `out/<título>.mp4`.

## Cómo se monta un vídeo nuevo
1. Poner el guion en texto plano en `input/guion-completo.txt`
   (y opcional `input/script.txt`), y la voz en `input/narration.mp3`.
2. Editar el "plan" dentro de `scripts/build-video.mjs`:
   - `PARTS`: secciones (ancla = subcadena única del guion) + búsquedas de b-roll.
   - `OVERLAYS`: textos/stats/hooks (ancla + contenido).
   - `PINS`: modelos concretos (ancla + modelo/comparativa).
   - `SUV_MODELS`: modelos SUV para el pool de imágenes de relleno.
3. `node scripts/build-video.mjs` → descarga clips (Pexels) e imágenes
   (Wikimedia), calcula tiempos por posición en el guion, y **genera
   `src/config.ts`**.
4. `npx remotion render src/index.ts CarVideo out/video.mp4 --crf=23`
   (render completo ~35-40 min para 17 min de vídeo).
   Validar antes con `--frames=INI-FIN` (tramos) + extraer fotogramas.

## Arquitectura (motor)
- `scripts/build-video.mjs` — ORQUESTADOR. Genera `src/config.ts`. Aquí está el
  "plan" (PARTS/OVERLAYS/PINS). Anclado por posición de texto: como la voz es TTS
  de ritmo casi constante, `tiempo ≈ (índice_en_guion / longitud) * duración`.
- `src/config.ts` — GENERADO, no editar a mano. Contiene `videoConfig` con:
  - `shots[]`: b-roll (clip o imagen), corte cada ~3 s.
  - `overlays[]`: caption / stat / hook, anclados a su segundo.
  - `pins[]`: imagen de modelo concreto (image) o comparativa (duo).
- `src/CarVideo.tsx` — compone 3 pistas: b-roll → pins → overlays + audio.
- `src/aw/` — componentes de estilo Auto Wheels:
  - `Broll.tsx` (clip/imagen, full o framed, sonido de corte condicional)
  - `Caption.tsx` (etiqueta blanca abajo), `Stat.tsx` (dato amarillo + sonido),
  - `HookCard.tsx` (cartela amarilla a pantalla completa), 
  - `PinImage.tsx` (modelo en tarjeta), `DuoPin.tsx` (comparativa 2 modelos).
- `src/theme.ts` — paleta + fuentes (Anton display, Inter/Oswald/Barlow).
- `src/effects/` `src/graphics/` — efectos antiguos (Ken Burns se reutiliza; el
  resto del estilo "Magnate/Vox" quedó descartado a favor de Auto Wheels).

## Biblioteca de clips (flujo fijo acordado)
- Los vídeos descargados de YouTube se GUARDAN en `input/youtube/` y NO se borran:
  son una **biblioteca que crece**. Cada vídeo nuevo el cliente añade 2-3 fuentes
  más → más variedad, menos repetición.
- El orquestador debe **usar automáticamente todo lo que haya en `input/youtube/`**,
  troceándolo en clips (o ventanas virtuales con startFrom) para el b-roll.
- **Etiquetar por modelo** los vídeos que sean de un coche concreto (p.ej. un
  review del T-Roc) para servirlos cuando ese modelo se menciona (regla roja).
- Descarga (la hace el CLIENTE, no yo): `DESCARGAR_VIDEOS_YOUTUBE.bat` en la raíz.
  Usa `yt-dlp.exe` + `cookies.txt` (exportado con extensión "Get cookies.txt
  LOCALLY") + `deno.exe` en PATH (resuelve el "n challenge" de YouTube). Los tres
  archivos están en la raíz del proyecto.

## Canales del cliente
- **"Car Lovers" (@carloversespañol) es el canal PROPIO del cliente** — en español
  y en otros idiomas. Su metraje es reutilizable **sin problema de copyright**. Si
  hay originales, mejor usarlos que re-descargar de YouTube. Los otros canales
  (suvbuzz, 4autowheels, carlyfe1, rsmotors) son de terceros (responsabilidad del
  cliente).

## VÍDEO DE MARCA (la solución buena a la regla roja)
- Los vídeos `public/assets/youtube/marca-<key>.mp4` son b-roll etiquetado de esa
  marca/modelo (`key` = golf, troc, tiguan, corolla, ford, mondeo, insignia, leon…).
- Cuando el guion habla de esa marca, el b-roll usa **ESE vídeo** (no genérico).
  Alias en `brandAlias` (volkswagen→tiguan, toyota→corolla).
- Los que NO tienen vídeo de marca (temas: neumáticos, peatón…) usan **vídeo
  general** + un inserto breve de imagen correcta.
- Para añadir marcas: descargar `marca-<key>.mp4` de un review/walkaround de esa
  marca (busco los enlaces yo con `yt-dlp "ytsearchN:..."`, el cliente descarga
  con un .bat tipo `DESCARGAR_MARCAS.bat`). Clave `<key>` debe coincidir con el
  `key` de la entidad en `ENTITIES`.
- Resultado: VÍDEO real + marca correcta. Es lo que quiere el cliente.

## EMPAREJAMIENTO POR CONTENIDO (base del anterior)
- El orquestador escanea el guion con un diccionario `ENTITIES` (marcas, modelos,
  temas) y en cada tramo donde se menciona algo, pone material de ESO exacto
  (imagen del modelo/marca/tema vía Wikimedia+SerpAPI). Ver `ENTITIES` +
  `activeEntity()` en `build-video.mjs`.
- Cada mención "cubre" de -2s a +8s. Los tramos sin entidad específica usan el
  vídeo genérico de YouTube.
- Si una entidad no tiene material, se lista en `out/_faltantes.txt` y hay que
  avisar al cliente para que pase una URL de vídeo de eso.
- Para tener VÍDEO (no imagen) de una marca/modelo concreto: el cliente descarga
  un vídeo de esa marca y lo etiquetamos (pendiente de automatizar el tagging por
  título de los vídeos de `public/assets/youtube/`).
- NUNCA debe salir una marca/coche que no sea de lo que se habla (p.ej. Mercedes
  cuando se habla de Ford). Es la regla nº1 del cliente.

## B-roll principal = biblioteca de YouTube (NUEVO)
- Si hay vídeos en `public/assets/youtube/`, el orquestador los usa como **b-roll
  principal** (se salta Pexels + imágenes de SUV). Los trocea en **ventanas
  virtuales de 3s** (mismo fichero, distinto `startFrom`) → 11 vídeos ≈ 1700
  ventanas únicas, reuso 1x.
- Los clips de YouTube van SIEMPRE en modo **framed** (tarjeta redondeada sobre
  **fondo negro + rejilla blanca**, estilo "canales top") con recorte sesgado
  hacia arriba (`objectPosition center 42%`) para tapar el texto quemado de la
  fuente. Ver `src/aw/Broll.tsx`.
- Descargar en **1080p** (el `.bat` usa `bv[height<=1080][vcodec^=avc1]`).
- El cliente va dejando 2-3 vídeos nuevos cada vez en la biblioteca (arsenal).
- Música de fondo a -20 dB va incluida (`src/CarVideo.tsx`).

## Fuentes de material (IMPORTANTE)
- **Clips de b-roll:** Pexels API (búsquedas SÓLO "suv ..."). Clave en `.env`.
- **Imágenes de modelo/SUV:** Wikimedia Commons (limpio, CC) PRIMERO, y si faltan
  se completa con **SerpAPI (Google Imágenes)** — clave `SERPAPI_KEY` en `.env`
  (plan gratis 100 búsquedas/mes; por eso se CACHEA en disco y solo busca lo que
  falte). Ver `getWikiImages` + `serpImages` en el orquestador.
- **YouTube: NO se puede automatizar** la descarga. Requiere burlar el anti-bot
  de YouTube con las cookies del usuario → línea que NO se cruza (elusión de
  bot-detection). La API de YouTube tampoco descarga vídeo. Si el cliente quiere
  metraje de YouTube, lo descarga ÉL y deja los `.mp4` en `input/youtube/` y
  nosotros los troceamos. (Aviso dado al cliente.)
- Aviso legal: las imágenes de SerpAPI tienen copyright variado (no CC como
  Wikimedia). Responsabilidad de uso del cliente.

## Assets
- `public/assets/clips/` — clips Pexels (`v-<id>.mp4`).
- `public/assets/img/`   — imágenes de modelo (`img-<modelo>.jpg`, `-<n>.jpg`).
- `public/assets/sfx/`   — glitch.mp3, whoosh.mp3, camera-shutter.mp3.
- `public/assets/audio/narration.mp3` — copia de la voz.
- `.env` → `PEXELS_API_KEY=...` (necesaria para descargar clips).

## Estado actual (2026-08-01)
- Vídeo de ejemplo: "La mayor estafa de los SUVs" (17 min), montado con este
  pipeline. Guion real + voz MiniMax del cliente.
- Funciona: b-roll 3 s SÓLO SUV (búsquedas "suv ..."), + pool de imágenes de SUV
  reales intercaladas 1/6 (relleno garantizado), 10 pins de modelo, 47 datos
  anclados, framed, ortografía, reuso máx ~4×.
- Sonido de transición: solo el primer minuto en los cortes (`shot.sfx`) + en
  cada dato (componente `Stat` lleva su sonido).

## GOTCHA: "No frame found at position" (normalizar b-roll a CFR 30fps)
- Los vídeos de YouTube vienen con frame rates dispares (24, 25, 29.97, 30, 60,
  59.7...). Remotion (compo a 30fps) a veces falla con **"No frame found at
  position"** al hacer seek en fuentes 60fps o con pocos keyframes → el render
  muere a mitad. Le pasó a `marca-mazda3.mp4` (60fps) tras recalibrar.
- SOLUCIÓN (permanente): normalizar TODOS los `marca-*.mp4` a **CFR 30fps con
  keyframe cada segundo** ANTES de renderizar: `bash scripts/_normalize.sh`
  (ffmpeg: `-vf fps=30 -c:v libx264 -crf 21 -g 30 -keyint_min 30 -sc_threshold 0
  -an -movflags +faststart`, reemplaza en sitio). Quita audio (b-roll mudo),
  reduce tamaño y **acelera el render** (seek con keyframe cercano siempre).
- Tras normalizar: re-`build-video` (re-sondea duraciones) y `npm run render`.

## Sincronización voz↔imagen (anti-drift) — CALIBRACIÓN Whisper
- PROBLEMA: el anclado por posición de texto (`timeAt=idx/L*total`) asume ritmo TTS
  perfectamente lineal. En la práctica hay **drift** (hasta ~37s en el vídeo 3):
  la voz dice una marca mientras en pantalla ya se ve la siguiente. Fallo real que
  detectó el cliente ("hablando de Ford Duratec y aparece Subaru").
- SOLUCIÓN: transcribir la narración con Whisper y CALIBRAR `timeAt` con tiempos
  reales (interpolación por tramos posición_texto→segundo_hablado). Pasos:
  1. `python scripts/_transcribe.py` (openai-whisper `base`, ~4 min CPU) →
     genera `out/_align.json` ([{start,end,text}...]). Necesita ffmpeg en PATH
     (hay uno de WinGet: Gyan.FFmpeg).
  2. `YT_SUBDIR=yt-motores node scripts/build-video.mjs` → la función
     `buildTimeAt()` detecta `out/_align.json`, alinea por tripletes de palabras
     y sustituye el tiempo lineal por el CALIBRADO. Log: "[align] N anclas · drift
     máx ≈ Xs -> tiempo CALIBRADO". Si no hay align.json, cae a lineal.
  3. `npm run render`.
- Verificado: cada marca y cada stat caen sobre su tramo hablado real.
- REGENERAR align tras cambiar el guion o la voz (si no, se descalibra).

## YouTube "PO Token" — RESUELTO (descargas HD, setup 2026-08-12)
- Desde ~ago-2026 YouTube exige **GVS PO Token** para 720p/1080p. Sin token,
  `yt-dlp` solo baja 360p; el cliente `android_vr` da **403** a mitad de descarga.
- **SOLUCIÓN MONTADA** (`bgutil-ytdlp-pot-provider`, modo script):
  1. Plugin instalado en el yt-dlp de **Python**: `pip install -U yt-dlp bgutil-ytdlp-pot-provider`.
  2. Generador de token compilado en `C:\Users\aleja\yt-dlp-potoken\server\build\generate_once.js`
     (clonado de GitHub + `npm install` + `npx tsc`).
  3. Descargar con **`python -m yt_dlp`** (NO el .exe) así:
     - **cwd NEUTRO** (p.ej. `%USERPROFILE%`), NO la carpeta del proyecto: si bgutil
       encuentra `deno.exe` en el cwd/PATH intenta compilar con deno y **falla por
       timeout de 15s**. Desde cwd neutro usa **node** (rápido).
     - Pasar el n-challenge a yt-dlp con deno por ruta:
       `--js-runtimes "deno:C:/Users/aleja/Desktop/car-channel-editor/deno.exe"`.
     - `--extractor-args "youtubepot-bgutilscript:script_path=<...>/generate_once.js"`.
  - Lo hace todo `DESCARGAR_MARCAS_MOTORES.bat` (ya configurado). Resultado
    probado: 1080p (fmt 137) sin 403, ~250 MB en ~20 s.
- Verificar formatos: `python -m yt_dlp -F --cookies cookies.txt --extractor-args "youtubepot-bgutilscript:script_path=<...>" <url>` → deben salir 136/137 sin aviso de PO Token.

## Aislamiento de clips POR VÍDEO (regla del cliente: no reutilizar)
- Regla del cliente: **cada vídeo con SUS PROPIOS clips**, sin reutilizar los de
  otros vídeos. Por eso el vídeo 3 usa carpeta propia `public/assets/yt-motores/`.
- `build-video.mjs` lee `YT_DIR = public/assets/<YT_SUBDIR>` (var. de entorno
  `YT_SUBDIR`, por defecto `youtube`). Para el vídeo 3:
  `YT_SUBDIR=yt-motores node scripts/build-video.mjs`.
- La carpeta lleva SOLO `marca-<key>.mp4` (sin `yt-*` generales): el intro/cierre
  toman el mix de vídeos de marca del propio vídeo (fallback a ytWindows), así
  NADA es reutilizado. Keys usados: toyotacorolla, hondacivic, mazda3, vwgolf,
  bmw340i, mercedeseclass, fordmondeo, subaruforester, hyundaii30, kiaceed,
  renaultmegane, renaultclio (coinciden con `videos:` de cada ENTIDAD).

## GOTCHA importante: Wikimedia rate-limit
- Descargar muchas imágenes seguidas de Wikimedia (thumbs u originales) acaba en
  **HTTP 429** (bloqueo temporal de IP). Por eso `getWikiImages` **reutiliza
  primero lo que ya hay en disco** (`public/assets/img/img-<slug>.jpg` y
  `-<n>.jpg`) SIN buscar → determinista y a prueba de 429. Solo descarga lo que
  falte. Si añades modelos nuevos y fallan por 429, espera un rato o reintenta;
  una vez en disco, ya se reutilizan siempre.
- `SUV_MODELS` y los modelos de `PINS` deben tener su imagen en disco para ser
  fiables.

## Herramientas/entorno
- Node en `C:\Program Files\nodejs` (a veces hay que anteponerlo al PATH).
- `npx remotion ffmpeg` = ffmpeg (build mínima: sin filtros `scale/tile/afade`).
- `yt-dlp.exe` está en la carpeta scratchpad de sesión (para analizar
  referencias, no para incrustar copyright).
- Créditos: las imágenes de Wikimedia son CC-BY-SA → hay que atribuir en la
  descripción del vídeo. (Pendiente: generar texto de créditos.)
