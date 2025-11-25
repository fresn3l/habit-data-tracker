// Difficulty and effort tracking utilities

import { getAllStoredData } from './dataStorage'

export const calculateEffortLevel = (habitId, difficulty) => {
  const allData = getAllStoredData()
  
  // Get completion rate
  let totalDays = 0
  let completedDays = 0
  
  Object.values(allData).forEach(dayData => {
    if (dayData.habits) {
      const habit = dayData.habits.find(h => h.id === habitId)
      if (habit) {
        totalDays++
        if (habit.completed) {
          completedDays++
        }
      }
    }
  })
  
  const completionRate = totalDays > 0 ? completedDays / totalDays : 0
  
  // Effort = difficulty (1-5) + inverse of completion rate (0-5)
  // Higher difficulty + lower completion = higher effort
  const difficultyScore = difficulty || 3 // Default to medium
  const completionPenalty = (1 - completionRate) * 5 // 0-5 based on missed completions
  
  const effortScore = difficultyScore + completionPenalty
  
  // Normalize to 1-10 scale
  return Math.min(10, Math.max(1, Math.round(effortScore)))
}

export const getAverageTimeSpent = (habitId) => {
  const allData = getAllStoredData()
  const times = []
  
  Object.values(allData).forEach(dayData => {
    if (dayData.habits) {
      const habit = dayData.habits.find(h => h.id === habitId)
      if (habit && habit.actualTimeSpent) {
        times.push(habit.actualTimeSpent)
      }
    }
  })
  
  if (times.length === 0) return null
  
  const sum = times.reduce((acc, time) => acc + time, 0)
  return sum / times.length
}

export const getDifficultyStats = () => {
  const allData = getAllStoredData()
  const habitStats = {}
  
  Object.values(allData).forEach(dayData => {
    if (dayData.habits) {
      dayData.habits.forEach(habit => {
        if (!habitStats[habit.id]) {
          habitStats[habit.id] = {
            id: habit.id,
            name: habit.name,
            emoji: habit.emoji,
            difficulty: habit.difficulty || null,
            times: [],
            completed: 0,
            total: 0
          }
        }
        
        habitStats[habit.id].total++
        if (habit.completed) {
          habitStats[habit.id].completed++
        }
        
        if (habit.actualTimeSpent) {
          habitStats[habit.id].times.push(habit.actualTimeSpent)
        }
      })
    }
  })
  
  // Calculate effort levels
  Object.values(habitStats).forEach(stat => {
    stat.completionRate = stat.total > 0 ? stat.completed / stat.total : 0
    stat.effortLevel = calculateEffortLevel(stat.id, stat.difficulty)
    stat.averageTime = stat.times.length > 0
      ? stat.times.reduce((sum, t) => sum + t, 0) / stat.times.length
      : null
  })
  
  return Object.values(habitStats)
}

export const getHighEffortLowCompletion = () => {
  const stats = getDifficultyStats()
  return stats
    .filter(stat => stat.effortLevel >= 7 && stat.completionRate < 0.5)
    .sort((a, b) => b.effortLevel - a.effortLevel)
}

export const getDifficultyTrend = (habitId) => {
  const allData = getAllStoredData()
  const trend = []
  
  Object.entries(allData)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .forEach(([dateKey, dayData]) => {
      if (dayData.habits) {
        const habit = dayData.habits.find(h => h.id === habitId)
        if (habit && habit.difficulty) {
          trend.push({
            date: dateKey,
            difficulty: habit.difficulty,
            completed: habit.completed
          })
        }
      }
    })
  
  return trend
}

