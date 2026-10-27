# themairlab.com

Static website for the Metabolism and Aging Integrative Research (MAIR) Lab (Harvard T.H. Chan School of Public Health). No frameworks — plain HTML, CSS and JS.

## Updating content

| To change…                         | Edit                     | Then run                        |
|------------------------------------|--------------------------|---------------------------------|
| Current lab members / alumni       | `assets/js/people.js`    | nothing (live on save)          |
| News, press, podcasts              | `assets/js/news.js`      | nothing                         |
| Publications (pull new from PubMed)| `scripts/update_pubs.py` (EXCLUDE / FEATURED lists) | `python3 scripts/update_pubs.py` |
| Page text and layout               | `pages/*.html`           | `python3 scripts/build.py`      |
| Header, footer, nav                | `scripts/build.py`       | `python3 scripts/build.py`      |
| Colours, fonts, spacing            | `assets/css/style.css`   | nothing                         |

The `*.html` files in the root are generated — edit `pages/` instead.

Member photos go in `assets/img/people/` (4:5 portraits; see `scripts/portraits/README.md`) and are referenced with `photo:` in `people.js`.

To rebuild everything on a new computer or with a new assistant, see `REBUILD.md`; working rules are in `CLAUDE.md`.

## Preview locally

    python3 -m http.server 8765

then open http://localhost:8765
