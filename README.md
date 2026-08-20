# Car Channel Editor

Pipeline de montaje automático de vídeo con Remotion, estilo motion
graphics tipo Magnate Media (color, capas, transiciones con glitch/SFX,
tipografía cinética) combinado con grafismo de datos tipo Vox (contadores,
porcentajes, barras) para cuando el guion menciona cifras.

**Empieza por leer `SETUP_STEPS.md`** — ahí están los pasos exactos para
la primera ejecución.

## Estructura

```
input/
  script.txt          <- TU GUION de cada video nuevo (lo escribes tu)
  narration.mp3         <- TU VOZ de cada video nuevo (la generas tu)
  script.example.txt     <- plantilla/formato de referencia
scripts/
  build-scenes.mjs      <- el orquestador: lee guion+voz, busca clips
                            reales en Pexels, genera src/config.ts solo
src/
  config.ts             <- GENERADO AUTOMATICAMENTE, no tocar a mano
  CarVideo.tsx            <- secuencia todas las escenas en el tiempo
  Scene.tsx                <- renderiza una escena segun su tipo (clip o data)
  effects/
    ColorGrade.tsx          <- gradacion de color cinematografica
    KenBurns.tsx              <- zoom in/out sincronizado
    SceneTransition.tsx       <- transicion (glitch/whoosh/shutter) + sonido
    KineticText.tsx            <- titulares animados con glow
  graphics/
    AnimatedCounter.tsx      <- "630 CV" contando hacia arriba
    PercentCircle.tsx          <- circulo de porcentaje tipo Vox
    BarChart.tsx                 <- barras comparativas animadas
public/assets/
  clips/                  <- clips reales descargados automaticamente
  sfx/                     <- sonidos de transicion (descargar una vez)
  audio/                    <- copia de tu narracion (automatico)
```

## Filosofia del proyecto

Hay dos capas separadas:
1. **El motor visual** (`effects/`, `graphics/`, `Scene.tsx`, `CarVideo.tsx`)
   — el "cómo se ve", reutilizable, no se toca vídeo a vídeo.
2. **El contenido** (`input/script.txt` + `input/narration.mp3`) — el
   "qué dice" cada vídeo, lo único que cambias tú cada día.

El orquestador (`scripts/build-scenes.mjs`) conecta ambas capas: lee
tu guion y tu voz, decide duraciones, busca clips reales, y genera
`src/config.ts` automáticamente. Ejecuta `npm run make-video` y
obtienes el vídeo final sin tocar ningún componente.
