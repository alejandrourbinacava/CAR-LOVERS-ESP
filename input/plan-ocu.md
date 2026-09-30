# PLAN VÍDEO 13 — "7 Coches CASI PERFECTOS Según la OCU 2026"

Guion: `input/guion-ocu.txt` (raw) / `input/guion-completo.txt` (montaje). Voz: PENDIENTE.
Formato por MODELOS. Título: `input/titulo.txt`. YT_SUBDIR = **yt-ocu**.

## 7 MODELOS (puntuación OCU 2026)
1. Toyota Aygo X Cross (98) · 2. Toyota RAV4 (96) · 3. Toyota C-HR (96) ·
4. Kia Niro EV (96) · 5. Suzuki Vitara (96) · 6. Kia Stonic (96) · 7. Mazda 2 (96).

## build-video.mjs YA aplicado
- ENTITIES (aygo, rav4, chr, niro, vitara, stonic, mazda2, cierre) con videos:[key] +
  query de reserva. C-HR anchor "ce hache erre" (así lo lee la voz).
- SECTIONS por "COCHE N:" + "EL PATRÓN QUE CONECTA A LOS SIETE" (cierre).
- OVERLAYS (26) con puntuaciones (98/100, 96/100, 85.590 conductores, 7 años Kia...).
- PARTS relleno genérico fiabilidad/taller/conducción.

## CLIPS (public/assets/yt-ocu, marca-<key>.mp4)
- rav4: REUTILIZAR "2026 Toyota RAV4 - Full 4K Walkaround" (ya en 4KVD, SIN USAR en V12).
- 6 a descargar (Aygo, C-HR, Niro, Vitara, Stonic, Mazda2). Links dados al cliente.
- Procesar: recortar zona limpia + normalizar 1080p30 no audio; frame-check anti-logo/slate.

## Al recibir la voz + 6 clips
1. narration.mp3 + Whisper -> out/_align.json. 2. renombrar/normalizar 7 clips en yt-ocu.
3. build (YT_SUBDIR=yt-ocu) -> 7 modelos + 0 repetidos + overlays. 4. subir Release
   clips-ocu + render-release.yml. 5. verificar mosaico. 6. paquete YouTube.
