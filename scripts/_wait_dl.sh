#!/usr/bin/env bash
# uso: bash scripts/_wait_dl.sh <run_id> <video> <idioma>
# Espera a que termine el run de render-shots.yml y descarga el artefacto a out/loc/<video>/<idioma>/video.mp4
cd "$(dirname "$0")/.."
RUN="$1"; V="$2"; L="$3"
REPO="alejandrourbinacava/CAR-LOVERS-ESP"
TOKEN=$(printf "protocol=https\nhost=github.com\n\n" | git credential fill 2>/dev/null | sed -n 's/^password=//p')
API="https://api.github.com/repos/$REPO/actions/runs/$RUN"
while true; do
  r=$(curl -s -H "Authorization: Bearer $TOKEN" "$API" | python -c "import sys,json;d=json.load(sys.stdin);print(d['status'],d.get('conclusion'))" 2>/dev/null)
  echo "$(date -u +%H:%M) $r"
  case "$r" in completed*) break;; esac
  sleep 120
done
case "$r" in *success*) ;; *) echo "RENDER FALLIDO: $r"; exit 1;; esac
AID=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/artifacts" | python -c "import sys,json;print(json.load(sys.stdin)['artifacts'][0]['id'])")
D="out/loc/$V/$L/dl"; mkdir -p "$D"
curl -sL -H "Authorization: Bearer $TOKEN" -o "$D/v.zip" "https://api.github.com/repos/$REPO/actions/artifacts/$AID/zip"
( cd "$D" && unzip -o -q v.zip && mv ./*.mp4 ../video.mp4 && rm -f v.zip )
ls -la "out/loc/$V/$L/video.mp4" && echo "DESCARGADO $L"
