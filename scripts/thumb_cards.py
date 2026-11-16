#!/usr/bin/env python3
"""thumb_cards.py <out.jpg> <mode> ... : miniatura 1280x720 con recortes de coche (public/assets/cut).
  pair <cutA> <cutB> <l1> <l2> <l3>   -> dos coches con "=" entre medias
  label <cut> <letra> <l1> <l2> <l3>  -> un coche con pegatina DGT circular grande
  versus <cutA> <notaA> <cutB> <notaB> <l1> <l2> <l3> -> dos coches con nota (A verde, B roja) y "VS"""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
out, mode = sys.argv[1], sys.argv[2]
W, H = 1280, 720
F = r"C:\Windows\Fonts\impact.ttf"
img = Image.new("RGB", (W, H))
d0 = ImageDraw.Draw(img)
for y in range(H):  # degradado oscuro azul-negro
    t = y / H
    d0.line([(0, y), (W, y)], fill=(int(18 + 20 * t), int(24 + 10 * t), int(48 - 30 * t)))
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(glow).ellipse([200, 260, 1080, 760], fill=(255, 190, 0, 70))
img.paste(glow.filter(ImageFilter.GaussianBlur(90)), (0, 0), glow.filter(ImageFilter.GaussianBlur(90)))
def car(p, box):
    im = Image.open(p).convert("RGBA"); x0, y0, x1, y1 = box
    s = min((x1 - x0) / im.width, (y1 - y0) / im.height); im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); sh.putalpha(im.getchannel("A").point(lambda a: int(a * 0.6)))
    sh = sh.filter(ImageFilter.GaussianBlur(14))
    px, py = x0 + (x1 - x0 - im.width) // 2, y1 - im.height
    img.paste((0, 0, 0), (px + 10, py + 18), sh); img.paste(im, (px, py), im)
d = ImageDraw.Draw(img, "RGBA")
def fit(t, size, maxw):
    while size > 20:
        f = ImageFont.truetype(F, size)
        if d.textlength(t, font=f) <= maxw: return f
        size -= 4
    return ImageFont.truetype(F, 20)
def txt(t, y, size, col, x=None, maxw=W - 80):
    f = fit(t, size, maxw); w = d.textlength(t, font=f); x = (W - w) // 2 if x is None else x
    d.text((x, y), t, font=f, fill=col, stroke_width=8, stroke_fill=(0, 0, 0, 255))
if mode == "pair":
    a, b, l1, l2, l3 = sys.argv[3:8]
    car(a, (10, 230, 630, 610)); car(b, (650, 230, 1270, 610))
    txt("=", 300, 200, (255, 215, 0), x=W // 2 - 45, maxw=200)
elif mode == "versus":
    a, na, b, nb, l1, l2, l3 = sys.argv[3:10]
    car(a, (10, 250, 630, 600)); car(b, (650, 250, 1270, 600))
    for cx, n, col in ((210, na, (30, 170, 60)), (1070, nb, (210, 30, 30))):
        cy, r = 300, 82
        d.ellipse([cx - r - 8, cy - r - 8, cx + r + 8, cy + r + 8], fill=(255, 255, 255)); d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=col)
        f = ImageFont.truetype(F, 110); w = d.textlength(n, font=f); d.text((cx - w / 2, cy - 68), n, font=f, fill=(255, 255, 255))
    txt("VS", 360, 150, (255, 215, 0), x=W // 2 - 70, maxw=200)
else:
    a, letter, l1, l2, l3 = sys.argv[3:8]
    car(a, (40, 220, 900, 620))
    cx, cy, r = 1060, 400, 165
    d.ellipse([cx - r - 10, cy - r - 10, cx + r + 10, cy + r + 10], fill=(255, 255, 255))
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(250, 210, 0))
    f = ImageFont.truetype(F, 240); w = d.textlength(letter, font=f)
    d.text((cx - w / 2, cy - 150), letter, font=f, fill=(20, 20, 20))
txt(l1, 14, 120, (255, 255, 255)); txt(l2, 140, 96, (255, 215, 0))
d.rectangle([0, H - 96, W, H], fill=(200, 20, 20, 240)); txt(l3, H - 94, 82, (255, 255, 255))
img.save(out, quality=92); print("OK", out)
