#!/usr/bin/env bash
export PATH="/c/Program Files/nodejs:$PATH"
cd "C:/Users/aleja/Desktop/car-channel-editor"
FF="C:/Users/aleja/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffmpeg.exe"
echo "===== [1/3] RE-ENCODE robusto (timestamps limpios) ($(date +%H:%M)) ====="
cd public/assets/yt-alemanes
for f in marca-*.mp4; do
  case "$f" in *.fix.mp4) continue;; esac
  o="${f%.mp4}.fix.mp4"
  "$FF" -y -hide_banner -loglevel error -fflags +genpts -i "$f" \
    -vf "fps=30,setpts=PTS-STARTPTS" -c:v libx264 -preset veryfast -crf 22 \
    -g 15 -keyint_min 15 -sc_threshold 0 -pix_fmt yuv420p -an \
    -vsync cfr -avoid_negative_ts make_zero -video_track_timescale 15360 -movflags +faststart "$o" \
    && mv -f "$o" "$f" && echo "  OK $f"
done
cd "C:/Users/aleja/Desktop/car-channel-editor"
echo "===== [2/3] REBUILD ($(date +%H:%M)) ====="
YT_SUBDIR=yt-alemanes node scripts/build-video.mjs 2>&1 | grep -iE "repetidos|Listo" || exit 3
echo "===== [3/3] RENDER ($(date +%H:%M)) ====="
npm run render || exit 4
echo "===== TERMINADO_ALEMANES_OK ($(date +%H:%M)) ====="
ls -la "out/Por Qué Los Mecánicos NUNCA Compran un Coche Alemán Usado.mp4" | awk '{printf "final: %.0f MB\n",$5/1048576}'
