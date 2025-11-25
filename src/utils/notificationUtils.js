// Notification utilities for browser notifications

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

export const checkNotificationPermission = () => {
  if (!('Notification' in window)) {
    return false
  }
  return Notification.permission === 'granted'
}

export const createNotification = (title, options = {}) => {
  if (!checkNotificationPermission()) {
    console.warn('Notification permission not granted')
    return null
  }

  const notificationOptions = {
    body: options.body || '',
    icon: options.icon || '/favicon.ico',
    badge: options.badge || '/favicon.ico',
    tag: options.tag || 'habit-reminder',
    requireInteraction: options.requireInteraction || false,
    data: options.data || {},
    ...options
  }

  const notification = new Notification(title, notificationOptions)

  // Handle notification click
  if (options.onClick) {
    notification.onclick = (event) => {
      event.preventDefault()
      if (options.onClick) {
        options.onClick(event, notification)
      }
      notification.close()
    }
  }

  // Auto-close after timeout if specified
  if (options.timeout) {
    setTimeout(() => {
      notification.close()
    }, options.timeout)
  }

  return notification
}

export const createHabitReminderNotification = (habit, onComplete, onSnooze) => {
  const title = `🔔 ${habit.emoji} ${habit.name}`
  const body = `Don't forget to complete your habit today!`

  return createNotification(title, {
    body: body,
    tag: `habit-${habit.id}`,
    requireInteraction: true,
    data: {
      habitId: habit.id,
      type: 'habit-reminder'
    },
    onClick: (event) => {
      window.focus()
      // Could open the app or focus on the habit
    }
  })
}

