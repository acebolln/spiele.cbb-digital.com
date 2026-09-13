/* ============================================================
   sw.js - offline cache.
   The point is the car and the train: once the game has been
   opened at home it keeps working with no signal.

   Strategy, split by what the file is:

   - code (HTML, CSS, JS, manifest): NETWORK FIRST, cache as
     fallback. A pure cache-first worker served the previous
     version until the second visit, so a fix shipped today only
     showed up tomorrow. Online you now always get the current
     build; offline you still get the last one that worked.

   - assets (fonts, icons, images): CACHE FIRST. They are big,
     they never change in place, and a round trip for them would
     slow the start for nothing.

   Bump CACHE when the file list changes, to drop stale entries.
   ============================================================ */

var CACHE = 'aya-memory-v3';

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

// Fonts, icons and images: cache first, they are immutable in practice.
function isAsset(url) {
  return /\.(woff2?|ttf|otf|png|jpe?g|gif|svg|webp|ico)$/i.test(url.pathname);
}

function putInCache(request, response) {
  if (response && response.ok) {
    var copy = response.clone();
    caches.open(CACHE).then(function (c) { c.put(request, copy); });
  }
  return response;
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;

  if (isAsset(url)) {
    e.respondWith(
      caches.match(req).then(function (hit) {
        return hit || fetch(req).then(function (res) { return putInCache(req, res); });
      })
    );
    return;
  }

  // Code: network first so a deploy takes effect immediately,
  // falling back to the cache when there is no connection.
  e.respondWith(
    fetch(req)
      .then(function (res) { return putInCache(req, res); })
      .catch(function () {
        return caches.match(req).then(function (hit) {
          if (hit) return hit;
          // A navigation with nothing cached for that exact URL still
          // gets the app shell rather than a browser error page.
          if (req.mode === 'navigate') return caches.match('./index.html');
          return Response.error();
        });
      })
  );
});
