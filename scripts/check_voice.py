"""check_voice.py <audio> <texto_esperado>: transcribe con faster-whisper (idioma autodetectado) y mide cuánto coincide con el texto."""
import sys, re, difflib
from faster_whisper import WhisperModel
m = WhisperModel("small", device="cpu", compute_type="int8")
segs, info = m.transcribe(sys.argv[1], beam_size=1)
txt = " ".join(s.text.strip() for s in segs)
norm = lambda s: re.sub(r"[^a-zà-ÿ0-9 ]", "", s.lower())
sim = difflib.SequenceMatcher(None, norm(txt).split(), norm(sys.argv[2]).split()).ratio()
print(f"idioma detectado={info.language} (p={info.language_probability:.2f}) duración={info.duration:.1f}s coincidencia={sim:.0%}")
print("→", txt)
