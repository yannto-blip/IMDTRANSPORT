# Captures d'écran de contrôle (outil de test local, non déployé).
# Usage : python3 scripts/shots.py URL_BASE OUT_DIR page1,page2 largeur1,largeur2
import sys, os
from playwright.sync_api import sync_playwright

base, out = sys.argv[1], sys.argv[2]
paths = sys.argv[3].split(',')
widths = [int(w) for w in sys.argv[4].split(',')]
full = len(sys.argv) < 6 or sys.argv[5] != 'fold'
os.makedirs(out, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    for w in widths:
        ctx = b.new_context(viewport={'width': w, 'height': 800 if w < 700 else 900}, device_scale_factor=1, is_mobile=w < 700, has_touch=w < 700)
        pg = ctx.new_page()
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
        for path in paths:
            pg.goto(base + path, wait_until='networkidle')
            sw = pg.evaluate('document.documentElement.scrollWidth')
            name = (path.strip('/') or 'home').replace('/', '_')
            pg.screenshot(path=f'{out}/{name}-{w}.png', full_page=full)
            print(f'{path} @{w}: scrollWidth={sw} overflow={"OUI" if sw > w else "non"} errors={errs}')
            errs.clear()
        ctx.close()
    b.close()
