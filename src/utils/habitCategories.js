/**
 * Habit Categories Configuration
 * 
 * This module defines the habit category system used throughout the app.
 * Categories provide:
 * - Color coding for visual organization
 * - Grouping of related habits
 * - Consistent styling across the app
 * 
 * Each category has:
 * - name: Display name
 * - color: Primary color (for text, borders)
 * - bgColor: Background color (for cards, badges)
 * - borderColor: Border color (for outlines)
 * 
 * @module utils/habitCategories
 */

// ============================================================================
// CATEGORY DEFINITIONS
// ============================================================================

/**
 * Habit category definitions with color schemes.
 * 
 * Categories are organized by life area:
 * - HEALTH: Medical, dental, general health
 * - FITNESS: Exercise, physical activity
 * - NUTRITION: Food, water, supplements
 * - MENTAL: Mental wellness, mindfulness, learning
 * - LIFESTYLE: Daily routines, sleep, general habits
 * - AVOIDANCE: Habits about avoiding things (alcohol, etc.)
 * 
 * Colors use Tailwind CSS color palette for consistency.
 * 
 * @constant {Object}
 */
export const HABIT_CATEGORIES = {
  /**
   * Health category - Medical and general health habits.
   * Examples: Brush teeth, wear retainers, take medication
   */
  HEALTH: {
    name: 'Health',
    color: '#ef4444',        // red-500
    bgColor: '#fef2f2',      // red-50
    borderColor: '#fca5a5',  // red-300
  },
  
  /**
   * Fitness category - Physical exercise and activity.
   * Examples: Gym, weightlifting, running, yoga
   */
  FITNESS: {
    name: 'Fitness',
    color: '#f59e0b',        // amber-500
    bgColor: '#fffbeb',      // amber-50
    borderColor: '#fcd34d',  // amber-300
  },
  
  /**
   * Nutrition category - Food, water, and supplements.
   * Examples: Water intake, calorie tracking, supplements
   */
  NUTRITION: {
    name: 'Nutrition',
    color: '#10b981',        // emerald-500
    bgColor: '#ecfdf5',      // emerald-50
    borderColor: '#6ee7b7',  // emerald-300
  },
  
  /**
   * Mental Wellness category - Mindfulness and mental health.
   * Examples: Meditation, journaling, reading, therapy
   */
  MENTAL: {
    name: 'Mental Wellness',
    color: '#3b82f6',        // blue-500
    bgColor: '#eff6ff',      // blue-50
    borderColor: '#93c5fd',  // blue-300
  },
  
  /**
   * Lifestyle category - Daily routines and general habits.
   * Examples: Sleep routines, phone usage, general habits
   */
  LIFESTYLE: {
    name: 'Lifestyle',
    color: '#8b5cf6',        // violet-500
    bgColor: '#f5f3ff',      // violet-50
    borderColor: '#c4b5fd',  // violet-300
  },
  
  /**
   * Avoidance category - Habits about avoiding things.
   * Examples: No alcohol, no smoking, no phone before bed
   */
  AVOIDANCE: {
    name: 'Avoidance',
    color: '#64748b',        // slate-500
    bgColor: '#f8fafc',      // slate-50
    borderColor: '#cbd5e1',  // slate-300
  },
}

// ============================================================================
// CATEGORY ASSIGNMENT
// ============================================================================

/**
 * Automatically assigns a category to a habit based on its name.
 * 
 * This function uses keyword matching to categorize habits.
 * The matching is case-insensitive and looks for keywords in
 * the habit name.
 * 
 * Category assignment logic:
 * - HEALTH: "teeth", "retainer"
 * - FITNESS: "weightlift", "gym", "exercise"
 * - NUTRITION: "water", "calories", "supplement"
 * - MENTAL: "meditate", "journal", "read"
 * - LIFESTYLE: "phone", "bed"
 * - AVOIDANCE: "alcohol", "weed", "no "
 * - Default: LIFESTYLE (if no match)
 * 
 * @param {string} habitName - The name of the habit
 * @returns {Object} Category object from HABIT_CATEGORIES
 * 
 * @example
 * const category = getCategoryForHabit('Brush Teeth')
 * // Returns: HABIT_CATEGORIES.HEALTH
 * 
 * @example
 * const category = getCategoryForHabit('Meditate Daily')
 * // Returns: HABIT_CATEGORIES.MENTAL
 */
export const getCategoryForHabit = (habitName) => {
  // Convert to lowercase for case-insensitive matching
  const name = habitName.toLowerCase()
  
  // Health category keywords
  if (name.includes('teeth') || name.includes('retainer')) {
    return HABIT_CATEGORIES.HEALTH
  }
  
  // Fitness category keywords
  if (name.includes('weightlift') || name.includes('gym') || name.includes('exercise')) {
    return HABIT_CATEGORIES.FITNESS
  }
  
  // Nutrition category keywords
  if (name.includes('water') || name.includes('calories') || name.includes('supplement')) {
    return HABIT_CATEGORIES.NUTRITION
  }
  
  // Mental wellness category keywords
  if (name.includes('meditate') || name.includes('journal') || name.includes('read')) {
    return HABIT_CATEGORIES.MENTAL
  }
  
  // Lifestyle category keywords
  if (name.includes('phone') || name.includes('bed')) {
    return HABIT_CATEGORIES.LIFESTYLE
  }
  
  // Avoidance category keywords
  if (name.includes('alcohol') || name.includes('weed') || name.includes('no ')) {
    return HABIT_CATEGORIES.AVOIDANCE
  }
  
  // Default to lifestyle if no match
  return HABIT_CATEGORIES.LIFESTYLE
}
