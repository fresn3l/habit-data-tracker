// Mood storage utilities

import { getAllStoredData, getTodayKey } from './dataStorage'

export const MOOD_STORAGE_KEY = 'mood-data'

export const saveMood = (dateKey, mood, notes = '') => {
  const allMoods = getAllMoods()
  allMoods[dateKey] = {
    date: dateKey,
    mood: mood, // 1-5 rating
    notes: notes,
    timestamp: new Date().toISOString(),
  }
  localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(allMoods))
  
  // Auto-sync to desktop file if enabled (background, non-blocking)
  if (typeof window !== 'undefined' && window.eel) {
    import('./desktopStorage').then(module => {
      module.autoSyncToDesktop().catch(() => {})
    }).catch(() => {})
  }
  
  return allMoods[dateKey]
}

export const getMood = (dateKey) => {
  const allMoods = getAllMoods()
  return allMoods[dateKey] || null
}

export const getAllMoods = () => {
  try {
    const data = localStorage.getItem(MOOD_STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error('Error reading moods:', error)
    return {}
  }
}

export const getMoodForDate = (dateKey) => {
  return getMood(dateKey)
}

export const getTodayMood = () => {
  const todayKey = getTodayKey()
  return getMood(todayKey)
}

export const getMoodHistory = (startDate, endDate) => {
  const allMoods = getAllMoods()
  const history = []
  
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toDateString()
    const mood = allMoods[dateKey]
    if (mood) {
      history.push(mood)
    }
  }
  
  return history.sort((a, b) => new Date(a.date) - new Date(b.date))
}

export const getAverageMood = (startDate, endDate) => {
  const history = getMoodHistory(startDate, endDate)
  if (history.length === 0) return null
  
  const sum = history.reduce((acc, mood) => acc + mood.mood, 0)
  return sum / history.length
}

export const getMoodEmoji = (mood) => {
  const moodMap = {
    1: '😢',
    2: '😕',
    3: '😐',
    4: '😊',
    5: '😄'
  }
  return moodMap[mood] || '😐'
}

