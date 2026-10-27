"""Same crop as compose.py (eyes aligned, 4:5), but keeps each photo's own background.
Usage: python compose_orig.py SEG_DIR OUT_DIR [--size WxH] [--cover]
If the photo does not fill the frame, it is scaled up just enough to fill it."""
import json, sys, pathlib
from PIL import Image, ImageOps
a = sys.argv[1:]; SEG, OUT = pathlib.Path(a[0]), pathlib.Path(a[1]); OUT.mkdir(exist_ok=True)
OW, OH = (int(v) for v in (a[a.index("--size") + 1] if "--size" in a else "960x1200").split("x"))
COVER = "--cover" in a
for js in sorted(SEG.glob("*.json")):
    slug = js.stem; info = json.loads(js.read_text())
    src = ImageOps.exif_transpose(Image.open(SEG / f"{slug}.src")).convert("RGB")
    lx, ly, rx, ry = info["eyes"]; cx, cy = (lx + rx) / 2, (ly + ry) / 2
    W, H = src.size
    s0 = 0.20 * OW / ((rx - lx) ** 2 + (ry - ly) ** 2) ** .5
    s = s0
    if COVER: s = max(s, OW / W, OH / H)
    x0, y0 = OW / 2 - cx * s, 0.42 * OH - cy * s
    gap = x0 > 0 or y0 > 0 or x0 + W * s < OW or y0 + H * s < OH
    if gap:  # fill the frame: scale up if needed, then slide
        s = max(s, OW / W, OH / H); x0, y0 = OW / 2 - cx * s, 0.42 * OH - cy * s
        x0 = min(0, max(OW - W * s, x0)); y0 = min(0, max(OH - H * s, y0))
    print(f"{slug:26s} {'refit x%.2f' % (s / s0) if gap else 'same crop'}")
    big = src.resize((round(W * s), round(H * s)), Image.LANCZOS)
    c = Image.new("RGB", (OW, OH)); c.paste(big, (round(x0), round(y0)))
    c.save(OUT / f"{slug}.jpg", quality=86, optimize=True, progressive=True)
