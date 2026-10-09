"""
qa-plates.py — repasa el detector de matrículas sobre los planos YA tapados y lista los que aún
muestran una matrícula (confianza alta). Guarda un mosaico de los sospechosos en out/_shotqa/plates.jpg

uso:  python scripts/qa-plates.py <carpeta en public/assets>   (p. ej. shots-usados)
"""
import importlib.util, os, re, sys

import cv2
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SUB = sys.argv[1] if len(sys.argv) > 1 else "shots-usados"
sys.argv = [sys.argv[0], "shots-tmp", "1"]
spec = importlib.util.spec_from_file_location("prep_shots", os.path.join(ROOT, "scripts", "prep-shots.py"))
ps = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ps)
det = ps.get_detector()

cfg = open(os.path.join(ROOT, "src", "config.ts"), encoding="utf-8").read()
files = re.findall(rf'clipSrc: "(assets/{SUB}/shot-[a-z0-9]+\.mp4)"', cfg)
bad = []
for i, rel in enumerate(files):
    cap = cv2.VideoCapture(os.path.join(ROOT, "public", rel))
    n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    hit = None
    for f in (int(n * 0.15), int(n * 0.5), int(n * 0.85)):
        cap.set(cv2.CAP_PROP_POS_FRAMES, f)
        ok, fr = cap.read()
        if not ok:
            continue
        for r in det.predict(fr):
            b = r.bounding_box
            bw, bh = b.x2 - b.x1, b.y2 - b.y1
            if r.confidence >= 0.5 and 1.8 <= bw / max(1, bh) <= 7.5 and bw * bh / (1920 * 1080) <= 0.2:
                hit = (fr, (int(b.x1), int(b.y1), int(b.x2), int(b.y2)), r.confidence)
                break
        if hit:
            break
    cap.release()
    if hit:
        bad.append((i, rel, hit))
print(f"{len(files)} planos revisados · {len(bad)} con matrícula detectable")
tiles = []
for i, rel, (fr, bx, c) in bad:
    t = fr.copy()
    cv2.rectangle(t, bx[:2], bx[2:], (0, 0, 255), 6)
    tiles.append(cv2.resize(t, (320, 180)))
    print(i, rel, f"conf={c:.2f}")
if tiles:
    cols = 6
    rows = (len(tiles) + cols - 1) // cols
    sh = np.zeros((rows * 180, cols * 320, 3), np.uint8)
    for k, t in enumerate(tiles):
        r, c = divmod(k, cols)
        sh[r * 180:(r + 1) * 180, c * 320:(c + 1) * 320] = t
    os.makedirs(os.path.join(ROOT, "out", "_shotqa"), exist_ok=True)
    cv2.imwrite(os.path.join(ROOT, "out", "_shotqa", "plates.jpg"), sh, [cv2.IMWRITE_JPEG_QUALITY, 85])
