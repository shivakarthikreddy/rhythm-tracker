const CACHE_NAME = 'rhythm-v2';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    e.respondWith(
      fetch(e.request).then(r => {
        const c = r.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, c));
        return r;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).then(r => {
        const c = r.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, c));
        return r;
      })
    )
  );
});

self.addEventListener('push', e => {
  let data = { title: 'Rhythm', body: 'Check your habits!' };
  try { data = e.data.json(); } catch (err) {
    data.body = e.data ? e.data.text() : data.body;
  }
  e.waitUntil(self.registration.showNotification(data.title || 'Rhythm', {
    body: data.body, icon: './icon-192.png', badge: './icon-192.png',
    tag: data.tag || 'rhythm-reminder', renotify: true, requireInteraction: true
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cls => {
    if (cls.length > 0) { cls[0].focus(); return cls[0].navigate('./'); }
    return clients.openWindow('./');
  }));
});

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
