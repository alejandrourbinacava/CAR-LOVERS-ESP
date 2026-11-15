#!/usr/bin/env python3
"""_shot_sheets.py <v> <outdir> [cfg]: hoja con el fotograma central de CADA plano (índice + clip de origen)
para revisar logos/rótulos/pantallas finales de otros canales. cfg por defecto out/_patch-<v>-config.ts."""
import sys, os, re, subprocess
from PIL import Image, ImageDraw
v, out = sys.argv[1], sys.argv[2]
cfg = sys.argv[3] if len(sys.argv) > 3 else f"out/_patch-{v}-config.ts"
os.makedirs(out, exist_ok=True)
rx = r'clipSrc: "([^"]+)", durationInSeconds: ([\d.]+), startFromSeconds: ([\d.]+)'
P = re.findall(rx, open(f"out/_config-{v}.ts", encoding="utf-8").read())
Q = re.findall(rx, open(cfg, encoding="utf-8").read())
TW, TH, C, R = 320, 180, 6, 10
tiles = []
for i, (p, q) in enumerate(zip(P, Q)):
    f = "public/" + q[0]
    for frac in (0.25, 0.75):
        r = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{float(q[1])*frac:.2f}", "-i", f, "-frames:v", "1", "-vf", f"scale={TW}:{TH}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True)
        im = Image.frombytes("RGB", (TW, TH), r.stdout) if len(r.stdout) == TW * TH * 3 else Image.new("RGB", (TW, TH), (90, 0, 0))
        d = ImageDraw.Draw(im); lab = f"{i} {os.path.basename(p[0])[:-4].replace('marca-','')} {p[2]}"
        d.rectangle((0, 0, 7 * len(lab), 12), fill=(0, 0, 0)); d.text((2, 0), lab, fill=(255, 255, 0))
        tiles.append(im)
per = C * R
for n in range(0, len(tiles), per):
    sh = Image.new("RGB", (C * TW, R * TH))
    for j, im in enumerate(tiles[n:n + per]): sh.paste(im, ((j % C) * TW, (j // C) * TH))
    sh.save(f"{out}/s_{n // per:02d}.jpg", quality=80)
print(len(tiles) // 2, "planos")
