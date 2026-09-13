/* ============================================================
   pwa.js - service worker registration.
   Deliberately silent: a failure here must never stop the game
   from being playable. Service workers only run on https or
   localhost, so this is a no-op when launched from file://.
   ============================================================ */

(function () {
  'use strict';

  if (!('serviceWorker' in navigator)) return;

  var secure = location.protocol === 'https:' ||
               location.hostname === 'localhost' ||
               location.hostname === '127.0.0.1';
  if (!secure) return;

  // When a new worker takes over, reload once so the page the visitor is
  // looking at is the one that was just deployed. Without this a fresh
  // build only becomes visible on the *next* visit, which is how an old
  // cached copy kept hiding a new button.
  var reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (reloading) return;
    reloading = true;
    location.reload();
  });

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' })
      .then(function (reg) {
        // Ask for a fresh worker on every load; cheap, and it keeps
        // installed copies on phones from drifting versions behind.
        reg.update();
      })
      .catch(function () {
        /* offline support is a bonus, not a requirement */
      });
  });
})();
