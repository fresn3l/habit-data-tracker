import { useState, useEffect } from 'react'
import { generateWeeklyReview, saveReview } from '../../utils/reviewUtils'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './WeeklyReview.css'

function WeeklyReview({ review: existingReview = null, onSave }) {
  const [review, setReview] = useState(existingReview)
  const [reflection, setReflection] = useState(existingReview?.reflection || '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!existingReview) {
      const newReview = generateWeeklyReview()
      setReview(newReview)
      setReflection(newReview.reflection || '')
    }
  }, [existingReview])

  const handleSave = () => {
    if (!review) return
    
    setSaving(true)
    const reviewToSave = {
      ...review,
      reflection: reflection
    }
    saveReview(reviewToSave)
    
    setTimeout(() => {
      setSaving(false)
      if (onSave) onSave(reviewToSave)
    }, 300)
  }

  if (!review) {
    return <div className="review-loading">Generating review...</div>
  }

  const weekChartData = [
    { day: 'Sun', completion: 0 },
    { day: 'Mon', completion: 0 },
    { day: 'Tue', completion: 0 },
    { day: 'Wed', completion: 0 },
    { day: 'Thu', completion: 0 },
    { day: 'Fri', completion: 0 },
    { day: 'Sat', completion: 0 },
  ]

  // Populate with actual data if available
  const allData = JSON.parse(localStorage.getItem('habit-tracker-data') || '{}')
  Object.entries(allData).forEach(([dateKey, dayData]) => {
    const date = new Date(dateKey)
    const dayOfWeek = date.getDay()
    if (dayData.completedCount && dayData.totalCount) {
      weekChartData[dayOfWeek].completion = Math.round((dayData.completedCount / dayData.totalCount) * 100)
    }
  })

  return (
    <div className="weekly-review">
      <div className="review-header">
        <h2>📅 Weekly Review</h2>
        <div className="review-period">
          {new Date(review.startDate).toLocaleDateString()} - {new Date(review.endDate).toLocaleDateString()}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="review-stats-grid">
        <div className="stat-card">
          <div className="stat-value">{review.statistics.averageCompletionRate || 0}%</div>
          <div className="stat-label">Avg Completion</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{review.statistics.daysTracked || 0}</div>
          <div className="stat-label">Days Tracked</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{review.statistics.totalHabitsCompleted || 0}</div>
          <div className="stat-label">Habits Completed</div>
        </div>
        {review.statistics.averageMood && (
          <div className="stat-card">
            <div className="stat-value">{review.statistics.averageMood.toFixed(1)}</div>
            <div className="stat-label">Avg Mood</div>
          </div>
        )}
      </div>

      {/* Highlights */}
      {review.highlights.length > 0 && (
        <div className="review-section">
          <h3>🌟 Highlights</h3>
          <div className="highlights-list">
            {review.highlights.map((highlight, index) => (
              <div key={index} className="highlight-item">
                <span className="highlight-emoji">{highlight.emoji}</span>
                <span className="highlight-message">{highlight.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {review.insights.length > 0 && (
        <div className="review-section">
          <h3>💡 Insights</h3>
          <ul className="insights-list">
            {review.insights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Weekly Chart */}
      <div className="review-section">
        <h3>Daily Completion Rates</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weekChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="day" stroke="#666" />
            <YAxis stroke="#666" domain={[0, 100]} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="completion" fill="#667eea" name="Completion %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Reflection */}
      <div className="review-section">
        <h3>📝 Reflection</h3>
        <div className="reflection-prompts">
          <p className="prompt">What went well this week?</p>
          <p className="prompt">What would you like to improve?</p>
          <p className="prompt">Which habit had the biggest impact?</p>
        </div>
        <textarea
          className="reflection-input"
          placeholder="Write your thoughts here..."
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          rows="6"
        />
      </div>

      <div className="review-actions">
        <button 
          className="btn-save-review"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Review'}
        </button>
      </div>
    </div>
  )
}

export default WeeklyReview
