# Tests de l'autocomplétion IGN et des liens Google Maps (outil local).
# Les réponses de l'API sont simulées (échantillons réels capturés le 24/11/2026) pour des tests reproductibles hors ligne.
# Usage : python3 scripts/test_autocomplete.py http://localhost:4173 chemin/axe.min.js
import sys, json, time
from urllib.parse import urlparse, parse_qs, unquote
from playwright.sync_api import sync_playwright

base, axe_path = sys.argv[1], sys.argv[2]
axe = open(axe_path).read()
ok = lambda c, m: print(('✓ ' if c else '✗ ') + m)

R = lambda kind, full, zc, city, x, y: {"x": x, "y": y, "kind": kind, "fulltext": full, "zipcode": zc, "city": city, "metropole": True}
SAMPLES = {
  'suresnes': [R('administratif', 'Suresnes, 92150', '92150', None, 2.2157, 48.8705), R('municipality', 'Suresnes, 92150 Suresnes', '92150', 'Suresnes', 2.218042, 48.870746),
               R('lieu-dit habité', 'Suresnes, 92150 Suresnes', '92150', 'Suresnes', 2.2147, 48.8682), R('cimetière', 'Suresnes American Cemetery, 92150 Suresnes', '92150', 'Suresnes', 2.2176, 48.872),
               R('station de tramway', 'Suresnes Longchamp, 92150 Suresnes', '92150', 'Suresnes', 2.2214, 48.8681), R('street', 'Rue de Verdun, 92150 Suresnes', '92150', 'Suresnes', 2.231378, 48.875094)],
  'rue de paris': [R('street', f'Rue de Paris, {zc} {c}', zc, c, x, y) for zc, c, x, y in [('80000', 'Amiens', 2.2875, 49.8853), ('35000', 'Rennes', -1.6638, 48.1130), ('93100', 'Montreuil', 2.425466, 48.856152), ('92100', 'Boulogne-Billancourt', 2.2407, 48.8406), ('76600', 'Le Havre', 0.1074, 49.4882), ('94300', 'Vincennes', 2.43, 48.85), ('91300', 'Massy', 2.27, 48.73)]],
  'allée des jonquilles': [R('street', 'Allée des Jonquilles, 92150 Suresnes', '92150', 'Suresnes', 2.223147, 48.881701), R('quartier', 'Allée des Jonquilles, 59990 Préseau', '59990', 'Préseau', 3.574, 50.313)],
  '92150': [R('municipality', 'Suresnes, 92150 Suresnes', '92150', 'Suresnes', 2.218042, 48.870746), R('street', 'Rue Gambetta, 92150 Suresnes', '92150', 'Suresnes', 2.228476, 48.876836)],
  'zone industrielle gen': [R('street', 'Zone Industrielle, 60210 Grandvilliers', '60210', 'Grandvilliers', 1.925, 49.661), R('zone industrielle', 'Zone Industrielle des Chanteraines, 92230 Gennevilliers', '92230', 'Gennevilliers', 2.315243, 48.930741)],
  'évry': [R('administratif', 'Évry-Courcouronnes, 91000', '91000', None, 2.426, 48.625), R('municipality', 'Évry-Courcouronnes, 91000 Évry-Courcouronnes', '91000', 'Évry-Courcouronnes', 2.426005, 48.625154)],
}

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    for label, opts in (('ordinateur', {'viewport': {'width': 1440, 'height': 900}}), ('mobile', {'viewport': {'width': 390, 'height': 800}, 'is_mobile': True, 'has_touch': True})):
        cx = b.new_context(**opts)
        cx.grant_permissions(['clipboard-read', 'clipboard-write'], origin=base)
        state = {'reqs': [], 'mode': 'ok', 'delay': {}}
        def handler(route):
            u = route.request.url; q = parse_qs(urlparse(u).query); text = q.get('text', [''])[0]
            state['reqs'].append(q)
            if state['mode'] == 'down': return route.abort('failed')
            if state['mode'] == '500': return route.fulfill(status=503, body='{"error":"unavailable"}', content_type='application/json')
            d = state['delay'].get(text, 0)
            if d: time.sleep(d)
            res = next((v for k, v in SAMPLES.items() if text.lower().startswith(k)), [])
            route.fulfill(status=200, content_type='application/json', headers={'Access-Control-Allow-Origin': '*'}, body=json.dumps({'status': 'OK', 'results': res}))
        cx.route('https://data.geopf.fr/**', handler)
        pg = cx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(base + '/transport-mini-pelle')
        pg.evaluate("() => { window.__opened=[]; window.IMD_open=(u,m)=>window.__opened.push([m,u]); }")
        frm = pg.locator('#qf-from')
        tap = (lambda loc: loc.tap()) if label == 'mobile' else (lambda loc: loc.click())
        L = f'[{label}]'

        frm.click(); frm.press_sequentially('Su', delay=30); pg.wait_for_timeout(600)
        ok(len(state['reqs']) == 0, f'{L} moins de 3 caractères : aucune requête')
        frm.fill(''); state['reqs'].clear()
        frm.press_sequentially('rue de paris', delay=60); pg.wait_for_timeout(300)
        ok(len(state['reqs']) == 0, f'{L} temporisation : aucune requête pendant la frappe')
        pg.wait_for_timeout(500)
        ok(len(state['reqs']) == 1, f'{L} temporisation 400 ms : 1 seule requête pour 12 frappes ({len(state["reqs"])})')
        q = state['reqs'][0]
        ok(sorted(q.keys()) == ['maxSuggestions', 'terr', 'text', 'type'] and q['terr'] == ['METROPOLE'] and q['text'] == ['rue de paris'], f'{L} seuls le texte saisi + paramètres techniques envoyés (terr=METROPOLE)')
        opts_ = pg.locator('#qf-from-list [role=option]')
        ok(opts_.count() == 5, f'{L} 5 suggestions maximum (7 reçues → {opts_.count()})')
        ok(pg.get_attribute('#qf-from', 'aria-expanded') == 'true', f'{L} combobox : aria-expanded=true')
        t0 = opts_.nth(0).inner_text().replace('\n', ' | ')
        ok('Rue de Paris' in t0 and '80000 Amiens' in t0, f'{L} affichage adresse + code postal + commune ({t0})')
        # axe sur la liste ouverte
        pg.add_script_tag(content=axe)
        v = pg.evaluate("axe.run(document.querySelector('.qform'), {runOnly:['wcag2a','wcag2aa','wcag21aa']}).then(r=>r.violations.map(v=>v.id+':'+v.nodes.length))")
        ok(not v, f'{L} accessibilité (axe) liste ouverte : {v or "0 violation"}')
        if label == 'ordinateur':
            frm.press('ArrowDown'); frm.press('ArrowDown')
            ok(pg.get_attribute('#qf-from', 'aria-activedescendant') == 'qf-from-opt-1', f'{L} clavier : flèches + aria-activedescendant')
            frm.press('Enter')
        else:
            tap(opts_.nth(1))
        ok(frm.input_value() == 'Rue de Paris, 35000 Rennes' and frm.get_attribute('data-lat') == '48.113000' and frm.get_attribute('data-lon') == '-1.663800', f'{L} sélection ({"Entrée" if label == "ordinateur" else "toucher"}) : adresse + coordonnées GPS')
        ok(pg.locator('#qf-from-list').is_hidden() and pg.evaluate("window.__opened.length") == 0, f'{L} sélection : liste fermée, formulaire non envoyé')
        frm.press('End'); frm.type(' bis'); ok(frm.get_attribute('data-lat') is None, f'{L} modification manuelle après sélection : coordonnées effacées')
        # souris + POI filtrés + doublons
        frm.fill(''); state['reqs'].clear(); frm.press_sequentially('suresnes', delay=20); pg.wait_for_timeout(700)
        labels = [opts_.nth(i).inner_text().split('\n')[0] for i in range(opts_.count())]
        ok(labels == ['Suresnes', 'Rue de Verdun'], f'{L} filtrage : doublons et POI non pertinents écartés ({labels})')
        tap(opts_.nth(0)) if label == 'mobile' else opts_.nth(0).click()
        ok(frm.input_value() == 'Suresnes, 92150 Suresnes', f'{L} sélection ({"toucher" if label == "mobile" else "souris"})')
        # Échap
        to = pg.locator('#qf-to'); to.click(); to.press_sequentially('allée des jonquilles', delay=10); pg.wait_for_timeout(700)
        ok(state['reqs'][-1]['text'] == ['allée des jonquilles'] and pg.locator('#qf-to-list [role=option]').count() == 2, f'{L} accents : requête et résultats corrects')
        to.press('Escape'); ok(pg.locator('#qf-to-list').is_hidden(), f'{L} Échap ferme la liste')
        # code postal
        to.fill(''); to.press_sequentially('92150', delay=10); pg.wait_for_timeout(700)
        ok(pg.locator('#qf-to-list [role=option]').count() == 2, f'{L} recherche par code postal')
        # requête obsolète
        to.fill(''); state['delay'] = {'évr': 1.2}; to.press_sequentially('évr', delay=10); pg.wait_for_timeout(500); to.press_sequentially('y', delay=10); pg.wait_for_timeout(1500)
        names = [pg.locator('#qf-to-list [role=option]').nth(i).inner_text().split('\n')[0] for i in range(pg.locator('#qf-to-list [role=option]').count())]
        ok(names == ['Évry-Courcouronnes'] and to.input_value() == 'évry', f'{L} requête obsolète annulée/ignorée, seule la dernière s\'affiche')
        state['delay'] = {}
        # chantier non référencé + saisie manuelle
        to.fill(''); to.press_sequentially('Chantier ZAC des Docks lot B4, Saint-Ouen', delay=5); pg.wait_for_timeout(700)
        ok(pg.locator('#qf-to-list').is_hidden() and 'Aucune suggestion' in pg.locator('#qf-to').locator('xpath=..').locator('[data-ac-live]').inner_text(), f'{L} chantier non référencé : pas de suggestion, saisie libre conservée')
        pg.fill('#qf-from-extra', 'Portail 3, entrée poids lourds'); pg.fill('#qf-to-extra', 'Zone de chargement côté quai')
        pg.fill('#qf-phone', '06 12 34 56 78')
        tap(pg.locator('button[value=whatsapp]')); mode, url = pg.evaluate("window.__opened[0]")
        msg = unquote(url.split('text=')[1])
        ok('- Lieu de prise en charge : Suresnes, 92150 Suresnes' in msg and '- Complément / accès (prise en charge) : Portail 3, entrée poids lourds' in msg and '- Complément / accès (livraison) : Zone de chargement côté quai' in msg, f'{L} WhatsApp : adresses + compléments d\'accès')
        ok('https://www.google.com/maps/search/?api=1&query=48.870746,2.218042' in msg, f'{L} lien Maps prise en charge via coordonnées GPS')
        ok('https://www.google.com/maps/search/?api=1&query=Chantier%20ZAC%20des%20Docks%20lot%20B4,%20Saint-Ouen' in msg, f'{L} lien Maps livraison via adresse textuelle (saisie manuelle)')
        ok('Itinéraire indicatif, non validé pour les poids lourds : https://www.google.com/maps/dir/?api=1&origin=48.870746,2.218042&destination=Chantier%20ZAC' in msg and '&travelmode=driving' in msg, f'{L} lien itinéraire indicatif + mention poids lourds')
        tap(pg.locator('button[value=email]')); mode, url = pg.evaluate("window.__opened[1]")
        body = unquote(url.split('&body=')[1])
        ok(mode == 'email' and 'maps/dir/?api=1&origin=48.870746,2.218042' in body and 'Complément / accès' in body, f'{L} e-mail : mêmes liens et compléments')
        ok(url.count('&') == 1 and '%26destination' in url, f'{L} e-mail : liens correctement encodés dans le mailto')
        print(f'      longueur mailto (demande type complète) : {len(url)} car.')
        if label == 'ordinateur':
            print('      --- message WhatsApp décodé ---\n      ' + msg.replace('\n', '\n      '))
        # API indisponible
        for m in ('down', '500'):
            state['mode'] = m; pg.fill('#qf-from', ''); frm.press_sequentially('rue de paris', delay=5); pg.wait_for_timeout(800)
            ok(pg.locator('#qf-from-list').is_hidden() and frm.input_value() == 'rue de paris', f'{L} API {"injoignable" if m == "down" else "en erreur 503"} : saisie libre, aucun blocage')
        n = pg.evaluate("window.__opened.length"); tap(pg.locator('button[value=whatsapp]'))
        ok(pg.evaluate("window.__opened.length") == n + 1, f'{L} API indisponible : la demande part quand même')
        state['mode'] = 'ok'
        # longue demande → copie
        pg.fill('#qf-info', 'é' * 600); tap(pg.locator('button[value=email]'))
        ok('Demande longue' in pg.locator('[data-quote-status]').inner_text(), f'{L} demande longue : invitation à copier')
        pg.click('[data-copy=quote]'); clip = pg.evaluate("navigator.clipboard.readText()")
        ok('maps/dir/?api=1' in clip and 'Portail 3' in clip, f'{L} copie de la demande : liens Maps inclus')
        ok(not errs, f'{L} aucune erreur JavaScript')
        cx.close()
    b.close()
