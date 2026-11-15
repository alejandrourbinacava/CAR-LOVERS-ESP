#!/usr/bin/env python3
"""_wm_scan_shots.py <v> <outdir>: como _wm_scan.py pero sobre los PLANOS ya cortados (public/assets/shots-<v>),
agrupados por clip de origen (out/_config-<v>.ts da el origen; out/_patch-<v>-config.ts o src/config.ts el plano actual).
Sirve cuando los fuentes yt-<v> ya se borraron. Bordes presentes en >=75 % de los fotogramas = rótulo/logo fijo."""
import sys, os, re, subprocess, json
import numpy as np, cv2
from PIL import Image, ImageDraw
v, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
rx = r'clipSrc: "([^"]+)", durationInSeconds: ([\d.]+), startFromSeconds: ([\d.]+)'
src = re.findall(rx, open(f"out/_config-{v}.ts", encoding="utf-8").read())
cur_f = f"out/_patch-{v}-config.ts" if os.path.exists(f"out/_patch-{v}-config.ts") else "src/config.ts"
cur = re.findall(rx, open(cur_f, encoding="utf-8").read())
assert len(src) == len(cur), (len(src), len(cur))
groups = {}
for i, (s, c) in enumerate(zip(src, cur)):
    if "/yt-" not in s[0] and ("/clips/" not in s[0] or "yt" in sys.argv[3:]): continue
    key = os.path.basename(s[0])[:-4].replace("marca-", "")
    f = "public/" + c[0]
    if os.path.exists(f): groups.setdefault(key, []).append((i, f, float(c[1])))
W, H = 640, 360
res, allbox = [], {}
for key, shots in groups.items():
    per = max(2, 24 // len(shots))
    frames = []
    for i, f, d in shots:
        for k in range(per):
            t = d * (k + 0.5) / per
            r = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.2f}", "-i", f, "-frames:v", "1", "-vf", f"scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "bgr24", "-"], capture_output=True)
            if len(r.stdout) == W * H * 3: frames.append(np.frombuffer(r.stdout, np.uint8).reshape(H, W, 3).copy())
    if len(frames) < 4: continue
    edges = np.mean([cv2.Canny(cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY), 80, 200) > 0 for fr in frames], axis=0)
    pers = edges >= 0.75
    pers[:, :4] = pers[:, -4:] = False; pers[:4] = pers[-4:] = False
    score = int(pers.sum()) * (2 if len(shots) > 1 else 1)
    n, lab, st, _ = cv2.connectedComponentsWithStats(cv2.dilate(pers.astype(np.uint8), np.ones((9, 9), np.uint8)))
    boxes = []
    for j in range(1, n):
        x, y, w, h, a = st[j]
        if a < 60 or w > W * 0.6 or h > H * 0.6 or (w > W * 0.4 and h < 8): continue
        sx = 1920 / W
        boxes.append([max(0, int((x - 6) * sx)), max(0, int((y - 6) * sx)), min(1920, int((x + w + 6) * sx)), min(1080, int((y + h + 6) * sx))])
    base = frames[len(frames) // 2].copy()
    base[pers] = (0, 0, 255)
    for b in boxes: cv2.rectangle(base, (int(b[0] / 3), int(b[1] / 3)), (int(b[2] / 3), int(b[3] / 3)), (0, 255, 0), 2)
    allbox[key] = {"boxes": boxes, "idx": [s[0] for s in shots]}
    res.append((score, key, len(shots), base))
res.sort(key=lambda r: -r[0])
for n in range(0, len(res), 12):
    sheet = Image.new("RGB", (4 * 400, 3 * 245), (40, 40, 40)); d = ImageDraw.Draw(sheet)
    for j, (score, key, ns, img) in enumerate(res[n:n + 12]):
        im = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB)).resize((400, 225))
        x, y = (j % 4) * 400, (j // 4) * 245
        sheet.paste(im, (x, y + 20)); d.text((x + 4, y + 4), f"{key} n={ns} {score}", fill=(255, 255, 0))
    sheet.save(f"{out}/wm_{n // 12:02d}.jpg")
json.dump(allbox, open(f"{out}/boxes.json", "w"), indent=0)
print(len(res), "grupos;", " ".join(f"{k}:{s}" for s, k, _, _ in res[:40]))
