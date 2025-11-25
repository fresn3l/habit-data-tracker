import { useState, useEffect } from 'react'
import DifficultySelector from './DifficultySelector'
import TimeTracker from './TimeTracker'
import ReminderSettings from './ReminderSettings'
import { saveDayData, getDayData, getTodayKey } from '../utils/dataStorage'
import { isReminderEnabled } from '../utils/reminderStorage'
import './HabitDetailModal.css'

function HabitDetailModal({ habit, onClose, onUpdate }) {
  const [difficulty, setDifficulty] = useState(habit.difficulty || null)
  const [timeSpent, setTimeSpent] = useState(null)
  const [showTimeTracker, setShowTimeTracker] = useState(false)
  const [showReminderSettings, setShowReminderSettings] = useState(false)
  const [hasReminder, setHasReminder] = useState(false)

  useEffect(() => {
    // Load today's time if available
    const todayKey = getTodayKey()
    const todayData = getDayData(todayKey)
    if (todayData && todayData.habits) {
      const todayHabit = todayData.habits.find(h => h.id === habit.id)
      if (todayHabit && todayHabit.actualTimeSpent) {
        setTimeSpent(todayHabit.actualTimeSpent)
      }
    }
    
    // Check if reminder is enabled
    setHasReminder(isReminderEnabled(habit.id))
  }, [habit])

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty)
    // Update habit in today's data
    const todayKey = getTodayKey()
    const todayData = getDayData(todayKey)
    if (todayData && todayData.habits) {
      const updatedHabits = todayData.habits.map(h => 
        h.id === habit.id ? { ...h, difficulty: newDifficulty } : h
      )
      saveDayData(todayKey, updatedHabits, todayData.weight)
      if (onUpdate) onUpdate()
    }
  }

  const handleTimeRecorded = (minutes) => {
    setTimeSpent(minutes)
    // Update habit in today's data
    const todayKey = getTodayKey()
    const todayData = getDayData(todayKey)
    if (todayData && todayData.habits) {
      const updatedHabits = todayData.habits.map(h => 
        h.id === habit.id ? { ...h, actualTimeSpent: minutes } : h
      )
      saveDayData(todayKey, updatedHabits, todayData.weight)
      if (onUpdate) onUpdate()
    }
    setShowTimeTracker(false)
  }

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
            <h3>Difficulty Rating</h3>
            <DifficultySelector 
              difficulty={difficulty} 
              onSelect={handleDifficultyChange}
            />
            <p className="detail-help">
              Rate how difficult this habit feels to complete
            </p>
          </div>

          <div className="detail-section">
            <h3>Time Tracking</h3>
            {timeSpent && (
              <div className="time-display">
                <span className="time-value">{timeSpent.toFixed(1)}</span>
                <span className="time-unit">minutes</span>
              </div>
            )}
            {!showTimeTracker ? (
              <button 
                className="btn-track-time"
                onClick={() => setShowTimeTracker(true)}
              >
                {timeSpent ? 'Update Time' : 'Track Time'}
              </button>
            ) : (
              <TimeTracker 
                habitId={habit.id}
                onTimeRecorded={handleTimeRecorded}
                initialTime={timeSpent ? timeSpent * 60 : null}
              />
            )}
            <p className="detail-help">
              Track how long this habit actually takes to complete
            </p>
          </div>

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
