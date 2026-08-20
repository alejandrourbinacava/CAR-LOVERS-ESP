import json, whisper
m = whisper.load_model("base")
r = m.transcribe("input/narration.mp3", language="es", word_timestamps=False, verbose=False)
segs = [{"start": round(s["start"],2), "end": round(s["end"],2), "text": s["text"].strip()} for s in r["segments"]]
json.dump(segs, open("out/_align.json","w",encoding="utf-8"), ensure_ascii=False, indent=0)
print("segmentos:", len(segs), "ultimo end:", segs[-1]["end"] if segs else None)
