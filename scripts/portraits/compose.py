"""Place each cut-out on a shared background, aligned on the eyes, 4:5 portrait.

Usage:  python compose.py OUT_DIR [--size 960x1200] [--cover]

--size   output size (current members 960x1200; alumni 480x600, their old photos are small)
--cover  scale up as needed so the photo fills the frame, for tightly cropped originals
         that would otherwise leave a floating head or cut-off shoulders
"""
import json, sys, pathlib
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps

S = pathlib.Path(__file__).parent / "seg"
args = sys.argv[1:]
OUT = pathlib.Path(args[0])
OW, OH = (int(v) for v in (args[args.index("--size") + 1] if "--size" in args else "960x1200").split("x"))
COVER = "--cover" in args
EYE_SPAN = 0.20   # pupil distance as fraction of width
EYE_Y = 0.42      # eye line as fraction of height


def background():
    # warm stone, lighter in the upper middle (like soft studio light)
    y, x = np.mgrid[0:OH, 0:OW].astype(float)
    d = np.sqrt(((x - OW * .5) / OW) ** 2 + ((y - OH * .35) / OH) ** 2)
    t = np.clip(d / .75, 0, 1)[..., None]
    c0, c1 = np.array([238, 234, 226.]), np.array([214, 207, 196.])
    bg = c0 * (1 - t) + c1 * t
    bg += np.random.default_rng(1).normal(0, 1.2, bg.shape)  # tiny grain, avoids banding
    return Image.fromarray(np.clip(bg, 0, 255).astype("uint8"))


def only_this_person(mask, cx, cy):
    # keep the cut-out region that contains the face, dropping other people in the shot
    solid = mask.point(lambda v: 255 if v > 128 else 0)
    ImageDraw.floodfill(solid, (int(cx), int(cy)), 100)
    keep = solid.point(lambda v: 255 if v == 100 else 0).filter(ImageFilter.MaxFilter(5))
    return Image.fromarray(np.minimum(np.array(mask), np.array(keep)))


for js in sorted(S.glob("*.json")):
    slug = js.stem
    info = json.loads(js.read_text())
    src = ImageOps.exif_transpose(Image.open(S / f"{slug}.src")).convert("RGB")
    mask = Image.open(S / f"{slug}.mask.png").convert("L").resize(src.size)
    lx, ly, rx, ry = info["eyes"]
    cx, cy = (lx + rx) / 2, (ly + ry) / 2
    mask = only_this_person(mask, cx, cy)
    W, H = src.size
    s = EYE_SPAN * OW / ((rx - lx) ** 2 + (ry - ly) ** 2) ** .5
    if COVER:
        s = max(s, OW / W, OH / H)
    x0, y0 = OW / 2 - cx * s, EYE_Y * OH - cy * s
    if COVER:  # slide (never past the eyes' side of centre) so the photo covers the frame
        x0 = min(0, max(OW - W * s, x0))
        y0 = min(0, max(OH - H * s, y0))
    print(f"{slug:22s} scale {s:4.2f}")
    big = src.resize((round(W * s), round(H * s)), Image.LANCZOS)
    m = mask.resize(big.size, Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.2))
    canvas = background()
    canvas.paste(big, (round(x0), round(y0)), m)
    canvas.save(OUT / f"{slug}.jpg", quality=86, optimize=True, progressive=True)
