import { useState, useEffect } from 'react'
import { getAllTodos, saveTodo, deleteTodo } from '../../utils/todoStorage'
import { calculateNextOccurrence, getRecurrenceLabel } from '../../utils/recurrenceUtils'
import ToDoForm from './ToDoForm'
import './RecurrenceManager.css'

function RecurrenceManager({ onClose }) {
  const [recurringTodos, setRecurringTodos] = useState([])
  const [editingTodo, setEditingTodo] = useState(null)
  const [pausedTodos, setPausedTodos] = useState(new Set())

  useEffect(() => {
    loadRecurringTodos()
    loadPausedState()
  }, [])

  const loadRecurringTodos = () => {
    const allTodos = getAllTodos()
    const recurring = allTodos.filter(t => 
      t.isRecurring && !t.isRecurringInstance
    )
    setRecurringTodos(recurring)
  }

  const loadPausedState = () => {
    try {
      const paused = localStorage.getItem('paused-recurring-todos')
      if (paused) {
        setPausedTodos(new Set(JSON.parse(paused)))
      }
    } catch (error) {
      console.error('Error loading paused state:', error)
    }
  }

  const savePausedState = (pausedSet) => {
    localStorage.setItem('paused-recurring-todos', JSON.stringify([...pausedSet]))
  }

  const handlePause = (todoId) => {
    const newPaused = new Set(pausedTodos)
    newPaused.add(todoId)
    setPausedTodos(newPaused)
    savePausedState(newPaused)
  }

  const handleResume = (todoId) => {
    const newPaused = new Set(pausedTodos)
    newPaused.delete(todoId)
    setPausedTodos(newPaused)
    savePausedState(newPaused)
  }

  const handleDelete = (todoId) => {
    if (window.confirm('Delete this recurring todo series? This will not delete existing instances.')) {
      deleteTodo(todoId)
      loadRecurringTodos()
    }
  }

  const handleSave = (todo) => {
    saveTodo(todo)
    setEditingTodo(null)
    loadRecurringTodos()
  }

  const getNextOccurrence = (todo) => {
    if (pausedTodos.has(todo.id)) return 'Paused'
    const next = calculateNextOccurrence(todo)
    return next ? new Date(next).toLocaleDateString() : 'No more occurrences'
  }

  return (
    <div className="recurrence-manager-overlay" onClick={onClose}>
      <div className="recurrence-manager-container" onClick={(e) => e.stopPropagation()}>
        <div className="recurrence-manager-header">
          <h2>🔄 Recurring Todos</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="recurrence-manager-content">
          {recurringTodos.length === 0 ? (
            <div className="no-recurring-todos">
              <p>No recurring todos yet.</p>
              <p className="hint">Create a todo and enable "Make this recurring" to see it here.</p>
            </div>
          ) : (
            <div className="recurring-todos-list">
              {recurringTodos.map(todo => (
                <div key={todo.id} className="recurring-todo-item">
                  <div className="recurring-todo-info">
                    <h3>{todo.title}</h3>
                    <div className="recurring-todo-meta">
                      <span className="recurrence-label">{getRecurrenceLabel(todo)}</span>
                      <span className="next-occurrence">Next: {getNextOccurrence(todo)}</span>
                    </div>
                    {todo.description && (
                      <p className="recurring-todo-desc">{todo.description}</p>
                    )}
                  </div>
                  <div className="recurring-todo-actions">
                    {pausedTodos.has(todo.id) ? (
                      <button 
                        className="btn-resume"
                        onClick={() => handleResume(todo.id)}
                      >
                        ▶ Resume
                      </button>
                    ) : (
                      <button 
                        className="btn-pause"
                        onClick={() => handlePause(todo.id)}
                      >
                        ⏸ Pause
                      </button>
                    )}
                    <button 
                      className="btn-edit"
                      onClick={() => setEditingTodo(todo)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(todo.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {editingTodo && (
        <ToDoForm
          todo={editingTodo}
          onSave={handleSave}
          onCancel={() => setEditingTodo(null)}
        />
      )}
    </div>
  )
}

export default RecurrenceManager

