// Time-based utilities for greetings and habit filtering

export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 12) {
    return {
      message: "Good morning! What habits are we taking care of now?",
      emoji: "🌅",
      period: "morning"
    }
  } else if (hour >= 12 && hour < 17) {
    return {
      message: "Good afternoon! Let's keep up those good habits!",
      emoji: "☀️",
      period: "afternoon"
    }
  } else if (hour >= 17 && hour < 22) {
    return {
      message: "Good evening! Time for your evening habits!",
      emoji: "🌆",
      period: "evening"
    }
  } else {
    return {
      message: "Late night! Don't forget your nighttime habits!",
      emoji: "🌙",
      period: "night"
    }
  }
}

export const getCurrentTimePeriod = () => {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 12) {
    return 'morning'
  } else if (hour >= 17 && hour < 22) {
    return 'night'
  } else if (hour >= 22 || hour < 5) {
    return 'night'
  } else {
    return 'anytime' // afternoon can be either
  }
}

export const shouldShowHabit = (habit, timePeriod) => {
  if (!habit.timeOfDay || habit.timeOfDay === 'anytime') {
    return true
  }
  
  if (timePeriod === 'afternoon') {
    // Show both morning and night habits in afternoon
    return true
  }
  
  return habit.timeOfDay === timePeriod
}
