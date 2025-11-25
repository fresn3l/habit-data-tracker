// Analytics utilities for data analysis

import { getAllStoredData, getAllDates } from './dataStorage'
import { getAllTodos } from './todoStorage'

// Calculate average time to completion for todos
export const getAverageTimeToCompletion = (timeframe = 'all') => {
  const todos = getAllTodos()
  const completedTodos = todos.filter(t => t.completed && t.timeToCompletion !== null && t.timeToCompletion !== undefined)
  
  if (completedTodos.length === 0) return null
  
  // Filter by timeframe
  let filteredTodos = completedTodos
  if (timeframe !== 'all') {
    const now = new Date()
    const cutoff = new Date()
    
    if (timeframe === 'week') {
      cutoff.setDate(now.getDate() - 7)
    } else if (timeframe === 'month') {
      cutoff.setMonth(now.getMonth() - 1)
    }
    
    filteredTodos = completedTodos.filter(todo => {
      const completedAt = new Date(todo.completedAt)
      return completedAt >= cutoff
    })
  }
  
  if (filteredTodos.length === 0) return null
  
  const totalHours = filteredTodos.reduce((sum, todo) => sum + todo.timeToCompletion, 0)
  const averageHours = totalHours / filteredTodos.length
  
  return {
    hours: averageHours,
    days: averageHours / 24,
    formatted: formatTimeToCompletion(averageHours),
    count: filteredTodos.length
  }
}

// Format time to completion in a readable format
export const formatTimeToCompletion = (hours) => {
  if (hours < 1) {
    const minutes = Math.round(hours * 60)
    return `${minutes} min`
  } else if (hours < 24) {
    return `${hours.toFixed(1)} hrs`
  } else {
    const days = (hours / 24).toFixed(1)
    return `${days} days`
  }
}

// Get individual habit completion percentages
export const getHabitCompletionStats = (timeframe = 'all') => {
  const allData = getAllStoredData()
  const dates = getAllDates()
  
  if (dates.length === 0) return []
  
  // Filter dates by timeframe
  let filteredDates = dates
  if (timeframe !== 'all') {
    const now = new Date()
    const cutoff = new Date()
    
    if (timeframe === 'week') {
      cutoff.setDate(now.getDate() - 7)
    } else if (timeframe === 'month') {
      cutoff.setMonth(now.getMonth() - 1)
    }
    
    filteredDates = dates.filter(dateStr => {
      const date = new Date(dateStr)
      return date >= cutoff
    })
  }
  
  // Collect all unique habits
  const habitMap = {}
  
  filteredDates.forEach(dateStr => {
    const dayData = allData[dateStr]
    if (dayData && dayData.habits) {
      dayData.habits.forEach(habit => {
        if (!habitMap[habit.id]) {
          habitMap[habit.id] = {
            id: habit.id,
            name: habit.name,
            emoji: habit.emoji,
            completedDays: 0,
            totalDays: 0
          }
        }
        habitMap[habit.id].totalDays++
        if (habit.completed) {
          habitMap[habit.id].completedDays++
        }
      })
    }
  })
  
  // Calculate percentages
  return Object.values(habitMap).map(habit => ({
    ...habit,
    percentage: habit.totalDays > 0 
      ? Math.round((habit.completedDays / habit.totalDays) * 100) 
      : 0
  })).sort((a, b) => b.percentage - a.percentage)
}

// Get todo completion statistics
export const getTodoCompletionStats = (timeframe = 'all') => {
  const todos = getAllTodos()
  
  // Filter by timeframe
  let filteredTodos = todos
  if (timeframe !== 'all') {
    const now = new Date()
    const cutoff = new Date()
    
    if (timeframe === 'week') {
      cutoff.setDate(now.getDate() - 7)
    } else if (timeframe === 'month') {
      cutoff.setMonth(now.getMonth() - 1)
    }
    
    filteredTodos = todos.filter(todo => {
      const createdDate = todo.createdAt ? new Date(todo.createdAt) : new Date(0)
      return createdDate >= cutoff
    })
  }
  
  const total = filteredTodos.length
  const completed = filteredTodos.filter(t => t.completed).length
  const pending = total - completed
  
  return {
    total,
    completed,
    pending,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
  }
}

// Get productivity trends (habits + todos completion over time)
export const getProductivityTrend = (timeframe = 'month') => {
  const allData = getAllStoredData()
  const dates = getAllDates()
  
  if (dates.length === 0) return []
  
  const now = new Date()
  const cutoff = new Date()
  
  if (timeframe === 'week') {
    cutoff.setDate(now.getDate() - 7)
  } else if (timeframe === 'month') {
    cutoff.setMonth(now.getMonth() - 1)
  } else {
    cutoff.setFullYear(now.getFullYear() - 1)
  }
  
  const filteredDates = dates.filter(dateStr => {
    const date = new Date(dateStr)
    return date >= cutoff
  }).sort()
  
  return filteredDates.map(dateStr => {
    const dayData = allData[dateStr]
    const habitCompletion = dayData && dayData.totalCount > 0
      ? (dayData.completedCount / dayData.totalCount) * 100
      : 0
    
    // Count todos created and completed on this day
    const todos = getAllTodos()
    const dayTodos = todos.filter(t => {
      if (!t.createdAt) return false
      const createdDate = new Date(t.createdAt).toDateString()
      return createdDate === dateStr
    })
    const completedDayTodos = todos.filter(t => {
      if (!t.completedAt) return false
      const completedDate = new Date(t.completedAt).toDateString()
      return completedDate === dateStr
    })
    
    return {
      date: dateStr,
      habitCompletionRate: Math.round(habitCompletion),
      todosCreated: dayTodos.length,
      todosCompleted: completedDayTodos.length
    }
  })
}

// Get habit consistency score (streaks, etc.)
export const getHabitConsistency = (habitId) => {
  const allData = getAllStoredData()
  const dates = getAllDates().sort()
  
  if (dates.length === 0) return null
  
  let currentStreak = 0
  let longestStreak = 0
  let totalCompletions = 0
  let totalDays = 0
  
  // Calculate from most recent backwards
  for (let i = dates.length - 1; i >= 0; i--) {
    const dateStr = dates[i]
    const dayData = allData[dateStr]
    
    if (dayData && dayData.habits) {
      const habit = dayData.habits.find(h => h.id === habitId)
      if (habit) {
        totalDays++
        if (habit.completed) {
          totalCompletions++
          currentStreak++
          longestStreak = Math.max(longestStreak, currentStreak)
        } else {
          currentStreak = 0
        }
      }
    }
  }
  
  return {
    currentStreak,
    longestStreak,
    totalCompletions,
    totalDays,
    consistencyRate: totalDays > 0 ? Math.round((totalCompletions / totalDays) * 100) : 0
  }
}
