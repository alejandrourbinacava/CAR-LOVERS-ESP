"""
prep-shots.py â€” corta cada plano del montaje en su propio clip y TAPA LAS MATRÃCULAS.

Lee out/_shots-plan.json (lo genera build-video.mjs), y para cada plano:
  - corta [startFrom, startFrom+dur+pad] del clip fuente,
  - detecta matrÃ­culas (modelo ONNX yolo-v9, open-image-models) cada N fotogramas,
  - las pixela + desenfoca (con retenciÃ³n temporal para no "parpadear"),
  - codifica a 1080p/30fps CFR sin audio -> public/assets/<OUT_DIR>/shot-XXX.mp4
DespuÃ©s reescribe src/config.ts para que cada plano use su fichero (startFrom = 0).

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
# Tramos EXTERIORES (sin pantallas) de cada clip donde se acepta cualquier matrÃ­cula en Ã¡ngulo/primer plano
RELAX = {"marca-bluehdi": 45, "marca-toyota": 80, "marca-moderno": 150, "marca-rav4": 80, "marca-qashqai": 40, "marca-arona": 120, "marca-t2008": 35, "marca-captur": 50, "marca-stonic": 35, "marca-vitara": 100, "marca-niro": 220, "marca-kona": 80, "marca-model3": 40, "marca-mgzs": 40, "marca-chr": 40, "marca-yariscross": 45, "marca-atto2": 55, "marca-cx5": 160, "marca-q2": 45, "marca-smart": 40, "marca-puretech": 70, "marca-a4": 30, "marca-duster": 130,  "marca-evoque": 90, "marca-modely": 40, "marca-lexus": 140, "marca-sandero": 120, "marca-corolla": 45, "marca-macan": 40, "marca-jimny": 40, "marca-leaf": 35, "marca-ipace": 60, "marca-polestar": 180, "marca-mx53": 9999, "marca-jazz3": 9999, "marca-jazz": 9999, "marca-prius2": 9999, "marca-ls4302": 9999, "marca-lc1203": 9999, "marca-mx5": 9999, "marca-golf": 9999, "marca-sandero2": 45, "marca-ecog3": 40, "marca-ecog": 40, "marca-ariya": 300, "marca-ariya2": 300, "marca-atto2": 300, "marca-atto22": 300, "marca-b10": 300, "marca-b102": 300, "marca-chr": 300, "marca-chr2": 300, "marca-chr3": 300, "marca-elroq": 300, "marca-elroq2": 300, "marca-epiq": 300, "marca-epiq2": 300, "marca-ev2": 300, "marca-ev22": 300, "marca-ev3": 300, "marca-ev32": 300, "marca-ex40": 300, "marca-ex402": 300, "marca-idcross": 300, "marca-idcross2": 300, "marca-ioniq3": 300, "marca-ioniq32": 300, "marca-juke": 300, "marca-lexustz": 300, "marca-lexustz2": 300, "marca-omoda5": 300, "marca-omoda52": 300, "marca-qashqai": 300, "marca-qashqai2": 300, "marca-qashqai3": 300, "marca-rav4": 300, "marca-rav42": 300, "marca-rav43": 300, "marca-solterra": 300, "marca-solterra2": 300, "marca-sportage": 300, "marca-tucson": 300, "marca-tucson2": 300, "marca-xiaomi": 300, "marca-zrv": 300, "marca-zrv2": 300}
# Marcas de agua FIJAS (x1,y1,x2,y2) que se desenfocan en TODOS los fotogramas de ese clip
STATIC_MASKS = {'marca-dolphin4': [(30, 28, 165, 165)], 'marca-t034': [(30, 28, 165, 165)], 'marca-ec34': [(30, 28, 165, 165)], 'marca-mg44': [(30, 28, 165, 165)], 'marca-dolphin2': [(20, 945, 330, 1070)], 'marca-juniore': [(20, 945, 330, 1070)], 'marca-ec32': [(1500, 15, 1915, 100)], 'marca-juniore2': [(1500, 15, 1915, 100)], 'marca-r53': [(1620, 985, 1915, 1075)], 'marca-juniore3': [(30, 25, 150, 105)], 'marca-juniore4': [(30, 25, 150, 105)], 'marca-cx5': [(1735, 22, 1905, 98)], 'marca-evoqueb': [(30, 975, 350, 1050)], 'marca-bmw320b': [(35, 30, 335, 100)], 'marca-lc1203': [(1760, 985, 1915, 1075)], 'marca-golf': [(30, 20, 215, 125)], 'marca-glp': [(30, 40, 270, 175)], 'marca-ecog': [(10, 940, 140, 1075)], 'marca-e213a': [(1440, 950, 1850, 1045)], 'marca-e213b': [(1440, 950, 1850, 1045)], 'marca-c205a': [(1440, 950, 1850, 1045)], 'marca-c205b': [(1440, 950, 1850, 1045)], 'marca-glca': [(1440, 950, 1850, 1045)], 'marca-glea': [(1440, 950, 1850, 1045)], 'marca-gleb': [(10, 960, 130, 1075)], 'marca-s222a': [(10, 25, 160, 170)], 'marca-w124a': [(10, 20, 220, 130)], 'marca-c63a': [(1740, 25, 1905, 170)], 'marca-w124c': [(1740, 25, 1905, 170)], 'marca-s222b': [(15, 965, 520, 1065), (1790, 15, 1915, 100)], 'marca-s222c': [(15, 965, 520, 1065), (1790, 15, 1915, 100)], 'marca-x3b': [(30, 0, 600, 120)], 'yt-encheaptrucks/marca-ridgeline2': [(1560, 860, 1880, 1060)], 'yt-encheaptrucks/marca-ridgeline3': [(1560, 860, 1880, 1060)], 'yt-enfeatures/marca-startstop3': [(1630, 795, 1870, 1030)], 'yt-ennobody/marca-eqs1': [(0, 985, 500, 1080), (1420, 985, 1920, 1080)], 'yt-ennobody/marca-eqs2': [(0, 985, 500, 1080), (1420, 985, 1920, 1080)], 'yt-ennobody/marca-glb1': [(0, 985, 500, 1080), (1420, 985, 1920, 1080)], 'yt-ennobody/marca-glb2': [(0, 985, 500, 1080), (1420, 985, 1920, 1080)], 'yt-ennobody/marca-glb3': [(0, 985, 500, 1080), (1420, 985, 1920, 1080)], 'yt-ennobody/marca-id42': [(1720, 900, 1880, 1045)], 'yt-enengines/marca-k24c': [(1440, 950, 1850, 1060)], 'yt-enengines/marca-ur46c': [(1440, 950, 1850, 1060)], 'yt-enengines/marca-ur57b': [(1440, 950, 1850, 1060)], 'yt-enengines/marca-ur57c': [(1440, 950, 1850, 1060)], 'yt-enengines/marca-hyba': [(60, 940, 360, 1040), (1360, 940, 1880, 1040)], 'yt-enengines/marca-hybc': [(60, 940, 360, 1040), (1360, 940, 1880, 1040)], 'yt-enengines/marca-gr40b': [(1380, 920, 1910, 1075)], 'yt-enengines/marca-gr40c': [(1380, 920, 1910, 1075)], 'yt-encollapse/marca-vinfast1': [(20, 975, 520, 1070)], 'yt-enworsttrucks/marca-rivian2': [(40, 950, 440, 1055)], 'yt-enreliab/marca-gen4': [(0, 0, 240, 125), (1440, 940, 1860, 1060)], 'yt-enworthless/marca-levante1': [(1400, 0, 1920, 75)], 'yt-enworthless/marca-levante2': [(1400, 0, 1920, 75)], 'yt-enworthless/marca-levante3': [(1400, 0, 1920, 75)], 'yt-enworthless/marca-gc4xe1': [(0, 970, 1000, 1060)], 'yt-enworthless/marca-stelvio2': [(820, 960, 1160, 1080)], 'yt-enworthless/marca-ix1': [(0, 0, 300, 60)], 'yt-enworthless/marca-ix2': [(0, 0, 300, 60)], 'yt-enworthless/marca-ioniq51': [(0, 0, 300, 60)], 'yt-enworthless/marca-ioniq52': [(700, 1000, 1220, 1080)], 'yt-enworthless/marca-rav42': [(1440, 0, 1820, 160)], 'yt-enworthless/marca-gc4xe3': [(0, 0, 420, 95)], 'yt-enluxury/marca-seq2': [(60, 880, 1240, 1010)], 'yt-enluxury/marca-seq3': [(60, 880, 1240, 1010)], 'yt-enluxury/marca-x52': [(60, 880, 1240, 1010)], 'yt-enluxury/marca-qx803': [(1300, 0, 1920, 100)], 'yt-enluxury/marca-qx802': [(0, 960, 330, 1080)], 'yt-enluxury/marca-gx4601': [(1500, 0, 1920, 130)], 'yt-consumoreal/marca-chr2': [(0, 955, 125, 1075)], 'yt-consumoreal/marca-peu3': [(0, 955, 125, 1075)], 'yt-consumoreal/marca-rav3': [(0, 955, 125, 1075)], 'yt-consumoreal/marca-yaris2': [(0, 955, 125, 1075)], 'yt-consumoreal/marca-niro2': [(0, 955, 125, 1075)], 'yt-consumoreal/marca-chr3': [(1470, 960, 1800, 1060)], 'yt-consumoreal/marca-niro1': [(1400, 930, 1830, 1060)], 'yt-consumoreal/marca-outl1': [(0, 1000, 280, 1080)], 'yt-consumoreal/marca-qash3': [(1730, 15, 1910, 165)], 'yt-consumoreal/marca-tucp2': [(110, 730, 290, 910)], 'yt-consumoreal/marca-yaris3': [(0, 945, 135, 1075)], 'yt-yariscross/marca-fab1': [(1400, 120, 1810, 190)], 'yt-yariscross/marca-fab4': [(1460, 70, 1840, 130)], 'yt-yariscross/marca-fab3': [(130, 55, 325, 115)], 'yt-yariscross/marca-gen5': [(1600, 860, 1840, 1045)], 'yt-concesionario/marca-corolla1': [(1750, 15, 1915, 105)], 'yt-concesionario/marca-corolla3': [(100, 945, 1725, 1025)], 'yt-concesionario/marca-sandero3': [(1505, 30, 1870, 95)], 'yt-usados10k/marca-aygo3': [(1440, 935, 1865, 1080)], 'yt-usados10k/marca-c3a': [(1440, 935, 1865, 1080)], 'yt-usados10k/marca-c3b': [(1440, 935, 1865, 1080)], 'yt-usados10k/marca-fabia1': [(1440, 935, 1865, 1080)], 'yt-usados10k/marca-fabia2': [(1440, 935, 1865, 1080)], 'yt-usados10k/marca-fabia3': [(1440, 935, 1865, 1080)], 'yt-usados10k/marca-ibiza2': [(1440, 935, 1865, 1080)], 'yt-usados10k/marca-jazzgk2': [(1440, 935, 1865, 1080)], 'yt-usados10k/marca-mazdados4': [(1440, 935, 1865, 1080)], 'yt-usados10k/marca-p208b': [(1440, 935, 1865, 1080)], 'yt-usados10k/marca-polo1': [(1440, 935, 1865, 1080)], 'yt-usados10k/marca-swift2': [(1440, 935, 1865, 1080)], 'yt-usados10k/marca-yarish2': [(1440, 935, 1865, 1080)], 'yt-usados10k/marca-aurish1': [(1860, 800, 1920, 895)], 'yt-usados10k/marca-aurish2': [(1410, 955, 1875, 1055)], 'yt-usados10k/marca-aygo2': [(0, 945, 135, 1080)], 'yt-usados10k/marca-mazdados5': [(0, 925, 150, 1080)], 'yt-usados10k/marca-c3c': [(1660, 0, 1810, 125)], 'yt-usados10k/marca-fabiaold2': [(10, 10, 300, 215), (1440, 935, 1920, 1080)], 'yt-usados10k/marca-p208a': [(75, 30, 345, 132)], 'yt-usados10k/marca-sandero2': [(170, 828, 400, 996)], 'yt-usados10k/marca-sandero3': [(1685, 950, 1920, 1080)], 'yt-usados10k/marca-swift1': [(0, 1000, 260, 1080)], 'yt-gemelos/marca-asx2': [(0, 0, 192, 84)], 'yt-gemelos/marca-frontera1': [(1626, 66, 1830, 153)], 'yt-gemelos/marca-gen1': [(63, 0, 273, 84), (12, 9, 87, 75), (252, 9, 315, 72)], 'yt-gemelos/marca-gen3': [(51, 48, 309, 138)], 'yt-gemelos/marca-gen5': [(1494, 63, 1677, 144), (1716, 63, 1848, 144), (1653, 72, 1716, 138)], 'yt-gemelos/marca-junior1': [(1626, 66, 1830, 153)], 'yt-gemelos/marca-junior2': [(0, 6, 111, 114)], 'yt-gemelos/marca-kamiq3': [(1518, 21, 1719, 117), (1389, 30, 1458, 99), (1704, 54, 1791, 117)], 'yt-gemelos/marca-lbx3': [(51, 948, 363, 1050)], 'yt-gemelos/marca-rcinco1': [(0, 0, 192, 84)], 'yt-gemelos/marca-rcinco2': [(1620, 66, 1836, 153)], 'yt-gemelos/marca-tcross2': [(1458, 999, 1920, 1080)], 'yt-gemelos/marca-tucson2': [(1527, 993, 1809, 1080), (1782, 996, 1920, 1080)], 'yt-gemelos/marca-ycross1': [(63, 0, 321, 126)], 'yt-etiquetab/marca-gen3': [(66, 63, 294, 144), (63, 894, 273, 1014)], 'yt-etiquetab/marca-gen4': [(6, 972, 198, 1080)], 'yt-etiquetab/marca-gen10': [(1632, 966, 1911, 1074)], 'yt-etiquetab/marca-gen7': [(0, 957, 150, 1080)], 'yt-etiquetab/marca-auris3': [(0, 966, 114, 1080)], 'yt-etiquetab/marca-qashqai3': [(6, 51, 111, 114), (87, 51, 162, 114), (138, 51, 210, 114), (189, 51, 300, 114), (369, 51, 537, 114), (1440, 51, 1521, 114), (1404, 960, 1494, 1023), (1464, 960, 1530, 1023), (1527, 960, 1920, 1023)], 'yt-etiquetab/marca-gen2': [(1746, 0, 1920, 195)], 'yt-etiquetab/marca-gen5': [(1764, 891, 1920, 1040)], 'yt-consumoreal/marca-yaris1': [(0, 0, 250, 62)], 'yt-consumoreal/marca-tuch1': [(0, 0, 250, 62)], 'yt-consumoreal/marca-peu1': [(0, 0, 250, 62)], 'yt-consumoreal/marca-kuga1': [(0, 0, 250, 62)], 'yt-consumoreal/marca-gen3': [(10, 950, 1050, 1055), (1790, 940, 1910, 1050)], 'yt-yariscross/marca-hyb1': [(35, 15, 1105, 85), (330, 930, 1600, 1050)], 'yt-yariscross/marca-ycgr1': [(1580, 25, 1830, 65)], 'yt-yariscross/marca-duster1': [(1515, 40, 1860, 85)], 'yt-yariscross/marca-ycawd3': [(90, 45, 295, 200)], 'yt-yariscross/marca-duster3': [(1795, 10, 1915, 70)], 'yt-yariscross/marca-ncap1': [(115, 820, 270, 1020), (1515, 915, 1845, 1010)], 'yt-concesionario/marca-arona3': [(1170, 30, 1920, 400)]}


def _force_set():
    p = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "out", "_force-relax.txt")
    try:
        return set(x.strip() for x in open(p, encoding="utf-8") if x.strip())
    except OSError:
        return set()


FORCE = _force_set()


def is_relaxed(clip_src, start):
    name = os.path.basename(clip_src)[:-4]
    if f"{name}@{float(start or 0)}" in FORCE:   # planos donde el QA vio una matrÃ­cula sin tapar
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
        k = max(15, min((w // 3) | 1, 61))   # tope: un kernel enorme (matrÃ­cula en primer plano) cuelga el proceso
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
        # TRAMOS EXTERIORES / STOCK (no hay salpicadero): se acepta cualquier matrÃ­cula razonable
        if c >= 0.3 and 1.0 <= ar <= 7.5 and area <= 0.15:
            return True
        return False
    # TRAMOS DE CONDUCCIÃ“N (interior): las pantallas del salpicadero se confunden con matrÃ­culas.
    # Solo se tapan matrÃ­culas PEQUEÃ‘AS y anchas de coches lejanos (trÃ¡fico).
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
            fr = last  # fin del clip: congelar Ãºltimo fotograma
        last = fr
        if fr.shape[1] != W or fr.shape[0] != H:
            fr = cv2.resize(fr, (W, H), interpolation=cv2.INTER_AREA)
        yield fr
    cap.release()


def process_shot(job):
    idx, src_path, start, dur, out_path, relax = job
    stock = '/clips/' in src_path.replace(chr(92), '/')
    if os.path.exists(out_path) and os.path.getsize(out_path) > 20000:
        return idx, 0, "ya existÃ­a"
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
    # PASADA 1: detectar matrÃ­culas (cada `stride` fotogramas)
    dets = {}
    ndet = 0
    for n, fr in enumerate(read_frames(src_path, start, nframes)):
        if n % stride == 0:
            ext = relax or stock or is_exterior(fr)
            res = [r for r in det.predict(fr) if good_plate(r, ext, stock)]
            if res:
                dets[n] = [(int(r.bounding_box.x1), int(r.bounding_box.y1), int(r.bounding_box.x2), int(r.bounding_box.y2)) for r in res]
                ndet += len(res)
    # PASADA 2: aplicar el tapado con retenciÃ³n BIDIRECCIONAL (tambiÃ©n antes de la primera detecciÃ³n)
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
        smask = STATIC_MASKS.get(os.path.basename(os.path.dirname(src_path)) + '/' + os.path.basename(src_path)[:-4], STATIC_MASKS.get(os.path.basename(src_path)[:-4], []))
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
    return hashlib.md5(f"{s['clipSrc']}|{s['startFrom']}|{s['dur']}|{'v8r' if is_relaxed(s['clipSrc'], s['startFrom']) else 'v8'}{'m2' if 'marca-bmw320b' in s['clipSrc'] else ''}{'pm' if (os.path.basename(os.path.dirname(s['clipSrc'])) + '/' + os.path.basename(s['clipSrc'])[:-4]) in STATIC_MASKS else ''}".encode()).hexdigest()[:10]


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
    print(f"=== PREP_SHOTS_OK Â· {len(plan)} planos Â· {plates} detecciones de matrÃ­cula Â· config reescrito ===")


if __name__ == "__main__":
    main()

