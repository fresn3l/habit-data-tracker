import { useState, useEffect } from 'react'
import WeeklyReview from '../components/WeeklyReview'
import MonthlyReview from '../components/MonthlyReview'
import { getReviews } from '../utils/reviewUtils'
import './ReviewsPage.css'

function ReviewsPage() {
  const [view, setView] = useState('generate') // 'generate', 'history'
  const [reviewType, setReviewType] = useState('weekly') // 'weekly', 'monthly'
  const [savedReviews, setSavedReviews] = useState([])
  const [selectedReview, setSelectedReview] = useState(null)

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = () => {
    const reviews = getReviews()
    setSavedReviews(reviews.sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt)))
  }

  const handleReviewSaved = (review) => {
    loadReviews()
    setView('history')
    setSelectedReview(review)
  }

  const handleGenerateNew = () => {
    setSelectedReview(null)
    setView('generate')
  }

  return (
    <>
      <div className="reviews-header">
        <h2>📊 Reviews</h2>
        <div className="reviews-nav">
          <button 
            className={`nav-btn ${view === 'generate' ? 'active' : ''}`}
            onClick={() => setView('generate')}
          >
            Generate Review
          </button>
          <button 
            className={`nav-btn ${view === 'history' ? 'active' : ''}`}
            onClick={() => setView('history')}
          >
            Review History
          </button>
        </div>
      </div>

      {view === 'generate' ? (
        <div className="reviews-container">
          <div className="review-type-selector">
            <button 
              className={`type-btn ${reviewType === 'weekly' ? 'active' : ''}`}
              onClick={() => setReviewType('weekly')}
            >
              Weekly Review
            </button>
            <button 
              className={`type-btn ${reviewType === 'monthly' ? 'active' : ''}`}
              onClick={() => setReviewType('monthly')}
            >
              Monthly Review
            </button>
          </div>

          {reviewType === 'weekly' ? (
            <WeeklyReview onSave={handleReviewSaved} />
          ) : (
            <MonthlyReview onSave={handleReviewSaved} />
          )}
        </div>
      ) : (
        <div className="reviews-container">
          {savedReviews.length === 0 ? (
            <div className="no-reviews">
              <p>No saved reviews yet.</p>
              <button className="btn-generate" onClick={handleGenerateNew}>
                Generate Your First Review
              </button>
            </div>
          ) : (
            <>
              <div className="reviews-list">
                {savedReviews.map(review => (
                  <div 
                    key={review.id} 
                    className="review-card"
                    onClick={() => setSelectedReview(review)}
                  >
                    <div className="review-card-header">
                      <h3>{review.period === 'week' ? '📅' : '📆'} {review.period === 'week' ? 'Weekly' : 'Monthly'} Review</h3>
                      <span className="review-date">
                        {new Date(review.generatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="review-card-stats">
                      <span>{review.statistics.averageCompletionRate}% completion</span>
                      <span>{review.statistics.daysTracked} days</span>
                    </div>
                    {review.highlights.length > 0 && (
                      <div className="review-card-highlights">
                        {review.highlights[0].emoji} {review.highlights[0].message}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selectedReview && (
                <div className="review-detail">
                  {selectedReview.period === 'week' ? (
                    <WeeklyReview review={selectedReview} onSave={handleReviewSaved} />
                  ) : (
                    <MonthlyReview review={selectedReview} onSave={handleReviewSaved} />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}

export default ReviewsPage
