#!/usr/bin/env python3
"""_pick_repl.py <v> <idx,idx,...> > spec.json : elige un tramo nuevo del MISMO clip para cada plano malo,
sin solaparse con tramos ya usados en el vídeo (±1 s), evitando el 8 % inicial y el 25 % final (intros/pantallas finales)."""
import sys, re, json, subprocess
v = sys.argv[1]; bad = [int(x) for x in sys.argv[2].split(",")]
rx = r'clipSrc: "([^"]+)", durationInSeconds: ([\d.]+), startFromSeconds: ([\d.]+)'
P = re.findall(rx, open(f"out/_config-{v}.ts", encoding="utf-8").read())
used = {}
for c, d, s in P: used.setdefault(c, []).append((float(s), float(s) + float(d)))
spec = []
for i in bad:
    c, d, s = P[i]; d = float(d)
    f = "public/" + c
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)
    lo, hi = max(8.0, dur * 0.08), dur * 0.75 - d
    t = lo; ok = None
    while t <= hi:
        if all(t + d + 1 <= a or t - 1 >= b for a, b in used[c]): ok = t; break
        t += 2.5
    if ok is None: print(f"# sin hueco {i} {c}", file=sys.stderr); continue
    used[c].append((ok, ok + d))
    spec.append({"i": i, "clip": c.split("marca-")[1][:-4], "start": ok, "dur": d})
    print(f"# {i} {c} {s} -> {ok} (clip {dur:.0f}s)", file=sys.stderr)
print(json.dumps(spec))
