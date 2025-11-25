// Habit categories with color coding
export const HABIT_CATEGORIES = {
  HEALTH: {
    name: 'Health',
    color: '#ef4444', // red
    bgColor: '#fef2f2',
    borderColor: '#fca5a5',
  },
  FITNESS: {
    name: 'Fitness',
    color: '#f59e0b', // amber
    bgColor: '#fffbeb',
    borderColor: '#fcd34d',
  },
  NUTRITION: {
    name: 'Nutrition',
    color: '#10b981', // emerald
    bgColor: '#ecfdf5',
    borderColor: '#6ee7b7',
  },
  MENTAL: {
    name: 'Mental Wellness',
    color: '#3b82f6', // blue
    bgColor: '#eff6ff',
    borderColor: '#93c5fd',
  },
  LIFESTYLE: {
    name: 'Lifestyle',
    color: '#8b5cf6', // violet
    bgColor: '#f5f3ff',
    borderColor: '#c4b5fd',
  },
  AVOIDANCE: {
    name: 'Avoidance',
    color: '#64748b', // slate
    bgColor: '#f8fafc',
    borderColor: '#cbd5e1',
  },
}

export const getCategoryForHabit = (habitName) => {
  const name = habitName.toLowerCase()
  
  if (name.includes('teeth') || name.includes('retainer')) {
    return HABIT_CATEGORIES.HEALTH
  }
  if (name.includes('weightlift') || name.includes('gym') || name.includes('exercise')) {
    return HABIT_CATEGORIES.FITNESS
  }
  if (name.includes('water') || name.includes('calories') || name.includes('supplement')) {
    return HABIT_CATEGORIES.NUTRITION
  }
  if (name.includes('meditate') || name.includes('journal') || name.includes('read')) {
    return HABIT_CATEGORIES.MENTAL
  }
  if (name.includes('phone') || name.includes('bed')) {
    return HABIT_CATEGORIES.LIFESTYLE
  }
  if (name.includes('alcohol') || name.includes('weed') || name.includes('no ')) {
    return HABIT_CATEGORIES.AVOIDANCE
  }
  
  return HABIT_CATEGORIES.LIFESTYLE // default
}
