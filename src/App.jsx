import { useState, useEffect, lazy, Suspense } from 'react'
import { startReminderScheduler } from './utils/reminderScheduler'
import { requestNotificationPermission } from './utils/notificationUtils'
import './App.css'

// Lazy load pages for faster startup
const HabitsPage = lazy(() => import('./pages/HabitsPage'))
const GoalsPage = lazy(() => import('./pages/GoalsPage'))
const ToDoPage = lazy(() => import('./pages/ToDoPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'))

function App() {
  const [currentPage, setCurrentPage] = useState('habits') // 'habits', 'goals', 'todos', 'analytics', or 'reviews'
  const [date, setDate] = useState(new Date().toLocaleDateString())

  useEffect(() => {
    // Defer reminder scheduler to after initial render for faster startup
    const initReminders = () => {
      requestNotificationPermission().then(hasPermission => {
        if (hasPermission) {
          startReminderScheduler()
        }
      })
    }
    
    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initReminders, { timeout: 2000 })
    } else {
      setTimeout(initReminders, 100)
    }

    // Cleanup on unmount
    return () => {
      import('./utils/reminderScheduler').then(module => {
        module.stopReminderScheduler()
      })
    }
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>✨ Personal Tracker</h1>
        <p className="date">{date}</p>
        
        {/* Top-level Navigation */}
        <div className="main-nav-tabs">
          <button 
            className={`main-tab ${currentPage === 'habits' ? 'active' : ''}`}
            onClick={() => setCurrentPage('habits')}
          >
            Habits
          </button>
          <button 
            className={`main-tab ${currentPage === 'goals' ? 'active' : ''}`}
            onClick={() => setCurrentPage('goals')}
          >
            Goals
          </button>
          <button 
            className={`main-tab ${currentPage === 'todos' ? 'active' : ''}`}
            onClick={() => setCurrentPage('todos')}
          >
            To Do
          </button>
          <button 
            className={`main-tab ${currentPage === 'analytics' ? 'active' : ''}`}
            onClick={() => setCurrentPage('analytics')}
          >
            Analytics
          </button>
          <button 
            className={`main-tab ${currentPage === 'reviews' ? 'active' : ''}`}
            onClick={() => setCurrentPage('reviews')}
          >
            Reviews
          </button>
        </div>
      </header>

      <main className="app-main">
        <Suspense fallback={<div className="loading-state">Loading...</div>}>
          {currentPage === 'habits' && <HabitsPage />}
          {currentPage === 'goals' && <GoalsPage />}
          {currentPage === 'todos' && <ToDoPage />}
          {currentPage === 'analytics' && <AnalyticsPage />}
          {currentPage === 'reviews' && <ReviewsPage />}
        </Suspense>
      </main>

      {currentPage === 'habits' && (
        <footer className="app-footer">
          <p>Keep up the great work! 💪</p>
        </footer>
      )}
    </div>
  )
}

export default App
