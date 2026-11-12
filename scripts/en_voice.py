#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""en_voice.py <v>  — Car Lovers English: voz de un vídeo ORIGINAL en inglés.
Lee input/guion-en-<v>.txt (1ª línea = SCRIPT: "título"), genera la narración con ai33 (voz del canal EN)
párrafo a párrafo vía loc_tts.py y deja lo que espera make_build.py:
  input/guion-<v>.txt      (guion hablado, sin la línea del título)
  input/narration-<v>.mp3  (narración)
  input/titulo-<v>.txt     (título de out/_youtube-<v>.txt, o el del guion)
"""
import json, os, re, shutil, subprocess, sys

VOICE = "elevenlabs_4N8zjn9tVNuDEBFWVHAq"
v = sys.argv[1]
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
src = open(f"{ROOT}/input/guion-en-{v}.txt", encoding="utf-8").read().replace("\r", "")
first, _, body = src.partition("\n")
title = re.sub(r'^SCRIPT:\s*', "", first).strip().strip('"“”')
body = body.strip() + "\n"
lines = [l.strip() for l in body.split("\n") if l.strip()]
os.makedirs(f"{ROOT}/input/loc/{v}", exist_ok=True)
json.dump({"voice": VOICE, "lines": lines}, open(f"{ROOT}/input/loc/{v}/en.json", "w", encoding="utf-8"), ensure_ascii=False, indent=0)
open(f"{ROOT}/input/guion-{v}.txt", "w", encoding="utf-8").write(body)
yt = f"{ROOT}/out/_youtube-{v}.txt"
if os.path.exists(yt):
    t = open(yt, encoding="utf-8").read().split("\n")
    for i, l in enumerate(t):
        if "TITLE" in l.upper() or "TÍTULO" in l.upper():
            nxt = next((x.strip() for x in t[i + 1:] if x.strip()), "")
            if nxt:
                title = nxt
            break
open(f"{ROOT}/input/titulo-{v}.txt", "w", encoding="utf-8").write(title + "\n")
print(f"[{v}] {len(lines)} párrafos · {len(body)} caracteres · título: {title}", flush=True)
r = subprocess.run([sys.executable, "-X", "utf8", f"{ROOT}/scripts/loc_tts.py", v, "en", "5"], cwd=ROOT)
if r.returncode:
    sys.exit(r.returncode)
shutil.copyfile(f"{ROOT}/out/loc/{v}/en/narration.mp3", f"{ROOT}/input/narration-{v}.mp3")
print(f"[{v}] VOZ_OK -> input/narration-{v}.mp3", flush=True)
