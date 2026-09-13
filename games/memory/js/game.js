/* ============================================================
   game.js - memory engine
   ------------------------------------------------------------
   Design rules this file encodes, all aimed at a 3-year-old:
   - no timer, no score, no move counter, no way to lose
   - the board always fits the screen, never scrolls
   - generous look-time before unmatched cards turn back
   - mouse and touch are handled by one pointer path
   - the whole game is reachable without reading a single word

   The engine is theme-agnostic: it asks MemoryThemes for motifs
   and palette and knows nothing about what is drawn on the cards.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- tuning ------------------------------------------------ */

  var LEVELS = [
    { pairs: 3, label: 'Ganz leicht' },
    { pairs: 4, label: 'Leicht' },
    { pairs: 6, label: 'Mittel' },
    { pairs: 8, label: 'Gross' }
  ];

  var CARD_RATIO   = 1.18;   // height / width
  var GAP          = 14;     // px between cards
  var MAX_CARD_W   = 230;    // do not let 6 cards fill a 27" monitor
  var MATCH_DELAY  = 420;    // ms to admire a correct pair before it locks
  var MISS_DELAY   = 1500;   // ms both wrong cards stay open - toddlers are slow
  var FLIP_BACK    = 360;    // ms wobble before turning back
  var DEAL_STAGGER = 55;     // ms between cards appearing

  var STAR = '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M12 2.6 15 9l7 1-5 4.9 1.2 7L12 18.6 5.8 21.9 7 14.9 2 10l7-1z"/></svg>';

  /* ---------- state ------------------------------------------------- */

  var state = {
    level: 0,
    deck: [],          // [{motif}]
    flipped: [],       // indices currently face up and unresolved
    matched: 0,
    lock: false,
    cards: []          // DOM nodes
  };

  var el = {};
  var confetti = null;
  var theme = null;

  /* ---------- helpers ----------------------------------------------- */

  function $(sel) { return document.querySelector(sel); }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = (Math.random() * (i + 1)) | 0;
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Pick the grid that makes the cards as large as possible while
  // keeping a complete rectangle (no holes - a hole reads as a bug
  // to a small child, and to the parent watching).
  //
  // Raw size alone would pick 6x2 for twelve cards on a wide screen.
  // That is technically the largest card, but it smears the board
  // across the full monitor width and a 3-year-old then loses track
  // of where she already looked. So lopsided grids take a penalty
  // and a compact 4x3 wins whenever it is nearly as large.
  function bestGrid(n, W, H) {
    var best = null;
    for (var cols = 1; cols <= n; cols++) {
      if (n % cols !== 0) continue;
      var rows = n / cols;
      var cw = (W - GAP * (cols - 1)) / cols;
      var ch = (H - GAP * (rows - 1)) / rows;
      var w = Math.min(cw, ch / CARD_RATIO);
      if (w <= 0) continue;
      var score = w * (1 - 0.25 * Math.abs(cols - rows) / (cols + rows));
      if (!best || score > best.score) {
        best = { cols: cols, rows: rows, w: w, score: score };
      }
    }
    return best;
  }

  // Everything here is floored to whole pixels and then re-checked
  // against the box. Fractional card sizes used to round upward and
  // push the last column a few pixels past the board edge, which
  // showed as a sliver of card next to the grid.
  function layout() {
    if (!state.cards.length) return;

    var box = el.board.getBoundingClientRect();
    if (box.width < 40 || box.height < 40) return;   // not laid out yet

    var g = bestGrid(state.deck.length, box.width, box.height);
    if (!g) return;

    var roomW = Math.floor((box.width  - GAP * (g.cols - 1)) / g.cols);
    var roomH = Math.floor((box.height - GAP * (g.rows - 1)) / g.rows);

    var w = Math.min(roomW, Math.floor(roomH / CARD_RATIO), MAX_CARD_W);
    var h = Math.min(Math.floor(w * CARD_RATIO), roomH);
    if (w < 1 || h < 1) return;

    el.grid.style.setProperty('--cols', g.cols);
    el.grid.style.setProperty('--card-w', w + 'px');
    el.grid.style.setProperty('--card-h', h + 'px');
    el.grid.style.setProperty('--gap', GAP + 'px');
  }

  /* ---------- theme -------------------------------------------------- */

  function useTheme(next) {
    theme = window.MemoryThemes.apply(next);

    el.title.innerHTML = theme.title || theme.name;
    document.title = (theme.title || theme.name).replace(/<br\s*\/?>/gi, ' ');

    var cover = window.MemoryThemes.motif(theme, theme.cover);
    if (cover) el.winHero.innerHTML = cover.svg;

    var host = $('#themes');
    if (host) {
      [].forEach.call(host.children, function (b) {
        b.classList.toggle('is-on', b.dataset.theme === theme.id);
        b.setAttribute('aria-pressed', b.dataset.theme === theme.id ? 'true' : 'false');
      });
    }
  }

  function buildThemePicker() {
    var themes = window.MemoryThemes.all();
    var host = $('#themes');
    // One theme means no choice to make - keep the start screen clean.
    if (themes.length < 2) { host.remove(); return; }

    themes.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'theme-btn';
      b.dataset.theme = t.id;
      b.setAttribute('aria-label', t.name);
      var cover = window.MemoryThemes.motif(t, t.cover);
      b.innerHTML = '<span class="theme-thumb" style="--motif-bg:' + cover.bg + '">' +
                    cover.svg + '</span>';
      b.addEventListener('pointerdown', function () {
        window.Sfx.unlock(); window.Sfx.tap();
      });
      b.addEventListener('click', function () { useTheme(t); });
      host.appendChild(b);
    });
  }

  /* ---------- screens ----------------------------------------------- */

  function show(screen) {
    ['start', 'game', 'win'].forEach(function (s) {
      el[s].classList.toggle('is-active', s === screen);
      el[s].setAttribute('aria-hidden', s === screen ? 'false' : 'true');
    });
  }

  function showStart() {
    if (confetti) confetti.stop();
    show('start');
  }

  /* ---------- round ------------------------------------------------- */

  function startRound(levelIndex) {
    state.level = levelIndex;
    var pairs = LEVELS[levelIndex].pairs;

    var picked = shuffle(theme.motifs.slice()).slice(0, pairs);
    var deck = [];
    picked.forEach(function (m) { deck.push(m, m); });
    state.deck = shuffle(deck);
    state.flipped = [];
    state.matched = 0;
    state.lock = false;

    buildProgress(pairs);
    buildCards();
    show('game');
    layout();

    for (var i = 0; i < state.deck.length; i++) window.Sfx.deal(i);
  }

  function buildProgress(pairs) {
    var html = '';
    for (var i = 0; i < pairs; i++) {
      html += '<span class="pip" aria-hidden="true">' + STAR + '</span>';
    }
    el.progress.innerHTML = html;
    el.progress.setAttribute('aria-label', '0 von ' + pairs + ' Paaren gefunden');
  }

  function buildCards() {
    el.grid.innerHTML = '';
    state.cards = [];

    state.deck.forEach(function (motif, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'card';
      btn.style.animationDelay = (i * DEAL_STAGGER) + 'ms';
      // 640ms = the deal animation, so idle float starts once cards landed.
      btn.style.setProperty('--float-delay', (640 + (i * 137) % 900) + 'ms');
      btn.setAttribute('aria-label', 'Karte ' + (i + 1) + ', verdeckt');
      btn.innerHTML =
        '<span class="card-inner">' +
          '<span class="face back">' +
            '<span class="back-star">' + STAR + '</span>' +
          '</span>' +
          '<span class="face front" style="--motif-bg:' + motif.bg + '">' +
            motif.svg +
          '</span>' +
        '</span>';

      // One pointer path covers mouse, pen and touch. `click` is only
      // used when it came from the keyboard (detail === 0), so a tap
      // never fires the handler twice.
      btn.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        activate(i);
      });
      btn.addEventListener('click', function (e) {
        if (e.detail === 0) activate(i);
      });

      el.grid.appendChild(btn);
      state.cards.push(btn);
    });
  }

  /* ---------- interaction ------------------------------------------- */

  function activate(i) {
    window.Sfx.unlock();

    var card = state.cards[i];
    if (!card || state.lock) return;
    if (card.classList.contains('is-flipped') || card.classList.contains('is-matched')) return;

    card.classList.add('is-flipped');
    card.setAttribute('aria-label', 'Karte ' + (i + 1) + ', ' + state.deck[i].name);
    window.Sfx.flip();
    state.flipped.push(i);

    if (state.flipped.length === 2) {
      state.lock = true;
      var a = state.flipped[0], b = state.flipped[1];
      if (state.deck[a].id === state.deck[b].id) {
        setTimeout(function () { onMatch(a, b); }, MATCH_DELAY);
      } else {
        setTimeout(function () { onMiss(a, b); }, MISS_DELAY);
      }
    }
  }

  function onMatch(a, b) {
    [a, b].forEach(function (i) {
      var c = state.cards[i];
      c.classList.add('is-matched');
      c.disabled = true;
      sparkle(c);
    });

    window.Sfx.match(state.matched);
    state.matched++;
    state.flipped = [];
    state.lock = false;

    var pips = el.progress.children;
    if (pips[state.matched - 1]) pips[state.matched - 1].classList.add('on');
    el.progress.setAttribute('aria-label',
      state.matched + ' von ' + LEVELS[state.level].pairs + ' Paaren gefunden');

    if (state.matched === LEVELS[state.level].pairs) {
      setTimeout(win, 520);
    }
  }

  function onMiss(a, b) {
    var cards = [state.cards[a], state.cards[b]];
    cards.forEach(function (c) { c.classList.add('is-wobble'); });
    window.Sfx.miss();

    setTimeout(function () {
      cards.forEach(function (c, k) {
        c.classList.remove('is-wobble', 'is-flipped');
        c.setAttribute('aria-label', 'Karte ' + ([a, b][k] + 1) + ', verdeckt');
      });
      state.flipped = [];
      state.lock = false;
    }, FLIP_BACK);
  }

  // Little stars flying out of a matched card.
  function sparkle(card) {
    if (window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var r = card.getBoundingClientRect();
    var host = el.fx;
    for (var i = 0; i < 7; i++) {
      var s = document.createElement('span');
      s.className = 'spark';
      s.innerHTML = STAR;
      var ang = (Math.PI * 2 * i) / 7 + Math.random() * 0.5;
      var dist = 50 + Math.random() * 55;
      s.style.left = (r.left + r.width / 2) + 'px';
      s.style.top = (r.top + r.height / 2) + 'px';
      s.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
      s.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
      s.style.animationDelay = (i * 22) + 'ms';
      host.appendChild(s);
      (function (node) {
        setTimeout(function () { node.remove(); }, 1100);
      })(s);
    }
  }

  /* ---------- win ---------------------------------------------------- */

  function win() {
    state.cards.forEach(function (c, i) {
      c.style.setProperty('--wave-delay', (i * 60) + 'ms');
      c.classList.add('is-wave');
    });
    window.Sfx.win();
    if (confetti) confetti.burst(140, 5200);
    setTimeout(function () { show('win'); }, 850);
  }

  /* ---------- fullscreen --------------------------------------------- */

  function fsElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
  }

  function fsSupported() {
    var de = document.documentElement;
    var enabled = document.fullscreenEnabled;
    if (enabled === undefined) enabled = document.webkitFullscreenEnabled;
    return !!(enabled && (de.requestFullscreen || de.webkitRequestFullscreen));
  }

  var fsBroken = false;

  function fsUnavailable() {
    // iOS Safari has no element fullscreen. A dead button is worse
    // than no button, so it goes away instead of doing nothing.
    fsBroken = true;
    el.full.hidden = true;
  }

  // start-memory.cmd launches the browser with --start-fullscreen, so
  // the window already covers the screen. requestFullscreen() then
  // changes nothing visible and the button feels broken - which is
  // exactly how it was reported. Hide it while that is the case.
  function windowFillsScreen() {
    if (!window.screen || !screen.width) return false;
    return Math.abs(window.innerWidth  - screen.width)  <= 2 &&
           Math.abs(window.innerHeight - screen.height) <= 2;
  }

  // Starting a round used to request fullscreen automatically. Browsers
  // answer element fullscreen with a permanent "swipe down to exit"
  // overlay that no page is allowed to suppress - it is a safety feature
  // so a site cannot trap you. That banner sat over the board the whole
  // time, so the automatic request is gone.
  //
  // The banner-free route to real fullscreen is installing the page:
  // the manifest declares display:fullscreen, so an installed copy runs
  // without any browser UI at all. See maybeOfferInstall().

  function toggleFullscreen() {
    var de = document.documentElement;
    try {
      if (!fsElement()) {
        var req = de.requestFullscreen || de.webkitRequestFullscreen;
        var p = req.call(de);
        // The promise rejects on a permissions policy block; unhandled
        // that was silent and the button looked broken.
        if (p && p.catch) p.catch(fsUnavailable);
      } else {
        var exit = document.exitFullscreen || document.webkitExitFullscreen;
        var q = exit.call(document);
        if (q && q.catch) q.catch(function () {});
      }
    } catch (e) {
      fsUnavailable();
    }
  }

  function syncFullscreenButton() {
    if (fsBroken || !fsSupported()) { el.full.hidden = true; return; }
    var on = !!fsElement();
    el.full.hidden = !on && windowFillsScreen();
    el.full.classList.toggle('is-off', on);
    el.full.setAttribute('aria-pressed', on ? 'true' : 'false');
    el.full.setAttribute('aria-label', on ? 'Vollbild beenden' : 'Vollbild starten');
  }

  /* ---------- install ------------------------------------------------- */

  // An installed copy runs with display:fullscreen from the manifest:
  // no browser UI, no exit-fullscreen banner, and it keeps working
  // offline. That is the only way to get real fullscreen without the
  // overlay, so offer it when the browser says it is possible.
  var installPrompt = null;

  function runningInstalled() {
    return (window.matchMedia &&
            (window.matchMedia('(display-mode: standalone)').matches ||
             window.matchMedia('(display-mode: fullscreen)').matches)) ||
           window.navigator.standalone === true;
  }

  function maybeOfferInstall() {
    if (runningInstalled()) return;             // already installed

    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      installPrompt = e;
      el.install.hidden = false;
    });

    window.addEventListener('appinstalled', function () {
      installPrompt = null;
      el.install.hidden = true;
    });

    el.install.addEventListener('click', function () {
      if (!installPrompt) return;
      window.Sfx.tap();
      installPrompt.prompt();
      installPrompt.userChoice.then(function () {
        installPrompt = null;
        el.install.hidden = true;
      });
    });
  }

  /* ---------- sound button -------------------------------------------- */

  function syncSoundButton() {
    var m = window.Sfx.isMuted();
    el.sound.classList.toggle('is-off', m);
    el.sound.setAttribute('aria-label', m ? 'Ton einschalten' : 'Ton ausschalten');
    el.sound.setAttribute('aria-pressed', m ? 'true' : 'false');
  }

  /* ---------- boot ---------------------------------------------------- */

  function init() {
    el.start    = $('#screen-start');
    el.game     = $('#screen-game');
    el.win      = $('#screen-win');
    el.board    = $('#board');
    el.grid     = $('#grid');
    el.progress = $('#progress');
    el.fx       = $('#fx');
    el.sound    = $('#btn-sound');
    el.full     = $('#btn-full');
    el.install  = $('#btn-install');
    el.title    = $('#title');
    el.winHero  = $('#win-hero');

    confetti = new window.Confetti($('#confetti'));

    buildThemePicker();
    useTheme(window.MemoryThemes.preferred());

    // Level buttons on the start screen.
    var levelHost = $('#levels');
    LEVELS.forEach(function (lv, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'level-btn';
      b.setAttribute('aria-label', lv.label + ', ' + lv.pairs + ' Paare');

      // A miniature of the actual board - readable without any text.
      var g = bestGrid(lv.pairs * 2, 100, 100 / CARD_RATIO);
      var mini = '';
      for (var k = 0; k < lv.pairs * 2; k++) mini += '<i></i>';
      b.innerHTML =
        '<span class="mini" style="--mc:' + (g ? g.cols : 2) + '">' + mini + '</span>' +
        '<span class="level-count">' + (lv.pairs * 2) + '</span>';

      b.addEventListener('pointerdown', function () {
        window.Sfx.unlock(); window.Sfx.tap();
      });
      b.addEventListener('click', function () { startRound(i); });
      levelHost.appendChild(b);
    });

    $('#btn-home').addEventListener('click', function () {
      window.Sfx.tap(); showStart();
    });
    $('#btn-again').addEventListener('click', function () {
      window.Sfx.tap(); startRound(state.level);
    });
    $('#btn-other').addEventListener('click', function () {
      window.Sfx.tap(); showStart();
    });
    el.sound.addEventListener('click', function () {
      window.Sfx.setMuted(!window.Sfx.isMuted());
      syncSoundButton();
      if (!window.Sfx.isMuted()) { window.Sfx.unlock(); window.Sfx.tap(); }
    });
    el.full.addEventListener('click', toggleFullscreen);

    syncSoundButton();
    syncFullscreenButton();
    maybeOfferInstall();

    ['fullscreenchange', 'webkitfullscreenchange'].forEach(function (ev) {
      document.addEventListener(ev, function () {
        syncFullscreenButton();
        layout();
      });
    });

    // A ResizeObserver on the board catches everything window.resize
    // misses: entering fullscreen, the mobile address bar collapsing,
    // the top bar rewrapping, an orientation flip mid-animation.
    function onResize() { layout(); syncFullscreenButton(); }

    if (window.ResizeObserver) {
      new window.ResizeObserver(onResize).observe(el.board);
    }
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', function () {
      setTimeout(onResize, 150);
    });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', layout);
    }

    // Belt and braces against toddler gestures on a touchscreen PC.
    document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    document.addEventListener('dblclick', function (e) { e.preventDefault(); });

    showStart();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
