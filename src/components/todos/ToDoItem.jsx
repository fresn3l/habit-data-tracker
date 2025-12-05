/**
 * To Do Item Component
 * 
 * Displays a single todo item with:
 * - Priority badge (Now, Next, Later)
 * - Linked goal indicator (if linked)
 * - Completion checkbox
 * - Time commitment
 * - Due date
 * - Recurrence indicator
 * 
 * @module components/todos/ToDoItem
 * @component
 */

import { useState } from 'react'
import { getRecurrenceLabel, calculateNextOccurrence } from '../../utils/recurrenceUtils'
import { getAllGoals } from '../../utils/goalStorage'
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

  /**
   * Get priority badge color based on priority level.
   * Now = red, Next = orange, Later = blue
   */
  const getPriorityColor = () => {
    if (isOverdue()) return '#dc2626'
    switch (todo.priority) {
      case 'now': return '#ef4444'      // Red for "Now"
      case 'next': return '#f59e0b'     // Orange for "Next"
      case 'later': return '#3b82f6'    // Blue for "Later"
      default: return '#6b7280'
    }
  }

  /**
   * Get priority label for display.
   */
  const getPriorityLabel = () => {
    switch (todo.priority) {
      case 'now': return 'Now'
      case 'next': return 'Next'
      case 'later': return 'Later'
      default: return todo.priority || 'Next'
    }
  }

  /**
   * Get linked goal if todo is linked to a goal.
   */
  const getLinkedGoal = () => {
    if (!todo.linkedGoalId) return null
    const goals = getAllGoals()
    return goals.find(g => g.id === todo.linkedGoalId)
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

  const linkedGoal = getLinkedGoal()

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
              className="priority-badge"
              style={{ backgroundColor: getPriorityColor() }}
            >
              {getPriorityLabel()}
            </span>
          </div>
          
          {todo.description && (
            <p className="todo-description">{todo.description}</p>
          )}

          <div className="todo-meta">
            {linkedGoal && (
              <span className="linked-goal-badge" title={`Linked to goal: ${linkedGoal.title}`}>
                🎯 {linkedGoal.emoji || ''} {linkedGoal.title}
              </span>
            )}
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
