// Goal storage utilities

export const GOALS_STORAGE_KEY = 'goals-data'
export const GOAL_STEPS_STORAGE_KEY = 'goal-steps-data'

export const getAllGoals = () => {
  try {
    const data = localStorage.getItem(GOALS_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading goals:', error)
    return []
  }
}

export const saveGoal = (goal) => {
  const goals = getAllGoals()
  const existingIndex = goals.findIndex(g => g.id === goal.id)
  
  if (existingIndex >= 0) {
    goals[existingIndex] = goal
  } else {
    goals.push(goal)
  }
  
  localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals))
  return goal
}

export const deleteGoal = (goalId) => {
  const goals = getAllGoals().filter(g => g.id !== goalId)
  localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals))
  
  // Also delete all steps for this goal
  const steps = getAllGoalSteps().filter(s => s.goalId !== goalId)
  localStorage.setItem(GOAL_STEPS_STORAGE_KEY, JSON.stringify(steps))
}

export const getAllGoalSteps = () => {
  try {
    const data = localStorage.getItem(GOAL_STEPS_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading goal steps:', error)
    return []
  }
}

export const getStepsForGoal = (goalId) => {
  const allSteps = getAllGoalSteps()
  return allSteps.filter(s => s.goalId === goalId)
}

export const saveGoalStep = (step) => {
  const steps = getAllGoalSteps()
  const existingIndex = steps.findIndex(s => s.id === step.id)
  
  if (existingIndex >= 0) {
    steps[existingIndex] = step
  } else {
    steps.push(step)
  }
  
  localStorage.setItem(GOAL_STEPS_STORAGE_KEY, JSON.stringify(steps))
  return step
}

export const deleteGoalStep = (stepId) => {
  const steps = getAllGoalSteps().filter(s => s.id !== stepId)
  localStorage.setItem(GOAL_STEPS_STORAGE_KEY, JSON.stringify(steps))
}

export const completeStep = (stepId, dateKey = null) => {
  const todayKey = dateKey || new Date().toDateString()
  const steps = getAllGoalSteps()
  const step = steps.find(s => s.id === stepId)
  
  if (!step) return null
  
  if (!step.completions) {
    step.completions = []
  }
  
  // Check if already completed today (for daily steps)
  if (step.frequency === 'daily') {
    const todayCompletion = step.completions.find(c => c.date === todayKey)
    if (todayCompletion) {
      // Remove completion (toggle off)
      step.completions = step.completions.filter(c => c.date !== todayKey)
    } else {
      // Add completion
      step.completions.push({ date: todayKey, timestamp: new Date().toISOString() })
    }
  } else if (step.frequency === 'weekly') {
    // For weekly, find the week this date belongs to
    const date = new Date(todayKey)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    const weekKey = weekStart.toDateString()
    
    const weekCompletion = step.completions.find(c => {
      const cDate = new Date(c.date)
      const cWeekStart = new Date(cDate)
      cWeekStart.setDate(cDate.getDate() - cDate.getDay())
      return cWeekStart.toDateString() === weekKey
    })
    
    if (weekCompletion) {
      step.completions = step.completions.filter(c => {
        const cDate = new Date(c.date)
        const cWeekStart = new Date(cDate)
        cWeekStart.setDate(cDate.getDate() - cDate.getDay())
        return cWeekStart.toDateString() !== weekKey
      })
    } else {
      step.completions.push({ date: todayKey, timestamp: new Date().toISOString() })
    }
  } else if (step.frequency === 'monthly') {
    // For monthly, find the month this date belongs to
    const date = new Date(todayKey)
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`
    
    const monthCompletion = step.completions.find(c => {
      const cDate = new Date(c.date)
      return `${cDate.getFullYear()}-${cDate.getMonth()}` === monthKey
    })
    
    if (monthCompletion) {
      step.completions = step.completions.filter(c => {
        const cDate = new Date(c.date)
        return `${cDate.getFullYear()}-${cDate.getMonth()}` !== monthKey
      })
    } else {
      step.completions.push({ date: todayKey, timestamp: new Date().toISOString() })
    }
  } else {
    // One-time step
    const hasCompletion = step.completions.length > 0
    if (hasCompletion) {
      step.completions = []
    } else {
      step.completions.push({ date: todayKey, timestamp: new Date().toISOString() })
    }
  }
  
  saveGoalStep(step)
  return step
}

export const isStepCompleted = (step, dateKey = null) => {
  if (!step.completions || step.completions.length === 0) return false
  
  const todayKey = dateKey || new Date().toDateString()
  
  if (step.frequency === 'daily') {
    return step.completions.some(c => c.date === todayKey)
  } else if (step.frequency === 'weekly') {
    const date = new Date(todayKey)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    const weekKey = weekStart.toDateString()
    
    return step.completions.some(c => {
      const cDate = new Date(c.date)
      const cWeekStart = new Date(cDate)
      cWeekStart.setDate(cDate.getDate() - cDate.getDay())
      return cWeekStart.toDateString() === weekKey
    })
  } else if (step.frequency === 'monthly') {
    const date = new Date(todayKey)
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`
    
    return step.completions.some(c => {
      const cDate = new Date(c.date)
      return `${cDate.getFullYear()}-${cDate.getMonth()}` === monthKey
    })
  } else {
    // One-time step
    return step.completions.length > 0
  }
}

export const calculateGoalProgress = (goal) => {
  const steps = getStepsForGoal(goal.id)
  if (steps.length === 0) return { progress: 0, total: 0, percentage: 0 }
  
  const todayKey = new Date().toDateString()
  const completedSteps = steps.filter(step => isStepCompleted(step, todayKey))
  
  return {
    progress: completedSteps.length,
    total: steps.length,
    percentage: Math.round((completedSteps.length / steps.length) * 100)
  }
}
