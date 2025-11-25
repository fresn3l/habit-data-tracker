// Export utilities for data backup and export

import { getAllStoredData, getAllDates } from './dataStorage'
import { getAllTodos } from './todoStorage'
import { getAllGoals, getAllGoalSteps } from './goalStorage'

const EXPORT_VERSION = '1.0.0'

export const exportAllData = (format = 'json', dateRange = null) => {
  const habitsData = getAllStoredData()
  const todos = getAllTodos()
  const goals = getAllGoals()
  const goalSteps = getAllGoalSteps()
  
  // Filter by date range if provided
  let filteredHabitsData = habitsData
  if (dateRange && dateRange.start && dateRange.end) {
    const filtered = {}
    const start = new Date(dateRange.start)
    start.setHours(0, 0, 0, 0)
    const end = new Date(dateRange.end)
    end.setHours(23, 59, 59, 999)
    
    Object.keys(habitsData).forEach(dateKey => {
      const date = new Date(dateKey)
      if (date >= start && date <= end) {
        filtered[dateKey] = habitsData[dateKey]
      }
    })
    filteredHabitsData = filtered
  }
  
  const exportData = {
    version: EXPORT_VERSION,
    exportDate: new Date().toISOString(),
    data: {
      habits: filteredHabitsData,
      todos: todos,
      goals: goals,
      goalSteps: goalSteps,
    },
    metadata: {
      totalDays: Object.keys(filteredHabitsData).length,
      totalTodos: todos.length,
      totalGoals: goals.length,
      totalGoalSteps: goalSteps.length,
    }
  }
  
  if (format === 'json') {
    return JSON.stringify(exportData, null, 2)
  } else if (format === 'csv') {
    return convertToCSV(exportData)
  }
  
  return exportData
}

const convertToCSV = (data) => {
  let csv = 'Personal Tracker Data Export\n'
  csv += `Export Date: ${new Date(data.exportDate).toLocaleString()}\n\n`
  
  // Habits CSV
  csv += '=== HABITS ===\n'
  csv += 'Date,Habit Name,Emoji,Category,Completed\n'
  
  Object.entries(data.data.habits).forEach(([date, dayData]) => {
    if (dayData.habits) {
      dayData.habits.forEach(habit => {
        const category = habit.category?.name || 'Unknown'
        csv += `"${date}","${habit.name}","${habit.emoji}","${category}","${habit.completed ? 'Yes' : 'No'}"\n`
      })
    }
  })
  
  csv += '\n=== TODOS ===\n'
  csv += 'Title,Description,Time Commitment,Urgency,Due Date,Created,Completed,Time to Completion (hours)\n'
  
  data.data.todos.forEach(todo => {
    const created = todo.createdAt ? new Date(todo.createdAt).toLocaleDateString() : ''
    const completed = todo.completedAt ? new Date(todo.completedAt).toLocaleDateString() : ''
    const dueDate = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : ''
    const timeToCompletion = todo.timeToCompletion ? todo.timeToCompletion.toFixed(2) : ''
    
    csv += `"${todo.title}","${todo.description || ''}","${todo.timeCommitment || ''}","${todo.urgency || ''}","${dueDate}","${created}","${completed}","${timeToCompletion}"\n`
  })
  
  csv += '\n=== GOALS ===\n'
  csv += 'Title,Description,Target Amount,Unit,Emoji,Created\n'
  
  data.data.goals.forEach(goal => {
    const created = goal.createdAt ? new Date(goal.createdAt).toLocaleDateString() : ''
    csv += `"${goal.title}","${goal.description || ''}","${goal.targetAmount || ''}","${goal.unit || ''}","${goal.emoji || ''}","${created}"\n`
  })
  
  csv += '\n=== GOAL STEPS ===\n'
  csv += 'Goal ID,Step Title,Amount,Frequency,Created\n'
  
  data.data.goalSteps.forEach(step => {
    const created = step.createdAt ? new Date(step.createdAt).toLocaleDateString() : ''
    csv += `"${step.goalId}","${step.title}","${step.amount || ''}","${step.frequency || ''}","${created}"\n`
  })
  
  // Weight data
  csv += '\n=== WEIGHT TRACKING ===\n'
  csv += 'Date,Weight (lbs)\n'
  
  Object.entries(data.data.habits).forEach(([date, dayData]) => {
    if (dayData.weight) {
      csv += `"${date}","${dayData.weight}"\n`
    }
  })
  
  return csv
}

export const downloadData = (data, filename, format = 'json') => {
  const extension = format === 'json' ? 'json' : 'csv'
  const mimeType = format === 'json' ? 'application/json' : 'text/csv'
  
  const blob = new Blob([data], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.${extension}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

