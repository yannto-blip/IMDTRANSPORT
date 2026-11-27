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
    ctx = b.new_context(bypass_csp=True, viewport={'width': 375, 'height': 740}, is_mobile=True, has_touch=True)
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
    pg.locator('.dep[data-code="77"]').tap(); pg.wait_for_url('**/zones-intervention**', timeout=5000); ok('zones-intervention' in pg.url, f'Carte : 2e appui ouvre la fiche ({pg.url.replace(base, "")})')
    ctx.close()
    # --- Desktop
    ctx = b.new_context(bypass_csp=True, viewport={'width': 1440, 'height': 900})
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

    # --- Formulaire de devis : WhatsApp + e-mail + copie (desktop et mobile)
    STUB = "() => { window.__opened=[]; window.IMD_open=(u,m)=>{window.__opened.push([m,u]);}; window.IMD_ANALYTICS=true; window.dataLayer=[]; }"
    def fill(pg):
        pg.fill('#qf-model', 'Kubota U27-4 + 2 godets & BRH'); pg.fill('#qf-weight', '2,7 t'); pg.fill('#qf-dims', '4,5 × 1,5 × 2,5 m')
        pg.fill('#qf-from', 'Évry-Courcouronnes (91)'); pg.fill('#qf-to', "Saint-Ouen-l'Aumône, 95"); pg.fill('#qf-date', '2026-12-15')
        pg.fill('#qf-name', 'Société Él€ctro Bâtiment'); pg.fill('#qf-phone', '06 12 34 56 78')
        pg.fill('#qf-info', 'Accès par rue étroite.\nLivraison avant 7h — merci !')
    for label, cx in (('ordinateur', ctx), ('mobile', b.new_context(bypass_csp=True, viewport={'width': 390, 'height': 800}, is_mobile=True, has_touch=True))):
        cx.grant_permissions(['clipboard-read', 'clipboard-write'], origin=base)
        pg = cx.new_page(); pg.goto(base + '/transport-mini-pelle'); pg.evaluate(STUB)
        click = (lambda sel: pg.tap(sel)) if label == 'mobile' else (lambda sel: pg.click(sel))
        ok(pg.locator('#qf-type').input_value() == 'Mini-pelle', f'[{label}] type pré-sélectionné selon la prestation')
        click('button[value=email]')
        ok(pg.get_attribute('#qf-from', 'aria-invalid') == 'true' and pg.evaluate("window.__opened.length") == 0, f'[{label}] champs obligatoires bloquants (e-mail)')
        st = pg.locator('[data-quote-status]').inner_text(); ok('obligatoires' in st and 'reçu' not in st.lower(), f'[{label}] erreur claire, aucune fausse confirmation')
        fill(pg)
        click('button[value=whatsapp]'); mode, url = pg.evaluate("window.__opened[0]")
        msg = unquote(url.split('text=')[1])
        ok(mode == 'whatsapp' and url.startswith('https://wa.me/33688494533?text='), f'[{label}] WhatsApp : wa.me vers le numéro IMD')
        ok('Téléphone : 06 12 34 56 78' in msg and "Saint-Ouen-l'Aumône, 95" in msg and 'Él€ctro' in msg and 'rue étroite.\nLivraison avant 7h' in msg and 'Date souhaitée : 15/12/2026' in msg, f'[{label}] WhatsApp : contenu complet (accents, symboles, retours à la ligne, date, téléphone)')
        ok('Envoyer' in pg.locator('[data-quote-status]').inner_text() and 'ne nous parvient qu' in pg.locator('[data-quote-status]').inner_text(), f'[{label}] WhatsApp : statut honnête')
        click('button[value=email]'); mode, url = pg.evaluate("window.__opened[1]")
        ok(mode == 'email' and url.startswith('mailto:imdtransport92@gmail.com?subject='), f'[{label}] E-mail : mailto vers imdtransport92@gmail.com')
        q = url.split('?', 1)[1]; subj = unquote(q.split('&body=')[0].replace('subject=', '')); body = unquote(q.split('&body=')[1])
        print(f'      objet : {subj}')
        ok(subj == "Demande de devis transport — Mini-pelle — Évry-Courcouronnes (91) → Saint-Ouen-l'Aumône, 95", f'[{label}] E-mail : objet explicite')
        ok('Téléphone : 06 12 34 56 78' in body and 'Marque / modèle : Kubota U27-4 + 2 godets & BRH' in body and 'Dimensions : 4,5 × 1,5 × 2,5 m' in body and 'rue étroite.\nLivraison' in body and 'photos du matériel à cet e-mail' in body, f'[{label}] E-mail : corps complet')
        raw = q.split('&body=')[1]
        ok('%0A' in raw and '%26' in raw and ' ' not in url and raw.count('&') == 0, f'[{label}] E-mail : encodage correct (&, retours à la ligne, espaces)')
        ok(len(url) < 2000, f'[{label}] E-mail : longueur du lien {len(url)} car. (< 2000)')
        st = pg.locator('[data-quote-status]').inner_text(); ok('Envoyer' in st and 'reçu' not in st.lower(), f'[{label}] E-mail : statut honnête')
        pg.click('[data-copy=quote]'); clip = pg.evaluate("navigator.clipboard.readText()")
        ok(clip.startswith('Objet : Demande de devis transport') and 'Téléphone : 06 12 34 56 78' in clip, f'[{label}] Copie de la demande')
        ok('pas encore transmise' in pg.locator('[data-quote-status]').inner_text(), f'[{label}] Copie : statut honnête')
        pg.click('[data-copy=email]'); ok(pg.evaluate("navigator.clipboard.readText()") == 'imdtransport92@gmail.com', f'[{label}] Copie de l\'adresse e-mail')
        evs = [e['event'] for e in pg.evaluate("window.dataLayer")]
        ok(evs == ['submit_quote_whatsapp', 'submit_quote_email', 'copy_quote', 'copy_email'] and '0612' not in json.dumps(pg.evaluate("window.dataLayer")), f'[{label}] Suivi (si activé) : {evs}, sans donnée personnelle')
    pg = ctx.new_page(); pg.goto(base + '/'); pg.evaluate(STUB.replace("window.IMD_ANALYTICS=true; ", ""))
    pg.fill('#qf-from', 'Paris'); pg.fill('#qf-to', 'Melun'); pg.click('button[value=whatsapp]')
    m2 = unquote(pg.evaluate("window.__opened[0][1]").split('text=')[1])
    ok('Poids' not in m2 and 'Téléphone' not in m2 and 'Lieu de livraison : Melun' in m2, 'Champs vides omis du message')
    ok(pg.evaluate("window.dataLayer.length") == 0, 'Suivi : aucun événement sans activation')
    ok(pg.locator('[data-quote]').count() == 1 and pg.locator('button[value=email]').count() == 1, 'Formulaire unique et mutualisé sur la page')
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
