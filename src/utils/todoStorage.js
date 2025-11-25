// Todo storage utilities

export const TODOS_STORAGE_KEY = 'todos-data'

export const getAllTodos = () => {
  try {
    const data = localStorage.getItem(TODOS_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading todos:', error)
    return []
  }
}

export const saveTodo = (todo) => {
  const todos = getAllTodos()
  const existingIndex = todos.findIndex(t => t.id === todo.id)
  
  if (existingIndex >= 0) {
    todos[existingIndex] = todo
  } else {
    todos.push(todo)
  }
  
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos))
  return todo
}

export const deleteTodo = (todoId) => {
  const todos = getAllTodos().filter(t => t.id !== todoId)
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos))
}

export const toggleTodoComplete = (todoId) => {
  const todos = getAllTodos()
  const todo = todos.find(t => t.id === todoId)
  if (todo) {
    const wasCompleted = todo.completed
    todo.completed = !todo.completed
    
    if (!wasCompleted && todo.completed) {
      // Just completed - set completion time
      todo.completedAt = new Date().toISOString()
      
      // Calculate time to completion in hours
      if (todo.createdAt) {
        const createdAt = new Date(todo.createdAt)
        const completedAt = new Date(todo.completedAt)
        const hoursDiff = (completedAt - createdAt) / (1000 * 60 * 60)
        todo.timeToCompletion = hoursDiff
      }
    } else if (wasCompleted && !todo.completed) {
      // Uncompleted - clear completion data
      todo.completedAt = null
      todo.timeToCompletion = null
    }
    
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos))
  }
  return todo
}

export const getTodosByPriority = (todos) => {
  return [...todos].sort((a, b) => {
    // Sort by completion first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    
    // Then by urgency (high > medium > low)
    const urgencyOrder = { high: 3, medium: 2, low: 1 }
    if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency]
    }
    
    // Then by due date (soonest first)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate)
    }
    if (a.dueDate && !b.dueDate) return -1
    if (!a.dueDate && b.dueDate) return 1
    
    return 0
  })
}

export const getOverdueTodos = (todos) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return todos.filter(todo => {
    if (todo.completed || !todo.dueDate) return false
    const dueDate = new Date(todo.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate < today
  })
}
