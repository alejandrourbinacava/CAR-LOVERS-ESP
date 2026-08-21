#!/usr/bin/env bash
cd "C:/Users/aleja/Desktop/car-channel-editor"
TOKEN=$(printf "protocol=https\nhost=github.com\n\n" | git credential fill 2>/dev/null | sed -n 's/^password=//p')
REPO="alejandrourbinacava/CAR-LOVERS-ESP"; RUN=32487245246
API="https://api.github.com/repos/$REPO/actions/runs/$RUN"
for i in $(seq 1 260); do
  st=$(curl -s -H "Authorization: Bearer $TOKEN" "$API" 2>/dev/null | python -c "import sys,json;d=json.load(sys.stdin);print(d['status'],d.get('conclusion'))" 2>/dev/null)
  echo "[$(printf '%03d' $((i*60)))s] $st"
  # snapshot de pasos
  curl -s -H "Authorization: Bearer $TOKEN" "$API/jobs" 2>/dev/null | python -c "import sys,json;d=json.load(sys.stdin);j=d['jobs'][0];print('  '+' | '.join([('['+((s['conclusion'] or s['status'])[:4])+'] '+s['name'][:22]) for s in j['steps'] if s['status']!='queued'][-4:]))" 2>/dev/null
  case "$st" in completed*) echo "=== FIN ==="; break;; esac
  sleep 60
done
# resumen final de pasos
curl -s -H "Authorization: Bearer $TOKEN" "$API/jobs" 2>/dev/null | python -c "import sys,json;d=json.load(sys.stdin);j=d['jobs'][0];print('CONCLUSION:',j.get('conclusion'));[print(' ',(s['conclusion'] or s['status']).ljust(11),s['name']) for s in j['steps']]"
