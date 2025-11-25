// Reminder scheduling logic

import { getActiveReminders, shouldRemindToday, isHabitCompletedToday, getNextReminderTime } from './reminderStorage'
import { createHabitReminderNotification } from './notificationUtils'
import { getAllStoredData } from './dataStorage'

let reminderInterval = null
let scheduledReminders = new Map()

export const startReminderScheduler = () => {
  // Clear any existing interval
  stopReminderScheduler()
  
  // Check for reminders every minute
  reminderInterval = setInterval(() => {
    checkAndTriggerReminders()
  }, 60000) // Check every minute
  
  // Also check immediately
  checkAndTriggerReminders()
}

export const stopReminderScheduler = () => {
  if (reminderInterval) {
    clearInterval(reminderInterval)
    reminderInterval = null
  }
  
  // Clear scheduled reminders
  scheduledReminders.forEach(timeout => clearTimeout(timeout))
  scheduledReminders.clear()
}

export const checkAndTriggerReminders = () => {
  const now = new Date()
  const activeReminders = getActiveReminders()
  
  activeReminders.forEach(reminder => {
    // Check if we should remind today
    if (!shouldRemindToday(reminder)) {
      return
    }
    
    // Check if habit is already completed
    if (isHabitCompletedToday(reminder.habitId)) {
      return
    }
    
    // Check if it's time to remind
    const [hours, minutes] = reminder.time.split(':').map(Number)
    const reminderTime = new Date()
    reminderTime.setHours(hours, minutes, 0, 0)
    
    const nowTime = new Date()
    nowTime.setHours(now.getHours(), now.getMinutes(), 0, 0)
    
    // Check if we're within the reminder window (same hour)
    if (reminderTime.getHours() === nowTime.getHours() && 
        reminderTime.getMinutes() === nowTime.getMinutes()) {
      
      // Check if we already sent a reminder today
      const reminderKey = `reminder-${reminder.habitId}-${now.toDateString()}`
      if (!scheduledReminders.has(reminderKey)) {
        triggerReminder(reminder)
        scheduledReminders.set(reminderKey, true)
      }
    }
  })
}

export const triggerReminder = async (reminder) => {
  // Get habit details
  const allData = getAllStoredData()
  let habit = null
  
  // Find habit in today's data or recent data
  const todayKey = new Date().toDateString()
  const todayData = allData[todayKey]
  
  if (todayData && todayData.habits) {
    habit = todayData.habits.find(h => h.id === reminder.habitId)
  }
  
  // If not found, try to get from habit categories or create minimal habit object
  if (!habit) {
    // Try to find in any recent day's data
    for (const dayData of Object.values(allData).slice(-7)) {
      if (dayData.habits) {
        const found = dayData.habits.find(h => h.id === reminder.habitId)
        if (found) {
          habit = found
          break
        }
      }
    }
  }
  
  // Create minimal habit if not found
  if (!habit) {
    habit = {
      id: reminder.habitId,
      name: 'Habit',
      emoji: '📝'
    }
  }
  
  // Create notification
  createHabitReminderNotification(habit, () => {
    // Handle complete action
    window.focus()
  }, () => {
    // Handle snooze action
    // Schedule for 15 minutes later
    setTimeout(() => {
      triggerReminder(reminder)
    }, 15 * 60 * 1000)
  })
  
  // Log reminder
  logReminderTriggered(reminder.habitId)
}

export const logReminderTriggered = (habitId) => {
  try {
    const logs = getReminderLogs()
    logs.push({
      habitId,
      timestamp: new Date().toISOString(),
      date: new Date().toDateString()
    })
    
    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.shift()
    }
    
    localStorage.setItem('reminder-logs', JSON.stringify(logs))
  } catch (error) {
    console.error('Error logging reminder:', error)
  }
}

export const getReminderLogs = () => {
  try {
    const data = localStorage.getItem('reminder-logs')
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading reminder logs:', error)
    return []
  }
}

// Schedule reminders for all active reminders
export const scheduleAllReminders = () => {
  stopReminderScheduler()
  
  const activeReminders = getActiveReminders()
  const now = new Date()
  
  activeReminders.forEach(reminder => {
    if (!shouldRemindToday(reminder)) return
    
    const nextTime = getNextReminderTime(reminder)
    if (!nextTime) return
    
    const timeUntilReminder = nextTime.getTime() - now.getTime()
    
    if (timeUntilReminder > 0 && timeUntilReminder < 24 * 60 * 60 * 1000) {
      const timeoutId = setTimeout(() => {
        triggerReminder(reminder)
        scheduleAllReminders() // Reschedule after triggering
      }, timeUntilReminder)
      
      scheduledReminders.set(reminder.habitId, timeoutId)
    }
  })
  
  // Also start the interval checker as backup
  startReminderScheduler()
}

