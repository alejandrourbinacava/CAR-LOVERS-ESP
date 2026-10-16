#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ai33_tts.py — cliente del TTS de ai33.pro (v3) para doblar los vídeos de Car Lovers.

La clave NO va en el repo: se lee de la variable AI33_KEY o de un fichero (AI33_KEY_FILE, o
el .ai33_key del proyecto CANAL WW2). Nunca se imprime.

  python scripts/ai33_tts.py <voice_id> <salida.mp3> "<texto>" [speed]
  python scripts/ai33_tts.py --voices <provider> [language]      # lista voces (minimax|clone|elevenlabs|...)

Flujo: POST /v3/text-to-speech (multipart) -> task_id; GET /v3/task/<id> hasta status=done;
data.metadata.audio_url. El transporte es curl (el almacén de certificados de Python falla aquí).
"""
import json, os, subprocess, sys, time

BASE = "https://api.ai33.pro"
KEY_FILES = [os.environ.get("AI33_KEY_FILE", ""), r"C:\Users\aleja\Desktop\CANAL WW2\.ai33_key"]


def key():
    k = os.environ.get("AI33_KEY")
    if k:
        return k.strip()
    for f in KEY_FILES:
        if f and os.path.exists(f):
            return open(f, encoding="utf-8").read().strip()
    raise RuntimeError("Falta la clave de ai33 (AI33_KEY o AI33_KEY_FILE)")


def curl(args, binary=False, retries=4):
    last = None
    for i in range(retries):
        p = subprocess.run(["curl", "-sS", "--fail-with-body", "-m", "180"] + args, capture_output=True)
        if p.returncode == 0:
            return p.stdout if binary else json.loads(p.stdout.decode("utf-8"))
        last = p.stdout.decode("utf-8", "replace")[:300] + " | " + p.stderr.decode("utf-8", "replace")[:160]
        time.sleep(2 * (i + 1))
    raise RuntimeError("curl: " + str(last))


def voices(provider, language=None):
    out, page = [], 1
    while True:
        q = f"{BASE}/v3/voices?provider={provider}&page={page}" + (f"&language={language}" if language else "")
        d = curl([q, "-H", "xi-api-key: " + key()])
        data = d["data"] if isinstance(d["data"], list) else d["data"].get("voices", [])
        out += data
        if not d.get("pagination", {}).get("has_more"):
            return out
        page += 1


def credits():
    return curl([BASE + "/v1/credits", "-H", "xi-api-key: " + key()]).get("credits")


def tts(text, voice_id, dest, speed=1.0, wait=900, extra=None):
    """Sintetiza `text` y deja el mp3 en `dest`. Devuelve el coste en créditos."""
    args = ["-X", "POST", BASE + "/v3/text-to-speech", "-H", "xi-api-key: " + key(),
            "-F", "text=" + text, "-F", "voice_id=" + voice_id, "-F", "speed=%.2f" % speed,
            "-F", "with_transcript=false"]
    for k, v in (extra or {}).items():
        args += ["-F", f"{k}={v}"]
    r = curl(args)
    if not r.get("success"):
        raise RuntimeError("ai33 rechazó la petición: %s" % r)
    tid, t0 = r["task_id"], time.time()
    while True:
        time.sleep(3)
        try:
            t = curl([BASE + "/v3/task/" + tid, "-H", "xi-api-key: " + key()], retries=2)
        except Exception:
            continue
        d = t.get("data", {})
        st = d.get("status")
        if st == "done":
            url = (d.get("metadata") or {}).get("audio_url")
            if not url:
                raise RuntimeError("tarea done sin audio_url: %s" % d)
            open(dest, "wb").write(curl(["-L", url.split("?")[0]], binary=True, retries=10))
            return d.get("credit_cost", 0)
        if st in ("error", "failed"):
            raise RuntimeError("tarea fallida: %s" % d)
        if time.time() - t0 > wait:
            raise RuntimeError("timeout esperando la tarea %s" % tid)


if __name__ == "__main__":
    if len(sys.argv) >= 3 and sys.argv[1] == "--voices":
        for v in voices(sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None):
            print(v["voice_id"], "|", v["name"], "|", v.get("language"), "|", v.get("gender"))
    else:
        c = tts(sys.argv[3], sys.argv[1], sys.argv[2], float(sys.argv[4]) if len(sys.argv) > 4 else 1.0)
        print("OK, coste %s créditos -> %s" % (c, sys.argv[2]))
