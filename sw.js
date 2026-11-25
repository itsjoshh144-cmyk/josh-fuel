// Josh's Fuel service worker: app shell cached on install, food photos cached as they load.
const VERSION = "jf-v1";
const SHELL = ["./", "index.html", "app.js", "data.js", "manifest.json", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== "jf-img").map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;

  // Food photos: cache-first, then network (stored for offline).
  if (url.hostname === "images.unsplash.com") {
    e.respondWith(caches.open("jf-img").then(async c => {
      const hit = await c.match(e.request);
      if (hit) return hit;
      try { const res = await fetch(e.request); if (res.ok || res.type === "opaque") c.put(e.request, res.clone()); return res; }
      catch { return new Response("", { status: 504 }); }
    }));
    return;
  }

  // App files: network-first so updates show up, cache fallback when offline.
  if (url.origin === location.origin) {
    e.respondWith(fetch(e.request).then(res => {
      const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
  }
});

// Warm the photo cache after first load so the whole app works offline.
self.addEventListener("message", e => {
  if (e.data && e.data.type === "warm" && Array.isArray(e.data.urls)) {
    caches.open("jf-img").then(c => e.data.urls.forEach(u => c.match(u).then(hit => hit || fetch(u, { mode: "no-cors" }).then(r => c.put(u, r)).catch(() => {}))));
  }
});
