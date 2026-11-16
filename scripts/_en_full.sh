#!/usr/bin/env bash
# _en_full.sh <v>... — tras revisar las hojas: reglas (con extra-skips) -> build -> re-corte (caché) -> relajado -> fase full (commit + subir planos + render en la nube)
export PATH="/usr/bin:/bin:/c/Program Files/nodejs:$PATH"
cd /c/Users/aleja/Desktop/car-channel-editor
LOG=out/_en_full.log
for v in "$@"; do
  echo "=== $v rebuild $(date +%H:%M)" >> $LOG
  python -X utf8 scripts/_mk_rules.py $v yt-$v out/_face1-$v.txt out/_face2-$v.txt > /dev/null
  python -X utf8 scripts/make_build.py $v > /dev/null
  cp out/_align-$v.json out/_align.json
  YT_SUBDIR=yt-$v node scripts/build-video.$v.mjs > out/_build-$v.log 2>&1 || { echo "=== $v BUILD FALLO" >> $LOG; continue; }
  cp out/_shots-plan.json out/_shots-plan-$v.json; cp src/config.ts out/_config-$v.ts
  STAGE=cut bash scripts/vid_pipeline.sh $v input/narration-$v.mp3 input/titulo-$v.txt > out/_pipeC-$v.log 2>&1
  python -X utf8 scripts/_auto_relax.py $v > out/_relaxC-$v.log 2>&1
  STAGE=cut bash scripts/vid_pipeline.sh $v input/narration-$v.mp3 input/titulo-$v.txt > out/_pipeD-$v.log 2>&1
  grep -q "CORTE TERMINADO" out/_pipeD-$v.log || { echo "=== $v CORTE FALLO" >> $LOG; continue; }
  if [ -n "$HOLD" ]; then cp src/config.ts out/_patch-$v-config.ts; echo "=== $v HOLD $(date +%H:%M) (revisar planos; luego subir-shots + _render_branch)" >> $LOG; continue; fi
  echo "=== $v full $(date +%H:%M) $(tail -2 out/_pipeD-$v.log | head -1 | tr -d '\000')" >> $LOG
  bash scripts/vid_pipeline.sh $v input/narration-$v.mp3 input/titulo-$v.txt > out/_full-$v.log 2>&1
  echo "=== $v DONE $(date +%H:%M) $(grep -a 'run [0-9]\|dispatch\|FALLO' out/_full-$v.log | tr -d '\000' | tr '\n' ' ')" >> $LOG
done
echo EN_FULL_FIN >> $LOG
