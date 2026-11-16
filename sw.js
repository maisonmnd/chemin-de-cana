// Chemin de Cana, version 20261116173520
const V = "cana-20261116173520";
const COEUR = ["./","index.html","app.enc","vendor/supabase.js","manifest.webmanifest","icones/icone-192.png","icones/icone-512.png","icones/apple-180.png","lectures/2026-11.json","lectures/2026-12.json","lectures/2027-01.json","lectures/2027-02.json","lectures/2027-03.json","lectures/2027-04.json","lectures/2027-05.json","lectures/2027-06.json","lectures/2027-07.json","lectures/2027-08.json","lectures/index.json"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(COEUR)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin === location.origin) {
    const frais = r.mode === "navigate" || /\/(index\.html|app\.enc)?$/.test(u.pathname);
    if (frais) {
      e.respondWith(fetch(r).then(res => { if (res.ok) { const copie = res.clone(); caches.open(V).then(c => c.put(r.mode === "navigate" ? "./" : r, copie)); } return res; }).catch(() => caches.match(r.mode === "navigate" ? "./" : r, {ignoreSearch: true})));
      return;
    }
    e.respondWith(caches.match(r, {ignoreSearch: true}).then(m => m || fetch(r).then(res => { if (res.ok) { const copie = res.clone(); caches.open(V).then(c => c.put(r, copie)); } return res; })));
    return;
  }
  if (/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) {
    e.respondWith(caches.open(V + "-polices").then(c => c.match(r).then(m => { const net = fetch(r).then(res => { c.put(r, res.clone()); return res; }).catch(() => m); return m || net; })));
  }
});
