import { useState, useEffect } from 'react'
import HabitsPage from './pages/HabitsPage'
import GoalsPage from './pages/GoalsPage'
import ToDoPage from './pages/ToDoPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ReviewsPage from './pages/ReviewsPage'
import { startReminderScheduler } from './utils/reminderScheduler'
import { requestNotificationPermission } from './utils/notificationUtils'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('habits') // 'habits', 'goals', 'todos', 'analytics', or 'reviews'
  const [date, setDate] = useState(new Date().toLocaleDateString())

  useEffect(() => {
    // Request notification permission on first load
    requestNotificationPermission().then(hasPermission => {
      if (hasPermission) {
        // Start reminder scheduler
        startReminderScheduler()
      }
    })

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
        {currentPage === 'habits' && <HabitsPage />}
        {currentPage === 'goals' && <GoalsPage />}
        {currentPage === 'todos' && <ToDoPage />}
        {currentPage === 'analytics' && <AnalyticsPage />}
        {currentPage === 'reviews' && <ReviewsPage />}
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
