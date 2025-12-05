/**
 * Desktop File Storage Utilities
 * 
 * This module provides functions for syncing app data between localStorage
 * and a desktop file. It handles:
 * - Saving all app data to a JSON file on Desktop (or custom location)
 * - Loading all app data from a desktop file
 * - Auto-syncing data changes to desktop file
 * - Managing file path configuration
 * 
 * @module utils/desktopStorage
 */

/**
 * Storage keys - read directly from localStorage to avoid circular dependencies.
 * Storage modules import this module for auto-sync, so we can't import from them.
 */
const STORAGE_KEYS = {
  HABITS: 'habit-tracker-data',
  TODOS: 'todos-data',
  GOALS: 'goals-data',
  GOAL_STEPS: 'goal-steps-data',
  MOOD: 'mood-data',
  JOURNALS: 'habit-tracker-journals',
  REMINDERS: 'habit-tracker-reminders',
  STREAKS: 'habit-tracker-streaks'
}

// Check if Eel is available (only in desktop app mode)
const isEelAvailable = () => {
  return typeof window !== 'undefined' && window.eel
}

/**
 * Get the desktop path.
 * 
 * @returns {Promise<string|null>} Desktop path or null if unavailable
 */
export const getDesktopPath = async () => {
  if (!isEelAvailable()) {
    return null
  }
  
  try {
    const result = await window.eel.get_desktop_path()()
    if (result.success) {
      return result.path
    }
  } catch (error) {
    console.error('Error getting desktop path:', error)
  }
  
  return null
}

/**
 * Get the configured data file path.
 * 
 * @returns {Promise<string|null>} Saved file path or null if not set
 */
export const getDataFilePath = async () => {
  if (!isEelAvailable()) {
    return null
  }
  
  try {
    const result = await window.eel.get_data_file_path()()
    if (result.success) {
      return result.path
    }
  } catch (error) {
    console.error('Error getting data file path:', error)
  }
  
  return null
}

/**
 * Set the data file path.
 * 
 * @param {string} filePath - Full path to the data file
 * @returns {Promise<boolean>} True if successful
 */
export const setDataFilePath = async (filePath) => {
  if (!isEelAvailable()) {
    return false
  }
  
  try {
    const result = await window.eel.set_data_file_path(filePath)()
    return result.success
  } catch (error) {
    console.error('Error setting data file path:', error)
    return false
  }
}

/**
 * Export all data from localStorage to a structured object.
 * 
 * Reads directly from localStorage to avoid circular dependencies
 * with storage utility modules.
 * 
 * @returns {Object} All app data in export format
 */
const exportAllData = () => {
  // Read all data directly from localStorage using storage keys
  // This avoids circular dependencies with storage utility modules
  const habitsData = JSON.parse(localStorage.getItem('habit-tracker-data') || '{}')
  const todos = JSON.parse(localStorage.getItem('todos-data') || '[]')
  const goals = JSON.parse(localStorage.getItem('goals-data') || '[]')
  const goalSteps = JSON.parse(localStorage.getItem('goal-steps-data') || '[]')
  const moodData = JSON.parse(localStorage.getItem('mood-data') || '{}')
  const journals = JSON.parse(localStorage.getItem('habit-tracker-journals') || '{}')
  const reminders = JSON.parse(localStorage.getItem('habit-tracker-reminders') || '[]')
  const streaks = JSON.parse(localStorage.getItem('habit-tracker-streaks') || '{}')
  
  return {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    data: {
      habits: habitsData,
      todos: todos,
      goals: goals,
      goalSteps: goalSteps,
      mood: moodData,
      journals: journals,
      reminders: reminders,
      streaks: streaks
    }
  }
}

/**
 * Save all data to desktop file.
 * 
 * @param {string|null} filePath - Optional custom file path (uses saved path if not provided)
 * @returns {Promise<Object>} Result object with success status
 */
