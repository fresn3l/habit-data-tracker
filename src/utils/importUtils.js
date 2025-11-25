// Import utilities for data restoration

import { 
  STORAGE_KEY, 
  getAllStoredData,
  saveDayData 
} from './dataStorage'
import { 
  TODOS_STORAGE_KEY,
  getAllTodos,
  saveTodo
} from './todoStorage'
import { 
  GOALS_STORAGE_KEY,
  GOAL_STEPS_STORAGE_KEY,
  getAllGoals,
  getAllGoalSteps,
  saveGoal,
  saveGoalStep
} from './goalStorage'

const CURRENT_VERSION = '1.0.0'

export const validateImportData = (data) => {
  try {
    if (typeof data === 'string') {
      data = JSON.parse(data)
    }
    
    if (!data || typeof data !== 'object') {
      return { valid: false, error: 'Invalid data format' }
    }
    
    // Check version compatibility
    if (data.version && data.version !== CURRENT_VERSION) {
      return { 
        valid: true, 
        warning: `Data version ${data.version} may not be fully compatible with current version ${CURRENT_VERSION}` 
      }
    }
    
    // Check required structure
    if (!data.data || typeof data.data !== 'object') {
      return { valid: false, error: 'Missing data object' }
    }
    
    return { valid: true }
  } catch (error) {
    return { valid: false, error: `Parse error: ${error.message}` }
  }
}

export const importData = (importData, options = {}) => {
  const { merge = false, backup = true } = options
  
  // Validate data
  const validation = validateImportData(importData)
  if (!validation.valid) {
    throw new Error(validation.error)
  }
  
  // Create backup if requested
  if (backup) {
    createBackup()
  }
  
  let data
  if (typeof importData === 'string') {
    data = JSON.parse(importData)
  } else {
    data = importData
  }
  
  if (!data.data) {
    throw new Error('Invalid import data structure')
  }
  
  if (merge) {
    // Merge data
    mergeHabitsData(data.data.habits || {})
    mergeTodos(data.data.todos || [])
    mergeGoals(data.data.goals || [])
    mergeGoalSteps(data.data.goalSteps || [])
  } else {
    // Replace data
    if (data.data.habits) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.data.habits))
    }
    if (data.data.todos) {
      localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(data.data.todos))
    }
    if (data.data.goals) {
      localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(data.data.goals))
    }
    if (data.data.goalSteps) {
      localStorage.setItem(GOAL_STEPS_STORAGE_KEY, JSON.stringify(data.data.goalSteps))
    }
  }
  
  return { success: true, warning: validation.warning }
}

const mergeHabitsData = (importedHabits) => {
  const existingHabits = getAllStoredData()
  const merged = { ...existingHabits, ...importedHabits }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
}

const mergeTodos = (importedTodos) => {
  const existingTodos = getAllTodos()
  const merged = [...existingTodos]
  
  importedTodos.forEach(importedTodo => {
    const existingIndex = merged.findIndex(t => t.id === importedTodo.id)
    if (existingIndex >= 0) {
      merged[existingIndex] = importedTodo
    } else {
      merged.push(importedTodo)
    }
  })
  
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(merged))
}

const mergeGoals = (importedGoals) => {
  const existingGoals = getAllGoals()
  const merged = [...existingGoals]
  
  importedGoals.forEach(importedGoal => {
    const existingIndex = merged.findIndex(g => g.id === importedGoal.id)
    if (existingIndex >= 0) {
      merged[existingIndex] = importedGoal
    } else {
      merged.push(importedGoal)
    }
  })
  
  localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(merged))
}

const mergeGoalSteps = (importedSteps) => {
  const existingSteps = getAllGoalSteps()
  const merged = [...existingSteps]
  
  importedSteps.forEach(importedStep => {
    const existingIndex = merged.findIndex(s => s.id === importedStep.id)
    if (existingIndex >= 0) {
      merged[existingIndex] = importedStep
    } else {
      merged.push(importedStep)
    }
  })
  
  localStorage.setItem(GOAL_STEPS_STORAGE_KEY, JSON.stringify(merged))
}

export const createBackup = () => {
  const backupKey = `backup-${new Date().toISOString()}`
  const allData = {
    habits: getAllStoredData(),
    todos: getAllTodos(),
    goals: getAllGoals(),
    goalSteps: getAllGoalSteps(),
  }
  
  // Store backup in localStorage with timestamp
  const backups = getBackups()
  backups.push({
    key: backupKey,
    timestamp: new Date().toISOString(),
    data: allData
  })
  
  // Keep only last 7 days of backups
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const filteredBackups = backups.filter(backup => {
    const backupDate = new Date(backup.timestamp)
    return backupDate >= sevenDaysAgo
  })
  
  localStorage.setItem('habit-tracker-backups', JSON.stringify(filteredBackups))
  
  return backupKey
}

export const getBackups = () => {
  try {
    const backups = localStorage.getItem('habit-tracker-backups')
    return backups ? JSON.parse(backups) : []
  } catch (error) {
    console.error('Error reading backups:', error)
    return []
  }
}

export const restoreFromBackup = (backupKey) => {
  const backups = getBackups()
  const backup = backups.find(b => b.key === backupKey)
  
  if (!backup) {
    throw new Error('Backup not found')
  }
  
  // Create backup before restore
  createBackup()
  
  // Restore data
  if (backup.data.habits) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(backup.data.habits))
  }
  if (backup.data.todos) {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(backup.data.todos))
  }
  if (backup.data.goals) {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(backup.data.goals))
  }
  if (backup.data.goalSteps) {
    localStorage.setItem(GOAL_STEPS_STORAGE_KEY, JSON.stringify(backup.data.goalSteps))
  }
  
  return { success: true }
}

export const deleteBackup = (backupKey) => {
  const backups = getBackups()
  const filtered = backups.filter(b => b.key !== backupKey)
  localStorage.setItem('habit-tracker-backups', JSON.stringify(filtered))
}

