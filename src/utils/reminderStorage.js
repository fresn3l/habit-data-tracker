// Reminder storage and scheduling utilities

import { getAllStoredData } from './dataStorage'
import { getTodayKey } from './dataStorage'

export const REMINDER_STORAGE_KEY = 'habit-reminders'

export const saveReminder = (habitId, reminderConfig) => {
  const reminders = getAllReminders()
  reminders[habitId] = {
    habitId,
    enabled: reminderConfig.enabled || false,
    time: reminderConfig.time || '09:00',
    days: reminderConfig.days || [1, 2, 3, 4, 5], // Monday-Friday default
    ...reminderConfig
  }
  localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(reminders))
  return reminders[habitId]
}

export const getReminder = (habitId) => {
  const reminders = getAllReminders()
  return reminders[habitId] || null
}

export const getAllReminders = () => {
  try {
    const data = localStorage.getItem(REMINDER_STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error('Error reading reminders:', error)
    return {}
  }
}

export const deleteReminder = (habitId) => {
  const reminders = getAllReminders()
  delete reminders[habitId]
  localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(reminders))
}

export const isReminderEnabled = (habitId) => {
  const reminder = getReminder(habitId)
  return reminder && reminder.enabled
}

export const shouldRemindToday = (reminder) => {
  if (!reminder || !reminder.enabled) return false
  
  const today = new Date()
  const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.
  
  return reminder.days.includes(dayOfWeek)
}

export const getNextReminderTime = (reminder) => {
  if (!reminder || !reminder.enabled) return null
  
  const now = new Date()
  const [hours, minutes] = reminder.time.split(':').map(Number)
  
  const reminderTime = new Date()
  reminderTime.setHours(hours, minutes, 0, 0)
  
  // If time has passed today, schedule for tomorrow
  if (reminderTime <= now) {
    reminderTime.setDate(reminderTime.getDate() + 1)
  }
  
  // Find next day that matches reminder days
  while (!reminder.days.includes(reminderTime.getDay())) {
    reminderTime.setDate(reminderTime.getDate() + 1)
  }
  
  return reminderTime
}

export const isHabitCompletedToday = (habitId) => {
  const todayKey = getTodayKey()
  const allData = getAllStoredData()
  const todayData = allData[todayKey]
  
  if (!todayData || !todayData.habits) return false
  
  const habit = todayData.habits.find(h => h.id === habitId)
  return habit ? habit.completed : false
}

export const getActiveReminders = () => {
  const reminders = getAllReminders()
  return Object.values(reminders).filter(r => r.enabled)
}

