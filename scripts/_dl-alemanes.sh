#!/usr/bin/env bash
export PATH="/c/Program Files/nodejs:$PATH"
cd "C:/Users/aleja"   # cwd NEUTRO (bgutil usa node)
PROJ="C:/Users/aleja/Desktop/car-channel-editor"
SCRIPT="C:/Users/aleja/yt-dlp-potoken/server/build/generate_once.js"
DENO="$PROJ/deno.exe"; COOKIES="$PROJ/cookies.txt"; OUT="$PROJ/public/assets/yt-alemanes"
FMT="bv*[height<=1080][vcodec^=avc1]/bv[height<=1080]/b[height<=1080]"
OPTS=(--cookies "$COOKIES" --no-playlist --no-continue --force-overwrites --retries 10 --fragment-retries 10 \
  --js-runtimes "deno:$DENO" --extractor-args "youtubepot-bgutilscript:script_path=$SCRIPT")
declare -A U=(
 [bmwserie3]="https://youtu.be/ajeCEr-SRac"
 [mercedesclasee]="https://youtu.be/IN7yz-fbXhs"
 [audia6]="https://youtu.be/-a9H7WPErX0"
 [vwgolftdi]="https://youtu.be/g1SwwbJ-f-8"
 [bmwserie1]="https://youtu.be/vQ3UZDYvZZY"
 [mercedesclasea]="https://youtu.be/aEoU3pnJc_U"
 [mazdacx5]="https://youtu.be/CTtoSFehn2E"
 [toyotarav4]="https://youtu.be/8QYp_LYhT5g"
 [lexusis]="https://youtu.be/50AIZkKeF6g"
 [hondacrv]="https://youtu.be/AO3_tkuPgNM"
 [suzukivitara]="https://youtu.be/r6I6MnfDB-w"
 [daciaduster]="https://youtu.be/37Mxv8sISgs"
)
for k in bmwserie3 mercedesclasee audia6 vwgolftdi bmwserie1 mercedesclasea mazdacx5 toyotarav4 lexusis hondacrv suzukivitara daciaduster; do
  echo ">>> $k"
  python -m yt_dlp "${OPTS[@]}" -f "$FMT" -o "$OUT/marca-$k.%(ext)s" "${U[$k]}" 2>&1 | grep -iE "100% of|Forbidden|ERROR" | tail -1
  sz=$(ls -la "$OUT/marca-$k.mp4" 2>/dev/null | awk '{print $5}'); echo "    -> $((sz/1048576)) MB"
done
echo "=== FIN ALEMANES ==="; ls -la "$OUT" | grep -c mp4
