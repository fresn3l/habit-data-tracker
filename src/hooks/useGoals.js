/**
 * Custom React Hook for Goal Management
 * 
 * Encapsulates all goal-related state and operations, providing a clean
 * interface for components that need goal functionality.
 * 
 * @module hooks/useGoals
 * @returns {Object} Goal management interface
 */

import { useState, useEffect, useCallback } from 'react'
import { getAllGoals, saveGoal, deleteGoal } from '../utils/goalStorage'

/**
 * Custom hook for managing goals.
 * 
 * @returns {Object} Goal management interface
 * @property {Array} goals - Current list of goals
 * @property {boolean} showForm - Whether goal form is visible
 * @property {Object|null} editingGoal - Currently editing goal (null if creating new)
 * @property {Function} loadGoals - Reload goals from storage
 * @property {Function} handleSave - Save goal (create or update)
 * @property {Function} handleDelete - Delete goal
 * @property {Function} handleEdit - Start editing a goal
 * @property {Function} handleNew - Start creating a new goal
 * @property {Function} closeForm - Close the goal form
 * 
 * @example
 * const {
 *   goals,
 *   showForm,
 *   editingGoal,
 *   handleSave,
 *   handleDelete,
 *   handleNew,
 *   closeForm
 * } = useGoals()
 */
export const useGoals = () => {
  const [goals, setGoals] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)

  /**
   * Load all goals from storage and update state.
   */
  const loadGoals = useCallback(() => {
    try {
      const allGoals = getAllGoals()
      setGoals(allGoals)
    } catch (error) {
      console.error('Error loading goals:', error)
    }
  }, [])

  /**
   * Load goals on mount.
   */
  useEffect(() => {
    loadGoals()
  }, [loadGoals])

  /**
   * Save a goal (create new or update existing).
   * 
   * @param {Object} goalData - Goal data to save
   * @param {string} [goalData.id] - Goal ID (if updating)
   */
  const handleSave = useCallback((goalData) => {
    try {
      // Generate ID and timestamp for new goals
      if (!goalData.id) {
        goalData.id = Date.now().toString()
        goalData.createdAt = new Date().toISOString()
      }
      
      saveGoal(goalData)
      loadGoals()
      setShowForm(false)
      setEditingGoal(null)
    } catch (error) {
      console.error('Error saving goal:', error)
      throw error
    }
  }, [loadGoals])

  /**
   * Delete a goal.
   * 
   * @param {string} goalId - ID of goal to delete
   */
  const handleDelete = useCallback((goalId) => {
    try {
      deleteGoal(goalId)
      loadGoals()
    } catch (error) {
      console.error('Error deleting goal:', error)
      throw error
    }
  }, [loadGoals])

  /**
   * Start editing a goal.
   * 
   * @param {Object} goal - Goal to edit
   */
  const handleEdit = useCallback((goal) => {
    setEditingGoal(goal)
    setShowForm(true)
  }, [])

  /**
   * Start creating a new goal.
   */
  const handleNew = useCallback(() => {
    setEditingGoal(null)
    setShowForm(true)
  }, [])

  /**
   * Close the goal form.
   */
  const closeForm = useCallback(() => {
    setShowForm(false)
    setEditingGoal(null)
  }, [])

  return {
    // State
    goals,
    showForm,
    editingGoal,
    
    // Actions
    loadGoals,
    handleSave,
    handleDelete,
    handleEdit,
    handleNew,
    closeForm,
  }
}

