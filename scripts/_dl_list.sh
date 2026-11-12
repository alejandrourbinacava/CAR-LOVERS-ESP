#!/usr/bin/env bash
# uso: bash scripts/_dl_list.sh <v>
# Baja a 1080p (0-300 s) los clips de scripts/_clips-<v>.txt ("clave idYouTube  # notas") a public/assets/yt-<v>/marca-<clave>.mp4
export PATH="/usr/bin:/bin:/c/Program Files/nodejs:$PATH"
V="$1"
cd "C:/Users/aleja"
PROJ="C:/Users/aleja/Desktop/car-channel-editor"
SCRIPT="C:/Users/aleja/yt-dlp-potoken/server/build/generate_once.js"
OUT="$PROJ/public/assets/yt-$V"; mkdir -p "$OUT"
OPTS=(--cookies "$PROJ/cookies.txt" --no-playlist --no-continue --retries 10 --fragment-retries 10 --no-warnings \
  --js-runtimes "deno:$PROJ/deno.exe" --extractor-args "youtubepot-bgutilscript:script_path=$SCRIPT" --download-sections "*0-300")
FMT="bv*[height<=1080][vcodec^=avc1]/bv[height<=1080]/b[height<=1080]"
grep -v '^\s*#' "$PROJ/scripts/_clips-$V.txt" | sed 's/#.*//' | while read -r key id; do
  [ -z "$key" ] && continue
  [ -z "$id" ] && continue
  dst="$OUT/marca-$key.mp4"
  if [ -s "$dst" ] && [ "$(stat -c %s "$dst")" -gt 1000000 ]; then echo "ya: $key"; continue; fi
  ok=0
  for t in 1 2 3; do
    python -X utf8 -m yt_dlp "${OPTS[@]}" -f "$FMT" --merge-output-format mp4 -o "$dst" "https://youtu.be/$id" >/dev/null 2>&1
    if [ -s "$dst" ] && [ "$(stat -c %s "$dst")" -gt 1000000 ]; then ok=1; break; fi
    rm -f "$dst" "$dst.part"
  done
  echo "$key $id ok=$ok $( [ -s "$dst" ] && echo $(( $(stat -c %s "$dst")/1048576 ))MB )"
done
echo FIN
