import { useState } from 'react'
import './StepForm.css'

function StepForm({ step, goal, onSave, onCancel }) {
  const [title, setTitle] = useState(step?.title || '')
  const [amount, setAmount] = useState(step?.amount || '')
  const [frequency, setFrequency] = useState(step?.frequency || 'one-time')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const stepData = {
      ...step,
      goalId: goal.id,
      title: title.trim(),
      amount: amount ? parseFloat(amount) : null,
      frequency: frequency,
      updatedAt: new Date().toISOString(),
    }

    onSave(stepData)
  }

  return (
    <div className="step-form-overlay" onClick={onCancel}>
      <div className="step-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="step-form-header">
          <h3>{step ? 'Edit Step' : 'Add Step to Goal'}</h3>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="step-form">
          <div className="form-group">
            <label>Step Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`e.g., Save $50`}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Amount (optional)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="50"
              className="form-input"
            />
            <small>Amount that adds to your goal progress</small>
          </div>

          <div className="form-group">
            <label>Frequency *</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="form-input"
            >
              <option value="one-time">One-time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <small>
              {frequency === 'one-time' && 'Complete once to add progress'}
              {frequency === 'daily' && 'Complete each day to add progress'}
              {frequency === 'weekly' && 'Complete once per week to add progress'}
              {frequency === 'monthly' && 'Complete once per month to add progress'}
            </small>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              {step ? 'Update' : 'Add'} Step
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StepForm
