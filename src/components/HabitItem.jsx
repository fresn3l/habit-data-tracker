import { useState } from 'react'
import StreakBadge from './StreakBadge'
import HabitDetailModal from './HabitDetailModal'
import './HabitItem.css'

function HabitItem({ habit, onToggle, onUpdate }) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  const handleToggle = (e) => {
    e.stopPropagation()
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
    onToggle(habit.id)
  }

  const handleDetailClick = (e) => {
    e.stopPropagation()
    setShowDetail(true)
  }

  const category = habit.category || { color: '#667eea', bgColor: '#f5f3ff', borderColor: '#c4b5fd' }
  
  return (
    <div 
      className={`habit-item ${habit.completed ? 'completed' : ''} ${isAnimating ? 'animating' : ''}`}
      onClick={handleToggle}
      style={{
        '--category-color': category.color,
        '--category-bg': category.bgColor,
        '--category-border': category.borderColor,
      }}
    >
      <div className="habit-checkbox">
        <input
          type="checkbox"
          checked={habit.completed}
          onChange={() => {}}
          readOnly
        />
        <span className="checkmark">✓</span>
      </div>
      <div className="habit-content">
        <span className="habit-emoji">{habit.emoji}</span>
        <span className="habit-name">{habit.name}</span>
        <div className="habit-badges">
          {habit.timeOfDay && habit.timeOfDay !== 'anytime' && (
            <span className="habit-time-badge" data-time={habit.timeOfDay}>
              {habit.timeOfDay === 'morning' ? '🌅' : '🌙'} {habit.timeOfDay}
            </span>
          )}
          {habit.difficulty && (
            <span className="habit-difficulty-badge" title={`Difficulty: ${habit.difficulty}/5`}>
              {'⭐'.repeat(habit.difficulty)}
            </span>
          )}
          <span className="habit-category-badge" style={{ backgroundColor: category.bgColor, color: category.color }}>
            {category.name}
          </span>
        </div>
      </div>
      <div className="habit-right">
        {habit.completed && (
          <span className="habit-celebration">🎉</span>
        )}
        <StreakBadge habitId={habit.id} showLongest={false} />
        <button 
          className="habit-detail-btn"
          onClick={handleDetailClick}
          title="View details"
        >
          ⚙️
        </button>
      </div>

      {showDetail && (
        <HabitDetailModal
          habit={habit}
          onClose={() => setShowDetail(false)}
          onUpdate={onUpdate}
        />
      )}
    </div>
  )
}

export default HabitItem
