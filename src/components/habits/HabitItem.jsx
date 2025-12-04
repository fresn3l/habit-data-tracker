import { useState } from 'react'
import StreakBadge from './StreakBadge'
import HabitDetailModal from './HabitDetailModal'
import { isReminderEnabled } from '../../utils/reminderStorage'
import './HabitItem.css'

function HabitItem({ habit, onToggle, onUpdate }) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const hasReminder = isReminderEnabled(habit.id)

  const handleToggle = (e) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
    if (onToggle) {
      onToggle(habit.id)
    }
  }

  const handleDetailClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setShowDetail(true)
  }

  const category = habit.category || { color: '#667eea', bgColor: '#f5f3ff', borderColor: '#c4b5fd' }
  
  return (
    <div 
      className={`habit-item ${habit.completed ? 'completed' : ''} ${isAnimating ? 'animating' : ''}`}
      onClick={(e) => {
        // Don't toggle if clicking the detail button, checkbox, or badges
        if (e.target.closest('.habit-detail-btn') || 
            e.target.closest('.habit-checkbox') ||
            e.target.closest('.habit-badges')) {
          return
        }
        handleToggle(e)
      }}
      style={{
        '--category-color': category.color,
        '--category-bg': category.bgColor,
        '--category-border': category.borderColor,
      }}
    >
      <div className="habit-checkbox" onClick={handleToggle}>
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
          {hasReminder && (
            <span className="habit-reminder-badge" title="Reminders enabled">
              🔔
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
