self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {}
  const title = data.title || 'Anchor'
  const options = {
    body: data.body || 'Time to check in on your recovery journey.',
    icon: '/anchor-icon.png',
    badge: '/anchor-icon.png',
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function(event) {
  event.notification.close()
  event.waitUntil(clients.openWindow('/'))
})