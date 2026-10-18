#!/usr/bin/env bash
# loc_pipeline.sh <video> <idioma>...   (ej.: bash scripts/loc_pipeline.sh suv it de fr)
# Por cada idioma: montaje (build) -> fotos limpias -> planos con matrículas tapadas -> QA -> commit/push
# -> subir planos al Release -> lanzar render en GitHub -> esperar y descargar el vídeo (en segundo plano).
# Lanzarlo con prioridad Idle (Start-Process + PriorityClass) para no molestar mientras se juega.
cd "$(dirname "$0")/.."
V="$1"; shift
export YT_SUBDIR="yt-$V"
TOKEN=$(printf "protocol=https\nhost=github.com\n\n" | git credential fill 2>/dev/null | sed -n 's/^password=//p')
REPO="alejandrourbinacava/CAR-LOVERS-ESP"
for L in "$@"; do
  echo "=== [$L] $(date +%H:%M) build"
  LOC="$L" node scripts/build-video.$V.mjs > "out/_build-$V-$L.log" 2>&1 || { echo "[$L] BUILD FALLO"; continue; }
  echo "=== [$L] $(date +%H:%M) fotos limpias"
  python scripts/clean-images.py > "out/_clean-$V-$L.log" 2>&1
  echo "=== [$L] $(date +%H:%M) planos"
  python scripts/prep-shots.py "shots-$V-$L" 2 > "out/_prep-$V-$L.log" 2> "out/_prep-$V-$L.err"
  grep -q PREP_SHOTS_OK "out/_prep-$V-$L.log" || { echo "[$L] PREP FALLO"; continue; }
  python scripts/qa-plates.py "shots-$V-$L" > "out/_qa-$V-$L.log" 2>/dev/null
  cp out/_shotqa/plates.jpg "out/_shotqa/plates-$V-$L.jpg" 2>/dev/null
  echo "=== [$L] $(date +%H:%M) commit"
  python -c "
import json;d=json.load(open('input/loc/$V/$L.json',encoding='utf-8'));open('out/loc/$V/$L/titulo.txt','w',encoding='utf-8').write(d['titulo'])"
  git add -f public/assets/img-clean src/config.ts "out/loc/$V/$L/narration.mp3" "out/loc/$V/$L/titulo.txt" scripts/bad-images.json 2>/dev/null
  git commit -q -m "Doblaje $V ($L): montaje con fotos de los modelos 2027 y planos" && git push -q origin main
  SHA=$(git rev-parse --short HEAD)
  echo "=== [$L] $(date +%H:%M) subir planos ($SHA)"
  bash scripts/subir-shots.sh "shots-$V-$L" "shots-$V-$L" > "out/_upload-$V-$L.log" 2>&1
  grep -q FALLO "out/_upload-$V-$L.log" && { echo "[$L] UPLOAD con FALLOS"; continue; }
  curl -s -o /dev/null -w "[$L] dispatch HTTP %{http_code}\n" -X POST -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/$REPO/actions/workflows/render-shots.yml/dispatches" \
    -d "{\"ref\":\"main\",\"inputs\":{\"subdir\":\"shots-$V-$L\",\"tag\":\"shots-$V-$L\",\"narration\":\"out/loc/$V/$L/narration.mp3\",\"titulo_file\":\"out/loc/$V/$L/titulo.txt\"}}"
  sleep 8
  RID=$(curl -s -H "Authorization: Bearer $TOKEN" "https://api.github.com/repos/$REPO/actions/workflows/render-shots.yml/runs?per_page=1" | python -c "import sys,json;print(json.load(sys.stdin)['workflow_runs'][0]['id'])")
  echo "=== [$L] run $RID"
  echo "$RID" > "out/_run-$V-$L.txt"
  (nohup bash scripts/_wait_dl.sh "$RID" "$V" "$L" > "out/_dl-$V-$L.log" 2>&1 &)
done
echo "=== PIPELINE TERMINADO $(date +%H:%M)"
