#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""_patch_shots.py <v> <commit> <spec.json>: rehace planos concretos de un vídeo YA montado sin tocar src/config.ts
del árbol de trabajo (lo puede estar usando la cola de otro vídeo).

spec.json = [{"i": 33, "clip": "fab3", "start": 125, "dur": 3}, ...]  (i = posición del plano en config.ts)
- genera cada plano con prep-shots.process_shot (tapado de matrículas + STATIC_MASKS) con nombre nuevo
- escribe out/_patch-<v>-config.ts = config.ts de <commit> con esos planos cambiados
- sube los planos nuevos al Release shots-<v>
Después: bash scripts/_patch_commit.sh <v>  (commit sin tocar el árbol + push + render)
"""
import hashlib, json, os, re, subprocess, sys, urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
v, commit, spec_path = sys.argv[1:4]
spec = json.load(open(spec_path, encoding="utf-8"))
src = open(os.path.join(ROOT, "scripts", "prep-shots.py"), encoding="utf-8").read()
ns = {"__file__": os.path.join(ROOT, "scripts", "prep-shots.py"), "__name__": "patch"}
_argv = sys.argv; sys.argv = ["prep-shots.py", f"shots-{v}", "2"]   # prep-shots lee argv al importarse
exec(src.split("if __name__")[0], ns)
sys.argv = _argv

cfg = (open(os.path.join(ROOT, "out", f"_patch-{v}-config.ts"), encoding="utf-8").read() if commit == "cur" else
       subprocess.run(["git", "show", f"{commit}:src/config.ts"], cwd=ROOT, capture_output=True).stdout.decode("utf-8"))
pat = re.compile(r'assets/shots-%s/(shot-[0-9a-f]+)\.mp4' % re.escape(v))
names = pat.findall(cfg)
out_dir = os.path.join(ROOT, "public", "assets", f"shots-{v}")
new_files = []
for s in spec:
    clip = f"assets/yt-{v}/marca-{s['clip']}.mp4"
    masked = f"yt-{v}/marca-{s['clip']}" in ns["STATIC_MASKS"]
    key = hashlib.md5(f"{clip}|{s['start']}|{s['dur']}|v8{'pm' if masked else ''}|patch".encode()).hexdigest()[:10]
    name = f"shot-{key}"
    out = os.path.join(out_dir, name + ".mp4")
    r = ns["process_shot"]((s["i"], os.path.join(ROOT, "public", clip), float(s["start"]), float(s["dur"]), out, False))
    print(s, "->", name, r, flush=True)
    if r[1] < 0:
        sys.exit(f"FALLO generando {s}")
    old = names[s["i"]]
    cfg = cfg.replace(f"assets/shots-{v}/{old}.mp4", f"assets/shots-{v}/{name}.mp4", 1)
    new_files.append(out)
open(os.path.join(ROOT, "out", f"_patch-{v}-config.ts"), "w", encoding="utf-8", newline="\n").write(cfg)

tok = subprocess.run(["git", "credential", "fill"], input=b"protocol=https\nhost=github.com\n\n", capture_output=True, cwd=ROOT).stdout.decode()
tok = re.search(r"^password=(.*)$", tok, re.M).group(1).strip()
api = "https://api.github.com/repos/alejandrourbinacava/CAR-LOVERS-ESP"
try:
    rid = json.load(urllib.request.urlopen(urllib.request.Request(f"{api}/releases/tags/shots-{v}", headers={"Authorization": f"Bearer {tok}"})))["id"]
except urllib.error.HTTPError:
    print("sin Release shots-%s todavia: se subira con subir-shots.sh" % v); new_files = []
for f in new_files:
    req = urllib.request.Request(f"https://uploads.github.com/repos/alejandrourbinacava/CAR-LOVERS-ESP/releases/{rid}/assets?name={os.path.basename(f)}",
                                 data=open(f, "rb").read(), method="POST",
                                 headers={"Authorization": f"Bearer {tok}", "Content-Type": "video/mp4"})
    try:
        print("subido", os.path.basename(f), urllib.request.urlopen(req).status, flush=True)
    except urllib.error.HTTPError as e:
        print("subida", os.path.basename(f), e.code, e.read()[:200], flush=True)
print("PATCH_OK", len(new_files))
