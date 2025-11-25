// Recurring todo utilities

export const calculateNextOccurrence = (todo) => {
  if (!todo.isRecurring || !todo.recurrencePattern) {
    return null
  }

  const now = new Date()
  // Use last completed date or original due date
  const lastDue = todo.completedAt 
    ? new Date(todo.completedAt)
    : todo.dueDate 
    ? new Date(todo.dueDate)
    : now
  const interval = todo.recurrenceInterval || 1

  let nextDate = new Date(lastDue)

  switch (todo.recurrencePattern) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + interval)
      break
    
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + (7 * interval))
      break
    
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + interval)
      // Handle month end edge cases
      if (nextDate.getDate() !== lastDue.getDate()) {
        nextDate.setDate(0) // Set to last day of month
      }
      break
    
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + interval)
      break
    
    default:
      return null
  }

  // Check if recurrence has ended
  if (todo.recurrenceEndDate) {
    const endDate = new Date(todo.recurrenceEndDate)
    if (nextDate > endDate) {
      return null
    }
  }

  return nextDate
}

export const shouldGenerateNext = (todo) => {
  if (!todo.isRecurring || !todo.recurrencePattern) return false
  
  // Check paused state
  try {
    const paused = localStorage.getItem('paused-recurring-todos')
    if (paused) {
      const pausedSet = new Set(JSON.parse(paused))
      if (pausedSet.has(todo.id)) return false
    }
  } catch (e) {
    // Ignore errors
  }
  
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  
  // If todo is completed, generate next one
  if (todo.completed && todo.dueDate) {
    const dueDate = new Date(todo.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    
    if (dueDate <= now) {
      return true
    }
  }
  
  // If not completed but due date has passed, also generate
  if (!todo.completed && todo.dueDate) {
    const dueDate = new Date(todo.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    
    if (dueDate < now) {
      return true
    }
  }
  
  return false
}

export const generateRecurringTodo = (templateTodo) => {
  const nextDue = calculateNextOccurrence(templateTodo)
  
  if (!nextDue) return null

  // Check if recurrence has ended
  if (templateTodo.recurrenceEndDate) {
    const endDate = new Date(templateTodo.recurrenceEndDate)
    endDate.setHours(23, 59, 59, 999)
    if (nextDue > endDate) {
      return null
    }
  }

  const newTodo = {
    id: `${templateTodo.id}-${Date.now()}`,
    title: templateTodo.title,
    description: templateTodo.description,
    timeCommitment: templateTodo.timeCommitment,
    urgency: templateTodo.urgency,
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: nextDue.toISOString(),
    originalRecurringId: templateTodo.id,
    isRecurringInstance: true,
    // Don't copy recurrence fields to instances
    isRecurring: false,
  }

  return newTodo
}

export const getRecurrenceLabel = (todo) => {
  if (!todo.isRecurring) return ''
  
  const pattern = todo.recurrencePattern || 'daily'
  const interval = todo.recurrenceInterval || 1
  
  const labels = {
    daily: interval === 1 ? 'Daily' : `Every ${interval} days`,
    weekly: interval === 1 ? 'Weekly' : `Every ${interval} weeks`,
    monthly: interval === 1 ? 'Monthly' : `Every ${interval} months`,
    yearly: interval === 1 ? 'Yearly' : `Every ${interval} years`
  }
  
  return labels[pattern] || 'Recurring'
}

