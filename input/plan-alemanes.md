# PLAN VÍDEO 4 — "Por Qué Los Mecánicos NUNCA Compran un Coche Alemán Usado"

Guion: `input/guion-alemanes.txt` (~16.6k chars, 8 partes). Voz: `input/narration.mp3` (15:57) YA puesta.
Clips propios en `public/assets/yt-alemanes/` (aislados, sin reutilizar). YT_SUBDIR=yt-alemanes.

## ESTADO: BORRADOR 360p RENDERIZADO
- `out/Por Qué Los Mecánicos NUNCA Compran un Coche Alemán Usado.mp4` (15:57, 348 MB, 360p en tarjeta).
- Motor ya reescrito para este vídeo (ENTITIES/OVERLAYS/SECTIONS + entidad "villanos"
  que rota BMW/Mercedes/Audi en Partes 1-5 -> 0 repeticiones). Calibrado con Whisper.
- **POR QUÉ 360p:** YouTube frenó la IP para HD (bulk hoy). Solo bajó 360p.
- **PARA PASAR A HD (cuando la IP se descongele):** correr `DESCARGAR_ALEMANES.bat`
  (baja 1080p a yt-alemanes, sobrescribe los 360p), luego
  `bash scripts/_finish-alemanes2.sh` (re-encode robusto 30fps + rebuild + render).
  NO hay que tocar el motor: entidades/overlays/secciones ya están.
- GOTCHA render 360p: el compositor de Remotion daba "no frame found" con los .mp4
  del formato 18; se arregló re-encodando con timestamps limpios
  (`-vf fps=30,setpts=PTS-STARTPTS -vsync cfr -avoid_negative_ts make_zero -g 15`)
  en `_finish-alemanes2.sh`.

## Al montar (cuando llegue la voz)
1. Copiar voz a `input/narration.mp3`.
2. `python scripts/_transcribe.py` → `out/_align.json` (calibración anti-drift).
3. Reescribir ENTITIES/OVERLAYS/SECTIONS en build-video.mjs (abajo) + fix anclas.
4. `bash scripts/_normalize.sh` apuntando a yt-alemanes (o adaptar) → CFR 30fps.
5. `YT_SUBDIR=yt-alemanes node scripts/build-video.mjs` (verificar "clips repetidos: 0").
6. `npm run render`.

## ENTIDADES (marca-<key>.mp4 en yt-alemanes)
Villanos: bmwserie3 (PROTAGONISTA), mercedesclasee, audia6.
Alemanes-OK (Parte 6): vwgolftdi, bmwserie1, mercedesclasea.
Alternativas (Parte 7): mazdacx5, toyotarav4, lexusis, hondacrv, suzukivitara, daciaduster.

Anclas por CÓDIGO/MODELO único (evitar bare "BMW"/"Mercedes" salvo villano):
- bmwserie3: ["Serie 3","módulo FRM","módulo CAS","mecatrónica ZF","BMW"] (BMW genérico=villano)
- mercedesclasee: ["Clase E","Mercedes-Benz","Mercedes"] (Mercedes genérico=villano)
- audia6: ["Audi A6","Audi"]
- vwgolftdi: ["Golf","1.6 TDI","2.0 TDI"]
- bmwserie1: ["Serie 1","B47"]   (gana sobre "BMW" por posición en activeEntity)
- mercedesclasea: ["Clase A","Clase B","W176","W246"]  (gana sobre "Mercedes")
- mazdacx5: ["Mazda","CX-5","Skyactiv"]
- toyotarav4: ["Toyota","RAV4","Corolla","híbrido"]
- lexusis: ["Lexus","IS","RX"]
- hondacrv: ["Honda","CR-V","Civic"]
- suzukivitara: ["Suzuki","Vitara"]
- daciaduster: ["Dacia","Duster","K9K"]

## SECCIONES (primary "pegajoso")
- "PARTE 1:"→bmwserie3, "PARTE 2:"→bmwserie3, "PARTE 3:"→bmwserie3,
  "PARTE 4:"→bmwserie3, "PARTE 5:"→bmwserie3 (Mercedes/Audi al nombrarlos)
- "PARTE 6"→vwgolftdi (Serie1/ClaseA al nombrarlos)
- "SENSACIONES: MAZDA"→mazdacx5, "FIABILIDAD: TOYOTA"→toyotarav4,
  "RAZONABLE: LEXUS"→lexusis, "PRACTICIDAD: HONDA"→hondacrv,
  "AJUSTADO: SUZUKI"→suzukivitara
- "PARTE 8:"→bmwserie3 (recap villano)

## OVERLAYS (borrador; verificar anclas al montar)
HOOK "Hay una pregunta que me hacen": hook "LOS MECÁNICOS NO\nCOMPRAN ALEMÁN USADO"
"nunca digo BMW": caption "NI BMW · NI MERCEDES · NI AUDI"
P1: "2.5 sobre 5.0"→stat 2,5/5 "FIABILIDAD BMW · REPAIRPAL (30/32)"; "968 dólares"→968 $/AÑO "BMW (MEDIA 652)";
    "908 dólares"→908 $/AÑO "MERCEDES"; "Audi, 987"→987 $/AÑO "AUDI"; "Lexus: 551"→551 $/AÑO "LEXUS";
    "65% más"→+65% "ALEMÁN vs LEXUS"
P2: "16-17%"→16-17% "FALLO ESCAPE (MEDIA 5%)"; "tres veces más"→x3 "PROBLEMAS ANTICONTAMINACIÓN"
P3: "setenta y noventa módulos"→70-90 "MÓDULOS ELECTRÓNICOS"; "cuatrocientos y mil quinientos"→400-1.500 € "UN MÓDULO";
    "cuarenta códigos"→40 CÓDIGOS "DIAGNÓSTICO OFICIAL 400 €"
P4: "mecatrónica ZF"→2.000-4.000 € "MECATRÓNICA ZF"; "Turbocompresor"→1.200-2.500 € "TURBO";
    "veinticinco mil euros en el total"→22-25 MIL € "COSTE REAL 5 AÑOS (COMPRA 15.000)"
P6: hook "LOS ALEMANES QUE SÍ"; "Golf 1.6 TDI"→caption "VW GOLF TDI · SIN BITURBO"; "B47"→caption "BMW SERIE 1 · B47"
P7: hook "QUÉ COMPRAMOS EN SU LUGAR"; "447 dólares"→447 $/AÑO "MAZDA CX-5 Nº1"; 
    "300.000 km sin averías"→+300.000 KM "TOYOTA HÍBRIDO"; "60 y el 65 por ciento"→60-65% "LEXUS RETIENE VALOR (BMW 40%)";
    "cuatro marcas más fiables"→caption "SUZUKI TOP-4 OCU 2026"
CIERRE: "no ve el badge"→hook "NO VEMOS EL BADGE,\nVEMOS LA ARQUITECTURA"; "Suscríbete para más"→hook SUSCRÍBETE

## Fuentes descargadas (URLs)
bmwserie3=ajeCEr-SRac mercedesclasee=IN7yz-fbXhs audia6=-a9H7WPErX0 vwgolftdi=g1SwwbJ-f-8
bmwserie1=vQ3UZDYvZZY mercedesclasea=aEoU3pnJc_U mazdacx5=CTtoSFehn2E toyotarav4=8QYp_LYhT5g
lexusis=50AIZkKeF6g hondacrv=AO3_tkuPgNM suzukivitara=r6I6MnfDB-w daciaduster=37Mxv8sISgs
