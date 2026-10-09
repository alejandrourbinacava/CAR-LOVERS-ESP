"""scripts/facescan.py <clip.mp4>... : caras en fotogramas CLAVE (rápido) -> tramos [ini,fin] con margen."""
import sys, os, re, subprocess, threading
import numpy as np, cv2
FF = "C:/Users/aleja/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffmpeg.exe"
W, H = 640, 360
det = cv2.FaceDetectorYN.create(os.path.join(os.path.dirname(os.path.abspath(__file__)), "yunet.onnx"), "", (W, H), 0.8, 0.3, 50)


def scan(f):
    p = subprocess.Popen([FF, "-hide_banner", "-skip_frame", "nokey", "-i", f, "-vf", f"scale={W}:{H},showinfo", "-vsync", "0",
                          "-f", "rawvideo", "-pix_fmt", "bgr24", "-"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    times = []

    def rd():
        for line in iter(p.stderr.readline, b""):
            m = re.search(rb"pts_time:([0-9.]+)", line)
            if m: times.append(float(m.group(1)))
    th = threading.Thread(target=rd, daemon=True); th.start()
    hits, dur, n = [], 0, 0
    sz = W * H * 3
    while True:
        buf = p.stdout.read(sz)
        if len(buf) < sz: break
        fr = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
        _, faces = det.detect(fr)
        while len(times) <= n: threading.Event().wait(0.01)
        t = times[n]; n += 1; dur = t
        if faces is not None and any(x[14] >= 0.85 and x[2] >= 28 for x in faces):
            hits.append(t)
    p.wait()
    rng = []
    for h in hits:
        if rng and h - rng[-1][1] <= 8: rng[-1][1] = h + 3
        else: rng.append([max(0, h - 4), h + 3])
    print(os.path.basename(f), round(dur), n, [[round(a), round(b)] for a, b in rng], flush=True)


for f in sys.argv[1:]:
    scan(f)
