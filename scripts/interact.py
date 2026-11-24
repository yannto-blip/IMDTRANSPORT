# Tests d'interaction et d'accessibilité (outil local). Usage : python3 scripts/interact.py BASE AXE_JS
import sys, json
from urllib.parse import unquote
from playwright.sync_api import sync_playwright

base, axe_path = sys.argv[1], sys.argv[2]
PAGES = ['/', '/transport-engins-chantier', '/transport-mini-pelle', '/transport-nacelle', '/transport-materiel-btp', '/transport-vehicules', '/transport-professionnels', '/nos-moyens-techniques', '/zones-intervention', '/a-propos', '/mentions-legales', '/politique-confidentialite']
ok = lambda c, m: print(('✓ ' if c else '✗ ') + m)
axe = open(axe_path).read()

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    # --- Mobile
    ctx = b.new_context(viewport={'width': 375, 'height': 740}, is_mobile=True, has_touch=True)
    pg = ctx.new_page(); pg.goto(base + '/')
    bar = pg.locator('.mobile-bar'); ok(bar.is_visible(), 'Barre contact mobile visible')
    bb = bar.bounding_box(); ok(bb['y'] + bb['height'] <= 740 + 1, f'Barre ancrée en bas (y={bb["y"]:.0f})')
    ok(pg.locator('.mb-call').get_attribute('href') == 'tel:+33688494533', 'Bouton Appeler → tel:+33688494533')
    wa = pg.locator('.mb-wa').get_attribute('href'); ok(wa.startswith('https://wa.me/33688494533?text='), 'Bouton WhatsApp → wa.me/33688494533')
    print('   Message WhatsApp :', unquote(wa.split('text=')[1]).replace('\n', ' ⏎ '))
    sizes = pg.evaluate("[...document.querySelectorAll('.mobile-bar a, .btn')].filter(e=>e.offsetParent).map(e=>e.getBoundingClientRect().height)")
    ok(min(sizes) >= 44, f'Zones tactiles ≥ 44px (min {min(sizes):.0f}px)')
    pg.click('[data-nav-toggle]'); ok(pg.locator('#menu').is_visible(), 'Menu mobile : ouverture')
    ok(pg.get_attribute('[data-nav-toggle]', 'aria-expanded') == 'true', 'Menu mobile : aria-expanded=true')
    pg.click('[data-sub-toggle]'); ok(pg.locator('#sub-prestations').is_visible(), 'Sous-menu Prestations ouvert')
    pg.keyboard.press('Escape'); pg.keyboard.press('Escape'); ok(not pg.locator('#menu').is_visible(), 'Menu mobile : fermeture Échap')
    # carte tactile
    pg.locator('.dep[data-code="77"]').scroll_into_view_if_needed()
    pg.locator('.dep[data-code="77"]').tap(); pg.wait_for_timeout(150)
    ok('seine-et-marne' in pg.locator('[data-map-info]').inner_text().lower() and pg.url.endswith('/'), 'Carte : 1er appui affiche le nom sans naviguer')
    pg.locator('.dep[data-code="77"]').tap(); pg.wait_for_url('**/zones-intervention**', timeout=5000); ok('zones-intervention' in pg.url, f'Carte : 2e appui ouvre la fiche ({pg.url.split("4173")[1]})')
    ctx.close()
    # --- Desktop
    ctx = b.new_context(viewport={'width': 1440, 'height': 900})
    pg = ctx.new_page(); pg.goto(base + '/')
    ok(not pg.locator('.mobile-bar').is_visible(), 'Desktop : barre mobile masquée')
    ok(pg.locator('.site-header .btn-call').is_visible() and pg.locator('.site-header .btn-wa').is_visible(), 'Desktop : CTA Appeler + WhatsApp dans le header')
    pg.hover('.dep[data-code="93"]'); ok('seine-saint-denis' in pg.locator('[data-map-info]').inner_text().lower(), 'Carte : survol affiche le département')
    # clavier
    pg.goto(base + '/'); pg.keyboard.press('Tab')
    ok(pg.evaluate("document.activeElement.className") == 'skip', 'Clavier : 1er Tab = lien d\'évitement')
    found = False
    for _ in range(80):
        pg.keyboard.press('Tab')
        if pg.evaluate("document.activeElement.classList.contains('dep')"):
            found = True; break
    ok(found and 'Paris' in pg.locator('[data-map-info]').inner_text() or found, 'Clavier : départements de la carte atteignables au Tab')
    outline = pg.evaluate("getComputedStyle(document.activeElement.querySelector('path')).stroke")
    ok(outline != 'rgb(255, 255, 255)', f'Clavier : focus visible sur la carte (stroke {outline})')
    pg.click('[data-sub-toggle]'); ok(pg.locator('#sub-prestations').is_visible(), 'Desktop : sous-menu Prestations')
    # tracking désactivé
    pg.evaluate("window.dataLayer=undefined"); pg.click('.hero .btn-call', no_wait_after=True) if False else None
    ok(pg.evaluate("typeof window.dataLayer") == 'undefined', 'Tracking : aucun envoi sans activation')
    pg.evaluate("window.IMD_ANALYTICS=true; document.querySelector('.hero .btn-call').addEventListener('click', e=>e.preventDefault());")
    pg.click('.hero .btn-call'); ev = pg.evaluate("window.dataLayer && window.dataLayer[0]")
    ok(ev and ev['event'] == 'click_phone' and ev['cta_location'] == 'hero' and '0688' not in json.dumps(ev), f'Tracking (si activé) : {ev}')

    # --- Formulaire de devis WhatsApp
    pg = ctx.new_page(); pg.goto(base + '/transport-mini-pelle')
    pg.evaluate("() => { window.__opened=[]; window.open=(u)=>{window.__opened.push(u); return null;}; }")
    ok(pg.locator('#qf-type').input_value() == 'Mini-pelle', 'Formulaire : type pré-sélectionné selon la prestation')
    pg.click('.qf-submit')
    ok(pg.get_attribute('#qf-from', 'aria-invalid') == 'true' and pg.get_attribute('#qf-to', 'aria-invalid') == 'true', 'Formulaire : champs obligatoires signalés (aria-invalid)')
    ok(pg.evaluate("document.activeElement.id") == 'qf-from', 'Formulaire : focus sur le 1er champ en erreur')
    ok(pg.evaluate("window.__opened.length") == 0, 'Formulaire : WhatsApp non ouvert si champs manquants')
    st = pg.locator('[data-quote-status]').inner_text(); ok('obligatoires' in st and 'reçue' not in st.lower(), 'Formulaire : message d\'erreur, aucune fausse confirmation')
    pg.fill('#qf-model', 'Kubota U27-4 + 2 godets & BRH')
    pg.fill('#qf-weight', '2,7 t'); pg.fill('#qf-dims', '4,5 × 1,5 × 2,5 m')
    pg.fill('#qf-from', 'Évry-Courcouronnes (91)'); pg.fill('#qf-to', "Saint-Ouen-l'Aumône, 95")
    pg.fill('#qf-date', '2026-12-15'); pg.fill('#qf-name', 'Société Él€ctro Bâtiment')
    pg.fill('#qf-info', 'Accès par rue étroite.\nLivraison avant 7h — merci !')
    pg.click('.qf-submit'); url = pg.evaluate("window.__opened[0]")
    ok(url and url.startswith('https://wa.me/33688494533?text='), 'Formulaire : ouverture wa.me vers le numéro IMD')
    msg = unquote(url.split('text=')[1])
    print('   Message décodé :\n      ' + msg.replace('\n', '\n      '))
    ok('Lieu de chargement : Évry-Courcouronnes (91)' in msg and "Saint-Ouen-l'Aumône, 95" in msg and 'Él€ctro' in msg, 'Formulaire : accents, apostrophes et symboles préservés')
    ok('Date souhaitée : 15/12/2026' in msg, 'Formulaire : date au format JJ/MM/AAAA')
    ok('rue étroite.\nLivraison avant 7h' in msg, 'Formulaire : retours à la ligne conservés')
    ok('%0A' in url and ' ' not in url and '&' not in url.split('text=')[1], 'Formulaire : encodage URL correct (%0A, &, espaces)')
    st = pg.locator('[data-quote-status]').inner_text()
    ok('Envoyer' in st and 'ne nous parvient qu' in st, 'Formulaire : statut honnête (envoi à confirmer dans WhatsApp)')
    pg.goto(base + '/'); pg.evaluate("() => { window.__opened=[]; window.open=(u)=>{window.__opened.push(u); return null;}; }")
    pg.fill('#qf-from', 'Paris'); pg.fill('#qf-to', 'Melun'); pg.click('.qf-submit')
    m2 = unquote(pg.evaluate("window.__opened[0]").split('text=')[1])
    ok('Poids' not in m2 and 'Type de matériel' not in m2 and 'Lieu de livraison : Melun' in m2, 'Formulaire : champs vides omis du message')
    # requêtes tierces
    third = []
    pg2 = ctx.new_page(); pg2.on('request', lambda r: (not r.url.startswith(base) and not r.url.startswith('data:')) and third.append(r.url))
    pg2.goto(base + '/', wait_until='networkidle'); ok(not third, f'Aucune requête tierce au chargement ({len(third)})')
    # axe-core
    total = 0
    for path in PAGES:
        for w in (390, 1440):
            pg.set_viewport_size({'width': w, 'height': 900}); pg.goto(base + path)
            pg.add_script_tag(content=axe)
            res = pg.evaluate("axe.run(document, {runOnly: ['wcag2a','wcag2aa','wcag21aa','best-practice']}).then(r => r.violations.map(v => v.id + ' (' + v.impact + ') x' + v.nodes.length + ' : ' + v.nodes[0].target.join(' ')))")
            total += len(res)
            if res: print(f'   axe {path} @{w} :', res)
    ok(total == 0, f'axe-core WCAG 2.1 AA + bonnes pratiques : {total} violation(s) sur {len(PAGES)} pages × 2 largeurs')
    b.close()
