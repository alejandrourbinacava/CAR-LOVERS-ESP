#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
loc_tts.py <video> <idioma> [workers]

Dobla un vídeo: lee input/loc/<video>/<idioma>.json, genera UN audio por párrafo con ai33 (caché en
out/loc/<video>/<idioma>/lines/NNN.mp3), los une con pausas y deja:
   out/loc/<video>/<idioma>/narration.mp3      narración completa
   out/loc/<video>/<idioma>/lines.json         [{start,end}] por párrafo (para sincronizar el montaje)
La numeración de párrafos coincide 1:1 con las líneas NO vacías de input/loc/<video>/guion-es.txt.
"""
import concurrent.futures as cf, json, os, subprocess, sys, wave
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ai33_tts as A

FF = os.environ.get("FFMPEG", "C:/Users/aleja/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffmpeg.exe")
SR = 44100
GAP, GAP_HEAD = 0.28, 0.75      # pausa tras un párrafo normal / tras un encabezado en MAYÚSCULAS

video, lang = sys.argv[1], sys.argv[2]
workers = int(sys.argv[3]) if len(sys.argv) > 3 else 5
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
cfg = json.load(open(f"{ROOT}/input/loc/{video}/{lang}.json", encoding="utf-8"))
out = f"{ROOT}/out/loc/{video}/{lang}"
os.makedirs(out + "/lines", exist_ok=True)
lines, voice = cfg["lines"], cfg["voice"]


def one(i):
    import time
    dest = f"{out}/lines/{i:03d}.mp3"
    if os.path.exists(dest) and os.path.getsize(dest) > 4000:
        return i, 0
    last, fails, waits = None, 0, 0
    while fails < 4 and waits < 120:
        try:
            return i, A.tts(lines[i], voice, dest, speed=1.0)
        except Exception as e:
            last = e
            try:
                os.remove(dest)
            except OSError:
                pass
            if "queue_limit_exceeded" in str(e) or "429" in str(e):   # cola de ai33 llena (máx. 10): esperar y reintentar
                waits += 1
                time.sleep(20)
            else:
                fails += 1
                time.sleep(5)
    raise RuntimeError(f"línea {i}: {last}")


todo = [i for i in range(len(lines))]
if os.environ.get('REV'):
    todo.reverse()          # segundo proceso: genera desde el final para acortar la espera
spent, done = 0, 0
with cf.ThreadPoolExecutor(workers) as ex:
    for i, c in ex.map(one, todo):
        done += 1
        spent += c or 0
        if done % 10 == 0 or done == len(todo):
            print(f"[{done}/{len(todo)}] créditos gastados ≈ {spent}", flush=True)

if os.environ.get('GEN_ONLY'):
    print('GEN_ONLY: fin de la generación'); sys.exit(0)
# --- unir con pausas ---
frames, timing, pos = [], [], 0
for i, txt in enumerate(lines):
    wav = f"{out}/lines/{i:03d}.wav"
    subprocess.run([FF, "-y", "-loglevel", "error", "-i", f"{out}/lines/{i:03d}.mp3", "-ar", str(SR), "-ac", "1", "-sample_fmt", "s16", wav], check=True)
    w = wave.open(wav, "rb")
    data = w.readframes(w.getnframes())
    n = w.getnframes()
    w.close()
    timing.append({"start": round(pos / SR, 3), "end": round((pos + n) / SR, 3)})
    gap = int((GAP_HEAD if txt.strip() == txt.strip().upper() and len(txt) < 120 else GAP) * SR)
    frames.append(data + b"\x00\x00" * gap)
    pos += n + gap
raw = f"{out}/_raw.wav"
w = wave.open(raw, "wb")
w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes(b"".join(frames))
w.close()
subprocess.run([FF, "-y", "-loglevel", "error", "-i", raw, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "44100", "-b:a", "160k", f"{out}/narration.mp3"], check=True)
for i in range(len(lines)):
    try:
        os.remove(f"{out}/lines/{i:03d}.wav")
    except OSError:
        pass
os.remove(raw)
json.dump(timing, open(f"{out}/lines.json", "w"), indent=0)
print(f"OK · {len(lines)} párrafos · duración {timing[-1]['end']:.1f}s · créditos ≈ {spent} · {out}/narration.mp3")
