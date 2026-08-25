#!/usr/bin/env bash
# Sube todos los marca-*.mp4 de una carpeta a un Release de GitHub y (opcional)
# dispara el workflow de render en la nube.
#   uso: bash scripts/subir-clips.sh <carpeta_clips> <tag_release> [montar]
# ej.:  bash scripts/subir-clips.sh public/assets/yt-alemanes clips-alemanes montar
set -euo pipefail
DIR="${1:?carpeta de clips}"; TAG="${2:?tag del release}"; GO="${3:-}"
REPO="alejandrourbinacava/CAR-LOVERS-ESP"
SUBDIR="$(basename "$DIR")"
TOKEN=$(printf "protocol=https\nhost=github.com\n\n" | git credential fill 2>/dev/null | sed -n 's/^password=//p')
[ -n "$TOKEN" ] || { echo "No hay token de GitHub (haz 'git push' una vez para guardarlo)"; exit 1; }
API="https://api.github.com/repos/$REPO"

# Crear o reutilizar el Release
RID=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/releases/tags/$TAG" | python -c "import sys,json;print(json.load(sys.stdin).get('id',''))" 2>/dev/null || true)
if [ -z "$RID" ]; then
  RID=$(curl -s -X POST -H "Authorization: Bearer $TOKEN" "$API/releases" \
    -d "{\"tag_name\":\"$TAG\",\"name\":\"Clips $TAG\",\"prerelease\":true}" | python -c "import sys,json;print(json.load(sys.stdin)['id'])")
fi
echo "Release '$TAG' id=$RID"
UP="https://uploads.github.com/repos/$REPO/releases/$RID/assets"

n=0
for f in "$DIR"/marca-*.mp4; do
  [ -f "$f" ] || continue
  name="$(basename "$f")"
  # borrar asset previo con ese nombre (permite re-subir)
  AID=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/releases/$RID/assets" | python -c "import sys,json;print(next((a['id'] for a in json.load(sys.stdin) if a['name']=='$name'),''))" 2>/dev/null || true)
  [ -n "$AID" ] && curl -s -X DELETE -H "Authorization: Bearer $TOKEN" "$API/releases/assets/$AID" >/dev/null || true
  echo ">>> $name ($(ls -la "$f" | awk '{printf "%.0f MB",$5/1048576}'))..."
  curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: video/mp4" \
    --data-binary @"$f" "$UP?name=$name" >/dev/null && echo "    OK" || echo "    FALLO"
  n=$((n+1))
done
echo "=== $n clips subidos al Release '$TAG' ==="

if [ "$GO" = "montar" ]; then
  echo ">>> disparando render en la nube (subdir=$SUBDIR)..."
  curl -s -o /dev/null -w "dispatch HTTP %{http_code}\n" -X POST \
    -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" \
    "$API/actions/workflows/render-release.yml/dispatches" \
    -d "{\"ref\":\"main\",\"inputs\":{\"subdir\":\"$SUBDIR\",\"tag\":\"$TAG\"}}"
  echo "Mira el progreso en: https://github.com/$REPO/actions"
fi
