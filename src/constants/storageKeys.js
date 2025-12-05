/**
 * Storage Keys Constants
 * 
 * This file defines all localStorage keys used throughout the application.
 * Centralizing these keys makes it easier to:
 * - Avoid typos and inconsistencies
 * - Update keys in one place
 * - Understand what data is stored where
 * - Maintain data migration if needed
 * 
 * @module constants/storageKeys
 */

/**
 * Main data storage key for habit and weight tracking data.
 * Stores daily habit completion data and weight measurements.
 * 
 * Structure: { [dateString]: { habits: [], weight: number, ... } }
 * 
 * @constant {string}
 * @default 'habit-tracker-data'
 */
export const STORAGE_KEY_HABIT_DATA = 'habit-tracker-data'

/**
 * Storage key for goals data.
 * Stores all user-defined goals and their progress.
 * 
 * @constant {string}
 * @default 'habit-tracker-goals'
 */
export const STORAGE_KEY_GOALS = 'habit-tracker-goals'

/**
 * Storage key for todos data.
 * Stores all todo items, including recurring todos.
 * 
 * @constant {string}
 * @default 'habit-tracker-todos'
 */
export const STORAGE_KEY_TODOS = 'habit-tracker-todos'

/**
 * Storage key for mood tracking data.
 * Stores daily mood ratings and notes.
 * 
 * @constant {string}
 * @default 'habit-tracker-mood'
 */
export const STORAGE_KEY_MOOD = 'habit-tracker-mood'

/**
 * Storage key for habit reminder settings.
 * Stores reminder configurations for each habit.
 * 
 * @constant {string}
 * @default 'habit-tracker-reminders'
 */
export const STORAGE_KEY_REMINDERS = 'habit-tracker-reminders'

/**
 * Storage key for reminder trigger logs.
 * Tracks when reminders were sent (for analytics).
 * 
 * @constant {string}
 * @default 'reminder-logs'
 */
export const STORAGE_KEY_REMINDER_LOGS = 'reminder-logs'

/**
 * Storage key for notification permission status.
 * Remembers if user has granted notification permissions.
 * 
 * @constant {string}
 * @default 'notification-permission'
 */
export const STORAGE_KEY_NOTIFICATION_PERMISSION = 'notification-permission'

/**
 * Storage key for streak data.
 * Stores streak calculations for each habit.
 * 
 * @constant {string}
 * @default 'habit-tracker-streaks'
 */
export const STORAGE_KEY_STREAKS = 'habit-tracker-streaks'

/**
 * Storage key for journal entries.
 * Stores daily journal entries with text content, timer duration, and timestamps.
 * 
 * Structure: { [dateString]: { date: string, content: string, timerSeconds: number, timestamp: string } }
 * 
 * @constant {string}
 * @default 'habit-tracker-journals'
 */
export const STORAGE_KEY_JOURNALS = 'habit-tracker-journals'

/**
 * Storage key for habit templates.
 * Stores habit template definitions (structure, metadata) that are
 * instantiated each day with completion status.
 * 
 * Structure: Array of habit template objects with id, name, emoji, category, timeOfDay, etc.
 * 
 * @constant {string}
 * @default 'habit-tracker-templates'
 */
export const STORAGE_KEY_HABIT_TEMPLATES = 'habit-tracker-templates'
