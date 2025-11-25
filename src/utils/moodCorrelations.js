// Mood correlation analysis utilities

import { getAllStoredData } from './dataStorage'
import { getAllMoods } from './moodStorage'

export const calculateMoodHabitCorrelation = (habitId) => {
  const allData = getAllStoredData()
  const allMoods = getAllMoods()
  
  const daysWithHabit = []
  const daysWithoutHabit = []
  
  // Collect mood data for days with and without habit completion
  Object.entries(allData).forEach(([dateKey, dayData]) => {
    if (!dayData.habits) return
    
    const habit = dayData.habits.find(h => h.id === habitId)
    const mood = allMoods[dateKey]
    
    if (!mood) return
    
    if (habit && habit.completed) {
      daysWithHabit.push(mood.mood)
    } else {
      daysWithoutHabit.push(mood.mood)
    }
  })
  
  if (daysWithHabit.length === 0 && daysWithoutHabit.length === 0) {
    return null
  }
  
  const avgMoodWith = daysWithHabit.length > 0
    ? daysWithHabit.reduce((sum, m) => sum + m, 0) / daysWithHabit.length
    : null
  
  const avgMoodWithout = daysWithoutHabit.length > 0
    ? daysWithoutHabit.reduce((sum, m) => sum + m, 0) / daysWithoutHabit.length
    : null
  
  let moodImpact = 0
  if (avgMoodWith !== null && avgMoodWithout !== null) {
    moodImpact = avgMoodWith - avgMoodWithout
  } else if (avgMoodWith !== null) {
    moodImpact = avgMoodWith - 3 // Neutral baseline
  }
  
  return {
    habitId,
    avgMoodWith,
    avgMoodWithout,
    moodImpact,
    daysWithHabit: daysWithHabit.length,
    daysWithoutHabit: daysWithoutHabit.length,
    totalDays: daysWithHabit.length + daysWithoutHabit.length
  }
}

export const getAllHabitMoodCorrelations = () => {
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
  
  const correlations = []
  habitIds.forEach(habitId => {
    const correlation = calculateMoodHabitCorrelation(habitId)
    if (correlation && correlation.totalDays > 0) {
      correlations.push(correlation)
    }
  })
  
  // Sort by mood impact (positive first)
  return correlations.sort((a, b) => b.moodImpact - a.moodImpact)
}

export const getMoodVsHabitsCompleted = () => {
  const allData = getAllStoredData()
  const allMoods = getAllMoods()
  
  const dataPoints = []
  
  Object.entries(allData).forEach(([dateKey, dayData]) => {
    const mood = allMoods[dateKey]
    if (!mood || !dayData.habits) return
    
    const completedCount = dayData.completedCount || 0
    const totalCount = dayData.totalCount || 1
    const completionRate = completedCount / totalCount
    
    dataPoints.push({
      date: dateKey,
      mood: mood.mood,
      habitsCompleted: completedCount,
      completionRate: completionRate * 100
    })
  })
  
  return dataPoints.sort((a, b) => new Date(a.date) - new Date(b.date))
}

export const getTopMoodBoostingHabits = (limit = 3) => {
  const correlations = getAllHabitMoodCorrelations()
  return correlations
    .filter(c => c.moodImpact > 0)
    .slice(0, limit)
}

export const getTopMoodNegativeHabits = (limit = 3) => {
  const correlations = getAllHabitMoodCorrelations()
  return correlations
    .filter(c => c.moodImpact < 0)
    .slice(-limit)
    .reverse()
}

