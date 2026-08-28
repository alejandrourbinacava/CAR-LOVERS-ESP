# PLAN VÍDEO 5 — "Hyundai y Kia NO Pueden Superar a Toyota (Datos 2026)"

Guion: `input/guion-hyundaikia.txt`. Voz: PENDIENTE (la envía el cliente).
Comparativa Toyota (héroe) vs Hyundai/Kia (rivales) + Lexus. Clips propios en
`public/assets/yt-hyundaikia/` (o el SUBDIR que se use). Descarga: el CLIENTE.

## Al montar (cuando llegue la voz)
1. Copiar voz a `input/narration.mp3`; `cp guion-hyundaikia.txt guion-completo.txt`;
   `printf 'Hyundai y Kia NO Pueden Superar a Toyota' > input/titulo.txt`.
2. `python scripts/_transcribe.py` → `out/_align.json` (calibración anti-drift).
3. Reescribir ENTITIES/OVERLAYS/SECTIONS (abajo) en build-video.mjs.
4. Normalizar clips (30fps) + `YT_SUBDIR=yt-hyundaikia node scripts/build-video.mjs` + render.
   (O subir clips al Release y `render-release.yml` en la nube.)

## ENTIDADES (marca-<key>.mp4)
- toyota (HÉROE): videos [toyotarav4, toyotacamry, toyota4runner]
  anchors: ["RAV4","Camry","4Runner","2.5 litros","2GR-FE","1CD-FTV","Toyota Relax","híbridos"]
- coreanos (rotación rival general): videos [hyundaitucson, kiasportage]  (solo primary de sección)
- hyundai: videos [hyundaitucson]  anchors ["Hyundai","Tucson","Theta II"]
- kia: videos [kiasportage]  anchors ["Kia","Sportage"]
- coreanosev (rotación EV, Parte 6): videos [hyundaiioniq5, kiaev6]  (solo primary)
- hyundaiioniq5: videos [hyundaiioniq5]  anchors ["Ioniq 5","Ioniq 6"]
- kiaev6: videos [kiaev6]  anchors ["EV6","GV60"]
- lexus: videos [lexusrx]  anchors ["Lexus"]
- cierre: videos []  (general)

## SECCIONES (primary pegajoso)
- "HOOK DE APERTURA"→(sin primary, mix general)
- "PARTE 1:"→coreanos   "PARTE 2:"→coreanos
- "PARTE 3:"→toyota (Hyundai/Kia/Lexus al nombrarse)
- "PARTE 4:"→toyota
- "PARTE 5:"→coreanos (Theta II)
- "PARTE 6:"→coreanosev (Ioniq5/EV6)
- "PARTE 7:"→toyota
- "PARTE 8:"→coreanos ; "Compra Toyota si"→toyota
- "CONCLUSIÓN"→toyota ; "LLAMADA A LA ACCIÓN"→(mix)

## OVERLAYS (verificados; kind/valor)
HOOK "Kia te ofrece siete años"→hook "KIA: 7 AÑOS\nTOYOTA: 3 AÑOS"
"sigue eligiendo Toyota"→stat "+400.000 KM" "LOS MECÁNICOS ELIGEN TOYOTA"
P1 "PARTE 1"→hook "DONDE LOS COREANOS\nSÍ GANAN"; "siete años o ciento cincuenta mil"→stat "7 AÑOS/150.000 KM" "GARANTÍA KIA · TRANSFERIBLE";
   "cinco años sin límite"→stat "5 AÑOS" "GARANTÍA HYUNDAI · SIN LÍMITE KM"; "ofrece tres años"→stat "3 AÑOS" "TOYOTA (RELAX HASTA 10)"
P2 "PARTE 2"→hook "LA TRAMPA DE LA\nGARANTÍA DE 7 AÑOS"; "garantía más larga significa un coche más fiable"→caption "GARANTÍA ≠ FIABILIDAD";
   "herramienta de marketing"→caption "LA GARANTÍA ES MARKETING, NO FIABILIDAD"
P3 "PARTE 3"→hook "LOS DATOS REALES\nDE 2026"; "sesenta y seis sobre cien"→stat "66/100" "TOYOTA · Nº1 CONSUMER REPORTS 2026";
   "octava posición con cuarenta y ocho"→stat "48/100" "HYUNDAI · 8º"; "decimotercera posición"→stat "13º" "KIA · CONSUMER REPORTS";
   "ciento noventa y ocho problemas"→stat "198" "HYUNDAI · J.D. POWER (PP100)"; "Kia obtiene ciento noventa y tres"→stat "193" "KIA · J.D. POWER";
   "ciento cincuenta y uno problemas"→stat "151" "LEXUS · LÍDER J.D. POWER"
P4 "PARTE 4"→hook "TOYOTA GANA EN LO\nQUE MÁS IMPORTA"; "noventa y cinco sobre cien"→stat "95/100" "TOYOTA 4RUNNER · C. REPORTS 2026";
   "2.5 litros de cuatro cilindros del Camry"→caption "2.5 ATMOSFÉRICO · CAMRY / RAV4"
P5 "PARTE 5"→hook "EL ELEFANTE:\nEL MOTOR THETA II"; "Theta II de 2.0 y 2.4"→stat "THETA II 2.0/2.4" "HYUNDAI-KIA · 2011-2018";
   "picadura de pistones"→caption "PICADURA DE PISTONES · CONSUMO DE ACEITE"; "demandas colectivas"→caption "RETIRADAS + DEMANDAS COLECTIVAS (EE.UU.)"
P6 "PARTE 6"→hook "EL COMPONENTE\nCOMPARTIDO: ICCU"; "llamado ICCU"→stat "ICCU" "FALLO RECURRENTE · EV COREANOS 2026";
   "Ioniq 5, el EV6"→caption "IONIQ 5 · EV6 · IONIQ 6 · GV60"
P7 "PARTE 7"→hook "EL VALOR DE REVENTA:\nEL JUEZ FINAL"; "valora los Toyota usados"→caption "TOYOTA · MEJOR REVENTA DEL MERCADO";
   "garantía transferible de Kia"→caption "KIA · GARANTÍA TRANSFERIBLE SUMA VALOR"
P8 "PARTE 8"→hook "¿QUÉ DEBERÍAS\nCOMPRAR?"; "Compra Hyundai o Kia si"→caption "HYUNDAI/KIA: GARANTÍA + EQUIPO, SI CAMBIAS PRONTO";
   "Compra Toyota si"→caption "TOYOTA: 10-15 AÑOS, MÁXIMA FIABILIDAD"
CIERRE "todavía tiene un nombre"→hook "FIABILIDAD A LARGO PLAZO:\nTOYOTA"; "Por ingeniería"→caption "NO POR MARKETING. POR INGENIERÍA.";
   "Suscríbete para más"→hook "SUSCRÍBETE"

## CLIPS A DESCARGAR (el cliente) → nombrar marca-<key>.mp4
marca-toyotarav4     https://youtu.be/RkwfM8L4-HA
marca-toyotacamry    https://youtu.be/6nus6sASgAY
marca-toyota4runner  https://youtu.be/izEEVYE1p_A
marca-hyundaitucson  https://youtu.be/04c0L5ElAec
marca-hyundaiioniq5  https://youtu.be/BM6d6ngn0xQ
marca-kiasportage    https://youtu.be/uXNFHSUWrNA
marca-kiaev6         https://youtu.be/j69Wq0hQOTg
marca-lexusrx        https://youtu.be/O-xgv5WQXaE
