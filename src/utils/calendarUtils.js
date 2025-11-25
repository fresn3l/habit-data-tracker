// Calendar utilities for heatmap and date calculations

import { getAllStoredData, getDayData } from './dataStorage'

export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate()
}

export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay()
}

export const getCalendarDays = (year, month) => {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const days = []
  
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      day,
      date: new Date(year, month, day).toDateString(),
      fullDate: new Date(year, month, day)
    })
  }
  
  return days
}

export const getCompletionIntensity = (dateKey, allData) => {
  const dayData = allData[dateKey]
  if (!dayData || !dayData.habits) return 0
  
  const total = dayData.totalCount || 1
  const completed = dayData.completedCount || 0
  return completed / total
}

export const getHeatmapData = (year, month, habitId = null) => {
  const allData = getAllStoredData()
  const days = getCalendarDays(year, month)
  const heatmap = []
  
  days.forEach(day => {
    if (!day) {
      heatmap.push(null)
      return
    }
    
    const intensity = habitId 
      ? getHabitCompletionForDate(day.date, habitId, allData)
      : getCompletionIntensity(day.date, allData)
    
    heatmap.push({
      ...day,
      intensity,
      completed: intensity > 0
    })
  })
  
  return heatmap
}

const getHabitCompletionForDate = (dateKey, habitId, allData) => {
  const dayData = allData[dateKey]
  if (!dayData || !dayData.habits) return 0
  
  const habit = dayData.habits.find(h => h.id === habitId)
  return habit && habit.completed ? 1 : 0
}

export const getIntensityColor = (intensity) => {
  if (intensity === 0) return '#ebedf0' // gray
  if (intensity < 0.25) return '#c6e48b' // light green
  if (intensity < 0.5) return '#7bc96f' // medium green
  if (intensity < 0.75) return '#239a3b' // dark green
  return '#196127' // darkest green
}

export const formatMonthYear = (year, month) => {
  return new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

