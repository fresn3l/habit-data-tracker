import GoalItem from '../components/goals/GoalItem'
import GoalForm from '../components/goals/GoalForm'
import { useGoals } from '../hooks/useGoals'
import './GoalsPage.css'

/**
 * Goals Page Component
 * 
 * Displays and manages user goals. Uses the useGoals custom hook
 * for all goal-related state and operations.
 * 
 * @component
 * @returns {JSX.Element} Goals page component
 */
function GoalsPage() {
  const {
    goals,
    showForm: showGoalForm,
    editingGoal,
    handleSave: handleGoalSave,
    handleDelete: handleGoalDelete,
    handleEdit: handleGoalEdit,
    handleNew: handleNewGoal,
    closeForm,
  } = useGoals()

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
          onCancel={closeForm}
        />
      )}
    </>
  )
}

export default GoalsPage
