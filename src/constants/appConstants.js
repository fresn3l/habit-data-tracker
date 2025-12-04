/**
 * Application Constants
 * 
 * This file contains all application-wide constants that are used
 * throughout the codebase. These include:
 * - Cache settings
 * - Time intervals
 * - Default values
 * - Configuration values
 * 
 * Centralizing constants makes it easier to:
 * - Adjust values in one place
 * - Understand what values are used where
 * - Maintain consistency across the app
 * 
 * @module constants/appConstants
 */

/**
 * Cache Time-To-Live (TTL) in milliseconds.
 * 
 * This determines how long parsed localStorage data is cached
 * before being re-read from storage. A 5-second cache helps
 * performance by avoiding repeated JSON parsing, while still
 * ensuring data freshness.
 * 
 * @constant {number}
 * @default 5000
 * @unit milliseconds
 */
export const CACHE_TTL = 5000

/**
 * Reminder check interval in milliseconds.
 * 
 * How often the reminder scheduler checks if it's time to
 * send a reminder notification. Checking every minute ensures
 * reminders are sent promptly without excessive CPU usage.
 * 
 * @constant {number}
 * @default 60000
 * @unit milliseconds
 */
export const REMINDER_CHECK_INTERVAL = 60000

/**
 * Snooze duration in milliseconds.
 * 
 * When a user snoozes a reminder, how long to wait before
 * showing it again.
 * 
 * @constant {number}
 * @default 900000
 * @unit milliseconds (15 minutes)
 */
export const REMINDER_SNOOZE_DURATION = 15 * 60 * 1000

/**
 * Maximum number of reminder logs to keep.
 * 
 * Limits the size of reminder log storage by keeping only
 * the most recent N logs.
 * 
 * @constant {number}
 * @default 100
 */
export const MAX_REMINDER_LOGS = 100

/**
 * Default window size for the desktop application.
 * 
 * Width and height in pixels for the Eel application window.
 * 
 * @constant {Object}
 * @property {number} width - Window width in pixels
 * @property {number} height - Window height in pixels
 */
export const DEFAULT_WINDOW_SIZE = {
  width: 1400,
  height: 900
}

/**
 * Default port for the Eel server.
 * 
 * The port number used when starting the Eel development server.
 * Port 0 means use a random available port.
 * 
 * @constant {number}
 * @default 8080
 */
export const DEFAULT_EEL_PORT = 8080

/**
 * Application name.
 * 
 * Used throughout the app for display and identification.
 * 
 * @constant {string}
 * @default 'Personal Tracker'
 */
export const APP_NAME = 'Personal Tracker'

/**
 * Application version.
 * 
 * Semantic versioning: MAJOR.MINOR.PATCH
 * 
 * @constant {string}
 * @default '1.0.0'
 */
export const APP_VERSION = '1.0.0'

/**
 * Time periods for habit filtering.
 * 
 * Used to categorize habits by time of day and filter
 * which habits to show based on current time.
 * 
 * @constant {Object}
 */
export const TIME_PERIODS = {
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  EVENING: 'evening',
  NIGHT: 'night',
  ANYTIME: 'anytime'
}

/**
 * Todo urgency levels.
 * 
 * @constant {Object}
 */
export const URGENCY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
}

/**
 * Todo time commitment levels.
 * 
 * @constant {Object}
 */
export const TIME_COMMITMENT_LEVELS = {
  SHORT: 'short',    // < 15 minutes
  MEDIUM: 'medium',  // 15-60 minutes
  LONG: 'long'       // > 60 minutes
}

/**
 * Goal frequency types.
 * 
 * @constant {Object}
 */
export const GOAL_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
}

/**
 * Recurrence patterns for recurring todos.
 * 
 * @constant {Object}
 */
export const RECURRENCE_PATTERNS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
}

/**
 * Day of week indices (0 = Sunday, 6 = Saturday).
 * 
 * Used for reminder scheduling and recurrence calculations.
 * 
 * @constant {Object}
 */
export const DAY_OF_WEEK = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6
}

/**
 * Day labels for display.
 * 
 * Short day names for UI display.
 * 
 * @constant {Array<string>}
 */
export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/**
 * Hours that define time periods.
 * 
 * Used to determine morning, afternoon, evening, and night periods.
 * 
 * @constant {Object}
 */
export const TIME_PERIOD_HOURS = {
  MORNING_START: 5,
  MORNING_END: 12,
  AFTERNOON_START: 12,
  AFTERNOON_END: 17,
  EVENING_START: 17,
  EVENING_END: 22,
  NIGHT_START: 22,
  NIGHT_END: 5
}

