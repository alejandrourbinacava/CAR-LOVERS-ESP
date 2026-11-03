#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""make_sfx.py : sintetiza (sin descargas ni derechos) el paquete de sonidos del canal en public/assets/sfx/:
algo.mp3 (datos/precios: pitidos digitales 'algorítmicos'), swipe.mp3 (transición), impact.mp3 (ficha de modelo), tick.mp3 (UI)."""
import numpy as np, wave, subprocess, os, random
SR = 44100
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "assets", "sfx")
FF = "C:/Users/aleja/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffmpeg.exe"
rng = np.random.default_rng(7); random.seed(7)

def env(n, a=0.002, d=0.03):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / d)

def save(name, x, gain=0.8):
    x = x / (np.abs(x).max() + 1e-9) * gain
    p = os.path.join(OUT, name + ".wav")
    with wave.open(p, "w") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())
    subprocess.run([FF, "-y", "-loglevel", "error", "-i", p, "-b:a", "160k", os.path.join(OUT, name + ".mp3")], check=True)
    os.remove(p)

# algo: ráfaga de pitidos digitales (onda cuadrada/seno mezcladas), cada vez más rápida y aguda, con bitcrush leve
blips, t = [], 0.0
total = 0.85; x = np.zeros(int(SR * total))
freqs = [880, 1175, 1568, 1319, 1760, 2093, 1568, 2349, 1976, 2637, 2093, 3136]
gap = 0.09
for i, f in enumerate(freqs):
    n = int(SR * 0.05); tt = np.arange(n) / SR
    s = 0.6 * np.sign(np.sin(2 * np.pi * f * tt)) + 0.4 * np.sin(2 * np.pi * f * 2 * tt)
    s *= env(n, 0.001, 0.018)
    i0 = int(SR * t)
    x[i0:i0 + n] += s[: len(x) - i0]
    t += gap; gap *= 0.86
# bitcrush
x = np.round(x * 24) / 24
# eco corto
x[int(SR * 0.07):] += 0.25 * x[: -int(SR * 0.07)]
save("algo", x)

# swipe: ruido filtrado que sube (barrido)
n = int(SR * 0.6); tt = np.arange(n) / SR
noise = rng.standard_normal(n)
sweep = np.zeros(n); c = 0.0
from numpy.fft import rfft, irfft
# filtro paso banda móvil por bloques
blk = 1024; out = np.zeros(n)
for i0 in range(0, n - blk, blk // 2):
    seg = noise[i0:i0 + blk] * np.hanning(blk)
    F = rfft(seg); fr = np.fft.rfftfreq(blk, 1 / SR)
    cf = 300 + 5500 * (i0 / n) ** 1.6
    F *= np.exp(-((fr - cf) / (cf * 0.45 + 200)) ** 2)
    out[i0:i0 + blk] += irfft(F, blk)
e = np.sin(np.pi * np.clip(tt / 0.6, 0, 1)) ** 1.4
save("swipe", out * e, 0.7)

# impact: golpe grave + ruido
n = int(SR * 0.75); tt = np.arange(n) / SR
f = 40 + 140 * np.exp(-tt * 14)
ph = 2 * np.pi * np.cumsum(f) / SR
body = np.sin(ph) * np.exp(-tt * 5.5)
nz = rng.standard_normal(n) * np.exp(-tt * 35)
click = np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt * 120) * 0.3
save("impact", body + 0.35 * nz + click, 0.9)

# tick UI
n = int(SR * 0.12); tt = np.arange(n) / SR
tk = np.sin(2 * np.pi * 2400 * tt) * np.exp(-tt * 70) + 0.3 * np.sin(2 * np.pi * 4800 * tt) * np.exp(-tt * 120)
save("tick", tk, 0.6)
print("OK", sorted(f for f in os.listdir(OUT) if f.endswith(".mp3")))
