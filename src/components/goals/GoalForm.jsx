import { useState } from 'react'
import './GoalForm.css'

function GoalForm({ goal, onSave, onCancel }) {
  const [title, setTitle] = useState(goal?.title || '')
  const [description, setDescription] = useState(goal?.description || '')
  const [targetAmount, setTargetAmount] = useState(goal?.targetAmount || '')
  const [unit, setUnit] = useState(goal?.unit || '')
  const [emoji, setEmoji] = useState(goal?.emoji || '🎯')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const goalData = {
      ...goal,
      title: title.trim(),
      description: description.trim(),
      targetAmount: targetAmount ? parseFloat(targetAmount) : null,
      unit: unit.trim(),
      emoji: emoji || '🎯',
      updatedAt: new Date().toISOString(),
    }

    onSave(goalData)
  }

  return (
    <div className="goal-form-overlay" onClick={onCancel}>
      <div className="goal-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="goal-form-header">
          <h2>{goal ? 'Edit Goal' : 'Create New Goal'}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="goal-form">
          <div className="form-group">
            <label>Emoji</label>
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="🎯"
              maxLength="2"
              className="emoji-input"
            />
          </div>

          <div className="form-group">
            <label>Goal Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Save Money"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your goal..."
              rows="3"
              className="form-textarea"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Target Amount</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="300"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Unit</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="dollars, pounds, etc."
                className="form-input"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              {goal ? 'Update' : 'Create'} Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GoalForm
