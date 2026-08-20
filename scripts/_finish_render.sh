#!/usr/bin/env bash
export PATH="/c/Program Files/nodejs:$PATH"
cd "C:/Users/aleja/Desktop/car-channel-editor"
FFPROBE="C:/Users/aleja/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffprobe.exe"
set -o pipefail

echo "===== [1/3] NORMALIZANDO A CFR 30fps ($(date +%H:%M)) ====="
bash scripts/_normalize.sh

echo "===== VERIFICANDO fps ====="
bad=0
for f in public/assets/yt-motores/marca-*.mp4; do
  r=$("$FFPROBE" -v error -select_streams v:0 -show_entries stream=r_frame_rate -of default=nw=1:nk=1 "$f" 2>/dev/null)
  if [ "$r" != "30/1" ]; then echo "  !! $(basename $f) = $r (NO 30/1)"; bad=$((bad+1)); fi
done
if [ "$bad" -ne 0 ]; then echo "ABORTADO: $bad vídeos no quedaron a 30fps"; exit 2; fi
echo "  todos 30/1 OK"

echo "===== [2/3] REGENERANDO CONFIG (calibrado) ($(date +%H:%M)) ====="
YT_SUBDIR=yt-motores node scripts/build-video.mjs || { echo "ABORTADO en build"; exit 3; }

echo "===== [3/3] RENDER ($(date +%H:%M)) ====="
npm run render || { echo "ABORTADO en render"; exit 4; }

echo "===== TERMINADO_TODO_OK ($(date +%H:%M)) ====="
ls -la "out/MEJORES MOTORES DE CADA MARCA.mp4" | awk '{printf "final: %.0f MB\n",$5/1048576}'
