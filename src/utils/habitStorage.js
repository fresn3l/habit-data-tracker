/**
 * Habit Storage Utilities
 * 
 * This module provides functions for storing and retrieving habit templates
 * from browser localStorage. Habit templates define the structure of habits
 * (name, emoji, category, timeOfDay) that are then instantiated each day
 * with completion status.
 * 
 * Habit templates are stored separately from daily habit completion data.
 * This allows users to:
 * - Create/edit/delete habit definitions
 * - Have habits automatically appear each day
 * - Maintain consistent habit structure across days
 * 
 * @module utils/habitStorage
 * @requires constants/storageKeys
 */

import { STORAGE_KEY_HABIT_TEMPLATES } from '../constants/storageKeys'

// ============================================================================
// HABIT TEMPLATE MANAGEMENT
// ============================================================================

/**
 * Retrieves all habit templates from localStorage.
 * 
 * Habit templates define the structure and metadata for habits:
 * - id: Unique identifier
 * - name: Display name
 * - emoji: Icon/emoji for the habit
 * - category: Category object from habitCategories
 * - timeOfDay: 'morning', 'night', or 'anytime'
 * - createdAt: ISO timestamp when habit was created
 * - updatedAt: ISO timestamp when habit was last updated
 * 
 * @returns {Array<Object>} Array of habit template objects
 * 
 * @example
 * const templates = getAllHabitTemplates()
 * // Returns: [{ id: 1, name: 'Brush Teeth', emoji: '🦷', ... }, ...]
 */
export const getAllHabitTemplates = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_HABIT_TEMPLATES)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading habit templates:', error)
    return []
  }
}

/**
 * Saves a habit template to localStorage.
 * 
 * If the habit has an existing ID, it will be updated.
 * If no ID is provided, a new habit template will be created with
 * a generated ID and timestamps.
 * 
 * @param {Object} habitTemplate - The habit template to save
 * @param {string} [habitTemplate.id] - Unique identifier (auto-generated if not provided)
 * @param {string} habitTemplate.name - Display name of the habit
 * @param {string} [habitTemplate.emoji] - Emoji/icon for the habit
 * @param {Object} [habitTemplate.category] - Category object
 * @param {string} [habitTemplate.timeOfDay] - 'morning', 'night', or 'anytime'
 * @returns {Object} The saved habit template
 * 
 * @example
 * const habit = saveHabitTemplate({
 *   name: 'Morning Run',
 *   emoji: '🏃',
 *   timeOfDay: 'morning'
 * })
 */
export const saveHabitTemplate = (habitTemplate) => {
  const templates = getAllHabitTemplates()
  const existingIndex = templates.findIndex(h => h.id === habitTemplate.id)
  
  // Prepare the habit data with timestamps
  const now = new Date().toISOString()
  const habitData = {
    ...habitTemplate,
    updatedAt: now,
  }
  
  // If new habit, set createdAt and generate ID
  if (!habitTemplate.id) {
    habitData.id = Date.now().toString()
    habitData.createdAt = now
  } else if (existingIndex >= 0) {
    // Preserve createdAt for existing habits
    habitData.createdAt = templates[existingIndex].createdAt
  }
  
  // Update or add the habit
  if (existingIndex >= 0) {
    templates[existingIndex] = habitData
  } else {
    templates.push(habitData)
  }
  
  localStorage.setItem(STORAGE_KEY_HABIT_TEMPLATES, JSON.stringify(templates))
  
  // Auto-sync to desktop file if enabled (background, non-blocking)
  if (typeof window !== 'undefined' && window.eel) {
    import('./desktopStorage').then(module => {
      module.autoSyncToDesktop().catch(() => {})
    }).catch(() => {})
  }
  
  return habitData
}

/**
 * Deletes a habit template by ID.
 * 
 * This removes the habit template from storage. Note that this does
 * not affect existing daily completion data - historical data is preserved.
 * 
 * @param {string|number} habitId - The ID of the habit template to delete
 * @returns {boolean} True if deleted, false if not found
 * 
 * @example
 * deleteHabitTemplate('1234567890')
 */
export const deleteHabitTemplate = (habitId) => {
  const templates = getAllHabitTemplates()
  const filtered = templates.filter(h => h.id !== habitId.toString())
  
  if (filtered.length === templates.length) {
    return false // Habit not found
  }
  
  localStorage.setItem(STORAGE_KEY_HABIT_TEMPLATES, JSON.stringify(filtered))
  
  // Auto-sync to desktop file if enabled (background, non-blocking)
  if (typeof window !== 'undefined' && window.eel) {
    import('./desktopStorage').then(module => {
      module.autoSyncToDesktop().catch(() => {})
    }).catch(() => {})
  }
  
  return true
}

/**
 * Gets a single habit template by ID.
 * 
 * @param {string|number} habitId - The ID of the habit template
 * @returns {Object|null} The habit template, or null if not found
 * 
 * @example
 * const habit = getHabitTemplateById('1234567890')
 */
export const getHabitTemplateById = (habitId) => {
  const templates = getAllHabitTemplates()
  return templates.find(h => h.id === habitId.toString()) || null
}

/**
 * Initializes default habit templates if none exist.
 * 
 * This function checks if there are any habit templates in storage.
 * If none exist, it creates default templates based on common habits.
 * This is useful for first-time users or after data migration.
 * 
 * @returns {Array<Object>} All habit templates (including newly created defaults)
 * 
 * @example
 * const templates = initializeDefaultHabits()
 */
export const initializeDefaultHabits = () => {
  const existing = getAllHabitTemplates()
  
  // If templates already exist, return them
  if (existing.length > 0) {
    return existing
  }
  
  // Default habit templates
  const defaultTemplates = [
    { name: 'Brush Teeth (AM)', emoji: '🦷', timeOfDay: 'morning' },
    { name: 'Meditate', emoji: '🧘', timeOfDay: 'morning' },
    { name: 'Weightlifting', emoji: '💪', timeOfDay: 'anytime' },
    { name: 'Met Water Intake', emoji: '💧', timeOfDay: 'anytime' },
    { name: 'Read', emoji: '📚', timeOfDay: 'anytime' },
    { name: 'Met Calories Intake', emoji: '🍔', timeOfDay: 'anytime' },
    { name: 'Journaling', emoji: '✍️', timeOfDay: 'night' },
    { name: 'No Phone 1hr Before Bed', emoji: '📵', timeOfDay: 'night' },
    { name: 'No Alcohol Intake', emoji: '🍺', timeOfDay: 'anytime' },
    { name: 'No Weed Intake', emoji: '🚬', timeOfDay: 'anytime' },
    { name: 'Supplements On Time', emoji: '💊', timeOfDay: 'morning' },
    { name: 'Wear Retainers', emoji: '😬', timeOfDay: 'night' },
  ]
  
  // Save each default template
  const savedTemplates = defaultTemplates.map(template => {
    return saveHabitTemplate(template)
  })
  
  return savedTemplates
}

