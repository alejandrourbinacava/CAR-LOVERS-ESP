#!/usr/bin/env python3
"""_shot_zoom.py <v> <outjpg> <idx,idx,...> [crop x,y,w,h]: fotogramas al 25 % y 75 % de los planos dados, a 800 px (o recorte a tamaño real)."""
import sys, re, subprocess
from PIL import Image, ImageDraw
v, out, idx = sys.argv[1], sys.argv[2], [int(x) for x in sys.argv[3].split(",")]
crop = [int(x) for x in sys.argv[4].split(",")] if len(sys.argv) > 4 else None
rx = r'clipSrc: "([^"]+)", durationInSeconds: ([\d.]+), startFromSeconds: ([\d.]+)'
Q = re.findall(rx, open(f"out/_patch-{v}-config.ts", encoding="utf-8").read())
TW, TH = (crop[2], crop[3]) if crop else (800, 450)
vf = f"crop={crop[2]}:{crop[3]}:{crop[0]}:{crop[1]}" if crop else f"scale={TW}:{TH}"
ims = []
for i in idx:
    for fr in (0.25, 0.75):
        r = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{float(Q[i][1])*fr:.2f}", "-i", "public/" + Q[i][0], "-frames:v", "1", "-vf", vf, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True)
        im = Image.frombytes("RGB", (TW, TH), r.stdout); ImageDraw.Draw(im).text((4, 4), str(i), fill=(255, 0, 255)); ims.append(im)
sh = Image.new("RGB", (TW * 2, TH * len(idx)))
for j, im in enumerate(ims): sh.paste(im, ((j % 2) * TW, (j // 2) * TH))
sh.save(out, quality=85)
