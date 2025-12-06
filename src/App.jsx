/**
 * Personal Tracker - Main Application Component
 * 
 * This is the root component of the Personal Tracker application.
 * It handles:
 * - Top-level routing between pages (Habits, Goals, Todos, Analytics, Reviews)
 * - Application-wide state management
 * - Reminder scheduler initialization
 * - Layout structure (header, main, footer)
 * 
 * The app uses lazy loading for page components to improve startup performance.
 * Only the currently active page is loaded, reducing initial bundle size.
 * 
 * @module App
 * @component
 * 
 * @example
 * // App is rendered in main.jsx:
 * import App from './App'
 * ReactDOM.createRoot(document.getElementById('root')).render(<App />)
 */

import { useState, useEffect, lazy, Suspense } from 'react'
import { startReminderScheduler } from './utils/reminderScheduler'
import { requestNotificationPermission } from './utils/notificationUtils'
import ErrorBoundary from './components/ui/ErrorBoundary'
import './App.css'

// ============================================================================
// LAZY LOADED PAGE COMPONENTS
// ============================================================================

/**
 * Lazy load page components for code splitting and faster startup.
 * 
 * Using React.lazy() with dynamic imports means:
 * - Each page is a separate code chunk
 * - Pages only load when needed
 * - Smaller initial bundle size
 * - Faster Time to Interactive (TTI)
 * 
 * The Suspense component wraps lazy-loaded components and shows
 * a loading fallback while the component is being loaded.
 */
