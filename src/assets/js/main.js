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

  /* ---------- Formulaire de devis → WhatsApp ----------
     Aucun envoi serveur : le message est construit ici puis ouvert dans WhatsApp.
     La demande n'est transmise que lorsque le client appuie sur « Envoyer » dans WhatsApp. */
  function buildQuoteMessage(f) {
    var v = function (n) { var el = f.elements[n]; return el ? String(el.value).replace(/\s+$/g, '').replace(/^\s+/g, '') : ''; };
    var date = v('date');
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) { var p = date.split('-'); date = p[2] + '/' + p[1] + '/' + p[0]; }
    var rows = [
      ['Type de matériel', v('type')], ['Marque / modèle', v('model')], ['Poids', v('weight')], ['Dimensions', v('dims')],
      ['Lieu de chargement', v('from')], ['Lieu de livraison', v('to')], ['Date souhaitée', date], ['Nom / société', v('name')]
    ];
    var lines = ['Bonjour IMD Transport,', '', 'Je souhaite obtenir un devis pour un transport :', ''];
    rows.forEach(function (r) { if (r[1]) lines.push('- ' + r[0] + ' : ' + r[1]); });
    var info = v('info');
    if (info) { lines.push('', 'Informations complémentaires :', info); }
    lines.push('', 'Je peux vous envoyer des photos du matériel dans cette conversation.', '', 'Merci.');
    return lines.join('\n');
  }
  window.IMD_buildQuoteMessage = buildQuoteMessage; // exposé pour les tests

  Array.prototype.forEach.call(d.querySelectorAll('[data-quote]'), function (f) {
    var status = f.querySelector('[data-quote-status]');
    f.addEventListener('input', function (e) {
      var el = e.target;
      if (el.getAttribute('aria-invalid') === 'true' && el.value.trim()) {
        el.removeAttribute('aria-invalid');
        var err = d.getElementById(el.id + '-err'); if (err) err.hidden = true;
      }
    });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = null;
      ['from', 'to'].forEach(function (n) {
        var el = f.elements[n], err = d.getElementById(el.id + '-err'), bad = !el.value.trim();
        if (bad) { el.setAttribute('aria-invalid', 'true'); if (!first) first = el; } else el.removeAttribute('aria-invalid');
        if (err) err.hidden = !bad;
      });
      if (first) {
        status.textContent = 'Merci de renseigner les champs obligatoires : lieu de chargement et lieu de livraison.';
        first.focus();
        return;
      }
      if (window.IMD_ANALYTICS) (window.dataLayer = window.dataLayer || []).push({ event: 'submit_whatsapp_form', page_path: location.pathname, cta_location: 'form', service: f.getAttribute('data-svc') || '' });
      var url = 'https://wa.me/' + f.getAttribute('data-wa') + '?text=' + encodeURIComponent(buildQuoteMessage(f));
      status.innerHTML = '';
      var p1 = d.createElement('p'); p1.textContent = 'WhatsApp s’ouvre avec votre demande pré-remplie. Elle ne nous parvient qu’après avoir appuyé sur « Envoyer » dans WhatsApp. Vous pourrez y joindre vos photos.';
      var p2 = d.createElement('p'); var a = d.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = 'WhatsApp ne s’est pas ouvert ? Cliquez ici.'; p2.appendChild(a);
      status.appendChild(p1); status.appendChild(p2);
      if (window.matchMedia('(pointer: coarse)').matches) { window.location.href = url; }
      else { window.open(url, '_blank', 'noopener'); }
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
