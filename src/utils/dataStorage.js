// Data storage utilities for historical tracking

export const STORAGE_KEY = 'habit-tracker-data'

export const getTodayKey = () => {
  return new Date().toDateString()
}

export const getAllStoredData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error('Error reading stored data:', error)
    return {}
  }
}

export const saveDayData = (dateKey, habits, weight = null) => {
  const allData = getAllStoredData()
  const existingData = allData[dateKey] || {}
  
  allData[dateKey] = {
    ...existingData,
    date: dateKey,
    habits: habits.map(h => ({
      id: h.id,
      name: h.name,
      emoji: h.emoji,
      category: h.category,
      completed: h.completed,
      timeOfDay: h.timeOfDay || 'anytime',
    })),
    completedCount: habits.filter(h => h.completed).length,
    totalCount: habits.length,
    weight: weight !== null ? weight : existingData.weight,
    timestamp: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData))
}

export const saveWeight = (dateKey, weight) => {
  const allData = getAllStoredData()
  if (!allData[dateKey]) {
    allData[dateKey] = { date: dateKey, timestamp: new Date().toISOString() }
  }
  allData[dateKey].weight = weight
  allData[dateKey].timestamp = new Date().toISOString()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData))
}

export const getDayData = (dateKey) => {
  const allData = getAllStoredData()
  return allData[dateKey] || null
}

export const getAllDates = () => {
  const allData = getAllStoredData()
  return Object.keys(allData).sort()
}

export const getDateRange = (startDate, endDate) => {
  const allData = getAllStoredData()
  const range = []
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toDateString()
    if (allData[dateKey]) {
      range.push(allData[dateKey])
    }
  }
  
  return range
}

export const getWeekData = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay()) // Start of week (Sunday)
  weekStart.setHours(0, 0, 0, 0)
  
  return getDateRange(weekStart, today)
}

export const getMonthData = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  monthStart.setHours(0, 0, 0, 0)
  
  return getDateRange(monthStart, today)
}

export const calculateCompletionRate = (dataArray) => {
  if (!dataArray || dataArray.length === 0) return 0
  
  const totalDays = dataArray.length
  const totalCompleted = dataArray.reduce((sum, day) => {
    if (!day.completedCount || !day.totalCount) return sum
    return sum + (day.completedCount / day.totalCount)
  }, 0)
  
  return totalCompleted / totalDays
}

export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

export const calculateWeightChange = (current, previous) => {
  if (!previous || previous === 0) return null
  return current - previous
}

export const getAverageWeight = (dataArray) => {
  const weights = dataArray
    .map(day => day.weight)
    .filter(weight => weight !== null && weight !== undefined && !isNaN(weight))
  
  if (weights.length === 0) return null
  
  const sum = weights.reduce((acc, weight) => acc + weight, 0)
  return sum / weights.length
}
