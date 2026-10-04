# PLAN VÍDEO 14 — "Diésel en 2026: Los Motores Que SÍ Compraría un Mecánico y Los Que NO"

Guion: `input/guion-diesel.txt`. Voz: PENDIENTE. Formato por MOTORES/MODELOS (compra / no compra).
YT_SUBDIR = **yt-diesel**. Descarga: el CLIENTE con `DESCARGAR_DIESEL.bat` (LÍMITE del cliente: 10 descargas/día -> 10 clips, 1 largo por motor).
Anclas: códigos de motor son únicos (K9K, 2AD-FTV, DW12, BlueHDi 130, 1.9 TDI/BKD, OM651, N47, 1CD-FTV).

## 10 CLIPS ELEGIDOS (marca-<key>.mp4)
renault (Megane POV) · toyota (Avensis 2.2 D-4D; sirve también para la sección 1CD-FTV sin repetir ventana) ·
psa (407 POV) · bluehdi (308 SW) · vw19 (Golf V 1.9 TDI) · vw20 (Passat B6 2.0 TDI 140) ·
merc (C220 W204) · bmw1 (320d E90 POV 4K) · bmw2 (X1 18d; también NOx/relleno) · moderno (GLC 220d 2025).
El resto = Pexels. Claves de abajo (renault1-3 etc.) son del plan original de 29; usar las de arriba.

## SECCIONES (plan original)
SÍ (6): K9K Renault 1.5 dCi -> renault1-3 (Megane, Qashqai, Scenic) ·
2AD-FTV Toyota 2.2 D-4D -> toyota1-3 (Avensis, RAV4, Corolla Verso) ·
DW12 PSA 2.2 HDi -> psa1-3 (407, C5) · BlueHDi 130 -> bluehdi1-3 (308, 3008) ·
1.9 TDI / 2.0 TDI 140 -> vw1-4 (Golf V, Passat B6) · OM651 -> merc1-4 (C220, E220, GLC).
NO (4): N47 BMW -> bmw1-4 (320d E90, X1 18d, 520d F10) · Toyota 1CD-FTV -> avensis1-2 ·
Diésel moderno AdBlue/FAP -> moderno1-3 · NOx alemanes viejos -> reutilizar bmw/merc SIN
repetir ventana (de-dup global) . Relleno: Pexels carretera/autopista/taxi/motor diésel/depósito AdBlue.

## OVERLAYS a preparar (códigos + cifras)
400.000 km · 4,5 l/100 · K9K · 2AD-FTV · DW12 · 350.000 km BlueHDi · 4,8 l/100 · AFN/ASZ ·
BKD 2005-2010 · OM651 +300.000 km · N47 2007-2014 · límite 200.000 km AdBlue+FAP ·
regla 20-25.000 km/año · 5 reglas de compra · Euro 5 / 2010-2016.

## Al recibir la voz
1. narration.mp3 + Whisper -> out/_align.json. 2. guion-completo = guion-diesel. 3. titulo.txt.
4. normalizar clips + frame-check (sin logos/slate de concesionario). 5. build (YT_SUBDIR=yt-diesel).
6. subir Release clips-diesel + render-release.yml. 7. verificar mosaico. 8. paquete YouTube.
