import { useState } from 'react'
import StepItem from './StepItem'
import StepForm from './StepForm'
import { getStepsForGoal, calculateGoalProgress, deleteGoalStep, saveGoalStep } from '../utils/goalStorage'
import './GoalItem.css'

function GoalItem({ goal, onUpdate, onEdit, onDelete }) {
  const [steps, setSteps] = useState(getStepsForGoal(goal.id))
  const [showStepForm, setShowStepForm] = useState(false)
  const [editingStep, setEditingStep] = useState(null)
  const [expanded, setExpanded] = useState(true)
  
  const progress = calculateGoalProgress(goal)

  const handleStepAdded = () => {
    setSteps(getStepsForGoal(goal.id))
    setShowStepForm(false)
    setEditingStep(null)
    if (onUpdate) onUpdate()
  }

  const handleStepSave = (stepData) => {
    if (!stepData.id) {
      stepData.id = Date.now().toString()
      stepData.createdAt = new Date().toISOString()
      stepData.completions = []
    }
    saveGoalStep(stepData)
    handleStepAdded()
  }

  const handleStepDelete = (stepId) => {
    if (window.confirm('Are you sure you want to delete this step?')) {
      deleteGoalStep(stepId)
      setSteps(getStepsForGoal(goal.id))
      if (onUpdate) onUpdate()
    }
  }

  const handleStepEdit = (step) => {
    setEditingStep(step)
    setShowStepForm(true)
  }

  const getProgressColor = () => {
    if (progress.percentage >= 100) return '#22c55e'
    if (progress.percentage >= 50) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="goal-item">
      <div className="goal-header" onClick={() => setExpanded(!expanded)}>
        <div className="goal-title-section">
          <span className="goal-emoji">{goal.emoji || '🎯'}</span>
          <div className="goal-info">
            <h3 className="goal-title">{goal.title}</h3>
            {goal.description && (
              <p className="goal-description">{goal.description}</p>
            )}
          </div>
        </div>
        
        <div className="goal-progress-section">
          {goal.targetAmount && (
            <div className="goal-target">
              Target: {goal.targetAmount}{goal.unit ? ` ${goal.unit}` : ''}
            </div>
          )}
          <div className="goal-progress">
            <div className="progress-circle" style={{ '--progress': progress.percentage, '--color': getProgressColor() }}>
              <span className="progress-percentage">{progress.percentage}%</span>
            </div>
          </div>
        </div>

        <button 
          className="goal-expand-btn"
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
        >
          {expanded ? '▼' : '▶'}
        </button>
      </div>

      {expanded && (
        <div className="goal-body">
          <div className="goal-actions">
            <button 
              className="action-btn add-step-btn"
              onClick={() => { setEditingStep(null); setShowStepForm(true); }}
            >
              + Add Step
            </button>
            <button 
              className="action-btn edit-btn"
              onClick={() => onEdit(goal)}
            >
              Edit
            </button>
            <button 
              className="action-btn delete-btn"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this goal?')) {
                  onDelete(goal.id)
                }
              }}
            >
              Delete
            </button>
          </div>

          <div className="steps-container">
            {steps.length === 0 ? (
              <div className="no-steps">
                <p>No steps yet. Add a step to start tracking progress!</p>
              </div>
            ) : (
              steps.map(step => (
                <div key={step.id} className="step-wrapper">
                  <StepItem 
                    step={step} 
                    goal={goal}
                    onUpdate={handleStepAdded}
                  />
                  <div className="step-actions">
                    <button 
                      className="step-action-btn"
                      onClick={() => handleStepEdit(step)}
                    >
                      ✏️
                    </button>
                    <button 
                      className="step-action-btn"
                      onClick={() => handleStepDelete(step.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showStepForm && (
        <StepForm
          step={editingStep}
          goal={goal}
          onSave={handleStepSave}
          onCancel={() => { setShowStepForm(false); setEditingStep(null); }}
        />
      )}
    </div>
  )
}

export default GoalItem
