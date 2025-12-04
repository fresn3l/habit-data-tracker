/**
 * Todo Storage Utilities
 * 
 * This module provides functions for storing and retrieving todo items
 * from browser localStorage. It handles:
 * - Todo CRUD operations
 * - Priority-based sorting (Now, Next, Later)
 * - Goal linking
 * - Completion tracking
 * 
 * All todos are stored in a single localStorage key as an array.
 * 
 * @module utils/todoStorage
 * @requires constants/storageKeys
 */

import { STORAGE_KEY_TODOS } from '../constants/storageKeys'
import { TODO_PRIORITY_LEVELS } from '../constants/appConstants'

// Use the constant for the storage key
export const TODOS_STORAGE_KEY = STORAGE_KEY_TODOS

/**
 * Get all todos from localStorage.
 * 
 * @returns {Array} Array of all todo items
 */
export const getAllTodos = () => {
  try {
    const data = localStorage.getItem(TODOS_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading todos:', error)
    return []
  }
}

/**
 * Save a todo item to localStorage.
 * 
 * @param {Object} todo - Todo item to save
 * @returns {Object} The saved todo item
 */
export const saveTodo = (todo) => {
  const todos = getAllTodos()
  const existingIndex = todos.findIndex(t => t.id === todo.id)
  
  if (existingIndex >= 0) {
    todos[existingIndex] = todo
  } else {
    // New todo - set creation time if not already set
    if (!todo.createdAt) {
      todo.createdAt = new Date().toISOString()
    }
    // Ensure priority is set (default to 'next')
    if (!todo.priority) {
      todo.priority = TODO_PRIORITY_LEVELS.NEXT
    }
    todos.push(todo)
  }
  
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos))
  return todo
}

/**
 * Delete a todo item.
 * 
 * @param {string} todoId - ID of todo to delete
 */
export const deleteTodo = (todoId) => {
  const todos = getAllTodos().filter(t => t.id !== todoId)
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos))
}

/**
 * Toggle todo completion status.
 * Also updates goal progress if todo is linked to a goal.
 * 
 * @param {string} todoId - ID of todo to toggle
 * @returns {Object|null} The updated todo item, or null if not found
 */
export const toggleTodoComplete = (todoId) => {
  const todos = getAllTodos()
  const todo = todos.find(t => t.id === todoId)
  if (!todo) return null
  
  const wasCompleted = todo.completed
  todo.completed = !todo.completed
  
  if (!wasCompleted && todo.completed) {
    // Just completed - set completion time
    todo.completedAt = new Date().toISOString()
    
    // Calculate time to completion in hours
    if (todo.createdAt) {
      const createdAt = new Date(todo.createdAt)
      const completedAt = new Date(todo.completedAt)
      const hoursDiff = (completedAt - createdAt) / (1000 * 60 * 60)
      todo.timeToCompletion = hoursDiff
    }
    
    // Update goal progress if linked to a goal
    if (todo.linkedGoalId) {
      updateGoalTodoProgress(todo.linkedGoalId, 1)
    }
  } else if (wasCompleted && !todo.completed) {
    // Uncompleted - clear completion data
    todo.completedAt = null
    todo.timeToCompletion = null
    
    // Update goal progress if linked to a goal
    if (todo.linkedGoalId) {
      updateGoalTodoProgress(todo.linkedGoalId, -1)
    }
  }
  
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos))
  return todo
}

/**
 * Update goal's completed todos count.
 * 
 * This function directly accesses localStorage to update the goal's
 * completedTodosCount field. This avoids circular dependency issues.
 * 
 * @param {string} goalId - ID of the goal
 * @param {number} change - Change in count (1 for complete, -1 for uncomplete)
 */
const updateGoalTodoProgress = (goalId, change) => {
  try {
    // Directly access goals from localStorage to avoid circular dependency
    const GOALS_STORAGE_KEY = 'goals-data'
    const goalsData = localStorage.getItem(GOALS_STORAGE_KEY)
    if (!goalsData) return
    
    const goals = JSON.parse(goalsData)
    const goal = goals.find(g => g.id === goalId)
    
    if (goal) {
      if (!goal.completedTodosCount) {
        goal.completedTodosCount = 0
      }
      goal.completedTodosCount = Math.max(0, goal.completedTodosCount + change)
      
      // Save back to localStorage
      const goalIndex = goals.findIndex(g => g.id === goalId)
      if (goalIndex >= 0) {
        goals[goalIndex] = goal
        localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals))
      }
    }
  } catch (error) {
    console.error('Error updating goal todo progress:', error)
  }
}

/**
 * Get todos sorted by priority.
 * 
 * Priority order: Now > Next > Later
 * Within same priority: incomplete before complete, then by due date
 * 
 * @param {Array} todos - Array of todos to sort (defaults to all todos)
 * @returns {Array} Sorted array of todos
 */
export const getTodosByPriority = (todos = null) => {
  const todosToSort = todos || getAllTodos()
  
  // Priority order: now = 3, next = 2, later = 1
  const priorityOrder = {
    [TODO_PRIORITY_LEVELS.NOW]: 3,
    [TODO_PRIORITY_LEVELS.NEXT]: 2,
    [TODO_PRIORITY_LEVELS.LATER]: 1
  }
  
  return [...todosToSort].sort((a, b) => {
    // Sort by completion first (incomplete first)
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    
    // Then by priority (now > next > later)
    const aPriority = priorityOrder[a.priority] || 0
    const bPriority = priorityOrder[b.priority] || 0
    if (aPriority !== bPriority) {
      return bPriority - aPriority  // Higher priority first
    }
    
    // Then by due date (soonest first, if both have due dates)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate)
    }
    if (a.dueDate && !b.dueDate) return -1
    if (!a.dueDate && b.dueDate) return 1
    
    // Finally by creation date (newest first)
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt) - new Date(a.createdAt)
    }
    
    return 0
  })
}

/**
 * Get overdue todos.
 * 
 * @param {Array} todos - Array of todos to filter (defaults to all todos)
 * @returns {Array} Array of overdue todos
 */
export const getOverdueTodos = (todos = null) => {
  const todosToCheck = todos || getAllTodos()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return todosToCheck.filter(todo => {
    if (todo.completed || !todo.dueDate) return false
    const dueDate = new Date(todo.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate < today
  })
}

/**
 * Get todos linked to a specific goal.
 * 
 * @param {string} goalId - ID of the goal
 * @returns {Array} Array of todos linked to the goal
 */
export const getTodosForGoal = (goalId) => {
  const todos = getAllTodos()
  return todos.filter(t => t.linkedGoalId === goalId)
}

/**
 * Get completed todos count for a specific goal.
 * 
 * @param {string} goalId - ID of the goal
 * @returns {number} Count of completed todos for the goal
 */
export const getCompletedTodosCountForGoal = (goalId) => {
  const todos = getTodosForGoal(goalId)
  return todos.filter(t => t.completed).length
}
