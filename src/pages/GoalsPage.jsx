import { useState, useEffect } from 'react'
import GoalItem from '../components/GoalItem'
import GoalForm from '../components/GoalForm'
import { getAllGoals, saveGoal, deleteGoal } from '../utils/goalStorage'
import './GoalsPage.css'

function GoalsPage() {
  const [goals, setGoals] = useState([])
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = () => {
    setGoals(getAllGoals())
  }

  const handleGoalSave = (goalData) => {
    if (!goalData.id) {
      goalData.id = Date.now().toString()
      goalData.createdAt = new Date().toISOString()
    }
    saveGoal(goalData)
    loadGoals()
    setShowGoalForm(false)
    setEditingGoal(null)
  }

  const handleGoalEdit = (goal) => {
    setEditingGoal(goal)
    setShowGoalForm(true)
  }

  const handleGoalDelete = (goalId) => {
    deleteGoal(goalId)
    loadGoals()
  }

  const handleNewGoal = () => {
    setEditingGoal(null)
    setShowGoalForm(true)
  }

  return (
    <>
      <div className="goals-header">
        <div className="goals-header-content">
          <h2>My Goals</h2>
          <button className="create-goal-btn" onClick={handleNewGoal}>
            + Create Goal
          </button>
        </div>
        {goals.length > 0 && (
          <p className="goals-count">
            {goals.length} {goals.length === 1 ? 'goal' : 'goals'} in progress
          </p>
        )}
      </div>

      <div className="goals-container">
        {goals.length === 0 ? (
          <div className="empty-goals">
            <div className="empty-goals-icon">🎯</div>
            <h3>No goals yet</h3>
            <p>Create your first goal to start tracking your progress!</p>
            <button className="create-goal-btn-large" onClick={handleNewGoal}>
              + Create Your First Goal
            </button>
          </div>
        ) : (
          goals.map(goal => (
            <GoalItem
              key={goal.id}
              goal={goal}
              onUpdate={loadGoals}
              onEdit={handleGoalEdit}
              onDelete={handleGoalDelete}
            />
          ))
        )}
      </div>

      {showGoalForm && (
        <GoalForm
          goal={editingGoal}
          onSave={handleGoalSave}
          onCancel={() => { setShowGoalForm(false); setEditingGoal(null); }}
        />
      )}
    </>
  )
}

export default GoalsPage
