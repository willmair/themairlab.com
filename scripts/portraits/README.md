# Lab portraits

All headshots on the site share one look: 4:5 portrait, 960×1200, eyes at the same height and
size, on a warm stone background. Originals live in `OneDrive/01 Lab/Photos & Headshots/Lab Headshots`.

To add or replace someone (macOS; uses Apple's built-in subject detection, no uploads):

```bash
S=$(mktemp -d); mkdir $S/seg $S/out
cp scripts/portraits/* $S/ && cd $S && swiftc -O segment.swift -o segment
python3 -m venv venv && venv/bin/pip -q install pillow numpy
cp "<original photo>" seg/jane-doe.src
./segment seg/jane-doe.src seg/jane-doe.mask.png > seg/jane-doe.json
venv/bin/python compose.py out      # writes out/<slug>.jpg for every person in seg/
```

Then copy `out/jane-doe.jpg` to `assets/img/people/` and set `photo` and `slug` in `people.js`.
If a cut-out has stray edges (busy backgrounds, small photos), smooth the mask before composing:
open it, apply a `MinFilter(5)` then `MaxFilter(5)` with Pillow, and save it back.
