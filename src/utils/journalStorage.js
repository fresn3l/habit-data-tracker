/**
 * Journal Storage Utilities
 * 
 * This module provides functions for storing and retrieving journal entries
 * from browser localStorage. It handles:
 * - Daily journal entries with text content
 * - Timer duration tracking (how long user spent journaling)
 * - Timestamps for each entry
 * - File system export via Eel (if available)
 * 
 * All data is stored in localStorage with the following structure:
 * {
 *   "Mon Dec 01 2024": {
 *     date: "Mon Dec 01 2024",
 *     content: "Today I...",
 *     timerSeconds: 600,
 *     timestamp: "2024-12-01T10:30:00.000Z"
 *   },
 *   ...
 * }
 * 
 * @module utils/journalStorage
 * @requires constants/storageKeys
 */

import { STORAGE_KEY_JOURNALS } from '../constants/storageKeys'

/**
 * Get the current date string in the same format used throughout the app.
 * Format: "Mon Dec 01 2024"
 * 
 * @returns {string} Formatted date string
 */
const getDateString = () => {
  return new Date().toDateString()
}

/**
 * Get all journal entries from localStorage.
 * 
 * @returns {Object} Object with date strings as keys and journal entries as values
 * 
 * @example
 * const entries = getAllJournals()
 * // Returns: { "Mon Dec 01 2024": { date: "...", content: "...", ... }, ... }
 */
export const getAllJournals = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_JOURNALS)
    if (!stored) {
      return {}
    }
    return JSON.parse(stored)
  } catch (error) {
    console.error('Error reading journals from localStorage:', error)
    return {}
  }
}

/**
 * Get journal entry for a specific date.
 * 
 * @param {string} dateString - Date string in format "Mon Dec 01 2024" (optional, defaults to today)
 * @returns {Object|null} Journal entry object or null if not found
 * 
 * @example
 * const entry = getJournalForDate("Mon Dec 01 2024")
 * // Returns: { date: "Mon Dec 01 2024", content: "...", timerSeconds: 600, ... }
 */
export const getJournalForDate = (dateString = null) => {
  const date = dateString || getDateString()
  const allJournals = getAllJournals()
  return allJournals[date] || null
}

/**
 * Get today's journal entry.
 * 
 * @returns {Object|null} Today's journal entry or null if not found
 */
export const getTodaysJournal = () => {
  return getJournalForDate(getDateString())
}

/**
 * Save a journal entry for a specific date.
 * 
 * @param {string} content - The journal entry text content
 * @param {number} timerSeconds - Number of seconds spent journaling (default: 0)
 * @param {string} dateString - Date string (optional, defaults to today)
 * @returns {Object} The saved journal entry
 * 
 * @example
 * const entry = saveJournal("Today I went for a walk...", 600)
 * // Saves entry for today with 10 minutes (600 seconds) of journaling time
 */
export const saveJournal = (content, timerSeconds = 0, dateString = null) => {
  const date = dateString || getDateString()
  const allJournals = getAllJournals()
  
  const journalEntry = {
    date: date,
    content: content,
    timerSeconds: timerSeconds,
    timestamp: new Date().toISOString(),
    wordCount: content.trim().split(/\s+/).filter(word => word.length > 0).length
  }
  
  allJournals[date] = journalEntry
  
  try {
    localStorage.setItem(STORAGE_KEY_JOURNALS, JSON.stringify(allJournals))
    
    // Also attempt to save to file system via Eel (if available)
    saveJournalToFileSystem(journalEntry).catch(error => {
      console.warn('Failed to save journal to file system:', error)
      // Continue anyway - localStorage backup is sufficient
    })
    
    // Auto-sync to desktop file if enabled (background, non-blocking)
    if (typeof window !== 'undefined' && window.eel) {
      import('./desktopStorage').then(module => {
        module.autoSyncToDesktop().catch(() => {})
      }).catch(() => {})
    }
    
    return journalEntry
  } catch (error) {
    console.error('Error saving journal to localStorage:', error)
    throw new Error('Failed to save journal entry')
  }
}

/**
 * Update an existing journal entry.
 * 
 * @param {string} content - Updated journal entry text content
 * @param {number} timerSeconds - Updated timer seconds (optional, preserves existing if not provided)
 * @param {string} dateString - Date string (optional, defaults to today)
 * @returns {Object} The updated journal entry
 */
