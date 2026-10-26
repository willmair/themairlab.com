"""Place each cut-out on a shared background, aligned on the eyes, 4:5 portrait."""
import json, sys, pathlib
import numpy as np
from PIL import Image, ImageFilter, ImageOps

S = pathlib.Path(__file__).parent / "seg"
OUT = pathlib.Path(sys.argv[1])
OW, OH = 960, 1200
EYE_SPAN = float(sys.argv[2]) if len(sys.argv) > 2 else 0.20   # pupil distance as fraction of width
EYE_Y = float(sys.argv[3]) if len(sys.argv) > 3 else 0.42


def background():
    # warm stone, lighter in the upper middle (like soft studio light)
    y, x = np.mgrid[0:OH, 0:OW].astype(float)
    d = np.sqrt(((x - OW * .5) / OW) ** 2 + ((y - OH * .35) / OH) ** 2)
    t = np.clip(d / .75, 0, 1)[..., None]
    c0, c1 = np.array([238, 234, 226.]), np.array([214, 207, 196.])
    bg = c0 * (1 - t) + c1 * t
    bg += np.random.default_rng(1).normal(0, 1.2, bg.shape)  # tiny grain, avoids banding
    return Image.fromarray(np.clip(bg, 0, 255).astype("uint8"))


for js in sorted(S.glob("*.json")):
    slug = js.stem
    info = json.loads(js.read_text())
    src = ImageOps.exif_transpose(Image.open(S / f"{slug}.src")).convert("RGB")
    mask = Image.open(S / f"{slug}.mask.png").convert("L").resize(src.size)
    lx, ly, rx, ry = info["eyes"]
    span = ((rx - lx) ** 2 + (ry - ly) ** 2) ** .5
    s = EYE_SPAN * OW / span
    cx, cy = (lx + rx) / 2, (ly + ry) / 2
    W, H = src.size
    # where the source edges land in the output (gaps mean the cut-out ends inside the frame)
    left, right = OW / 2 - cx * s, OW / 2 + (W - cx) * s
    bottom = EYE_Y * OH + (H - cy) * s
    print(f"{slug:20s} scale {s:4.2f}  left {left:6.0f}  right {right:6.0f}  bottom {bottom:6.0f}/{OH}")
    big = src.resize((round(W * s), round(H * s)), Image.LANCZOS)
    m = mask.resize(big.size, Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.2))
    canvas = background()
    canvas.paste(big, (round(OW / 2 - cx * s), round(EYE_Y * OH - cy * s)), m)
    canvas.save(OUT / f"{slug}.jpg", quality=86, optimize=True, progressive=True)
