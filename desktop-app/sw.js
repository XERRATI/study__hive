/* =====================================================================
   Study Hive — service worker (sw.js)
   NETWORK-FIRST strategy. Why:
   · While online you ALWAYS get the newest files from GitHub Pages —
     updating the app (drag-and-drop upload) never serves stale copies.
   · Successful responses are quietly cached as a side effect, so the
     app still opens offline (and meets Chrome's installability criteria,
     which makes the manifest icons + home-screen shortcuts work).
   · The cache name never needs bumping: it is only used as an offline
     fallback, never as the source of truth while online.
   ===================================================================== */

var CACHE = 'studyhive-cache-v1';

self.addEventListener('install', function (e) {
  /* Take over as soon as possible so the new worker is active now,
     not on the next visit. */
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;   /* same-origin only */
  if (url.pathname.indexOf('/sw.js') !== -1) return; /* never cache self */

  e.respondWith(
    fetch(req).then(function (res) {
      if (res && res.ok) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) {
          c.put(req, copy);
        }).catch(function () {});
      }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) {
        if (hit) return hit;
        if (req.mode === 'navigate') {
          /* offline navigation: serve the cached landing page */
          return caches.match('./index.html').then(function (h) {
            return h || Response.error();
          });
        }
        return Response.error();
      });
    })
  );
});
