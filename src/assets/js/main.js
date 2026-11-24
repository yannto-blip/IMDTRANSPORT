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
