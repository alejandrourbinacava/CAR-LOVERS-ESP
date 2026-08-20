#!/usr/bin/env bash
export PATH="/c/Program Files/nodejs:$PATH"
cd "C:/Users/aleja"   # cwd NEUTRO: bgutil no encuentra deno -> usa node (rapido)
PROJ="C:/Users/aleja/Desktop/car-channel-editor"
SCRIPT="C:/Users/aleja/yt-dlp-potoken/server/build/generate_once.js"
DENO="$PROJ/deno.exe"
COOKIES="$PROJ/cookies.txt"
OUT="$PROJ/public/assets/yt-motores"
FMT="bv*[height<=1080][vcodec^=avc1]/bv[height<=1080]/b[height<=1080]"
OPTS=(--cookies "$COOKIES" --no-playlist --no-continue --force-overwrites --retries 10 --fragment-retries 10 \
  --js-runtimes "deno:$DENO" --extractor-args "youtubepot-bgutilscript:script_path=$SCRIPT")
declare -A U=(
 [toyotacorolla]="https://youtu.be/UbsWllwgDFk"
 [hondacivic]="https://youtu.be/Dga-4-VuiJU"
 [mazda3]="https://youtu.be/kR99SqZSwUo"
 [vwgolf]="https://youtu.be/qzBIw6UGwFs"
 [bmw340i]="https://youtu.be/w37SVXcAlDY"
 [mercedeseclass]="https://youtu.be/NsmWGv5yE8s"
 [fordmondeo]="https://youtu.be/d7p6s3FiPe4"
 [subaruforester]="https://youtu.be/HkWf8p92sio"
 [renaultmegane]="https://youtu.be/YaxIlhE6Q1Q"
 [renaultclio]="https://youtu.be/LwaeZnsruRw"
)
for k in toyotacorolla hondacivic mazda3 vwgolf bmw340i mercedeseclass fordmondeo subaruforester renaultmegane renaultclio; do
  echo ">>> $k  ${U[$k]}"
  python -m yt_dlp "${OPTS[@]}" -f "$FMT" -o "$OUT/marca-$k.%(ext)s" "${U[$k]}" 2>&1 | grep -iE "100% of|Forbidden|ERROR|timed out" | tail -2
  sz=$(ls -la "$OUT/marca-$k.mp4" 2>/dev/null | awk '{print $5}')
  echo "    -> $((sz/1048576)) MB"
done
echo "=== FIN ==="
ls -la "$OUT" | grep mp4 | awk '{printf "%-40s %5.0f MB\n",$NF,$5/1048576}'
