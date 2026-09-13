/* ============================================================
   themes.js - theme registry.
   Must load BEFORE any js/themes/<name>.js file.

   A theme supplies the motifs, the palette and the wording. The
   engine in game.js knows nothing about pirates or tractors - it
   only ever asks the registry for the active theme.

   Adding one: see js/themes/README.md
   ============================================================ */

(function () {
  'use strict';

  var list = [];
  var byId = {};
  var active = null;

  var STORE_KEY = 'aya.memory.theme';

  function register(theme) {
    if (!theme || !theme.id) throw new Error('theme needs an id');
    if (byId[theme.id]) throw new Error('duplicate theme id: ' + theme.id);
    if (!theme.motifs || theme.motifs.length < 8) {
      // 8 pairs is the largest round, so a theme below that cannot
      // fill the big board without repeating a motif.
      throw new Error('theme "' + theme.id + '" needs at least 8 motifs');
    }
    var seen = {};
    theme.motifs.forEach(function (m) {
      if (!m.id || !m.svg || !m.bg) throw new Error('bad motif in ' + theme.id);
      if (seen[m.id]) throw new Error('duplicate motif id ' + m.id + ' in ' + theme.id);
      seen[m.id] = 1;
    });
    byId[theme.id] = theme;
    list.push(theme);
  }

  function all() { return list.slice(); }

  function get(id) { return byId[id] || null; }

  // Priority: ?theme=x  >  last choice  >  first registered.
  function preferred() {
    var q = null;
    try {
      q = new URLSearchParams(location.search).get('theme');
    } catch (e) { /* very old browser - fall through */ }
    if (q && byId[q]) return byId[q];

    try {
      var saved = localStorage.getItem(STORE_KEY);
      if (saved && byId[saved]) return byId[saved];
    } catch (e) { /* private mode */ }

    return list[0] || null;
  }

  // Paint the theme's variables onto :root. Everything visual that
  // differs between themes is a CSS variable, so this one call
  // re-skins the whole game without touching the DOM.
  function apply(theme) {
    if (!theme) return null;
    active = theme;
    var root = document.documentElement;
    if (theme.vars) {
      Object.keys(theme.vars).forEach(function (k) {
        root.style.setProperty(k, theme.vars[k]);
      });
    }
    root.setAttribute('data-theme', theme.id);
    try { localStorage.setItem(STORE_KEY, theme.id); } catch (e) {}
    return theme;
  }

  function current() { return active; }

  function motif(theme, id) {
    var hit = (theme || active).motifs.filter(function (m) { return m.id === id; });
    return hit[0] || (theme || active).motifs[0];
  }

  window.MemoryThemes = {
    register: register,
    all: all,
    get: get,
    preferred: preferred,
    apply: apply,
    current: current,
    motif: motif
  };
})();
