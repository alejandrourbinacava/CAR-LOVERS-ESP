# Pasos al llegar a casa (15-20 min la primera vez)

## 1. Requisitos previos
- Node.js instalado (v18 o superior). Si no lo tienes: https://nodejs.org
- Claude Code instalado en tu ordenador.

## 2. Abrir el proyecto en Claude Code
Abre Claude Code y dile que abra la carpeta `car-channel-editor`
(la que has descomprimido). Puedes simplemente decirle:

> "Abre este proyecto, instala las dependencias con npm install,
> y arranca el preview con npm run dev"

O hazlo tú mismo en la terminal:

```bash
cd car-channel-editor
npm install
```

## 3. Descargar los sonidos de transición (una sola vez, para siempre)
- `public/assets/sfx/` -> lee el archivo DESCARGAR_ESTOS_SONIDOS.md de esa carpeta

Es lo único binario que no puedo generar yo directamente. Se hace una
vez y sirve para todos los vídeos futuros.

## 4. Consigue tu clave gratuita de Pexels (una sola vez)
1. Ve a https://www.pexels.com/api/ y pulsa "Get Started" (gratis).
2. Copia tu clave (API Key).
3. Copia `.env.example` como `.env` y pega tu clave ahí.

Esto es lo que permite que el sistema busque y descargue clips reales
de coche automáticamente según tu guion.

## 5. FLUJO PARA CADA VÍDEO NUEVO (esto es lo que harás cada día)

1. Escribe tu guion en `input/script.txt` (formato de ejemplo en
   `input/script.example.txt` — bloques separados por línea en
   blanco, cada uno CLIP o DATA).
2. Pon tu archivo de voz ya grabada/generada en `input/narration.mp3`.
3. Ejecuta:
   ```bash
   npm run make-video
   ```
4. Espera — busca los clips reales, mide tu audio, monta todo, y
   genera `out/video.mp4` con el vídeo terminado: color, zoom,
   transiciones con sonido, tipografía, gráficos de datos y tu
   voz narrada, todo sincronizado.

Si prefieres revisarlo en el navegador ANTES de exportar el archivo
final (recomendable para la primera vez):
```bash
npm run build-scenes
npm run dev
```

En Claude Code, todo este flujo se lo puedes pedir directamente:
> "Aquí está mi guion y mi audio [pégalos o indícale la ruta],
> móntame el vídeo completo"
y Claude Code puede colocar los archivos y ejecutar los comandos
por ti.

## Qué está ya construido (Tier 1 completo)
- ✅ Gradación de color cinematográfica (teal-orange y 2 variantes más)
- ✅ Zoom Ken Burns agresivo sincronizado
- ✅ Transiciones con aberración cromática + deslizamiento + flash
- ✅ Sonido de transición (glitch/whoosh/shutter) sincronizado al corte
- ✅ Tipografía cinética blanca con glow, palabra a palabra
- ✅ 3 gráficos estilo Vox: contador animado, círculo de porcentaje, barras comparativas
- ✅ Formato horizontal 1920x1080 16:9 (YouTube)

## Qué NO está incluido todavía (por diseño, ver conversación)
- ❌ Recorte de sujeto en capas independientes (matting) — es la parte
  técnicamente más difícil y de calidad variable; mejor probarla aparte
  antes de meterla en el pipeline automático.
- ❌ Descarga automática de clips de stock (Pexels/Videvo API) — de
  momento los clips se ponen a mano en public/assets/clips/.
