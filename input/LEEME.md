# Aqui van tus archivos de cada video nuevo

1. `script.txt`     <- tu guion, en el formato de script.example.txt (mismo carpeta)
2. `narration.mp3`  <- el audio de tu voz ya grabada/generada

Cuando ambos esten aqui, ejecuta desde la raiz del proyecto:

```
npm run make-video
```

Esto hace TODO automaticamente:
1. Mide la duracion real de narration.mp3
2. Reparte esa duracion entre las escenas de tu guion
3. Busca y descarga clips reales de coche en Pexels segun las
   palabras clave de cada bloque CLIP de tu guion
4. Genera src/config.ts
5. Renderiza el video final en out/video.mp4

Si prefieres revisarlo en el navegador antes de exportar:
```
npm run build-scenes
npm run dev
```
