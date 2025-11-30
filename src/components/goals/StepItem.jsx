import { useState } from 'react'
import { isStepCompleted, completeStep } from '../../utils/goalStorage'
import './StepItem.css'

function StepItem({ step, goal, onUpdate }) {
  const [isAnimating, setIsAnimating] = useState(false)
  const todayKey = new Date().toDateString()
  const completed = isStepCompleted(step, todayKey)

  const handleToggle = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
    
    completeStep(step.id, todayKey)
    if (onUpdate) onUpdate()
  }

  const getFrequencyLabel = () => {
    switch (step.frequency) {
      case 'daily': return 'Daily'
      case 'weekly': return 'Weekly'
      case 'monthly': return 'Monthly'
      default: return 'One-time'
    }
  }

  const getFrequencyBadgeColor = () => {
    switch (step.frequency) {
      case 'daily': return '#3b82f6'
      case 'weekly': return '#8b5cf6'
      case 'monthly': return '#ec4899'
      default: return '#64748b'
    }
  }

  return (
    <div 
      className={`step-item ${completed ? 'completed' : ''} ${isAnimating ? 'animating' : ''}`}
      onClick={handleToggle}
    >
      <div className="step-checkbox">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => {}}
          readOnly
        />
        <span className="checkmark">✓</span>
      </div>
      
      <div className="step-content">
        <div className="step-title-row">
          <span className="step-title">{step.title}</span>
          <span 
            className="step-frequency-badge"
            style={{ backgroundColor: getFrequencyBadgeColor() }}
          >
            {getFrequencyLabel()}
          </span>
        </div>
        {step.amount && (
          <span className="step-amount">+{step.amount}{goal.unit ? ` ${goal.unit}` : ''}</span>
        )}
      </div>

      {completed && (
        <span className="step-celebration">✨</span>
      )}
    </div>
  )
}

export default StepItem
