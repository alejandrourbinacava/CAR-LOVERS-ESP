"""
prep-shots.py — corta cada plano del montaje en su propio clip y TAPA LAS MATRÍCULAS.

Lee out/_shots-plan.json (lo genera build-video.mjs), y para cada plano:
  - corta [startFrom, startFrom+dur+pad] del clip fuente,
  - detecta matrículas (modelo ONNX yolo-v9, open-image-models) cada N fotogramas,
  - las pixela + desenfoca (con retención temporal para no "parpadear"),
  - codifica a 1080p/30fps CFR sin audio -> public/assets/<OUT_DIR>/shot-XXX.mp4
Después reescribe src/config.ts para que cada plano use su fichero (startFrom = 0).

uso:  python scripts/prep-shots.py [OUT_DIR=shots-diesel] [WORKERS=6]
"""
import json, os, re, subprocess, sys, time
from concurrent.futures import ProcessPoolExecutor

import cv2
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT_DIR = sys.argv[1] if len(sys.argv) > 1 else "shots-diesel"
WORKERS = int(sys.argv[2]) if len(sys.argv) > 2 else 6
FF = os.environ.get(
    "FFMPEG",
    "C:/Users/aleja/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffmpeg.exe",
)
W, H, FPS = 1920, 1080, 30
PAD = 0.3            # segundos extra al final (Remotion nunca se queda sin frames)
DET_EVERY = 4        # detectar cada N fotogramas
HOLD = 8             # fotogramas que se mantiene una caja tras perderla
CONF = 0.35
DETECTOR = None
# Tramos EXTERIORES (sin pantallas) de cada clip donde se acepta cualquier matrícula en ángulo/primer plano
RELAX = {"marca-bluehdi": 45, "marca-toyota": 80, "marca-moderno": 150, "marca-rav4": 120, "marca-qashqai": 40, "marca-arona": 120, "marca-t2008": 35, "marca-captur": 50, "marca-stonic": 35, "marca-vitara": 100, "marca-niro": 220, "marca-kona": 80, "marca-model3": 40, "marca-mgzs": 40, "marca-chr": 40, "marca-yariscross": 45, "marca-atto2": 55, "marca-cx5": 160, "marca-q2": 45, "marca-smart": 40, "marca-puretech": 70, "marca-a4": 30, "marca-duster": 60, "marca-golf": 35, "marca-evoque": 90, "marca-modely": 40}
# Marcas de agua FIJAS (x1,y1,x2,y2) que se desenfocan en TODOS los fotogramas de ese clip
STATIC_MASKS = {"marca-cx5": [(1735, 22, 1905, 98)], "marca-evoqueb": [(30, 975, 350, 1050)]}


def _force_set():
    p = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "out", "_force-relax.txt")
    try:
        return set(x.strip() for x in open(p, encoding="utf-8") if x.strip())
    except OSError:
        return set()


FORCE = _force_set()


def is_relaxed(clip_src, start):
    name = os.path.basename(clip_src)[:-4]
    if f"{name}@{float(start or 0)}" in FORCE:   # planos donde el QA vio una matrícula sin tapar
        return True
    return name in RELAX and float(start or 0) < RELAX[name]


def get_detector():
    global DETECTOR
    if DETECTOR is None:
        import warnings
        warnings.filterwarnings("ignore")
        import onnxruntime as ort
        _orig = ort.InferenceSession

        def _patched(path, sess_options=None, providers=None, **kw):
            so = sess_options or ort.SessionOptions()
            so.intra_op_num_threads, so.inter_op_num_threads = 2, 1  # evita saturar la CPU con varios procesos
            return _orig(path, sess_options=so, providers=providers, **kw)

        ort.InferenceSession = _patched
        from open_image_models import LicensePlateDetector
        DETECTOR = LicensePlateDetector(detection_model="yolo-v9-s-608-license-plate-end2end")
    return DETECTOR


