/* ============================================================
   sw.js - offline cache.
   The point is the car and the train: once the game has been
   opened at home it keeps working with no signal.

   Bump CACHE when any file below changes, otherwise returning
   visitors keep the old version.
   ============================================================ */

var CACHE = 'aya-memory-v2';

var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/game.css',
  './js/themes.js',
  './js/themes/wirbelwind.js',
  './js/themes/fahrzeuge.js',
  './js/audio.js',
  './js/confetti.js',
  './js/game.js',
  './js/pwa.js',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable.png'
  // shared/*.css is deliberately absent: it lives at ./shared/ in a
  // built deployment but at ../../shared/ in the repo, and listing both
  // means one of them 404s on every install. The fetch handler below
  // caches whatever the page actually loads, which covers it either way.
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // Individually, so one missing path cannot fail the whole install.
      // The shared/ CSS lives at two different places depending on
      // whether this is the repo layout or a built deployment.
      return Promise.all(ASSETS.map(function (url) {
        return c.add(url).catch(function () { return null; });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

// Cache first: the game is fully static, so the cached copy is always
// correct and starts instantly. A background fetch refreshes it for
// the next launch.
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== self.location.origin) return;

  e.respondWith(
    caches.match(e.request).then(function (hit) {
      var net = fetch(e.request).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        }
        return res;
      }).catch(function () { return hit; });

      return hit || net;
    })
  );
});
