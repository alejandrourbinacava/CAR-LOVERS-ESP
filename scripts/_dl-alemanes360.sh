#!/usr/bin/env bash
export PATH="/c/Program Files/nodejs:$PATH"
cd "C:/Users/aleja"
PROJ="C:/Users/aleja/Desktop/car-channel-editor"; OUT="$PROJ/public/assets/yt-alemanes"
OPTS=(--cookies "$PROJ/cookies.txt" --no-playlist --no-continue --force-overwrites --retries 15 \
  --js-runtimes "deno:$PROJ/deno.exe" --extractor-args "youtube:player_client=android,tv")
FMT="18/b[height<=480][ext=mp4]/b[height<=480]/b"
declare -A U=(
 [bmwserie3]="https://youtu.be/ajeCEr-SRac" [mercedesclasee]="https://youtu.be/IN7yz-fbXhs"
 [audia6]="https://youtu.be/-a9H7WPErX0" [vwgolftdi]="https://youtu.be/g1SwwbJ-f-8"
 [mercedesclasea]="https://youtu.be/aEoU3pnJc_U" [mazdacx5]="https://youtu.be/CTtoSFehn2E"
 [toyotarav4]="https://youtu.be/8QYp_LYhT5g" [lexusis]="https://youtu.be/50AIZkKeF6g"
 [hondacrv]="https://youtu.be/AO3_tkuPgNM" [suzukivitara]="https://youtu.be/r6I6MnfDB-w"
 [daciaduster]="https://youtu.be/37Mxv8sISgs"
)
for k in bmwserie3 mercedesclasee audia6 vwgolftdi mercedesclasea mazdacx5 toyotarav4 lexusis hondacrv suzukivitara daciaduster; do
  echo ">>> $k"
  python -m yt_dlp "${OPTS[@]}" -f "$FMT" -o "$OUT/marca-$k.%(ext)s" "${U[$k]}" 2>&1 | grep -iE "100% of|Forbidden|ERROR" | tail -1
done
echo "=== FIN 360 ==="; ls "$OUT"/*.mp4 | wc -l
