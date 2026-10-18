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

# planos necesarios (config.ts) menos los que ya están en el Release (comparación en Python: sin problemas de CR)
python - "$SUB" "$TOKEN" "$API" "$RID" <<'PYEOF' > /tmp/_shots_todo.txt
import json, re, sys, urllib.request
sub, token, api, rid = sys.argv[1:5]
need = sorted(set(re.findall(r"assets/%s/(shot-[a-z0-9]+\.mp4)" % re.escape(sub), open("src/config.ts", encoding="utf-8").read())))
have, page = set(), 1
while True:
    req = urllib.request.Request(f"{api}/releases/{rid}/assets?per_page=100&page={page}", headers={"Authorization": f"Bearer {token}"})
    d = json.load(urllib.request.urlopen(req))
    have |= {a["name"] for a in d}
    if len(d) < 100:
        break
    page += 1
sys.stderr.write("Planos necesarios: %d - ya subidos: %d - por subir: %d" % (len(need), len([n for n in need if n in have]), len([n for n in need if n not in have])) + chr(10))
print(chr(10).join(n for n in need if n not in have))
PYEOF

UP="https://uploads.github.com/repos/$REPO/releases/$RID/assets"
export TOKEN UP SUB
up_one() {
  f="$1"
  code=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: video/mp4" \
    --data-binary @"public/assets/$SUB/$f" "$UP?name=$f")
  echo "$f $code"
}
export -f up_one
[ -s /tmp/_shots_todo.txt ] && xargs -a /tmp/_shots_todo.txt -P 3 -I{} bash -c 'up_one {}' | awk '{ if ($2!="201" && $2!="422") print "FALLO:", $0; n++ } END { print "=== subidos:", n+0, "===" }'

if [ "$GO" = "montar" ]; then
  echo ">>> disparando render-shots.yml (subdir=$SUB tag=$TAG)..."
  curl -s -o /dev/null -w "dispatch HTTP %{http_code}\n" -X POST \
    -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" \
    "$API/actions/workflows/render-shots.yml/dispatches" \
    -d "{\"ref\":\"main\",\"inputs\":{\"subdir\":\"$SUB\",\"tag\":\"$TAG\"}}"
fi
