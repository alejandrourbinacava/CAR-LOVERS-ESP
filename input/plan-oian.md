# PLAN VÍDEO 12 — "5 Mejores Coches Para Quienes ODIAN Comprar Coche (2026)"

Guion: `input/guion-oian.txt` (raw) / `input/guion-completo.txt` (montaje). Voz: PENDIENTE.
Formato por MODELOS (como Vídeo 10). Título: `input/titulo.txt`.

## 6 MODELOS (secciones)
1. Dacia Sandero · 2. Toyota Corolla Híbrido · 3. Toyota Yaris Cross Híbrido ·
4. Dacia Jogger · 5. Honda CR-V / Toyota RAV4 Híbrido · +1. Hyundai Tucson Híbrido.

## build-video.mjs YA aplicado
- ENTITIES (sandero, corolla, yariscross, jogger, crv[CR-V/RAV4], tucson, cierre) con
  `videos:[key]` (clip marca-<key>.mp4 en public/assets/yt-oian) y `query` de reserva (imagen).
- SECTIONS por cabecera "COCHE N:" + mención Tucson + "CÓMO ELEGIR" (cierre).
- OVERLAYS (25) con datos: Nº1 ventas, 13.500€, 15 años/250.000km, 4,5 L/100,
  SUV híbrido nº1, 25.900€, 7 plazas, 5 años garantía Hyundai, etc.
- PARTS de relleno genérico (concesionario/conducción/familia).

## DECISIÓN PENDIENTE: material por modelo
- **CLIPS reales** (como Vídeo 10 final): 6 clips limpios marca-{sandero,corolla,yariscross,
  jogger,crv,tucson}.mp4 en public/assets/yt-oian → subir a Release + render-release.yml.
  (los busco/descargo limpios o los baja el cliente).
- **IMÁGENES sticky** (auto, sin descargas): quitar `videos`, deja `query` → SerpAPI/Wikimedia.
  Render por render-pexels.yml.

## Al recibir la voz
1. ¿TTS leyó título/HOOK? -> recortar. 2. narration.mp3 + Whisper -> out/_align.json.
3. build (YT_SUBDIR=yt-oian) -> verificar 6 modelos + 0 repetidos + overlays.
4. commit + push + render. 5. Paquete YouTube.
