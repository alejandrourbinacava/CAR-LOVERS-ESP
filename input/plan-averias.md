# PLAN VÍDEO 9 — "5 Averías Que el Taller Infla Para Cobrarte el Triple"

Guion: `input/guion-averias.txt`. Voz: PENDIENTE. CONCEPTUAL (como LSPI/Cajas):
b-roll stock Pexels limpio, render nube `render-pexels.yml` (secret PEXELS_API_KEY
ya puesto). Sin modelos ni clips manuales. Ya aplicado en build-video.mjs:

- PARTS: b-roll de taller/mecánico por sección (intro, A1 testigo/diagnóstico,
  A2 escape/FAP, A3 aceite/motor, A4 caja, A5 suspensión, presupuesto/factura,
  taller honesto/apretón de manos, conclusión).
- OVERLAYS (32, verificados): hook "5 AVERÍAS QUE EL TALLER INFLA" + stats
  684 € / 17,9% / 1.000-2.000 € FAP / 20-80 € PCV / 2.000-4.000 € caja /
  RD 1457/1986, y captions de "pregunta clave" por avería + señales de taller honesto.
- MODELS = [] (no aplica).

## Al recibir la voz
1. Comprobar si el TTS leyó el título/HOOK -> si sí, recortar (como en Cajas).
2. narration.mp3 + transcribir Whisper -> out/_align.json (calibración).
3. guion-completo.txt = guion sin las 2 primeras líneas (título + HOOK DE APERTURA).
4. titulo.txt.
5. build (YT_SUBDIR=yt-averias, Pexels) -> verificar 0 repetidos.
6. commit + push + disparar render-pexels.yml (subdir=yt-averias) + vigilar.
