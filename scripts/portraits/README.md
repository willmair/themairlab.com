# Lab portraits

All headshots on the site share one crop: 4:5 portrait (960×1200 current members, 480×600 alumni),
eyes at the same height and size. Each photo keeps its own original background (Will's choice,
27 Oct 2026: the cut-outs on a stone background looked odd). Scout's photo is her own. Originals live in `OneDrive/06 Career & Admin/Admin_WM+TK/Lab Headshots`; Will's is `OneDrive/William Mair Website/_originals/casual-headshot.jpg` (in front of the ship).

To add or replace someone (macOS; uses Apple's built-in subject detection, no uploads):

```bash
S=$(mktemp -d); mkdir $S/seg $S/out
cp scripts/portraits/* $S/ && cd $S && swiftc -O segment.swift -o segment
python3 -m venv venv && venv/bin/pip -q install pillow numpy
cp "<original photo>" seg/jane-doe.src
./segment seg/jane-doe.src seg/jane-doe.mask.png > seg/jane-doe.json
venv/bin/python compose_orig.py seg out                         # current members
venv/bin/python compose_orig.py seg out --size 480x600 --cover  # alumni
```

Then copy `out/jane-doe.jpg` to `assets/img/people/` and set `photo` and `slug` in `people.js`.
`segment` is only used here for the eye positions. `compose.py` is the older version that cut people out
onto a stone background; it is kept for reference but no longer used.
