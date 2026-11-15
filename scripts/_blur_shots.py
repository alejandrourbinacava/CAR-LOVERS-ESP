#!/usr/bin/env python3
"""_blur_shots.py <v> <masks.json> [skip_idx,...]: difumina cajas (coords 1920x1080) en los PLANOS YA CORTADOS de un vídeo
sin volver a bajar los fuentes. masks.json = {"clave_clip" o "#indice": [[x1,y1,x2,y2],...]}. El origen de cada plano sale de
out/_config-<v>.ts; el plano actual de out/_patch-<v>-config.ts (se reescribe). Sube los planos nuevos al Release shots-<v>."""
import sys, os, re, json, hashlib, subprocess, urllib.request
import cv2
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
os.chdir(ROOT)
v, mpath = sys.argv[1], sys.argv[2]
skip = {int(x) for x in sys.argv[3].split(",")} if len(sys.argv) > 3 and sys.argv[3] else set()
masks = json.load(open(mpath, encoding="utf-8"))
src = open(os.path.join(ROOT, "scripts", "prep-shots.py"), encoding="utf-8").read()
ns = {"__file__": os.path.join(ROOT, "scripts", "prep-shots.py"), "__name__": "blur"}
_a = sys.argv; sys.argv = ["prep-shots.py", f"shots-{v}", "2"]; exec(src.split("if __name__")[0], ns); sys.argv = _a
blur_boxes = ns["blur_boxes"]
if os.environ.get("STRONG"):
    import numpy as np
    def blur_boxes(frame, boxes):   # difuminado fuerte y liso (texto grande / matrículas cercanas)
        for (x1, y1, x2, y2) in boxes:
            x1, y1, x2, y2 = max(0, x1), max(0, y1), min(frame.shape[1], x2), min(frame.shape[0], y2)
            roi = frame[y1:y2, x1:x2]
            if roi.size == 0: continue
            h, w = roi.shape[:2]
            small = cv2.resize(roi, (max(2, w // 40), max(2, h // 40)), interpolation=cv2.INTER_AREA)
            up = cv2.resize(small, (w, h), interpolation=cv2.INTER_LINEAR)
            frame[y1:y2, x1:x2] = cv2.GaussianBlur(up, (31, 31), 0)
        return frame
rx = r'clipSrc: "([^"]+)", durationInSeconds: ([\d.]+), startFromSeconds: ([\d.]+)'
orig = re.findall(rx, open(f"out/_config-{v}.ts", encoding="utf-8").read())
cfgp = f"out/_patch-{v}-config.ts"
cfg = open(cfgp, encoding="utf-8").read()
cur = re.findall(rx, cfg)
assert len(orig) == len(cur)
new = []
for i, (o, c) in enumerate(zip(orig, cur)):
    key = os.path.basename(o[0])[:-4].replace("marca-", "")
    boxes = [tuple(b) for b in masks.get(f"#{i}", [])]
    if f"/yt-{v}/" in o[0] and key in masks and i not in skip: boxes += [tuple(b) for b in masks[key]]
    if not boxes: continue
    f_in = c[0]
    name = "shot-" + hashlib.md5(f"{f_in}|{boxes}|blur".encode()).hexdigest()[:10]
    f_out = f"assets/shots-{v}/{name}.mp4"
    cap = cv2.VideoCapture("public/" + f_in)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", "1920x1080", "-framerate", f"{fps:.3f}", "-i", "-",
                          "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "public/" + f_out], stdin=subprocess.PIPE)
    n = 0
    while True:
        ok, fr = cap.read()
        if not ok: break
        if fr.shape[1] != 1920: fr = cv2.resize(fr, (1920, 1080))
        p.stdin.write(blur_boxes(fr, boxes).tobytes()); n += 1
    p.stdin.close(); p.wait()
    cfg = cfg.replace(f_in, f_out, 1)
    new.append("public/" + f_out)
    print(i, key, f_in, "->", name, n, "fr", flush=True)
open(cfgp, "w", encoding="utf-8", newline="\n").write(cfg)
tok = subprocess.run(["git", "credential", "fill"], input=b"protocol=https\nhost=github.com\n\n", capture_output=True).stdout.decode()
tok = re.search(r"^password=(.*)$", tok, re.M).group(1).strip()
api = "https://api.github.com/repos/alejandrourbinacava/CAR-LOVERS-ESP"
rid = json.load(urllib.request.urlopen(urllib.request.Request(f"{api}/releases/tags/shots-{v}", headers={"Authorization": f"Bearer {tok}"})))["id"]
for f in new:
    req = urllib.request.Request(f"https://uploads.github.com/repos/alejandrourbinacava/CAR-LOVERS-ESP/releases/{rid}/assets?name={os.path.basename(f)}",
                                 data=open(f, "rb").read(), method="POST", headers={"Authorization": f"Bearer {tok}", "Content-Type": "video/mp4"})
    try: print("subido", os.path.basename(f), urllib.request.urlopen(req).status, flush=True)
    except urllib.error.HTTPError as e: print("subida", os.path.basename(f), e.code, e.read()[:200], flush=True)
print("BLUR_OK", len(new))
