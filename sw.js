const CACHE_NAME='rhythm-v3';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('/')){
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE_NAME).then(ch=>ch.put(e.request,c));return r}).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{const cl=r.clone();caches.open(CACHE_NAME).then(ch=>ch.put(e.request,cl));return r})));
});
self.addEventListener('push',e=>{let d={title:'Rhythm',body:'Check your habits!'};try{d=e.data.json()}catch(er){d.body=e.data?e.data.text():d.body}e.waitUntil(self.registration.showNotification(d.title||'Rhythm',{body:d.body,icon:'./icon-192.png',badge:'./icon-192.png',tag:d.tag||'rhythm',renotify:true,requireInteraction:true}))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(cls=>{if(cls.length>0){cls[0].focus();return cls[0].navigate('./')}return clients.openWindow('./')}))});
self.addEventListener('message',e=>{if(e.data==='skipWaiting')self.skipWaiting()});
