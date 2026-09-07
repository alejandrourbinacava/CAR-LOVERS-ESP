# PLAN VÍDEO 8 — "TIER LIST de SUV por Fiabilidad 2026 (S a F)"

Guion: `input/guion-tierlist.txt`. Voz: PENDIENTE. Formato NUEVO: **tier list de ~25
modelos**. Visual = IMAGEN de cada modelo (SerpAPI/Wikimedia, muchas ya en caché) +
badges de TIER + stats OCU/coste + b-roll SUV Pexels de fondo. Regla roja: cuando
nombra un modelo, se ve ESE modelo. Sin descargas manuales del cliente.

## MODELOS → TIER → query de imagen (para PINS/entidades)
TIER S: Lexus NX ("Lexus NX 2024") · Lexus RX ("Lexus RX 2024") · Toyota RAV4 ("Toyota RAV4 2024") · Toyota C-HR ("Toyota C-HR 2024") · Subaru Forester ("Subaru Forester 2024") · Subaru Outback ("Subaru Outback 2024")
TIER A: Mazda CX-5 ("Mazda CX-5 2024") · Suzuki Vitara ("Suzuki Vitara 2024") · Suzuki S-Cross ("Suzuki S-Cross 2024") · Honda CR-V ("Honda CR-V 2024") · Kia Sportage ("Kia Sportage 2024") · Hyundai Tucson ("Hyundai Tucson 2024")
TIER B: Nissan Qashqai J12 ("Nissan Qashqai 2023") · VW T-Roc ("Volkswagen T-Roc 2024") · Seat Arona ("Seat Arona 2024") · Skoda Kamiq ("Skoda Kamiq 2024") · Dacia Duster ("Dacia Duster 2024") · Dacia Sandero Stepway ("Dacia Sandero Stepway 2024")
TIER C: Peugeot 3008 ("Peugeot 3008 2024") · Citroen C5 Aircross ("Citroen C5 Aircross 2024") · Jeep Compass ("Jeep Compass 2024") · Jeep Renegade ("Jeep Renegade 2024")
TIER D: MG ZS ("MG ZS SUV 2024") · MG HS ("MG HS SUV 2024") · Alfa Romeo Stelvio ("Alfa Romeo Stelvio 2024") · DS7 Crossback ("DS7 Crossback 2024")
TIER F: Land Rover ("Range Rover Evoque 2024" / "Land Rover Discovery 2024")

## B-ROLL (Pexels de relleno, SUV genérico)
["suv driving highway", "suv city street", "white suv road", "suv dashboard driving",
 "black suv driving", "suv parked street", "luxury suv driving", "suv aerial road"]

## OVERLAYS (badges de TIER + stats; anclas verificadas literales)
HOOK
- "ochenta y cinco mil quinientos noventa conductores" -> stat "85.590" "CONDUCTORES REALES · OCU 2026"
- "algún tapado va a subir" -> hook "TIER LIST SUV\nFIABILIDAD 2026"

TIER S (hook + modelos)
- "TIER S — LOS INTOCABLES" -> hook "TIER S\nLOS INTOCABLES"
- "LEXUS NX / RX" -> stat "TIER S" "LEXUS NX / RX"
- "noventa y tres puntos" -> stat "OCU 93/100" "LEXUS · Nº1 FIABILIDAD 2026"
- "quinientos cincuenta euros anuales" -> stat "550 €/AÑO" "MANTENIMIENTO LEXUS (vs 900 ALEMANAS)"
- "TOYOTA RAV4 / TOYOTA C-HR" -> stat "TIER S" "TOYOTA RAV4 / C-HR"
- "noventa y seis puntos sobre cien en su categoría" -> stat "OCU 96/100" "TOYOTA RAV4 · HÍBRIDO HSD"
- "SUBARU FORESTER / OUTBACK" -> stat "TIER S" "SUBARU FORESTER / OUTBACK"
- "noventa y un puntos en la OCU 2026, junto a Toyota" -> stat "OCU 91/100" "SUBARU · BOXER + AWD PERMANENTE"

