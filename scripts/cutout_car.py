#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""cutout_car.py <in.jpg|png> <out.png> [--max 1400]
Recorta el coche de una foto (quita el fondo) con rembg/u2net (modelo local en ~/.u2net) y deja un PNG con alfa recortado al contenido.
Si el recorte sale vacío o casi todo el cuadro, avisa (foto no apta: poco contraste o varios coches)."""
import sys, os
os.environ.setdefault("U2NET_HOME", os.path.expanduser("~/.u2net"))
import numpy as np
from PIL import Image
from rembg import remove, new_session

src, dst = sys.argv[1], sys.argv[2]
mx = int(sys.argv[sys.argv.index("--max") + 1]) if "--max" in sys.argv else 1400
im = Image.open(src).convert("RGB")
if max(im.size) > mx:
    s = mx / max(im.size); im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
sess = new_session("u2net")
out = remove(im, session=sess, alpha_matting=False, post_process_mask=True)
a = np.array(out)[..., 3]
frac = (a > 128).mean()
ys, xs = np.where(a > 20)
if len(xs) == 0:
    print("VACIO", src); sys.exit(2)
out = out.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
os.makedirs(os.path.dirname(os.path.abspath(dst)), exist_ok=True)
out.save(dst)
print(f"OK {dst} {out.size} cobertura={frac:.2f}" + ("  AVISO: cobertura muy alta/baja" if frac > 0.85 or frac < 0.08 else ""))
