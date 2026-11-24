/* IMD Transport — JS minimal : menu, carte, suivi des clics (désactivé par défaut). */
(function () {
  'use strict';
  var d = document;

  /* ---------- Menu mobile ---------- */
  var toggle = d.querySelector('[data-nav-toggle]');
  var nav = d.querySelector('[data-nav]');
  function closeNav() { if (!nav) return; nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { closeNav(); toggle.focus(); } });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeNav(); });
  }

  /* ---------- Sous-menu Prestations ---------- */
  var subBtn = d.querySelector('[data-sub-toggle]');
  if (subBtn) {
    subBtn.addEventListener('click', function () {
      subBtn.setAttribute('aria-expanded', String(subBtn.getAttribute('aria-expanded') !== 'true'));
    });
    d.addEventListener('click', function (e) {
      if (!e.target.closest('.has-sub') && window.matchMedia('(min-width: 1080px)').matches) subBtn.setAttribute('aria-expanded', 'false');
    });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && subBtn.getAttribute('aria-expanded') === 'true') { subBtn.setAttribute('aria-expanded', 'false'); subBtn.focus(); }
    });
  }

  /* ---------- Carte Île-de-France ---------- */
  Array.prototype.forEach.call(d.querySelectorAll('[data-map]'), function (wrap) {
    var info = wrap.querySelector('[data-map-info]');
    var deps = wrap.querySelectorAll('.dep');
    var def = info ? info.textContent : '';
    var touched = null;
    function show(el) {
      Array.prototype.forEach.call(deps, function (x) { x.classList.toggle('is-active', x === el); });
      if (info) info.textContent = el ? el.getAttribute('data-name') + ' — ' + el.getAttribute('data-code') : def;
    }
    Array.prototype.forEach.call(deps, function (el) {
      el.addEventListener('mouseenter', function () { show(el); });
      el.addEventListener('mouseleave', function () { show(null); });
      el.addEventListener('focus', function () { show(el); });
      el.addEventListener('blur', function () { show(null); });
      // Tactile : 1er appui affiche le nom, 2e appui ouvre la fiche du département.
      el.addEventListener('touchend', function (e) {
        if (touched !== el) { e.preventDefault(); touched = el; show(el); }
      }, { passive: false });
    });
  });

  /* ---------- Formulaire de devis → WhatsApp ou e-mail ----------
     Aucun envoi serveur : le message est construit ici puis ouvert dans WhatsApp (wa.me)
     ou dans la messagerie du client (mailto). La demande n'est transmise que lorsque
     le client l'envoie lui-même : aucune confirmation de réception n'est affichée. */
  function track(ev, f) {
    if (!window.IMD_ANALYTICS) return; // aucun traceur actif par défaut
    (window.dataLayer = window.dataLayer || []).push({ event: ev, page_path: location.pathname, cta_location: 'form', service: f.getAttribute('data-svc') || '' });
  }
  function val(f, n) { var el = f.elements[n]; return el ? String(el.value).replace(/^\s+|\s+$/g, '') : ''; }
  function buildQuoteMessage(f, mode) {
    var date = val(f, 'date');
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) { var p = date.split('-'); date = p[2] + '/' + p[1] + '/' + p[0]; }
    var rows = [
      ['Type de matériel', val(f, 'type')], ['Marque / modèle', val(f, 'model')], ['Poids', val(f, 'weight')], ['Dimensions', val(f, 'dims')],
      ['Lieu de chargement', val(f, 'from')], ['Lieu de livraison', val(f, 'to')], ['Date souhaitée', date],
      ['Nom / société', val(f, 'name')], ['Téléphone', val(f, 'phone')]
    ];
    var lines = ['Bonjour IMD Transport,', '', 'Je souhaite obtenir un devis pour un transport :', ''];
    rows.forEach(function (r) { if (r[1]) lines.push('- ' + r[0] + ' : ' + r[1]); });
    var info = val(f, 'info');
    if (info) lines.push('', 'Informations complémentaires :', info);
    lines.push('', mode === 'email' ? 'Je joins, si besoin, des photos du matériel à cet e-mail.' : 'Je peux vous envoyer des photos du matériel dans cette conversation.', '', 'Merci.');
    return lines.join('\n');
  }
  function buildSubject(f) {
    var parts = ['Demande de devis transport'];
    if (val(f, 'type')) parts.push(val(f, 'type'));
    if (val(f, 'from') && val(f, 'to')) parts.push(val(f, 'from') + ' → ' + val(f, 'to'));
    return parts.join(' — ');
  }
  window.IMD_buildQuoteMessage = buildQuoteMessage; // exposé pour les tests
  window.IMD_buildSubject = buildSubject;
  // Ouverture de l'application (surchargée dans les tests automatisés)
  window.IMD_open = window.IMD_open || function (url, mode) {
    if (mode === 'whatsapp' && !window.matchMedia('(pointer: coarse)').matches) window.open(url, '_blank', 'noopener');
    else window.location.href = url;
  };
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (ok, ko) {
      var ta = d.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.className = 'sr';
      d.body.appendChild(ta); ta.select();
      try { d.execCommand('copy') ? ok() : ko(); } catch (e) { ko(e); }
      d.body.removeChild(ta);
    });
  }

  Array.prototype.forEach.call(d.querySelectorAll('[data-quote]'), function (f) {
    var status = f.querySelector('[data-quote-status]');
    function say(parts) { // parts : tableau de paragraphes (texte ou nœuds)
      status.innerHTML = '';
      parts.forEach(function (x) { var p = d.createElement('p'); if (typeof x === 'string') p.textContent = x; else p.appendChild(x); status.appendChild(p); });
    }
    function validate() {
      var first = null;
      ['from', 'to'].forEach(function (n) {
        var el = f.elements[n], err = d.getElementById(el.id + '-err'), bad = !el.value.trim();
        if (bad) { el.setAttribute('aria-invalid', 'true'); if (!first) first = el; } else el.removeAttribute('aria-invalid');
        if (err) err.hidden = !bad;
      });
      if (first) { say(['Merci de renseigner les champs obligatoires : lieu de chargement et lieu de livraison.']); first.focus(); return false; }
      return true;
    }
    function link(href, text, blank) { var a = d.createElement('a'); a.href = href; a.textContent = text; if (blank) { a.target = '_blank'; a.rel = 'noopener'; } return a; }

    f.addEventListener('input', function (e) {
      var el = e.target;
      if (el.getAttribute('aria-invalid') === 'true' && el.value.trim()) {
        el.removeAttribute('aria-invalid');
        var err = d.getElementById(el.id + '-err'); if (err) err.hidden = true;
      }
    });

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var mode = (e.submitter && e.submitter.value) || 'whatsapp';
      if (!validate()) return;
      var url;
      if (mode === 'email') {
        url = 'mailto:' + f.getAttribute('data-email') + '?subject=' + encodeURIComponent(buildSubject(f)) + '&body=' + encodeURIComponent(buildQuoteMessage(f, 'email'));
        track('submit_quote_email', f);
        say(['Votre messagerie s’ouvre avec la demande pré-remplie. Joignez vos photos si besoin : la demande ne nous parvient qu’après avoir cliqué sur « Envoyer » dans votre messagerie.',
          (url.length > 1900
            ? 'Demande longue : si le texte apparaît coupé dans votre messagerie, utilisez « Copier la demande » ci-dessus et collez-la dans votre e-mail.'
            : 'Rien ne s’est ouvert ? Utilisez « Copier la demande » ci-dessus et envoyez-la à ' + f.getAttribute('data-email') + ' depuis votre webmail.')]);
      } else {
        url = 'https://wa.me/' + f.getAttribute('data-wa') + '?text=' + encodeURIComponent(buildQuoteMessage(f, 'whatsapp'));
        track('submit_quote_whatsapp', f);
        say(['WhatsApp s’ouvre avec votre demande pré-remplie. Elle ne nous parvient qu’après avoir appuyé sur « Envoyer » dans WhatsApp. Vous pourrez y joindre vos photos.',
          link(url, 'WhatsApp ne s’est pas ouvert ? Cliquez ici.', true)]);
      }
      window.IMD_open(url, mode);
    });

    Array.prototype.forEach.call(f.querySelectorAll('[data-copy]'), function (btn) {
      btn.addEventListener('click', function () {
        var what = btn.getAttribute('data-copy'), email = f.getAttribute('data-email');
        if (what === 'quote' && !validate()) return;
        var text = what === 'quote' ? 'Objet : ' + buildSubject(f) + '\n\n' + buildQuoteMessage(f, 'email') : email;
        copyText(text).then(function () {
          track(what === 'quote' ? 'copy_quote' : 'copy_email', f);
          say([what === 'quote'
            ? 'Demande copiée. Collez-la dans un e-mail adressé à ' + email + ' (ou dans WhatsApp au ' + (f.getAttribute('data-wa') || '').replace(/^33/, '0').replace(/(\d{2})(?=\d)/g, '$1 ') + '), puis envoyez-la. Elle n’est pas encore transmise.'
            : 'Adresse copiée : ' + email + '.']);
        }, function () {
          say(['Copie impossible sur cet appareil. Adresse : ' + email + '.']);
        });
      });
    });
  });

  /* ---------- Suivi des intentions de contact ----------
     Aucun outil n'est chargé. Les événements sont poussés dans window.dataLayer
     uniquement si window.IMD_ANALYTICS est activé (après consentement).
     Aucune donnée personnelle (numéro, contenu WhatsApp) n'est transmise. */
  var utm = {};
  try {
    var q = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (k) { if (q.get(k)) utm[k] = q.get(k).slice(0, 80); });
    if (Object.keys(utm).length) sessionStorage.setItem('imd_utm', JSON.stringify(utm));
    else utm = JSON.parse(sessionStorage.getItem('imd_utm') || '{}');
  } catch (e) { utm = {}; }

  d.addEventListener('click', function (e) {
    var a = e.target.closest('[data-track]');
    if (!a || !window.IMD_ANALYTICS) return;
    var ev = {
      event: a.getAttribute('data-track'),
      page_path: location.pathname,
      cta_location: a.getAttribute('data-loc') || '',
      service: a.getAttribute('data-svc') || d.body.getAttribute('data-svc') || ''
    };
    for (var k in utm) ev[k] = utm[k];
    (window.dataLayer = window.dataLayer || []).push(ev);
  });
})();
