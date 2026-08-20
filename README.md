# CAR LOVERS ESP — Montador de vídeos (Remotion)

Pipeline que monta automáticamente vídeos de coches (estilo documental "Auto
Wheels"): b-roll a pantalla completa en tarjeta + textos/datos, a partir de un
**guion (texto)** + **voz (mp3)**. Motor en `scripts/build-video.mjs` (entidades
por marca, overlays anclados, secciones "pegajosas", calibración anti-drift con
Whisper, de-dup de clips, aislamiento por vídeo). Render con Remotion.

> El código está aquí; **los vídeos, la voz, las cookies y las claves NO** (ver
> `.gitignore`). El montaje real necesita esos archivos (localmente o vía secrets).

## Dos formas de montar un vídeo

### A) En la NUBE (GitHub Actions) — no usa tu PC ✅
Ideal cuando tu IP tiene el HD de YouTube frenado: el runner tiene otra IP.

**1. Añade los secrets** (repo → Settings → Secrets and variables → Actions → New):
- `YT_COOKIES` — contenido de un `cookies.txt` **solo de YouTube**. Expórtalo con
  la extensión *"Get cookies.txt LOCALLY"* **estando en youtube.com** (así salen
  pocas líneas; el completo no cabe en un secret de 48 KB). Pega el texto entero.
- `NARRATION_URL` — enlace de **descarga directa** del `narration.mp3` (súbelo a un
  *Release* de este repo, o Drive/Dropbox con enlace directo).
- `PEXELS_API_KEY`, `SERPAPI_KEY` — opcionales (solo si el vídeo usa imágenes de
  relleno; los de vídeo puro no las necesitan).

**2. Prepara el vídeo en el repo** (commit):
- `input/guion-completo.txt` (el guion) e `input/titulo.txt` (título → nombre del mp4).
- El montaje del motor (`ENTITIES`/`OVERLAYS`/`SECTIONS` en `scripts/build-video.mjs`).
- Un manifiesto de clips `scripts/clips-<video>.txt` (líneas `clave URL`).

**3. Lánzalo:** pestaña **Actions** → *"Montar vídeo (nube)"* → **Run workflow**
(elige `subdir` y `manifest`). Al terminar, descarga el **artifact `video-final`**.

### B) En LOCAL (Windows)
1. `DESCARGAR_<video>.bat` (baja clips en HD con el PO Token) → `public/assets/<subdir>/`.
2. Coloca la voz en `input/narration.mp3` y el guion en `input/guion-completo.txt`.
3. `python scripts/_transcribe.py` (calibración) → `out/_align.json`.
4. `YT_SUBDIR=<subdir> node scripts/build-video.mjs` (genera `src/config.ts`).
5. `npm run render` → `out/<título>.mp4`.

## Reglas del cliente (inamovibles)
1. **Regla roja**: en pantalla, el modelo del que se habla.
2. **Cada vídeo con sus propios clips** (carpeta aislada por `YT_SUBDIR`), sin
   reutilizar los de otros vídeos.
3. **No repetir clip** dentro del mismo vídeo (de-dup automático).
4. **Sincronía voz↔imagen** exacta (calibración Whisper).
5. Ortografía impecable, cortes 4-7 s, estilo framed, música a -20/-30 dB.

Más detalle de arquitectura y gotchas en `NOTAS_PROYECTO.md`.

## Aviso sobre descargas en la nube
YouTube vigila más las IP de *datacenter* (las de GitHub Actions). Con las cookies
de YouTube suele funcionar, pero si algún clip falla habrá que reintentar o subir
ese clip a mano. Es experimental para la parte de descarga; el render en nube es
sólido.