export const saveAllDataToDesktop = async (filePath = null) => {
  if (!isEelAvailable()) {
    console.warn('Eel not available - cannot save to desktop')
    return { success: false, error: 'Desktop storage not available' }
  }
  
  try {
    // Get file path (use provided or get saved path)
    let dataFilePath = filePath
    if (!dataFilePath) {
      dataFilePath = await getDataFilePath()
      
      // If no path saved, use default Desktop location
      if (!dataFilePath) {
        const desktopPath = await getDesktopPath()
        if (!desktopPath) {
          return { success: false, error: 'Could not get desktop path' }
        }
        dataFilePath = `${desktopPath}/personal-tracker-data.json`
      }
    }
    
    // Export all data
    const allData = exportAllData()
    
    // Save to file
    const result = await window.eel.save_all_data_to_file(dataFilePath, JSON.stringify(allData))()
    
    if (result.success) {
      // Save the file path for future use
      await setDataFilePath(dataFilePath)
    }
    
    return result
  } catch (error) {
    console.error('Error saving data to desktop:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Load all data from desktop file.
 * 
 * @param {string|null} filePath - Optional custom file path (uses saved path if not provided)
 * @returns {Promise<Object>} Result object with success status and data
 */
export const loadAllDataFromDesktop = async (filePath = null) => {
  if (!isEelAvailable()) {
    return { success: false, error: 'Desktop storage not available' }
  }
  
  try {
    // Get file path
    let dataFilePath = filePath
    if (!dataFilePath) {
      dataFilePath = await getDataFilePath()
      if (!dataFilePath) {
        return { success: false, error: 'No data file path configured' }
      }
    }
    
    // Load from file
    const result = await window.eel.load_all_data_from_file(dataFilePath)()
    
    if (!result.success) {
      return result
    }
    
    // Import all data to localStorage
    importAllData(result.data)
    
    return { success: true, data: result.data }
  } catch (error) {
    console.error('Error loading data from desktop:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Import data into localStorage from desktop file data.
 * 
 * @param {Object} data - Data object from desktop file
 */
const importAllData = (data) => {
  if (!data || !data.data) {
    throw new Error('Invalid data structure')
  }
  
  const { data: appData } = data
  
  // Import each data type
  if (appData.habits) {
    localStorage.setItem('habit-tracker-data', JSON.stringify(appData.habits))
  }
  if (appData.todos) {
    localStorage.setItem('todos-data', JSON.stringify(appData.todos))
  }
  if (appData.goals) {
    localStorage.setItem('goals-data', JSON.stringify(appData.goals))
  }
  if (appData.goalSteps) {
    localStorage.setItem('goal-steps-data', JSON.stringify(appData.goalSteps))
  }
  if (appData.mood) {
    localStorage.setItem('mood-data', JSON.stringify(appData.mood))
  }
  if (appData.journals) {
    localStorage.setItem('habit-tracker-journals', JSON.stringify(appData.journals))
  }
  if (appData.reminders) {
    localStorage.setItem('habit-tracker-reminders', JSON.stringify(appData.reminders))
  }
  if (appData.streaks) {
    localStorage.setItem('habit-tracker-streaks', JSON.stringify(appData.streaks))
  }
  
  // Note: Cache clearing is handled by storage modules themselves
  // We just need to ensure localStorage is updated
}

/**
 * Auto-sync: Save to desktop file whenever data changes.
 * Call this after any save operation.
 * 
 * Debounced to avoid excessive file writes (max once every 2 seconds).
 */
export const autoSyncToDesktop = async () => {
  // Check if auto-sync is enabled
  const autoSyncEnabled = localStorage.getItem('desktop-auto-sync-enabled') === 'true'
  if (!autoSyncEnabled) {
    return
  }
  
  // Debounce: Only sync every 2 seconds max
  const lastSync = localStorage.getItem('desktop-last-sync-time')
  const now = Date.now()
  if (lastSync && (now - parseInt(lastSync)) < 2000) {
    return // Too soon, skip
  }
  
  localStorage.setItem('desktop-last-sync-time', now.toString())
  
  // Save to desktop in background (don't block UI)
  saveAllDataToDesktop().catch(error => {
    console.warn('Auto-sync failed:', error)
  })
}

/**
 * Enable/disable auto-sync.
 * 
 * @param {boolean} enabled - Whether to enable auto-sync
 */
export const setAutoSyncEnabled = (enabled) => {
  localStorage.setItem('desktop-auto-sync-enabled', enabled ? 'true' : 'false')
  if (enabled) {
    // Sync immediately when enabling
    autoSyncToDesktop()
  }
}

/**
 * Check if auto-sync is enabled.
 * 
 * @returns {boolean} True if auto-sync is enabled
 */
export const isAutoSyncEnabled = () => {
  return localStorage.getItem('desktop-auto-sync-enabled') === 'true'
}

