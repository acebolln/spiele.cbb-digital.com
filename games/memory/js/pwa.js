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

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function () {
      /* offline support is a bonus, not a requirement */
    });
  });
})();