def blur_boxes(frame, boxes, grow=1.0):
    for (x1, y1, x2, y2) in boxes:
        bw, bh = x2 - x1, y2 - y1
        mx, my = int(bw * 0.18 * grow) + 6, int(bh * 0.40 * grow) + 6
        a, b = max(0, x1 - mx), max(0, y1 - my)
        c, d = min(frame.shape[1], x2 + mx), min(frame.shape[0], y2 + my)
        roi = frame[b:d, a:c]
        if roi.size == 0:
            continue
        h, w = roi.shape[:2]
        small = cv2.resize(roi, (max(2, w // 12), max(2, h // 12)), interpolation=cv2.INTER_LINEAR)
        pix = cv2.resize(small, (w, h), interpolation=cv2.INTER_NEAREST)
        k = max(15, (w // 3) | 1)
        frame[b:d, a:c] = cv2.GaussianBlur(pix, (k, k), 0)
    return frame


def is_exterior(fr):
    """Plano EXTERIOR (sin salpicadero): el tercio inferior no es mayoritariamente oscuro."""
    g = cv2.cvtColor(cv2.resize(fr, (192, 108)), cv2.COLOR_BGR2GRAY)
    dark = (g[int(108 * 0.65):, :] < 70).mean()
    return dark < 0.30


def good_plate(r, relax, stock=False):
    bw, bh = r.bounding_box.x2 - r.bounding_box.x1, r.bounding_box.y2 - r.bounding_box.y1
    ar = bw / max(1, bh)
    area = bw * bh / (W * H)
    c = r.confidence
    if relax or stock:
        # TRAMOS EXTERIORES / STOCK (no hay salpicadero): se acepta cualquier matrícula razonable
        if c >= 0.3 and 1.0 <= ar <= 7.5 and area <= 0.15:
            return True
        return False
    # TRAMOS DE CONDUCCIÓN (interior): las pantallas del salpicadero se confunden con matrículas.
    # Solo se tapan matrículas PEQUEÑAS y anchas de coches lejanos (tráfico).
    return c >= 0.28 and 2.4 <= ar <= 7.5 and area <= 0.012


def read_frames(src_path, start, nframes):
    cap = cv2.VideoCapture(src_path)
    sfps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    cap.set(cv2.CAP_PROP_POS_MSEC, start * 1000.0)
    last = None
    for _ in range(nframes):
        ok, fr = cap.read()
        if not ok:
            if last is None:
                break
            fr = last  # fin del clip: congelar último fotograma
        last = fr
        if fr.shape[1] != W or fr.shape[0] != H:
            fr = cv2.resize(fr, (W, H), interpolation=cv2.INTER_AREA)
        yield fr
    cap.release()


def process_shot(job):
    idx, src_path, start, dur, out_path, relax = job
    stock = '/clips/' in src_path.replace(chr(92), '/')
    if os.path.exists(out_path) and os.path.getsize(out_path) > 20000:
        return idx, 0, "ya existía"
    final_path = out_path
    out_path = final_path + ".tmp.mp4"
    det = get_detector()
    cap = cv2.VideoCapture(src_path)
    if not cap.isOpened():
        return idx, -1, f"no abre {src_path}"
    sfps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    cap.release()
    nframes = int(round((dur + PAD) * sfps))
    stride = 2 if relax else 3
    hold = 12 if relax else HOLD
    # PASADA 1: detectar matrículas (cada `stride` fotogramas)
    dets = {}
    ndet = 0
    for n, fr in enumerate(read_frames(src_path, start, nframes)):
        if n % stride == 0:
            ext = relax or stock or is_exterior(fr)
            res = [r for r in det.predict(fr) if good_plate(r, ext, stock)]
            if res:
                dets[n] = [(int(r.bounding_box.x1), int(r.bounding_box.y1), int(r.bounding_box.x2), int(r.bounding_box.y2)) for r in res]
                ndet += len(res)
    # PASADA 2: aplicar el tapado con retención BIDIRECCIONAL (también antes de la primera detección)
    cmd = [
        FF, "-y", "-hide_banner", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-framerate", f"{sfps:.3f}", "-i", "-",
        "-r", str(FPS), "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "23",
        "-g", "30", "-keyint_min", "30", "-sc_threshold", "0", "-pix_fmt", "yuv420p",
        "-movflags", "+faststart", out_path,
    ]
    pr = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    keys = sorted(dets)
    for n, fr in enumerate(read_frames(src_path, start, nframes)):
        near = [k for k in keys if abs(k - n) <= hold]
        smask = STATIC_MASKS.get(os.path.basename(src_path)[:-4], [])
        if near or smask:
            boxes = list(smask)
            for k in near:
                boxes.extend(dets[k])
            fr = blur_boxes(fr.copy(), boxes, 1.9 if relax else 1.0)
        try:
            pr.stdin.write(fr.tobytes())
        except (BrokenPipeError, OSError):
            break
    try:
        pr.stdin.close()
    except Exception:
        pass
    rc = pr.wait()
    if rc == 0 and os.path.exists(out_path) and os.path.getsize(out_path) > 20000:
        os.replace(out_path, final_path)
        return idx, ndet, "ok"
    return idx, -1, f"ffmpeg rc={rc}"


def shot_key(s):
    import hashlib
    return hashlib.md5(f"{s['clipSrc']}|{s['startFrom']}|{s['dur']}|{'v8r' if is_relaxed(s['clipSrc'], s['startFrom']) else 'v8'}".encode()).hexdigest()[:10]


def main():
    plan = json.load(open(os.path.join(ROOT, "out", "_shots-plan.json"), encoding="utf-8"))
    out_dir = os.path.join(ROOT, "public", "assets", OUT_DIR)
    os.makedirs(out_dir, exist_ok=True)
    jobs = []
    for s in plan:
        if s.get("isImage"):
            continue  # las fotos se quedan como imagen (Ken Burns en Remotion); van en el repo
        out = os.path.join(out_dir, f"shot-{shot_key(s)}.mp4")
        jobs.append((s["i"], os.path.join(ROOT, "public", s["clipSrc"]), float(s["startFrom"] or 0), float(s["dur"]), out, is_relaxed(s["clipSrc"], s["startFrom"])))
    t0 = time.time()
    done = plates = 0
    with ProcessPoolExecutor(max_workers=WORKERS) as ex:
        for idx, nd, msg in ex.map(process_shot, jobs, chunksize=2):
            done += 1
            plates += max(0, nd)
            if nd < 0 or done % 10 == 0 or done == len(jobs):
                print(f"[{done}/{len(jobs)}] shot-{idx:03d} placas={nd} {msg}  ({int(time.time()-t0)}s)", flush=True)
    # reescribir config.ts
    cfg_path = os.path.join(ROOT, "src", "config.ts")
    cfg = open(cfg_path, encoding="utf-8").read()
    it = iter(plan)

    def repl(m):
        s = next(it)
        if s.get("isImage"):
            return m.group(0)
        return f'  {{ clipSrc: "assets/{OUT_DIR}/shot-{shot_key(s)}.mp4", durationInSeconds: {m.group(2)}, startFromSeconds: 0,'

    new, n = re.subn(r'  \{ clipSrc: "([^"]+)", durationInSeconds: ([\d.]+), startFromSeconds: [\d.]+,', repl, cfg)
    assert n == len(plan), f"shots en config={n} vs plan={len(plan)}"
    open(cfg_path, "w", encoding="utf-8").write(new)
    print(f"=== PREP_SHOTS_OK · {len(plan)} planos · {plates} detecciones de matrícula · config reescrito ===")


if __name__ == "__main__":
    main()
