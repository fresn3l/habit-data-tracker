import { useState, useEffect } from 'react'
import ReminderSettings from '../forms/ReminderSettings'
import { getDayData, getTodayKey } from '../../utils/dataStorage'
import { isReminderEnabled } from '../../utils/reminderStorage'
import './HabitDetailModal.css'

function HabitDetailModal({ habit, onClose, onUpdate }) {
  const [showReminderSettings, setShowReminderSettings] = useState(false)
  const [hasReminder, setHasReminder] = useState(false)

  useEffect(() => {
    // Check if reminder is enabled
    setHasReminder(isReminderEnabled(habit.id))
  }, [habit])

  return (
    <div className="habit-detail-overlay" onClick={onClose}>
      <div className="habit-detail-container" onClick={(e) => e.stopPropagation()}>
        <div className="habit-detail-header">
          <div className="habit-detail-title">
            <span className="habit-emoji-large">{habit.emoji}</span>
            <h2>{habit.name}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="habit-detail-content">
          <div className="detail-section">
            <h3>Reminders {hasReminder && <span className="reminder-enabled">🔔</span>}</h3>
            {!showReminderSettings ? (
              <button 
                className="btn-track-time"
                onClick={() => setShowReminderSettings(true)}
              >
                {hasReminder ? 'Edit Reminders' : 'Set Up Reminders'}
              </button>
            ) : (
              <ReminderSettings
                habitId={habit.id}
                onClose={() => {
                  setShowReminderSettings(false)
                  setHasReminder(isReminderEnabled(habit.id))
                }}
                onSave={() => {
                  setHasReminder(isReminderEnabled(habit.id))
                }}
              />
            )}
            <p className="detail-help">
              Get notified when it's time to complete this habit
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HabitDetailModal
