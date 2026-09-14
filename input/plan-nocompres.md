# PLAN VÍDEO 10 — "Coches Que NUNCA Debes Comprar (Modelos y Años)"

Guion: `input/guion-nocompres.txt`. Voz: PENDIENTE. Formato por MODELOS (como la
tier list): imagen STICKY de cada modelo + overlays de año/avería + b-roll coche
Pexels de fondo. Render nube `render-pexels.yml`. Ya aplicado en build-video.mjs.

## 9 MODELOS (imagen sticky, query SerpAPI/Wikimedia)
1. Audi Q7 2020 · 2. Ford Focus 2020 · 3. Range Rover Evoque 2020 (primos británicos)
4. Nissan Qashqai 2022 · 5. Renault Captur 2021 (E-Tech) · 6. Peugeot 3008 2021 (Stellantis)
7. Tesla Model 3 2021 · 8. VW Golf 8 2021 · 9. Volvo XC60 2021

## OVERLAYS (39, verificados): hook por modelo con AÑO + stat de la avería
Q7 suspensión neumática/4 cifras · Focus fuga caja · Ingenium cadena + OCU 64 ·
Qashqai electrónica · Renault +334.000 campaña · Stellantis 1.2 PureTech + BlueHDi ·
Tesla calidad Fremont/Berlín · VW MQB Evo + DSG + Golf 8 · Volvo Sensus · patrón +
"nunca la primera hornada".

## Al recibir la voz
1. ¿TTS leyó título/HOOK? -> recortar si sí.
2. narration.mp3 + Whisper -> out/_align.json.
3. guion-completo = guion sin las 2 primeras líneas.
4. titulo.txt.
5. build (YT_SUBDIR=yt-nocompres) -> verificar imágenes sticky de los 9 + 0 repetidos.
6. commit (con las imágenes de modelo) + push + render-pexels.yml (subdir=yt-nocompres).
