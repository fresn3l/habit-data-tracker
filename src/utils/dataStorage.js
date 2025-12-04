/**
 * Data Storage Utilities
 * 
 * This module provides functions for storing and retrieving habit tracking data
 * from browser localStorage. It handles:
 * - Daily habit completion data
 * - Weight measurements
 * - Historical data retrieval
 * - Data caching for performance
 * 
 * All data is stored in a single localStorage key with the following structure:
 * {
 *   "Mon Dec 01 2024": {
 *     date: "Mon Dec 01 2024",
 *     habits: [...],
 *     weight: 150.5,
 *     completedCount: 8,
 *     totalCount: 12,
 *     timestamp: "2024-12-01T10:30:00.000Z"
 *   },
 *   ...
 * }
 * 
 * @module utils/dataStorage
 * @requires constants/storageKeys
 */
import { STORAGE_KEY_HABIT_DATA } from '../constants/storageKeys'
import { CACHE_TTL } from '../constants/appConstants'

// Use the constant for the storage key (maintains backward compatibility)
export const STORAGE_KEY = STORAGE_KEY_HABIT_DATA
// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

/**
 * In-memory cache for parsed localStorage data.
 * This avoids repeatedly parsing JSON on every read operation.
 * 
 * @private
 * @type {Object|null}
 */
let dataCache = null

/**
 * Timestamp when the cache was last updated.
 * Used to determine if cache is still valid based on CACHE_TTL.
 * 
 * @private
 * @type {number|null}
 */
let cacheTimestamp = null

// ============================================================================
// CORE STORAGE FUNCTIONS
// ============================================================================

/**
 * Gets a date string key for today's data.
 * 
 * Uses JavaScript's Date.toDateString() which returns a string like
 * "Mon Dec 01 2024". This format is consistent and human-readable.
 * 
 * @returns {string} Date string in format "Day Mon DD YYYY"
 * 
 * @example
 * const today = getTodayKey()
 * // Returns: "Mon Dec 01 2024"
 */
export const getTodayKey = () => {
  return new Date().toDateString()
}

/**
 * Retrieves all stored data from localStorage with optional caching.
 * 
 * This is the primary data access function. It implements a simple
 * caching mechanism to avoid repeated JSON parsing:
 * - First call: Reads from localStorage, parses JSON, caches result
 * - Subsequent calls within CACHE_TTL: Returns cached data
 * - After CACHE_TTL expires: Re-reads and re-parses from localStorage
 * 
 * The cache is automatically invalidated when data is written (via
 * clearDataCache() calls in save functions).
 * 
 * @param {boolean} [useCache=true] - Whether to use cached data if available
 * @returns {Object} All stored data, keyed by date strings
 * 
 * @example
 * const allData = getAllStoredData()
 * const todayData = allData[getTodayKey()]
 */
export const getAllStoredData = (useCache = true) => {
  const now = Date.now()
  
  // Return cached data if it's still valid (within CACHE_TTL)
  if (useCache && dataCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_TTL) {
    return dataCache
  }
  
  // Cache expired or not available - read from localStorage
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    // Parse JSON and cache the result
    dataCache = data ? JSON.parse(data) : {}
    cacheTimestamp = now
    return dataCache
  } catch (error) {
    // Handle corrupted data gracefully
    console.error('Error reading stored data:', error)
    return {}
  }
}

/**
 * Clears the in-memory data cache.
 * 
 * This should be called whenever data is written to localStorage
 * to ensure the cache doesn't become stale. All save functions
 * automatically call this after writing.
 * 
 * @returns {void}
 */
export const clearDataCache = () => {
  dataCache = null
  cacheTimestamp = null
}

// ============================================================================
// DATA WRITE OPERATIONS
// ============================================================================

/**
 * Saves habit and weight data for a specific day.
 * 
 * This is the primary write function for daily habit tracking.
 * It:
 * 1. Loads all existing data (without cache to ensure freshness)
 * 2. Merges new data with existing data for that day
 * 3. Calculates completion statistics
 * 4. Saves to localStorage
 * 5. Clears cache to ensure next read gets fresh data
 * 
 * The habits array is normalized to only store essential fields,
 * preventing storage bloat from unnecessary data.
 * 
 * @param {string} dateKey - Date string key (from getTodayKey())
 * @param {Array<Object>} habits - Array of habit objects
 * @param {number|null} weight - Weight measurement (optional)
 * @returns {void}
 * 
 * @example
 * const habits = [
 *   { id: 1, name: 'Meditate', completed: true, ... },
 *   { id: 2, name: 'Exercise', completed: false, ... }
 * ]
 * saveDayData('Mon Dec 01 2024', habits, 150.5)
 */
