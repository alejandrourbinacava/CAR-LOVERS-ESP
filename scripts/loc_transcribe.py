#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""loc_transcribe.py <carpeta con es.mp4> [modelo=small] [hilos=2]
Transcribe el vídeo español con faster-whisper -> <carpeta>/es-segments.json ([{start,end,text}]) y es.txt (una línea por segmento)."""
import json, os, sys
from faster_whisper import WhisperModel

d = sys.argv[1]
model = sys.argv[2] if len(sys.argv) > 2 else "small"
threads = int(sys.argv[3]) if len(sys.argv) > 3 else 2
m = WhisperModel(model, device="cpu", compute_type="int8", cpu_threads=threads)
segs, info = m.transcribe(os.path.join(d, "es.mp4"), language="es", vad_filter=True, beam_size=5)
out = []
for s in segs:
    out.append({"start": round(s.start, 2), "end": round(s.end, 2), "text": s.text.strip()})
    print(f"{s.start:7.1f} {s.text.strip()}", flush=True)
json.dump(out, open(os.path.join(d, "es-segments.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
open(os.path.join(d, "es.txt"), "w", encoding="utf-8").write("\n".join(o["text"] for o in out))
print("OK", len(out), "segmentos", round(info.duration), "s")
