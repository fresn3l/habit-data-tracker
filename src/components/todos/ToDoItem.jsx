import { useState } from 'react'
import { getRecurrenceLabel, calculateNextOccurrence } from '../utils/recurrenceUtils'
import './ToDoItem.css'

function ToDoItem({ todo, onToggle, onEdit, onDelete }) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
    if (onToggle) onToggle(todo.id)
  }

  const isOverdue = () => {
    if (todo.completed || !todo.dueDate) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(todo.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate < today
  }

  const getDaysUntilDue = () => {
    if (!todo.dueDate) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(todo.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    const diffTime = dueDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getUrgencyColor = () => {
    if (isOverdue()) return '#dc2626'
    switch (todo.urgency) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getTimeCommitmentIcon = () => {
    switch (todo.timeCommitment) {
      case 'short': return '⚡'
      case 'medium': return '⏱️'
      case 'long': return '🕐'
      default: return '⏰'
    }
  }

  const dueDateText = () => {
    if (!todo.dueDate) return null
    const days = getDaysUntilDue()
    if (days < 0) return 'Overdue!'
    if (days === 0) return 'Due today!'
    if (days === 1) return 'Due tomorrow'
    return `Due in ${days} days`
  }

  return (
    <div 
      className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue() ? 'overdue' : ''} ${isAnimating ? 'animating' : ''}`}
    >
      <div className="todo-content" onClick={handleToggle}>
        <div className="todo-checkbox">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => {}}
            readOnly
          />
          <span className="checkmark">✓</span>
        </div>

        <div className="todo-info">
          <div className="todo-title-row">
            <h3 className="todo-title">{todo.title}</h3>
            <span 
              className="urgency-badge"
              style={{ backgroundColor: getUrgencyColor() }}
            >
              {todo.urgency}
            </span>
          </div>
          
          {todo.description && (
            <p className="todo-description">{todo.description}</p>
          )}

          <div className="todo-meta">
            <span className="time-commitment">
              {getTimeCommitmentIcon()} {todo.timeCommitment}
            </span>
            {todo.isRecurring && !todo.isRecurringInstance && (
              <span className="recurrence-indicator" title={getRecurrenceLabel(todo)}>
                🔄 {getRecurrenceLabel(todo)}
              </span>
            )}
            {todo.dueDate && (
              <span className={`due-date ${isOverdue() ? 'overdue-text' : ''}`}>
                {dueDateText()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="todo-actions">
        <button 
          className="todo-action-btn"
          onClick={(e) => { e.stopPropagation(); onEdit(todo); }}
          title="Edit"
        >
          ✏️
        </button>
        <button 
          className="todo-action-btn"
          onClick={(e) => { e.stopPropagation(); onDelete(todo.id); }}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

export default ToDoItem