export const saveDayData = (dateKey, habits, weight = null) => {
  // Load all data without cache to ensure we have latest data
  const allData = getAllStoredData(false)
  const existingData = allData[dateKey] || {}
  
  // Merge new data with existing data for this day
  allData[dateKey] = {
    ...existingData, // Preserve any existing fields (like mood, notes, etc.)
    date: dateKey,
    // Normalize habits array - only store essential fields
    habits: habits.map(h => ({
      id: h.id,
      name: h.name,
      emoji: h.emoji,
      category: h.category,
      completed: h.completed,
      timeOfDay: h.timeOfDay || 'anytime',
    })),
    // Calculate completion statistics
    completedCount: habits.filter(h => h.completed).length,
    totalCount: habits.length,
    // Preserve existing weight if new weight is null
    weight: weight !== null ? weight : existingData.weight,
    timestamp: new Date().toISOString(),
  }
  
  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData))
  
  // Clear cache so next read gets fresh data
  clearDataCache()
}

/**
 * Saves only the weight measurement for a specific day.
 * 
 * This is a convenience function for updating weight without
 * needing to provide the full habits array. Useful when weight
 * is updated independently of habits.
 * 
 * @param {string} dateKey - Date string key (from getTodayKey())
 * @param {number} weight - Weight measurement
 * @returns {void}
 * 
 * @example
 * saveWeight('Mon Dec 01 2024', 150.5)
 */
export const saveWeight = (dateKey, weight) => {
  // Load all data without cache
  const allData = getAllStoredData(false)
  
  // Initialize day data if it doesn't exist
  if (!allData[dateKey]) {
    allData[dateKey] = { 
      date: dateKey, 
      timestamp: new Date().toISOString() 
    }
  }
  
  // Update weight and timestamp
  allData[dateKey].weight = weight
  allData[dateKey].timestamp = new Date().toISOString()
  
  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData))
  
  // Clear cache
  clearDataCache()
}

// ============================================================================
// DATA READ OPERATIONS
// ============================================================================

/**
 * Retrieves data for a specific day.
 * 
 * @param {string} dateKey - Date string key (from getTodayKey())
 * @returns {Object|null} Day data object or null if not found
 * 
 * @example
 * const todayData = getDayData(getTodayKey())
 * if (todayData) {
 *   console.log(`Completed ${todayData.completedCount} habits`)
 * }
 */
export const getDayData = (dateKey) => {
  const allData = getAllStoredData()
  return allData[dateKey] || null
}

/**
 * Gets all date keys that have stored data, sorted chronologically.
 * 
 * Useful for:
 * - Displaying a list of days with data
 * - Finding the first/last day with data
 * - Iterating over all days
 * 
 * @returns {Array<string>} Sorted array of date strings
 * 
 * @example
 * const dates = getAllDates()
 * const firstDay = dates[0]
 * const lastDay = dates[dates.length - 1]
 */
export const getAllDates = () => {
  const allData = getAllStoredData()
  return Object.keys(allData).sort()
}

/**
 * Retrieves data for a range of dates.
 * 
 * This function handles date normalization to ensure full day coverage:
 * - Start date is set to 00:00:00.000
 * - End date is set to 23:59:59.999
 * 
 * This ensures that all data within the range is included, even if
 * timestamps vary slightly.
 * 
 * @param {Date|string} startDate - Start date (inclusive)
 * @param {Date|string} endDate - End date (inclusive)
 * @returns {Array<Object>} Array of day data objects
 * 
 * @example
 * const weekData = getDateRange(
 *   new Date('2024-12-01'),
 *   new Date('2024-12-07')
 * )
 */
export const getDateRange = (startDate, endDate) => {
  const allData = getAllStoredData()
  const range = []
  
  // Normalize dates to ensure full day coverage
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0) // Start of day
  
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999) // End of day
  
  // Iterate through each day in the range
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toDateString()
    if (allData[dateKey]) {
      range.push(allData[dateKey])
    }
  }
  
  return range
}

