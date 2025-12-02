/**
 * Time Utilities
 * 
 * This module provides time-based utility functions for:
 * - Generating time-appropriate greetings
 * - Determining current time period (morning, afternoon, evening, night)
 * - Filtering habits based on time of day
 * 
 * These functions are used throughout the app to provide contextual
 * messaging and to show/hide habits based on when they should be performed.
 * 
 * @module utils/timeUtils
 * @requires constants/appConstants
 */

import { TIME_PERIOD_HOURS } from '../constants/appConstants'

// ============================================================================
// TIME PERIOD DETERMINATION
// ============================================================================

/**
 * Generates a time-appropriate greeting message based on current hour.
 * 
 * Time periods:
 * - Morning: 5:00 AM - 11:59 AM
 * - Afternoon: 12:00 PM - 4:59 PM
 * - Evening: 5:00 PM - 9:59 PM
 * - Night: 10:00 PM - 4:59 AM
 * 
 * Each greeting includes:
 * - A contextual message
 * - An emoji representing the time of day
 * - The time period name
 * 
 * @returns {Object} Greeting object with message, emoji, and period
 * @property {string} message - Greeting message text
 * @property {string} emoji - Emoji representing time of day
 * @property {string} period - Time period ('morning', 'afternoon', 'evening', 'night')
 * 
 * @example
 * const greeting = getTimeBasedGreeting()
 * // Returns: {
 * //   message: "Good morning! What habits are we taking care of now?",
 * //   emoji: "🌅",
 * //   period: "morning"
 * // }
 */
export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours()
  
  // Morning: 5 AM to 11:59 AM
  if (hour >= TIME_PERIOD_HOURS.MORNING_START && hour < TIME_PERIOD_HOURS.MORNING_END) {
    return {
      message: "Good morning! What habits are we taking care of now?",
      emoji: "🌅",
      period: "morning"
    }
  } 
  // Afternoon: 12 PM to 4:59 PM
  else if (hour >= TIME_PERIOD_HOURS.AFTERNOON_START && hour < TIME_PERIOD_HOURS.AFTERNOON_END) {
    return {
      message: "Good afternoon! Let's keep up those good habits!",
      emoji: "☀️",
      period: "afternoon"
    }
  } 
  // Evening: 5 PM to 9:59 PM
  else if (hour >= TIME_PERIOD_HOURS.EVENING_START && hour < TIME_PERIOD_HOURS.EVENING_END) {
    return {
      message: "Good evening! Time for your evening habits!",
      emoji: "🌆",
      period: "evening"
    }
  } 
  // Night: 10 PM to 4:59 AM
  else {
    return {
      message: "Late night! Don't forget your nighttime habits!",
      emoji: "🌙",
      period: "night"
    }
  }
}

/**
 * Determines the current time period for habit filtering.
 * 
 * This is used to filter which habits should be shown based on
 * the current time of day. The logic is slightly different from
 * getTimeBasedGreeting() because afternoon can show both morning
 * and night habits (since it's between them).
 * 
 * Time periods:
 * - Morning: 5:00 AM - 11:59 AM
 * - Afternoon: 12:00 PM - 4:59 PM (returns 'anytime' to show all)
 * - Night: 5:00 PM - 4:59 AM
 * 
 * @returns {string} Time period: 'morning', 'night', or 'anytime'
 * 
 * @example
 * const period = getCurrentTimePeriod()
 * // Returns: 'morning', 'night', or 'anytime'
 */
export const getCurrentTimePeriod = () => {
  const hour = new Date().getHours()
  
  // Morning: 5 AM to 11:59 AM
  if (hour >= TIME_PERIOD_HOURS.MORNING_START && hour < TIME_PERIOD_HOURS.MORNING_END) {
    return 'morning'
  } 
  // Evening/Night: 5 PM to 9:59 PM
  else if (hour >= TIME_PERIOD_HOURS.EVENING_START && hour < TIME_PERIOD_HOURS.EVENING_END) {
    return 'night'
  } 
  // Late Night/Early Morning: 10 PM to 4:59 AM
  else if (hour >= TIME_PERIOD_HOURS.NIGHT_START || hour < TIME_PERIOD_HOURS.NIGHT_END) {
    return 'night'
  } 
  // Afternoon: 12 PM to 4:59 PM
  // Show all habits during afternoon (between morning and night)
  else {
    return 'anytime'
  }
}

// ============================================================================
// HABIT FILTERING
// ============================================================================

/**
 * Determines if a habit should be shown based on current time period.
 * 
 * Logic:
 * - Habits with timeOfDay 'anytime' are always shown
 * - During afternoon, show all habits (morning, night, anytime)
 * - During morning/night, only show matching habits
 * 
 * This allows users to see relevant habits based on time of day,
 * while still having access to "anytime" habits.
 * 
 * @param {Object} habit - Habit object with timeOfDay property
 * @param {string} timePeriod - Current time period ('morning', 'night', 'anytime')
 * @returns {boolean} True if habit should be shown, false otherwise
 * 
 * @example
 * const habit = { name: 'Meditate', timeOfDay: 'morning' }
 * const shouldShow = shouldShowHabit(habit, 'morning')
 * // Returns: true
 */
export const shouldShowHabit = (habit, timePeriod) => {
  // Always show habits that can be done anytime
  if (!habit.timeOfDay || habit.timeOfDay === 'anytime') {
    return true
  }
  
  // During afternoon, show all habits (it's between morning and night)
  if (timePeriod === 'afternoon') {
    return true
  }
  
  // Otherwise, only show habits that match the current time period
  return habit.timeOfDay === timePeriod
}
