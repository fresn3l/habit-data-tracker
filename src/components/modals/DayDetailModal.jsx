import { useState, useEffect } from 'react'
import { getDayData } from '../../utils/dataStorage'
import './DayDetailModal.css'

function DayDetailModal({ date, onClose }) {
  const [dayData, setDayData] = useState(null)

  useEffect(() => {
    if (date) {
      const data = getDayData(date)
      setDayData(data)
    }
  }, [date])

  if (!date) return null

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="day-detail-overlay" onClick={onClose}>
      <div className="day-detail-container" onClick={(e) => e.stopPropagation()}>
        <div className="day-detail-header">
          <h2>{formattedDate}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="day-detail-content">
          {!dayData ? (
            <div className="no-data">
              <p>No data tracked for this day.</p>
            </div>
          ) : (
            <>
              {/* Habits */}
              {dayData.habits && dayData.habits.length > 0 && (
                <div className="detail-section">
                  <h3>Habits</h3>
                  <div className="habits-list">
                    {dayData.habits.map(habit => (
                      <div 
                        key={habit.id} 
                        className={`habit-item-detail ${habit.completed ? 'completed' : ''}`}
                      >
                        <span className="habit-emoji">{habit.emoji}</span>
                        <span className="habit-name">{habit.name}</span>
                        {habit.completed && <span className="check-icon">✓</span>}
                      </div>
                    ))}
                  </div>
                  <div className="completion-stats">
                    {dayData.completedCount} / {dayData.totalCount} habits completed
                    ({Math.round((dayData.completedCount / dayData.totalCount) * 100)}%)
                  </div>
                </div>
              )}

              {/* Weight */}
              {dayData.weight && (
                <div className="detail-section">
                  <h3>Weight</h3>
                  <div className="weight-value">{dayData.weight.toFixed(1)} lbs</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DayDetailModal
