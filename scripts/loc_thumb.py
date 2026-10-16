#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
loc_thumb.py <video> <idioma> [original.jpg]

Localiza la miniatura de un vídeo: borra el texto original (inpainting de la franja superior) y dibuja el
titular traducido con el mismo estilo (blanco/amarillo con contorno negro y banda roja).
Lee "thumb" de input/loc/<video>/<idioma>.json:  {"l1a","l1b","l2a","l2b"}  (l1b y l2b van en amarillo)
Deja out/loc/<video>/thumb/<idioma>.jpg (1280x720).
"""
import json, os, sys
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

video, lang = sys.argv[1], sys.argv[2]
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
src = sys.argv[3] if len(sys.argv) > 3 else f"{ROOT}/out/loc/{video}/thumb/orig.jpg"
cfg = json.load(open(f"{ROOT}/input/loc/{video}/{lang}.json", encoding="utf-8"))["thumb"]
img = cv2.imread(src)
H, W = img.shape[:2]
assert (W, H) == (1280, 720), "se espera una miniatura 1280x720"

# 1) máscara del texto original (blanco, amarillo, rojo de la banda y contorno negro) SOLO en la franja superior
Y1 = 250
box = np.zeros((H, W), np.uint8)
box[0:Y1, 120:1160] = 255
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
white = (v > 205) & (s < 70)
yellow = (h >= 18) & (h <= 38) & (s > 140) & (v > 190)
red = ((h <= 8) | (h >= 170)) & (s > 140) & (v > 90)
black = v < 55
mask = ((white | yellow | red | black) & (box > 0)).astype(np.uint8) * 255
mask = cv2.dilate(mask, np.ones((9, 9), np.uint8), iterations=2)
clean = cv2.inpaint(img, mask, 9, cv2.INPAINT_TELEA)
# suaviza la zona rellenada para que no se vea el parche
blur = cv2.GaussianBlur(clean, (0, 0), 14)
m3 = cv2.GaussianBlur(mask, (0, 0), 6)[..., None] / 255.0
clean = (clean * (1 - m3) + blur * m3).astype(np.uint8)

# 2) oscurece suavemente la franja superior (legibilidad) y dibuja el titular nuevo
base = Image.fromarray(cv2.cvtColor(clean, cv2.COLOR_BGR2RGB)).convert("RGBA")
grad = Image.new("RGBA", (W, 260), (0, 0, 0, 0))
gd = ImageDraw.Draw(grad)
for y in range(260):
    gd.line([(0, y), (W, y)], fill=(0, 0, 0, int(120 * (1 - y / 260))))
base.alpha_composite(grad, (0, 0))

FONT = r"C:\Windows\Fonts\impact.ttf"
if not os.path.exists(FONT):
    FONT = r"C:\Windows\Fonts\ariblk.ttf"


def fit(txt_parts, max_w, size):
    while size > 20:
        f = ImageFont.truetype(FONT, size)
        w = sum(f.getlength(t + " ") for t, _ in txt_parts) - f.getlength(" ")
        if w <= max_w:
            return f, w
        size -= 2
    return ImageFont.truetype(FONT, 20), max_w


def draw_line(im, parts, cy, max_w, size, skew=0.12):
    f, tw = fit(parts, max_w, size)
    layer = Image.new("RGBA", (W + 200, 260), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x = (layer.width - tw) / 2
    asc, desc = f.getmetrics()
    y = (layer.height - (asc + desc)) / 2
    for t, col in parts:
        d.text((x + 5, y + 6), t, font=f, fill=(0, 0, 0, 200), stroke_width=9, stroke_fill=(0, 0, 0, 200))   # sombra
        d.text((x, y), t, font=f, fill=col, stroke_width=8, stroke_fill=(0, 0, 0, 255))
        x += f.getlength(t + " ")
    # cursiva leve (como el original)
    layer = layer.transform(layer.size, Image.AFFINE, (1, skew, -skew * layer.height / 2, 0, 1, 0), Image.BICUBIC)
    layer = layer.crop((100, 0, 100 + W, 260))
    im.alpha_composite(layer, (0, int(cy - 130)))


WHITE, YELLOW = (255, 255, 255, 255), (255, 214, 0, 255)
# banda roja (segunda línea), con bordes irregulares tipo pincel
band = Image.new("RGBA", (W, H), (0, 0, 0, 0))
bd = ImageDraw.Draw(band)
pts = [(150, 150), (1100, 138), (1112, 186), (1090, 228), (170, 236), (158, 190)]
bd.polygon(pts, fill=(225, 20, 25, 255))
band = band.filter(ImageFilter.GaussianBlur(1.2))
base.alpha_composite(band)

draw_line(base, [(cfg["l1a"], WHITE), (cfg["l1b"], YELLOW)], 78, 1010, 150)
draw_line(base, [(cfg["l2a"], WHITE), (cfg["l2b"], YELLOW)], 188, 940, 96)

out = f"{ROOT}/out/loc/{video}/thumb"
os.makedirs(out, exist_ok=True)
base.convert("RGB").save(f"{out}/{lang}.jpg", quality=92)
print("OK ->", f"{out}/{lang}.jpg")
