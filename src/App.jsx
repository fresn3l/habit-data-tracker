import { useState } from 'react'
import HabitsPage from './pages/HabitsPage'
import GoalsPage from './pages/GoalsPage'
import ToDoPage from './pages/ToDoPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('habits') // 'habits', 'goals', or 'todos'
  const [date, setDate] = useState(new Date().toLocaleDateString())

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
        </div>
      </header>

      <main className="app-main">
        {currentPage === 'habits' && <HabitsPage />}
        {currentPage === 'goals' && <GoalsPage />}
        {currentPage === 'todos' && <ToDoPage />}
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