/**
 * Gets all data for the current week.
 * 
 * Week starts on Sunday (day 0) and includes all days up to today.
 * 
 * @returns {Array<Object>} Array of day data objects for this week
 * 
 * @example
 * const weekData = getWeekData()
 * const totalCompleted = weekData.reduce((sum, day) => 
 *   sum + (day.completedCount || 0), 0
 * )
 */
export const getWeekData = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Calculate week start (Sunday)
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay()) // Go back to Sunday
  weekStart.setHours(0, 0, 0, 0)
  
  return getDateRange(weekStart, today)
}

/**
 * Gets all data for the current month.
 * 
 * Month starts on the 1st and includes all days up to today.
 * 
 * @returns {Array<Object>} Array of day data objects for this month
 * 
 * @example
 * const monthData = getMonthData()
 * const avgWeight = getAverageWeight(monthData)
 */
export const getMonthData = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Calculate month start (1st of current month)
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  monthStart.setHours(0, 0, 0, 0)
  
  return getDateRange(monthStart, today)
}

// ============================================================================
// ANALYTICS HELPER FUNCTIONS
// ============================================================================

/**
 * Calculates the average completion rate from an array of day data.
 * 
 * Completion rate is calculated as:
 * (completedCount / totalCount) for each day, then averaged.
 * 
 * Returns a value between 0 and 1 (0% to 100%).
 * 
 * @param {Array<Object>} dataArray - Array of day data objects
 * @returns {number} Average completion rate (0-1)
 * 
 * @example
 * const weekData = getWeekData()
 * const completionRate = calculateCompletionRate(weekData)
 * // Returns: 0.75 (75% average completion)
 */
export const calculateCompletionRate = (dataArray) => {
  if (!dataArray || dataArray.length === 0) return 0
  
  const totalDays = dataArray.length
  const totalCompleted = dataArray.reduce((sum, day) => {
    // Skip days without completion data
    if (!day.completedCount || !day.totalCount) return sum
    // Add this day's completion rate to the sum
    return sum + (day.completedCount / day.totalCount)
  }, 0)
  
  // Return average completion rate
  return totalCompleted / totalDays
}

/**
 * Calculates percentage change between two values.
 * 
 * Formula: ((current - previous) / previous) * 100
 * 
 * Handles edge case where previous is 0:
 * - If current > 0: returns 100 (infinite increase)
 * - If current = 0: returns 0 (no change)
 * 
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} Percentage change (can be negative)
 * 
 * @example
 * const change = calculatePercentageChange(80, 60)
 * // Returns: 33.33 (33.33% increase)
 */
export const calculatePercentageChange = (current, previous) => {
  // Handle division by zero
  if (previous === 0) return current > 0 ? 100 : 0
  
  return ((current - previous) / previous) * 100
}

/**
 * Calculates weight change (difference) between two weights.
 * 
 * @param {number} current - Current weight
 * @param {number} previous - Previous weight
 * @returns {number|null} Weight change (positive = gain, negative = loss)
 * 
 * @example
 * const change = calculateWeightChange(150, 152)
 * // Returns: -2 (lost 2 lbs)
 */
export const calculateWeightChange = (current, previous) => {
  if (!previous || previous === 0) return null
  return current - previous
}

/**
 * Calculates average weight from an array of day data.
 * 
 * Filters out invalid weights (null, undefined, NaN) before calculating.
 * 
 * @param {Array<Object>} dataArray - Array of day data objects
 * @returns {number|null} Average weight or null if no valid weights
 * 
 * @example
 * const monthData = getMonthData()
 * const avgWeight = getAverageWeight(monthData)
 * // Returns: 150.5 or null if no weights recorded
 */
export const getAverageWeight = (dataArray) => {
  // Extract and filter valid weights
  const weights = dataArray
    .map(day => day.weight)
    .filter(weight => weight !== null && weight !== undefined && !isNaN(weight))
  
  // Return null if no valid weights
  if (weights.length === 0) return null
  
  // Calculate average
  const sum = weights.reduce((acc, weight) => acc + weight, 0)
  return sum / weights.length
}
