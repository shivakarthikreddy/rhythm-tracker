// Rhythm Service Worker — Handles push notifications & offline caching
const CACHE_NAME = 'rhythm-v1';
const ASSETS = ['./', './index.html'];

// Install — cache app shell
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

// Fetch — serve from cache, fallback to network
self.addEventListener('fetch', e => {











  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))






  );
});

// Push notification received
self.addEventListener('push', e => {
  let data = { title: 'Rhythm', body: 'Time to check your habits!' };
  try { data = e.data.json(); } catch (err) { 
    data.body = e.data ? e.data.text() : data.body;
  }
  e.waitUntil(
    self.registration.showNotification(data.title || 'Rhythm', {
      body: data.body || 'You have habits to complete!',
      icon: data.icon || './icon-192.png',
      badge: './icon-192.png',
      tag: data.tag || 'rhythm-reminder',
      renotify: true,
      requireInteraction: true,
      data: { url: './' }
    })
  );
});

// Notification clicked — open the app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cls => {
      if (cls.length > 0) {
        cls[0].focus();
        return cls[0].navigate('./');
      }
      return clients.openWindow('./');
    })
  );
});

// Periodic background sync (for scheduled reminders)
self.addEventListener('periodicsync', e => {
  if (e.tag === 'habit-check') {
    e.waitUntil(checkHabits());
  }
});

async function checkHabits() {
  // This sends a self-notification as a reminder
  const now = new Date();
  const hour = now.getHours();
  
  // Morning reminder (7 AM)
  if (hour === 7) {
    self.registration.showNotification('Rhythm — Good Morning!', {
      body: 'Start your day right. Check your habits!',
      tag: 'morning-reminder',
      renotify: true,
      requireInteraction: true
    });
  }
  
  // End of day reminder (9 PM)
  if (hour === 21) {
    self.registration.showNotification('Rhythm — End of Day', {
      body: 'Have you completed all your habits today?',
      tag: 'eod-reminder',
      renotify: true,
      requireInteraction: true
    });
  }
}
