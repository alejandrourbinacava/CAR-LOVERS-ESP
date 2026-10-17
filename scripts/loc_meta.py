#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""loc_meta.py <video> <idioma>
Rellena {chapters} de la descripción traducida con los capítulos reales (src/config.ts del montaje doblado)
y deja out/loc/<video>/<idioma>/meta.json {title, description, tags, thumbnail} listo para subir."""
import json, os, re, sys

video, lang = sys.argv[1], sys.argv[2]
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
cfg = open(os.environ.get("CFG", f"{ROOT}/src/config.ts"), encoding="utf-8").read()   # CFG=<ruta> para un montaje que ya no esté en src/config.ts
chs = json.loads(re.search(r"chapters: (\[.*?\]),\n", cfg).group(1))
loc = json.load(open(f"{ROOT}/input/loc/{video}/{lang}.json", encoding="utf-8"))
lines, last = [], -99
for c in chs:
    t = int(round(c["fromSeconds"]))
    if t - last < 10 and lines:
        continue  # YouTube exige >= 10 s entre capítulos
    if not lines:
        t = 0  # el primer capítulo debe empezar en 0:00
    h, m, s = t // 3600, (t % 3600) // 60, t % 60
    lines.append(f"{h}:{m:02d}:{s:02d} {c['label']}" if h else f"{m}:{s:02d} {c['label']}")
    last = t
meta = loc["meta"]
desc = meta["description"].replace("{chapters}", "\n".join(lines))
thumb = f"{ROOT}/out/loc/{video}/thumb/{lang}.jpg"
out = {"title": meta["title"], "description": desc, "tags": meta["tags"], "thumbnail": thumb if os.path.exists(thumb) else None}
os.makedirs(f"{ROOT}/out/loc/{video}/{lang}", exist_ok=True)
json.dump(out, open(f"{ROOT}/out/loc/{video}/{lang}/meta.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
sys.stdout.reconfigure(encoding="utf-8")
print(out["title"], "\n", "\n".join(lines), "\n tags:", len(out["tags"]), "caracteres · miniatura:", out["thumbnail"])
