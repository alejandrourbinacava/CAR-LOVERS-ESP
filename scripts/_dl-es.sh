#!/usr/bin/env bash
# uso: bash scripts/_dl-es.sh <idYT> <carpeta_salida>  -> baja el vídeo español a HD (1080p) con reintentos
export PATH="/c/Program Files/nodejs:$PATH"
cd "C:/Users/aleja"
PROJ="C:/Users/aleja/Desktop/car-channel-editor"
SCRIPT="C:/Users/aleja/yt-dlp-potoken/server/build/generate_once.js"
OUT="$1"; ID="$2"; mkdir -p "$OUT"
OPTS=(--cookies "$PROJ/cookies.txt" --no-playlist --no-continue --force-overwrites --retries 10 --fragment-retries 10 \
  --js-runtimes "deno:$PROJ/deno.exe" --extractor-args "youtubepot-bgutilscript:script_path=$SCRIPT")
for t in 1 2 3 4 5; do
  python -m yt_dlp "${OPTS[@]}" -f "bv*[height<=1080][vcodec^=avc1]+ba/bv[height<=1080]+ba/b[height<=1080]" --merge-output-format mp4 -o "$OUT/es.%(ext)s" "https://youtu.be/$ID" 2>&1 | tr '' '
' | grep -iE "100% of|Forbidden|ERROR|timed out" | tail -2
  [ -s "$OUT/es.mp4" ] && { echo "OK $(( $(stat -c %s "$OUT/es.mp4")/1048576 )) MB"; exit 0; }
  echo "reintento $t"
done
echo FALLO
