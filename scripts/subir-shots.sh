#!/usr/bin/env bash
# Sube al Release <tag> SOLO los planos que referencia src/config.ts (los shot-*.mp4 que
# genera scripts/prep-shots.py) y, con "montar", dispara render-shots.yml.
#   uso: bash scripts/subir-shots.sh <carpeta_en_public/assets> <tag> [montar]
#   ej.: bash scripts/subir-shots.sh shots-diesel shots-diesel montar
set -uo pipefail
cd "$(dirname "$0")/.."
SUB="${1:?carpeta (dentro de public/assets)}"; TAG="${2:?tag del release}"; GO="${3:-}"
REPO="alejandrourbinacava/CAR-LOVERS-ESP"
TOKEN=$(printf "protocol=https\nhost=github.com\n\n" | git credential fill 2>/dev/null | sed -n 's/^password=//p')
[ -n "$TOKEN" ] || { echo "No hay token de GitHub"; exit 1; }
API="https://api.github.com/repos/$REPO"

RID=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/releases/tags/$TAG" | python -c "import sys,json;print(json.load(sys.stdin).get('id',''))" 2>/dev/null || true)
if [ -z "$RID" ]; then
  RID=$(curl -s -X POST -H "Authorization: Bearer $TOKEN" "$API/releases" \
    -d "{\"tag_name\":\"$TAG\",\"name\":\"Planos $TAG\",\"prerelease\":true}" | python -c "import sys,json;print(json.load(sys.stdin)['id'])")
fi
echo "Release '$TAG' id=$RID"

# lista de planos referenciados + los que ya están subidos
grep -o "assets/$SUB/shot-[a-z0-9]*\.mp4" src/config.ts | sed "s#assets/$SUB/##" | sort -u > /tmp/_shots_need.txt
curl -s -H "Authorization: Bearer $TOKEN" "$API/releases/$RID/assets?per_page=100" | python -c "import sys,json;[print(a['name']) for a in json.load(sys.stdin)]" > /tmp/_shots_have.txt
PAGE=2
while true; do
  N=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/releases/$RID/assets?per_page=100&page=$PAGE" | python -c "import sys,json;d=json.load(sys.stdin);[print(a['name']) for a in d];" | tee -a /tmp/_shots_have.txt | wc -l)
  [ "$N" -lt 100 ] && break; PAGE=$((PAGE+1))
done
sort -u /tmp/_shots_have.txt -o /tmp/_shots_have.txt
comm -23 /tmp/_shots_need.txt /tmp/_shots_have.txt > /tmp/_shots_todo.txt
echo "Planos necesarios: $(wc -l < /tmp/_shots_need.txt) · ya subidos: $(comm -12 /tmp/_shots_need.txt /tmp/_shots_have.txt | wc -l) · por subir: $(wc -l < /tmp/_shots_todo.txt)"

UP="https://uploads.github.com/repos/$REPO/releases/$RID/assets"
export TOKEN UP SUB
up_one() {
  f="$1"
  code=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: video/mp4" \
    --data-binary @"public/assets/$SUB/$f" "$UP?name=$f")
  echo "$f $code"
}
export -f up_one
xargs -a /tmp/_shots_todo.txt -P 6 -I{} bash -c 'up_one {}' | awk '{ if ($2!="201") print "FALLO:", $0; n++ } END { print "=== subidos:", n+0, "===" }'

if [ "$GO" = "montar" ]; then
  echo ">>> disparando render-shots.yml (subdir=$SUB tag=$TAG)..."
  curl -s -o /dev/null -w "dispatch HTTP %{http_code}\n" -X POST \
    -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" \
    "$API/actions/workflows/render-shots.yml/dispatches" \
    -d "{\"ref\":\"main\",\"inputs\":{\"subdir\":\"$SUB\",\"tag\":\"$TAG\"}}"
fi
