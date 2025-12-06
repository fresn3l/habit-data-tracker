/**
 * Custom React Hook for Todo Management
 * 
 * Encapsulates all todo-related state and operations, providing a clean
 * interface for components that need todo functionality.
 * 
 * This hook follows the custom hooks pattern for reusable stateful logic.
 * It eliminates code duplication across components that manage todos.
 * 
 * @module hooks/useTodos
 * @returns {Object} Todo management interface
 */

import { useState, useEffect, useCallback } from 'react'
import { 
  getAllTodos, 
  saveTodo, 
  deleteTodo, 
  toggleTodoComplete, 
  getTodosByPriority, 
  getOverdueTodos 
} from '../utils/todoStorage'
import { generateRecurringTodo, shouldGenerateNext } from '../utils/recurrenceUtils'

/**
 * Custom hook for managing todos.
 * 
 * Provides:
 * - Todo list state
 * - CRUD operations (create, read, update, delete)
 * - Filtering and sorting
 * - Recurring todo management
 * - Form state management
 * 
 * @returns {Object} Todo management interface
 * @property {Array} todos - Current list of todos
 * @property {boolean} showForm - Whether todo form is visible
 * @property {Object|null} editingTodo - Currently editing todo (null if creating new)
 * @property {string} filter - Current filter ('all', 'active', 'completed')
 * @property {Function} loadTodos - Reload todos from storage
 * @property {Function} handleSave - Save todo (create or update)
 * @property {Function} handleDelete - Delete todo
 * @property {Function} handleToggle - Toggle todo completion
 * @property {Function} handleEdit - Start editing a todo
 * @property {Function} handleNew - Start creating a new todo
 * @property {Function} setFilter - Change current filter
 * @property {Function} closeForm - Close the todo form
 * @property {Function} getFilteredTodos - Get filtered and sorted todos
 * @property {Function} getOverdueTodos - Get todos that are overdue
 * 
 * @example
 * const {
 *   todos,
 *   showForm,
 *   editingTodo,
 *   handleSave,
 *   handleDelete,
 *   handleToggle,
 *   handleNew,
 *   closeForm
 * } = useTodos()
 */
export const useTodos = () => {
  const [todos, setTodos] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)
  const [filter, setFilter] = useState('all') // 'all', 'active', 'completed'

  /**
   * Load all todos from storage and update state.
   * 
   * This function is memoized with useCallback to prevent unnecessary
   * re-renders in components that depend on it.
   */
  const loadTodos = useCallback(() => {
    try {
      const allTodos = getAllTodos()
      setTodos(allTodos)
    } catch (error) {
      console.error('Error loading todos:', error)
      // In production, you might want to show an error message to the user
    }
  }, [])

  /**
   * Check for recurring todos and generate new instances if needed.
   * 
   * This is called whenever todos change to automatically generate
   * new instances of recurring todos based on their schedule.
   */
  const checkRecurringTodos = useCallback(() => {
    try {
      const allTodos = getAllTodos()
      const recurringTemplates = allTodos.filter(t => 
        t.isRecurring && !t.isRecurringInstance
      )
      
      let newInstancesCreated = false
      
      recurringTemplates.forEach(template => {
        if (shouldGenerateNext(template)) {
          const nextDue = template.nextDueDate || template.dueDate
          const existingInstance = allTodos.find(t => 
            t.originalRecurringId === template.id &&
            t.dueDate &&
            new Date(t.dueDate).toDateString() === new Date(nextDue).toDateString()
          )
          
          if (!existingInstance) {
            const newInstance = generateRecurringTodo(template)
            if (newInstance) {
              saveTodo(newInstance)
              newInstancesCreated = true
            }
          }
        }
      })
      
      if (newInstancesCreated) {
        loadTodos()
      }
    } catch (error) {
      console.error('Error checking recurring todos:', error)
    }
  }, [loadTodos])

  /**
   * Load todos on mount and whenever the component re-initializes.
   */
  useEffect(() => {
    loadTodos()
    checkRecurringTodos()
  }, [loadTodos, checkRecurringTodos])

  /**
   * Check for recurring todos whenever the todos list changes.
   */
  useEffect(() => {
    checkRecurringTodos()
  }, [todos, checkRecurringTodos])

  /**
   * Save a todo (create new or update existing).
   * 
   * @param {Object} todoData - Todo data to save
   * @param {string} [todoData.id] - Todo ID (if updating)
   */
  const handleSave = useCallback((todoData) => {
    try {
      saveTodo(todoData)
      loadTodos()
      setShowForm(false)
      setEditingTodo(null)
    } catch (error) {
      console.error('Error saving todo:', error)
      throw error // Re-throw so component can handle it
    }
  }, [loadTodos])

  /**
   * Delete a todo with confirmation.
   * 
   * @param {string} todoId - ID of todo to delete
   * @param {Function} [onConfirm] - Optional callback for custom confirmation
   */
  const handleDelete = useCallback((todoId, onConfirm = null) => {
    const confirmDelete = onConfirm || (() => {
      return window.confirm('Are you sure you want to delete this to do item?')
    })

    if (confirmDelete()) {
      try {
        deleteTodo(todoId)
        loadTodos()
      } catch (error) {
        console.error('Error deleting todo:', error)
        throw error
      }
    }
  }, [loadTodos])

  /**
   * Toggle todo completion status.
   * 
   * @param {string} todoId - ID of todo to toggle
   */
  const handleToggle = useCallback((todoId) => {
    try {
      const todo = toggleTodoComplete(todoId)
      
      // If completing a recurring todo instance, check if we need to generate next
      if (todo && todo.completed && todo.originalRecurringId) {
        setTimeout(() => {
          checkRecurringTodos()
        }, 1000)
      }
      
      loadTodos()
    } catch (error) {
      console.error('Error toggling todo:', error)
      throw error
    }
  }, [loadTodos, checkRecurringTodos])

  /**
   * Start editing a todo.
   * 
   * @param {Object} todo - Todo to edit
   */
  const handleEdit = useCallback((todo) => {
    setEditingTodo(todo)
    setShowForm(true)
  }, [])

  /**
   * Start creating a new todo.
   */
  const handleNew = useCallback(() => {
    setEditingTodo(null)
    setShowForm(true)
  }, [])

  /**
   * Close the todo form.
   */
  const closeForm = useCallback(() => {
    setShowForm(false)
    setEditingTodo(null)
  }, [])

  /**
   * Get filtered and sorted todos based on current filter.
   * 
   * @returns {Array} Filtered and sorted todos
   */
  const getFilteredTodos = useCallback(() => {
    let filtered = todos
    
    if (filter === 'active') {
      filtered = filtered.filter(t => !t.completed)
    } else if (filter === 'completed') {
      filtered = filtered.filter(t => t.completed)
    }
    
    return getTodosByPriority(filtered)
  }, [todos, filter])

  /**
   * Get overdue todos.
   * 
   * @returns {Array} Array of overdue todos
   */
  const getOverdueList = useCallback(() => {
    return getOverdueTodos(todos)
  }, [todos])

  return {
    // State
    todos,
    showForm,
    editingTodo,
    filter,
    
    // Actions
    loadTodos,
    handleSave,
    handleDelete,
    handleToggle,
    handleEdit,
    handleNew,
    closeForm,
    setFilter,
    
    // Computed values
    getFilteredTodos,
    getOverdueList,
  }
}

