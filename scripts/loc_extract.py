"""loc_extract.py <build-video.mjs de referencia> <salida.json>
Extrae OVERLAYS / TAGS / CHAPTERS de un build-video.mjs para poder traducirlos (doblaje a otros idiomas)."""
import json, re, sys

s = open(sys.argv[1], encoding="utf-8").read()
Q = r'"((?:[^"\\]|\\.)*)"'


def arr(name):
    i = s.index("const " + name + " = [")
    j = s.index("\n];", i)
    return s[i:j]


items = []
for line in arr("OVERLAYS").split("\n"):
    m = re.search(r'anchor: ' + Q + r', kind: "(\w+)"', line)
    if not m:
        continue
    o = {"anchor": m.group(1), "kind": m.group(2), "text": None, "value": None, "sub": None}
    for k in ("text", "value", "sub"):
        mm = re.search(k + r': ' + Q, line)
        if mm:
            o[k] = mm.group(1)
    items.append(o)
tags = []
for line in arr("TAGS").split("\n"):
    m = re.search(r'anchor: ' + Q + r', end: ' + Q + r', code: ' + Q + r', name: ' + Q + r', verdict: "(\w+)"', line)
    if m:
        tags.append(dict(zip(("anchor", "end", "code", "name", "verdict"), m.groups())))
chs = []
for line in arr("CHAPTERS").split("\n"):
    m = re.search(r'anchor: ' + Q + r', label: ' + Q, line)
    if m:
        chs.append(dict(zip(("anchor", "label"), m.groups())))
json.dump({"overlays": items, "tags": tags, "chapters": chs}, open(sys.argv[2], "w", encoding="utf-8"), ensure_ascii=False, indent=1)
sys.stdout.reconfigure(encoding="utf-8")
print(len(items), "overlays", len(tags), "tags", len(chs), "capítulos")
for i, o in enumerate(items):
    body = (o["text"] or "").replace("\\n", " / ") if o["kind"] != "stat" else f'{o["value"]} || {o["sub"]}'
    print(i, o["kind"], "|", body)
print("--- tags")
for i, t in enumerate(tags):
    print(i, t["code"], "|", t["name"], "|", t["verdict"])
print("--- capítulos")
for i, c in enumerate(chs):
    print(i, c["label"])
