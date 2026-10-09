"""
clean-images.py — tapa las MATRÍCULAS de las fotos de modelo usadas en el montaje.

Lee out/_shots-plan.json (las entradas isImage), detecta matrículas con el mismo modelo ONNX que
prep-shots.py y guarda copias limpias en public/assets/img-clean/<nombre>.jpg. Después reescribe
src/config.ts para que esos planos apunten a las copias limpias.

uso:  python scripts/clean-images.py
"""
import importlib.util, json, os, re, sys

import cv2

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.argv = [sys.argv[0], "shots-tmp", "1"]
spec = importlib.util.spec_from_file_location("prep_shots", os.path.join(ROOT, "scripts", "prep-shots.py"))
ps = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ps)

OUT = os.path.join(ROOT, "public", "assets", "img-clean")
os.makedirs(OUT, exist_ok=True)
plan = json.load(open(os.path.join(ROOT, "out", "_shots-plan.json"), encoding="utf-8"))
srcs = list(dict.fromkeys(s["clipSrc"] for s in plan if s.get("isImage")))
det = ps.get_detector()
tot = 0
for rel in srcs:
    name = os.path.basename(rel)
    dst = os.path.join(OUT, name)
    if os.path.exists(dst):
        continue
    im = cv2.imread(os.path.join(ROOT, "public", rel))
    if im is None:
        print("no abre", rel); continue
    h, w = im.shape[:2]
    boxes = []
    for r in det.predict(im):
        b = r.bounding_box
        bw, bh = b.x2 - b.x1, b.y2 - b.y1
        ar, area = bw / max(1, bh), bw * bh / (w * h)
        if r.confidence >= 0.3 and 1.0 <= ar <= 7.5 and area <= 0.2:
            boxes.append((int(b.x1), int(b.y1), int(b.x2), int(b.y2)))
    if boxes:
        im = ps.blur_boxes(im.copy(), boxes, 1.4)
        tot += len(boxes)
    cv2.imwrite(dst, im, [cv2.IMWRITE_JPEG_QUALITY, 92])
print(f"{len(srcs)} fotos · {tot} matrículas tapadas")

cfg_path = os.path.join(ROOT, "src", "config.ts")
cfg = open(cfg_path, encoding="utf-8").read()
n = 0
for rel in srcs:
    old = f'"{rel}"'
    new = f'"assets/img-clean/{os.path.basename(rel)}"'
    if old in cfg:
        cfg = cfg.replace(old, new); n += 1
open(cfg_path, "w", encoding="utf-8").write(cfg)
print(f"config.ts: {n} rutas de foto actualizadas a img-clean")
