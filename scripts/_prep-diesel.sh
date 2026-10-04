#!/usr/bin/env bash
# Normaliza los clips de yt-diesel a 1080p/30fps CFR sin audio (+ recorte del Qashqai para
# quitar la marca de agua de AutoMotoTube). Reemplaza en sitio; originales siguen en 4K Video Downloader.
FF="C:/Users/aleja/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffmpeg.exe"
cd "C:/Users/aleja/Desktop/car-channel-editor/public/assets/yt-diesel"
prep() {
  f="$1"; k="${f#marca-}"; k="${k%.mp4}"
  vf="fps=30,scale=-2:'min(1080,ih)'"
  [ "$k" = "renault2" ] && vf="crop=1688:950:116:0,scale=1920:1080,fps=30"
  o="${f%.mp4}.cfr.mp4"
  "$FF" -y -hide_banner -loglevel error -fflags +genpts -i "$f" -vf "$vf" -c:v libx264 -preset veryfast -crf 28 \
    -g 60 -keyint_min 60 -sc_threshold 0 -pix_fmt yuv420p -an -vsync cfr -movflags +faststart "$o" \
    && mv -f "$o" "$f" && echo "OK $f $(ls -la "$f" | awk '{printf "%.0f MB",$5/1048576}')"
}
N=0
for f in marca-*.mp4; do
  case "$f" in *.cfr.mp4) continue;; esac
  prep "$f" &
  N=$((N+1)); [ $((N % 3)) -eq 0 ] && wait
done
wait
echo "=== PREP_DIESEL_OK ==="