const HabitsPage = lazy(() => import('./pages/HabitsPage'))
const GoalsPage = lazy(() => import('./pages/GoalsPage'))
const ToDoPage = lazy(() => import('./pages/ToDoPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'))
const JournalPage = lazy(() => import('./pages/JournalPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

/**
 * Root application component.
 * 
 * Manages:
 * - Current page state (which page is active)
 * - Current date display
 * - Reminder scheduler initialization
 * 
 * @returns {JSX.Element} The root application component
 */
function App() {
  // ========================================================================
  // STATE MANAGEMENT
  // ========================================================================
  
  /**
   * Current active page.
   * 
   * Possible values:
   * - 'habits': Daily habit tracking page
   * - 'goals': Goal management page
   * - 'todos': Todo list management page
   * - 'analytics': Data analytics and visualizations page
   * - 'reviews': Weekly/monthly review page
   * - 'journal': Daily journal entry page
   * 
   * @type {string}
   */
  const [currentPage, setCurrentPage] = useState('habits')
  
  /**
   * Current date string for display in header.
   * 
   * Format: Locale-specific date string (e.g., "12/1/2024")
   * Updates on component mount.
   * 
   * @type {string}
   */
  const [date, setDate] = useState(new Date().toLocaleDateString())

  // ========================================================================
  // SIDE EFFECTS
  // ========================================================================
  
  /**
   * Initialize reminder scheduler on app mount.
   * 
   * This effect:
   * 1. Requests notification permission from the user
   * 2. Starts the reminder scheduler if permission is granted
   * 3. Defers initialization to avoid blocking initial render
   * 4. Cleans up scheduler on unmount
   * 
   * Uses requestIdleCallback (or setTimeout fallback) to defer
   * initialization until the browser is idle, improving startup
   * performance.
   * 
   * @effect
   * @runs Once on mount
   */
  useEffect(() => {
    /**
     * Initialize reminder system.
     * 
     * This function is deferred to avoid blocking initial render.
     * It requests notification permission and starts the scheduler
     * if permission is granted.
     */
    const initReminders = () => {
      requestNotificationPermission().then(hasPermission => {
        if (hasPermission) {
          // Start the reminder scheduler to check for habit reminders
          startReminderScheduler()
        }
      })
    }
    
    // Defer initialization to improve startup performance
    // Use requestIdleCallback if available (modern browsers)
    // Fall back to setTimeout for older browsers
    if ('requestIdleCallback' in window) {
      // Wait for browser to be idle, but timeout after 2 seconds
      requestIdleCallback(initReminders, { timeout: 2000 })
    } else {
      // Fallback: wait 100ms then initialize
      setTimeout(initReminders, 100)
    }

    /**
     * Cleanup function.
     * 
     * Stops the reminder scheduler when the app unmounts to prevent
     * memory leaks and unnecessary background processes.
     */
    return () => {
      // Dynamically import to avoid loading scheduler code if not needed
      import('./utils/reminderScheduler').then(module => {
        module.stopReminderScheduler()
      })
    }
  }, []) // Empty dependency array = run once on mount

  // ========================================================================
  // RENDER
  // ========================================================================
  
  return (
    <ErrorBoundary>
      <div className="app">
        {/* ================================================================== */}
        {/* HEADER SECTION */}
        {/* ================================================================== */}
        
        <header className="app-header">
        {/* App Title */}
        <h1>Deck Log</h1>
        
        {/* Current Date Display */}
        <p className="date">{date}</p>
        
        {/* ================================================================ */}
        {/* TOP-LEVEL NAVIGATION TABS */}
        {/* ================================================================ */}
        
        <div className="main-nav-tabs">
          {/* Habits Tab */}
          <button 
            className={`main-tab ${currentPage === 'habits' ? 'active' : ''}`}
            onClick={() => setCurrentPage('habits')}
            aria-label="Navigate to Habits page"
          >
            Habits
          </button>
          
          {/* Goals Tab */}
          <button 
            className={`main-tab ${currentPage === 'goals' ? 'active' : ''}`}
            onClick={() => setCurrentPage('goals')}
            aria-label="Navigate to Goals page"
          >
            Goals
          </button>
          
          {/* Todos Tab */}
          <button 
            className={`main-tab ${currentPage === 'todos' ? 'active' : ''}`}
            onClick={() => setCurrentPage('todos')}
            aria-label="Navigate to To Do page"
          >
            To Do
          </button>
          
          {/* Analytics Tab */}
          <button 
            className={`main-tab ${currentPage === 'analytics' ? 'active' : ''}`}
            onClick={() => setCurrentPage('analytics')}
            aria-label="Navigate to Analytics page"
          >
            Analytics
          </button>
          
          {/* Reviews Tab */}
          <button 
            className={`main-tab ${currentPage === 'reviews' ? 'active' : ''}`}
            onClick={() => setCurrentPage('reviews')}
            aria-label="Navigate to Reviews page"
          >
            Reviews
          </button>
          
          {/* Journal Tab */}
          <button 
            className={`main-tab ${currentPage === 'journal' ? 'active' : ''}`}
            onClick={() => setCurrentPage('journal')}
            aria-label="Navigate to Journal page"
          >
            Journal
          </button>
          
          {/* Settings Tab */}
          <button 
            className={`main-tab ${currentPage === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentPage('settings')}
            aria-label="Navigate to Settings page"
          >
            Settings
          </button>
        </div>
      </header>

      {/* ================================================================== */}
      {/* MAIN CONTENT AREA */}
      {/* ================================================================== */}
      
      <main className="app-main">
        {/* 
          Suspense boundary for lazy-loaded pages.
          Shows loading state while page component is being loaded.
        */}
        <Suspense fallback={<div className="loading-state">Loading...</div>}>
          {/* Conditionally render the active page component */}
          {currentPage === 'habits' && <HabitsPage />}
          {currentPage === 'goals' && <GoalsPage />}
          {currentPage === 'todos' && <ToDoPage />}
          {currentPage === 'analytics' && <AnalyticsPage />}
          {currentPage === 'reviews' && <ReviewsPage />}
          {currentPage === 'journal' && <JournalPage />}
          {currentPage === 'settings' && <SettingsPage />}
        </Suspense>
      </main>

      {/* ================================================================== */}
      {/* FOOTER SECTION */}
      {/* ================================================================== */}
      
      {/* 
        Footer only shown on Habits page for motivational messaging.
        Other pages don't need the footer.
      */}
        {currentPage === 'habits' && (
          <footer className="app-footer">
            <p>Keep up the great work! 💪</p>
          </footer>
        )}
      </div>
    </ErrorBoundary>
  )
}

export default App
