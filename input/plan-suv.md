# PLAN VÍDEO 15 — "Los Mejores SUV Para Comprar en 2027 (Y Los Que Deberías Esperar o Evitar)"

Guion: `input/guion-suv.txt` (SIN las notas finales). Datos y fuentes: `input/datos-suv-2027.md`.
Voz: PENDIENTE (la envía el cliente). YT_SUBDIR = **yt-suv**. Formato mixto: por MODELOS (clip por modelo) + datos.

## Clips en public/assets/yt-suv (marca-<key>.mp4)
Tienen: yariscross, chr, tucson (logo Silent Drives cada ~110s -> skip), cx5 (marca SPEEDHEADS fija -> blur),
qashqai (skip rótulo inicial), rav4, mgzs, atto2, modely (skip botón subscribe). cx5/modely: relleno general.
Faltan (descargas diarias 10/día): arona (enlace Pa9zvqxfacc), niro, vitara, stonic, captur, kona, t2008, q2.
Sin clip -> la ENTIDAD cae a imágenes (Wikimedia/SerpAPI) o a relleno general.

## Al recibir la voz
1. narration.mp3 + `python scripts/_transcribe.py` -> out/_align.json.
2. `cp input/guion-suv.txt input/guion-completo.txt`; quitar las 2 primeras líneas (título + "GANCHO...") si la voz no las lee;
   `printf '<título>' > input/titulo.txt`.
3. `YT_SUBDIR=yt-suv node scripts/build-video.mjs` -> revisar log "ancla no encontrada" y "clips repetidos: 0".
4. `python scripts/prep-shots.py shots-suv 8` (corta y tapa matrículas; CX-5: añadir máscara SPEEDHEADS arriba-dcha).
5. commit+push -> `bash scripts/subir-shots.sh shots-suv shots-suv montar` -> render-shots.yml.
6. QA con mosaicos + paquete YouTube (título, descripción, capítulos, tags).

## Notas de guion a verificar (cliente)
- Se menciona "Tesla Model 3" y solo tenemos clip del Model Y (se usa como eléctrico genérico en Parte 5, NO al nombrar el Model 3).
- Precios concretos (C-HR 35.750/28.650-30.750, RAV4 68 %) vienen de la ficha del cliente; reventa 68-74 % según fuente.
- Fechas/precios de novedades 2027 sin confirmar.
