import { useState, useEffect } from 'react'
import { generateMonthlyReview, saveReview } from '../../utils/reviewUtils'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './MonthlyReview.css'

function MonthlyReview({ review: existingReview = null, onSave }) {
  const [review, setReview] = useState(existingReview)
  const [reflection, setReflection] = useState(existingReview?.reflection || '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!existingReview) {
      const newReview = generateMonthlyReview()
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

  return (
    <div className="monthly-review">
      <div className="review-header">
        <h2>📆 Monthly Review</h2>
        <div className="review-period">
          {new Date(review.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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
        <div className="stat-card">
          <div className="stat-value">{review.statistics.todosCompleted || 0}</div>
          <div className="stat-label">Todos Completed</div>
        </div>
        {review.statistics.averageMood && (
          <div className="stat-card">
            <div className="stat-value">{review.statistics.averageMood.toFixed(1)}</div>
            <div className="stat-label">Avg Mood</div>
          </div>
        )}
      </div>

      {/* Weekly Breakdown */}
      {review.weeklyBreakdown && review.weeklyBreakdown.length > 0 && (
        <div className="review-section">
          <h3>Weekly Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={review.weeklyBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="week" stroke="#666" label={{ value: 'Week', position: 'insideBottom', offset: -5 }} />
              <YAxis stroke="#666" domain={[0, 100]} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="completionRate" 
                stroke="#667eea" 
                strokeWidth={3}
                dot={{ fill: '#667eea', r: 5 }}
                name="Completion Rate %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

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

      {/* Reflection */}
      <div className="review-section">
        <h3>📝 Reflection</h3>
        <div className="reflection-prompts">
          <p className="prompt">What were your biggest wins this month?</p>
          <p className="prompt">What habits became easier over time?</p>
          <p className="prompt">What would you like to focus on next month?</p>
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

export default MonthlyReview
