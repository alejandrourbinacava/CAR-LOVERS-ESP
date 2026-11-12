#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""_align_words.py <narration.mp3> <guion.txt> <salida.json> [modelo=small] [hilos=2]
Alineación PALABRA A PALABRA voz<->guion (más fina que _transcribe_align.py): Whisper con word_timestamps, emparejado
con el guion por secuencia (difflib) tras normalizar. Escribe [{start,end,text}] con trozos de ~4 palabras COPIADAS DEL GUION
(así buildTimeAt de build-video*.mjs encuentra anclas cada pocas palabras aunque Whisper escriba las cifras distinto)."""
import json, os, re, sys, unicodedata, difflib
from faster_whisper import WhisperModel

narr, guion, out = sys.argv[1:4]
model = sys.argv[4] if len(sys.argv) > 4 else "small"
threads = int(sys.argv[5]) if len(sys.argv) > 5 else 2
cache = out + ".words.json"


def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return [w for w in re.sub(r"[^a-z0-9ñ]+", " ", s).split() if w]


if os.path.exists(cache):
    words = json.load(open(cache, encoding="utf-8"))
else:
    m = WhisperModel(model, device="cpu", compute_type="int8", cpu_threads=threads)
    segs, info = m.transcribe(narr, language=os.environ.get("ALIGN_LANG", "es"), vad_filter=False, beam_size=1, word_timestamps=True)
    words = []
    for s in segs:
        for w in s.words or []:
            for t in norm(w.word):
                words.append({"w": t, "s": round(w.start, 2), "e": round(w.end, 2)})
    json.dump(words, open(cache, "w", encoding="utf-8"))
    print("palabras whisper:", len(words), "duración:", round(info.duration))

g = open(guion, encoding="utf-8").read()
gw = []  # (palabra normalizada, posición en el guion, ¿token de una sola palabra?)
for mm in re.finditer(r"\S+", g):
    ts = norm(mm.group(0))
    for t in ts:
        gw.append((t, mm.start(), len(ts) == 1))
a = [w["w"] for w in words]
b = [x[0] for x in gw]
sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
pairs = []  # (índice guion, tiempo)
for blk in sm.get_matching_blocks():
    for k in range(blk.size):
        pairs.append((blk.b + k, words[blk.a + k]["s"], words[blk.a + k]["e"]))
print(f"emparejadas {len(pairs)} de {len(gw)} palabras del guion ({100*len(pairs)//max(1,len(gw))} %)")

# trozos de 4 palabras consecutivas emparejadas, con el texto del guion
res = []
i = 0
while i + 3 < len(pairs):
    chunk = pairs[i:i + 4]
    if chunk[-1][0] - chunk[0][0] == 3 and all(gw[j][2] for j, _, _ in chunk):  # consecutivas, tokens simples (buildTimeAt no casa "38 548")
        txt = " ".join(gw[j][0] for j, _, _ in chunk)
        res.append({"start": chunk[0][1], "end": chunk[-1][2], "text": txt})
        i += 4
    else:
        i += 1
json.dump(res, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=0)
print("segmentos:", len(res))
