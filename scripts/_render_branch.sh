#!/usr/bin/env bash
# _render_branch.sh <v> <config.ts>: commit (árbol de main + ese config.ts) en la rama render-<v> y lanza render-shots.yml
# desde esa rama (así varios renders a la vez no se pisan el src/config.ts de main).
set -e
cd "$(dirname "$0")/.."
N="$1"; CFG="$2"
# comprobar que todo lo que usa el config (fichas, imágenes) está en git: si no, el render muere a mitad
MISS=$(grep -oE 'assets/(cut|img|img-clean)/[^"]+' "$CFG" | sort -u | while read p; do git ls-files --error-unmatch "public/$p" >/dev/null 2>&1 || echo "public/$p"; done)
for f in input/narration-$N.mp3 input/titulo-$N.txt; do [ -f "$f" ] && ! git ls-files --error-unmatch "$f" >/dev/null 2>&1 && MISS="$MISS $f"; true; done
if [ -n "$MISS" ]; then echo "[$N] FALTAN en git, se añaden:"; echo "$MISS"; git add -f $MISS && git commit -q -m "Video $N: fichas/imagenes que faltaban en el repo

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" && git push -q origin main; fi
REPO="alejandrourbinacava/CAR-LOVERS-ESP"
TOKEN=$(printf "protocol=https\nhost=github.com\n\n" | git credential fill 2>/dev/null | sed -n 's/^password=//p')
export GIT_INDEX_FILE=.git/_rb_index_$N
git read-tree HEAD
BLOB=$(git hash-object -w "$CFG")
git update-index --cacheinfo 100644 "$BLOB" src/config.ts
TREE=$(git write-tree)
C=$(printf "Render %s\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\n" "$N" | git commit-tree "$TREE" -p HEAD)
unset GIT_INDEX_FILE; rm -f .git/_rb_index_$N
git push -q -f origin "$C:refs/heads/render-$N"
curl -s -o /dev/null -w "[$N] dispatch HTTP %{http_code}\n" -X POST -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$REPO/actions/workflows/render-shots.yml/dispatches" \
  -d "{\"ref\":\"render-$N\",\"inputs\":{\"subdir\":\"shots-$N\",\"tag\":\"shots-$N\",\"narration\":\"input/narration-$N.mp3\",\"titulo_file\":\"input/titulo-$N.txt\"}}"
sleep 10
RID=$(curl -s -H "Authorization: Bearer $TOKEN" "https://api.github.com/repos/$REPO/actions/workflows/render-shots.yml/runs?branch=render-$N&per_page=1" | python -c "import sys,json;print(json.load(sys.stdin)['workflow_runs'][0]['id'])")
echo "[$N] run $RID"