TIER A
- "TIER A — MUY RECOMENDABLES" -> hook "TIER A\nMUY RECOMENDABLES"
- "MAZDA CX-5" -> stat "TIER A" "MAZDA CX-5 · 2.0 SKYACTIV ATMOSFÉRICO"
- "cuatrocientos cuarenta y siete euros" -> stat "447 €/AÑO" "MAZDA CX-5 · Nº1 RepairPal"
- "SUZUKI VITARA / S-CROSS" -> stat "TIER A" "SUZUKI VITARA / S-CROSS · BARATO DE MANTENER"
- "HONDA CR-V" -> stat "TIER A" "HONDA CR-V e:HEV · i-MMD"
- "KIA SPORTAGE / HYUNDAI TUCSON" -> stat "TIER A" "KIA SPORTAGE / HYUNDAI TUCSON"
- "evita las versiones con el motor 1.6 T-GDI" -> caption "EVITA EL 1.6 T-GDI · MEJOR HÍBRIDO O ATMOSFÉRICO"

TIER B
- "TIER B — CORRECTOS" -> hook "TIER B\nCORRECTOS"
- "NISSAN QASHQAI (solo generación J12" -> stat "TIER B" "NISSAN QASHQAI J12 (2021+) · CORREGIDO"
- "SEAT ARONA / VOLKSWAGEN T-ROC / SKODA KAMIQ" -> stat "TIER B" "T-ROC / ARONA / KAMIQ · TSI EA211"
- "de la posición treinta y uno a la veinticinco" -> caption "VW SUBE: PUESTO 31 → 25 (OCU 2026)"
- "DACIA DUSTER / SANDERO STEPWAY" -> stat "TIER B" "DACIA DUSTER · SIMPLE Y BARATO"

TIER C
- "TIER C — CON PRECAUCIÓN" -> hook "TIER C\nCON PRECAUCIÓN"
- "PEUGEOT 3008 / CITROËN C5 AIRCROSS" -> stat "TIER C" "PEUGEOT 3008 / C5 AIRCROSS · 1.2 PureTech"
- "setenta y seis puntos, superadas incluso por Volkswagen" -> stat "OCU 76/100" "PEUGEOT/CITROËN · POR DEBAJO DE VW"
- "correa de distribución en baño de aceite" -> caption "CORREA DE DISTRIBUCIÓN EN BAÑO DE ACEITE (PureTech)"
- "JEEP COMPASS / RENEGADE" -> stat "TIER C" "JEEP COMPASS / RENEGADE · 1.3 GSE + DCT"
- "NISSAN QASHQAI (generación J11" -> stat "TIER C → D" "QASHQAI J11 · CVT JATCO PROBLEMÁTICA"

TIER D
- "TIER D — EVITAR" -> hook "TIER D\nEVITAR SALVO GANGA"
- "MG ZS / MG HS" -> stat "TIER D" "MG ZS / HS · 'LA GRAN DECEPCIÓN' OCU"
- "setenta y dos puntos, solo por delante de Land Rover" -> stat "OCU 72/100" "MG · PENÚLTIMA POSICIÓN"
- "ALFA ROMEO STELVIO / DS7 CROSSBACK" -> stat "TIER D" "ALFA STELVIO / DS7 · ELÉCTRICA + DEPRECIACIÓN"

TIER F
- "TIER F — HUIR" -> hook "TIER F\nHUIR"
- "LAND ROVER (Range Rover, Sport, Evoque, Discovery, Defender)" -> stat "TIER F" "LAND ROVER · ÚLTIMO DE LA OCU 2026"
- "última posición de la OCU 2026 con sesenta y cuatro puntos" -> stat "OCU 64/100" "LAND ROVER · FAROLILLO ROJO"
- "El triángulo del terror" -> caption "TRIÁNGULO DEL TERROR: NEUMÁTICA + ELECTRÓNICA + ACCESO"

PATRÓN + CIERRE
- "EL PATRÓN QUE EXPLICA" -> hook "EL PATRÓN:\nSIMPLE ARRIBA, COMPLEJO ABAJO"
- "desconfía de los excesos de electrónica" -> caption "MECÁNICA PROBADA > EXCESO DE ELECTRÓNICA"
- "puede subir o bajar dos tiers según el motor" -> caption "EL MOTOR CONCRETO MUEVE 2 TIERS"
- "Suscríbete para la tier list" -> hook "SUSCRÍBETE"
