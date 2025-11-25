// Streak calculation and storage utilities

import { getAllStoredData, getTodayKey } from './dataStorage'

export const calculateStreak = (habitId) => {
  const allData = getAllStoredData()
  const todayKey = getTodayKey()
  const today = new Date(todayKey)
  
  // Get all dates for this habit
  const habitDates = []
  Object.entries(allData).forEach(([dateKey, dayData]) => {
    if (dayData.habits) {
      const habit = dayData.habits.find(h => h.id === habitId)
      if (habit) {
        habitDates.push({
          date: dateKey,
          completed: habit.completed
        })
      }
    }
  })
  
  // Sort dates chronologically
  habitDates.sort((a, b) => new Date(a.date) - new Date(b.date))
  
  if (habitDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null
    }
  }
  
  // Calculate current streak (from today backwards)
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0
  let lastCompletedDate = null
  
  // Find last completed date
  for (let i = habitDates.length - 1; i >= 0; i--) {
    if (habitDates[i].completed) {
      lastCompletedDate = habitDates[i].date
      break
    }
  }
  
  // Calculate streaks
  const todayDate = new Date(todayKey)
  todayDate.setHours(0, 0, 0, 0)
  
  // Current streak: count consecutive completed days from today backwards
  let checkDate = new Date(todayDate)
  let foundIncomplete = false
  
  // Check if completed today
  const todayData = habitDates.find(h => h.date === todayKey)
  if (todayData && todayData.completed) {
    currentStreak = 1
    checkDate.setDate(checkDate.getDate() - 1)
    
    // Continue counting backwards
    while (!foundIncomplete) {
      const dateKey = checkDate.toDateString()
      const dayData = habitDates.find(h => h.date === dateKey)
      
      if (dayData && dayData.completed) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        foundIncomplete = true
      }
    }
  } else {
    // Check yesterday - if completed, streak might continue
    checkDate.setDate(checkDate.getDate() - 1)
    const yesterdayKey = checkDate.toDateString()
    const yesterdayData = habitDates.find(h => h.date === yesterdayKey)
    
    if (yesterdayData && yesterdayData.completed) {
      currentStreak = 1
      checkDate.setDate(checkDate.getDate() - 1)
      
      while (!foundIncomplete) {
        const dateKey = checkDate.toDateString()
        const dayData = habitDates.find(h => h.date === dateKey)
        
        if (dayData && dayData.completed) {
          currentStreak++
          checkDate.setDate(checkDate.getDate() - 1)
        } else {
          foundIncomplete = true
        }
      }
    }
  }
  
  // Calculate longest streak (scan all dates)
  tempStreak = 0
  habitDates.forEach(({ completed }) => {
    if (completed) {
      tempStreak++
      longestStreak = Math.max(longestStreak, tempStreak)
    } else {
      tempStreak = 0
    }
  })
  
  return {
    currentStreak,
    longestStreak,
    lastCompletedDate,
    totalCompleted: habitDates.filter(h => h.completed).length,
    totalDays: habitDates.length
  }
}

export const updateStreakForHabit = (habitId) => {
  return calculateStreak(habitId)
}

export const getAllHabitStreaks = () => {
  const allData = getAllStoredData()
  const habitIds = new Set()
  
  // Collect all unique habit IDs
  Object.values(allData).forEach(dayData => {
    if (dayData.habits) {
      dayData.habits.forEach(habit => {
        habitIds.add(habit.id)
      })
    }
  })
  
  // Calculate streaks for each habit
  const streaks = {}
  habitIds.forEach(habitId => {
    streaks[habitId] = calculateStreak(habitId)
  })
  
  return streaks
}

export const getStreakHistory = (habitId, days = 30) => {
  const allData = getAllStoredData()
  const today = new Date()
  const history = []
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateKey = date.toDateString()
    
    const dayData = allData[dateKey]
    let completed = false
    
    if (dayData && dayData.habits) {
      const habit = dayData.habits.find(h => h.id === habitId)
      completed = habit ? habit.completed : false
    }
    
    history.push({
      date: dateKey,
      completed
    })
  }
  
  return history
}

