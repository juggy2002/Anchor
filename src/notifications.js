export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export const scheduleLocalNotification = () => {
  if (!('Notification' in window)) return
  if (Notification.permission !== 'granted') return

  const now = new Date()
  const target = new Date()
  target.setHours(9, 0, 0, 0)
  if (now > target) target.setDate(target.getDate() + 1)

  const delay = target - now

  setTimeout(() => {
    new Notification('Anchor 🌿', {
      body: "Good morning — time to check in on your recovery journey.",
      icon: '/anchor-icon.png',
    })
    scheduleLocalNotification()
  }, delay)
}