export const updateJournal = (content, timerSeconds = null, dateString = null) => {
  const date = dateString || getDateString()
  const existing = getJournalForDate(date)
  
  const updatedEntry = {
    ...existing,
    date: date,
    content: content,
    timerSeconds: timerSeconds !== null ? timerSeconds : (existing?.timerSeconds || 0),
    timestamp: new Date().toISOString(),
    wordCount: content.trim().split(/\s+/).filter(word => word.length > 0).length
  }
  
  return saveJournal(updatedEntry.content, updatedEntry.timerSeconds, date)
}

/**
 * Delete a journal entry for a specific date.
 * 
 * @param {string} dateString - Date string (optional, defaults to today)
 * @returns {boolean} True if deleted, false if not found
 */
export const deleteJournal = (dateString = null) => {
  const date = dateString || getDateString()
  const allJournals = getAllJournals()
  
  if (!allJournals[date]) {
    return false
  }
  
  delete allJournals[date]
  
  try {
    localStorage.setItem(STORAGE_KEY_JOURNALS, JSON.stringify(allJournals))
    return true
  } catch (error) {
    console.error('Error deleting journal from localStorage:', error)
    return false
  }
}

/**
 * Get all journal entries sorted by date (newest first).
 * 
 * @returns {Array} Array of journal entry objects sorted by date
 */
export const getAllJournalsSorted = () => {
  const allJournals = getAllJournals()
  
  return Object.values(allJournals)
    .sort((a, b) => {
      // Sort by timestamp (newest first)
      return new Date(b.timestamp) - new Date(a.timestamp)
    })
}

/**
 * Get journal entries for a date range.
 * 
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array} Array of journal entries within the date range
 */
export const getJournalsInRange = (startDate, endDate) => {
  const allJournals = getAllJournals()
  const entries = []
  
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  Object.values(allJournals).forEach(entry => {
    const entryDate = new Date(entry.timestamp)
    if (entryDate >= start && entryDate <= end) {
      entries.push(entry)
    }
  })
  
  return entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

/**
 * Export all journals to JSON string.
 * 
 * @returns {string} JSON string of all journal entries
 */
export const exportJournalsToJSON = () => {
  const allJournals = getAllJournals()
  return JSON.stringify(allJournals, null, 2)
}

/**
 * Save journal entry to file system via Eel (if available).
 * This is a background operation that doesn't block the UI.
 * 
 * @param {Object} journalEntry - Journal entry object to save
 * @returns {Promise} Promise that resolves when file is saved (or rejects if Eel not available)
 */
const saveJournalToFileSystem = async (journalEntry) => {
  // Check if Eel is available (only in desktop app mode)
  if (typeof window === 'undefined' || !window.eel) {
    return Promise.resolve() // Not available, skip silently
  }
  
  try {
    // Get app data directory path from Python
    const dataPath = await window.eel.get_app_data_path()()
    const journalsDir = dataPath.replace(/\\/g, '/') + '/journals'
    
    // Create journal entry file path
    const fileName = journalEntry.date.replace(/\s+/g, '_') + '.json'
    const filePath = journalsDir + '/' + fileName
    
    // Save to file system
    const result = await window.eel.save_journal_file(journalsDir, fileName, JSON.stringify(journalEntry, null, 2))()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to save journal file')
    }
    
    return result
  } catch (error) {
    // If Eel functions don't exist, that's okay - we still have localStorage
    if (error.message && error.message.includes('eel is not defined')) {
      return Promise.resolve()
    }
    throw error
  }
}

/**
 * Get all journal entries from file system via Eel (if available).
 * Falls back to localStorage if file system is not accessible.
 * 
 * @returns {Promise<Array>} Promise that resolves to array of journal entries
 */
export const loadJournalsFromFileSystem = async () => {
  // Check if Eel is available
  if (typeof window === 'undefined' || !window.eel) {
    // Fall back to localStorage
    return getAllJournalsSorted()
  }
  
  try {
    const dataPath = await window.eel.get_app_data_path()()
    const journalsDir = dataPath.replace(/\\/g, '/') + '/journals'
    
    const result = await window.eel.load_journal_files(journalsDir)()
    
    if (result.success && result.entries) {
      // Merge file system entries with localStorage
      const localStorageJournals = getAllJournals()
      const merged = { ...localStorageJournals }
      
      result.entries.forEach(entry => {
        merged[entry.date] = entry
      })
      
      // Save merged data back to localStorage
      localStorage.setItem(STORAGE_KEY_JOURNALS, JSON.stringify(merged))
      
      return getAllJournalsSorted()
    }
    
    return getAllJournalsSorted()
  } catch (error) {
    console.warn('Failed to load journals from file system:', error)
    // Fall back to localStorage
    return getAllJournalsSorted()
  }
}

