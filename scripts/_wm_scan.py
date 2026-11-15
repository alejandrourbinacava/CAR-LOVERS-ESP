#!/usr/bin/env python3
"""_wm_scan.py <v> <outdir>: busca marcas de agua/rótulos fijos en public/assets/yt-<v>/marca-*.mp4.
Bordes (Canny) presentes en >=75 % de 24 fotogramas = superposición fija (logo, subtítulo de canal, botón).
Saca hojas con cada clip y los bordes fijos en rojo, ordenadas por puntuación (más sospechosos primero)."""
import sys, os, glob, subprocess
import numpy as np, cv2
from PIL import Image, ImageDraw
v, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
W, H = 640, 360
res = []
allbox = {}
import json
for f in sorted(glob.glob(f"public/assets/yt-{v}/marca-*.mp4")):
    key = os.path.basename(f)[6:-4]
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout or 0)
    if dur <= 0: continue
    frames = []
    for k in range(24):
        t = dur * (k + 0.5) / 24
        r = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.2f}", "-i", f, "-frames:v", "1", "-vf", f"scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "bgr24", "-"], capture_output=True)
        if len(r.stdout) == W * H * 3: frames.append(np.frombuffer(r.stdout, np.uint8).reshape(H, W, 3).copy())
    if len(frames) < 8: continue
    edges = np.mean([cv2.Canny(cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY), 80, 200) > 0 for fr in frames], axis=0)
    pers = edges >= 0.75
    pers[:, :4] = pers[:, -4:] = False; pers[:4] = pers[-4:] = False
    score = int(pers.sum())
    n, lab, st, _ = cv2.connectedComponentsWithStats(cv2.dilate(pers.astype(np.uint8), np.ones((9, 9), np.uint8)))
    boxes = []
    for i in range(1, n):
        x, y, w, h, a = st[i]
        if a < 60 or w > W * 0.6 or h > H * 0.6 or (w > W * 0.4 and h < 8): continue
        sx = 1920 / W
        boxes.append([max(0, int((x - 6) * sx)), max(0, int((y - 6) * sx)), min(1920, int((x + w + 6) * sx)), min(1080, int((y + h + 6) * sx))])
    for b in boxes: cv2.rectangle(frames[len(frames) // 2], (int(b[0] / 3), int(b[1] / 3)), (int(b[2] / 3), int(b[3] / 3)), (0, 255, 0), 2)
    allbox[key] = boxes
    base = frames[len(frames) // 2].copy()
    base[pers] = (0, 0, 255)
    res.append((score, key, base))
res.sort(key=lambda r: -r[0])
for n in range(0, len(res), 12):
    sheet = Image.new("RGB", (4 * 400, 3 * 245), (40, 40, 40)); d = ImageDraw.Draw(sheet)
    for j, (score, key, img) in enumerate(res[n:n + 12]):
        im = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB)).resize((400, 225))
        x, y = (j % 4) * 400, (j // 4) * 245
        sheet.paste(im, (x, y + 20)); d.text((x + 4, y + 4), f"{key}  {score}", fill=(255, 255, 0))
    sheet.save(f"{out}/wm_{n // 12}.jpg")
json.dump(allbox, open(f"{out}/boxes.json", "w"), indent=0)
print(" ".join(f"{k}:{s}" for s, k, _ in res))
