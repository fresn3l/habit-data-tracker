import { useState, useEffect } from 'react'
import './ToDoForm.css'

function ToDoForm({ todo, onSave, onCancel }) {
  const [title, setTitle] = useState(todo?.title || '')
  const [description, setDescription] = useState(todo?.description || '')
  const [timeCommitment, setTimeCommitment] = useState(todo?.timeCommitment || 'short')
  const [urgency, setUrgency] = useState(todo?.urgency || 'medium')
  const [dueDate, setDueDate] = useState(todo?.dueDate || '')
  const [isRecurring, setIsRecurring] = useState(todo?.isRecurring || false)
  const [recurrencePattern, setRecurrencePattern] = useState(todo?.recurrencePattern || 'daily')
  const [recurrenceInterval, setRecurrenceInterval] = useState(todo?.recurrenceInterval || 1)
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(todo?.recurrenceEndDate || '')

  useEffect(() => {
    if (todo) {
      if (todo.dueDate) {
        // Format date for input (YYYY-MM-DD)
        const date = new Date(todo.dueDate)
        const formattedDate = date.toISOString().split('T')[0]
        setDueDate(formattedDate)
      }
      setIsRecurring(todo.isRecurring || false)
      setRecurrencePattern(todo.recurrencePattern || 'daily')
      setRecurrenceInterval(todo.recurrenceInterval || 1)
      if (todo.recurrenceEndDate) {
        const endDate = new Date(todo.recurrenceEndDate)
        const formattedEndDate = endDate.toISOString().split('T')[0]
        setRecurrenceEndDate(formattedEndDate)
      }
    }
  }, [todo])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const todoData = {
      ...todo,
      title: title.trim(),
      description: description.trim(),
      timeCommitment,
      urgency,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      completed: todo?.completed || false,
      updatedAt: new Date().toISOString(),
      isRecurring: isRecurring,
      recurrencePattern: isRecurring ? recurrencePattern : null,
      recurrenceInterval: isRecurring ? recurrenceInterval : null,
      recurrenceEndDate: isRecurring && recurrenceEndDate ? new Date(recurrenceEndDate).toISOString() : null,
    }

    if (!todoData.id) {
      todoData.id = Date.now().toString()
      todoData.createdAt = new Date().toISOString()
    }

    onSave(todoData)
  }

  return (
    <div className="todo-form-overlay" onClick={onCancel}>
      <div className="todo-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="todo-form-header">
          <h2>{todo ? 'Edit To Do' : 'Create New To Do'}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="todo-form">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Finish project report"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows="3"
              className="form-textarea"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Time Commitment</label>
              <select
                value={timeCommitment}
                onChange={(e) => setTimeCommitment(e.target.value)}
                className="form-input"
              >
                <option value="short">Short (&lt; 30 min)</option>
                <option value="medium">Medium (30 min - 2 hrs)</option>
                <option value="long">Long (2+ hrs)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Urgency</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="form-input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="form-input"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="form-checkbox"
              />
              <span>Make this recurring</span>
            </label>
          </div>

          {isRecurring && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Recurrence Pattern</label>
                  <select
                    value={recurrencePattern}
                    onChange={(e) => setRecurrencePattern(e.target.value)}
                    className="form-input"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Repeat Every</label>
                  <input
                    type="number"
                    min="1"
                    value={recurrenceInterval}
                    onChange={(e) => setRecurrenceInterval(parseInt(e.target.value) || 1)}
                    className="form-input"
                  />
                  <span className="form-hint">
                    {recurrencePattern === 'daily' ? 'day(s)' :
                     recurrencePattern === 'weekly' ? 'week(s)' :
                     recurrencePattern === 'monthly' ? 'month(s)' : 'year(s)'}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>End Date (Optional)</label>
                <input
                  type="date"
                  value={recurrenceEndDate}
                  onChange={(e) => setRecurrenceEndDate(e.target.value)}
                  className="form-input"
                  min={dueDate || new Date().toISOString().split('T')[0]}
                />
                <span className="form-hint">Leave empty for no end date</span>
              </div>
            </>
          )}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              {todo ? 'Update' : 'Create'} To Do
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ToDoForm
