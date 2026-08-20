#!/usr/bin/env bash
FF="C:/Users/aleja/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffmpeg.exe"
cd "C:/Users/aleja/Desktop/car-channel-editor/public/assets/yt-motores"
for f in marca-*.mp4; do
  case "$f" in *.cfr.mp4) continue;; esac
  out="${f%.mp4}.cfr.mp4"
  echo ">>> normalizando $f"
  "$FF" -y -hide_banner -loglevel error -i "$f" \
    -vf "fps=30" -c:v libx264 -preset veryfast -crf 21 -g 30 -keyint_min 30 -sc_threshold 0 \
    -pix_fmt yuv420p -an -movflags +faststart "$out" && mv -f "$out" "$f" && echo "    OK $(ls -la "$f" | awk '{printf "%.0f MB",$5/1048576}')"
done
echo "=== NORMALIZADOS ==="
