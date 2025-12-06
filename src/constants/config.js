/**
 * Application Configuration Constants
 * 
 * Centralized configuration for the entire application.
 * This file contains all configurable values, timeouts, delays,
 * and other constants that might need to be adjusted.
 * 
 * @module constants/config
 */

/**
 * Application metadata
 */
export const APP_CONFIG = {
  NAME: 'Deck Log',
  VERSION: '1.0.0',
  DESCRIPTION: 'Personal productivity tracking application',
}

/**
 * Timing and delay constants (in milliseconds)
 */
export const TIMING = {
  /** Debounce delay for desktop file sync */
  DESKTOP_SYNC_DEBOUNCE: 2000,
  
  /** Cache TTL for localStorage reads */
  CACHE_TTL: 5000,
  
  /** Delay before checking recurring todos after completion */
  RECURRING_TODO_CHECK_DELAY: 1000,
  
  /** Reminder scheduler check interval */
  REMINDER_CHECK_INTERVAL: 60000, // 1 minute
  
  /** Idle callback timeout for non-critical initialization */
  IDLE_CALLBACK_TIMEOUT: 2000,
  
  /** Fallback delay for reminder initialization */
  REMINDER_INIT_FALLBACK_DELAY: 100,
}

/**
 * UI Constants
 */
export const UI = {
  /** Maximum emoji length in habit forms */
  MAX_EMOJI_LENGTH: 2,
  
  /** Animation durations */
  ANIMATION_DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  
  /** Z-index layers */
  Z_INDEX: {
    MODAL: 1000,
    DROPDOWN: 100,
    TOOLTIP: 50,
    FLOATING_BUTTON: 100,
  },
}

/**
 * Validation Constants
 */
export const VALIDATION = {
  /** Minimum length for habit names */
  MIN_HABIT_NAME_LENGTH: 1,
  
  /** Maximum length for habit names */
  MAX_HABIT_NAME_LENGTH: 100,
  
  /** Minimum length for goal titles */
  MIN_GOAL_TITLE_LENGTH: 1,
  
  /** Maximum length for goal titles */
  MAX_GOAL_TITLE_LENGTH: 200,
  
  /** Minimum length for todo titles */
  MIN_TODO_TITLE_LENGTH: 1,
  
  /** Maximum length for todo titles */
  MAX_TODO_TITLE_LENGTH: 500,
}

/**
 * Storage Constants
 */
export const STORAGE = {
  /** Default desktop file path */
  DEFAULT_DESKTOP_PATH: '~/Desktop/personal-tracker-data.json',
  
  /** Data export version */
  EXPORT_VERSION: '1.0.0',
}

/**
 * Notification Constants
 */
export const NOTIFICATIONS = {
  /** Default notification title */
  DEFAULT_TITLE: 'Deck Log',
  
  /** Notification options */
  DEFAULT_OPTIONS: {
    icon: '/icon.png',
    badge: '/icon.png',
  },
}

/**
 * Feature Flags
 * 
 * Enable or disable features without code changes.
 * Useful for A/B testing or gradual feature rollouts.
 */
export const FEATURES = {
  /** Enable desktop file storage */
  DESKTOP_STORAGE: true,
  
  /** Enable auto-sync to desktop */
  AUTO_SYNC: true,
  
  /** Enable notifications */
  NOTIFICATIONS: true,
  
  /** Enable analytics */
  ANALYTICS: true,
}

/**
 * Development/Debug Constants
 */
export const DEBUG = {
  /** Enable verbose logging */
  VERBOSE_LOGGING: process.env.NODE_ENV === 'development',
  
  /** Show error details in error boundary */
  SHOW_ERROR_DETAILS: process.env.NODE_ENV === 'development',
}

