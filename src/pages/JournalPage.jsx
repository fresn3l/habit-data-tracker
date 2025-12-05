/**
 * Journal Page Component
 * 
 * The Journal page provides a daily journaling interface with:
 * - Open text editor for journal entries
 * - 10-minute timer for focused journaling
 * - Auto-save functionality
 * - Access to past journal entries
 * - File system storage integration
 * 
 * @module pages/JournalPage
 * @component
 */

import { useState, useEffect, useRef } from 'react'
import Timer from '../components/journal/Timer'
import { 
  getTodaysJournal, 
  saveJournal, 
  updateJournal,
  getAllJournalsSorted 
} from '../utils/journalStorage'
import './JournalPage.css'

export default function JournalPage() {
  /**
   * Current journal entry text content.
   */
  const [content, setContent] = useState('')
  
  /**
   * Timer seconds (elapsed time from timer).
   */
  const [timerSeconds, setTimerSeconds] = useState(0)
  
  /**
   * Whether content has been modified since last save.
   */
  const [isModified, setIsModified] = useState(false)
  
  /**
   * Status message to show user (saved, error, etc.).
   */
  const [statusMessage, setStatusMessage] = useState('')
  
  /**
   * Whether past entries modal is open.
   */
  const [showPastEntries, setShowPastEntries] = useState(false)
  
  /**
   * List of all past journal entries.
   */
  const [pastEntries, setPastEntries] = useState([])
  
  /**
   * Reference to textarea for focus management.
   */
  const textareaRef = useRef(null)
  
  /**
   * Load today's journal entry on component mount.
   */
  useEffect(() => {
    const todaysEntry = getTodaysJournal()
    if (todaysEntry) {
      setContent(todaysEntry.content || '')
      setTimerSeconds(todaysEntry.timerSeconds || 0)
    }
    
    // Focus textarea after a short delay for better UX
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }, 100)
  }, [])
  
  /**
   * Auto-save journal entry when content changes.
   * Debounced to avoid excessive saves.
   */
  useEffect(() => {
    if (!content.trim() && timerSeconds === 0) {
      // Don't save empty entries with no timer
      return
    }
    
    // Debounce auto-save
    const saveTimeout = setTimeout(() => {
      handleSave()
    }, 2000) // Save 2 seconds after user stops typing
    
    return () => clearTimeout(saveTimeout)
  }, [content, timerSeconds])
  
  /**
   * Handle content change in textarea.
   */
  const handleContentChange = (e) => {
    setContent(e.target.value)
    setIsModified(true)
    setStatusMessage('')
  }
  
  /**
   * Save journal entry.
   */
  const handleSave = () => {
    try {
      if (!content.trim() && timerSeconds === 0) {
        // Don't save completely empty entries
        return
      }
      
      const todaysEntry = getTodaysJournal()
      
      if (todaysEntry) {
        // Update existing entry
        updateJournal(content, timerSeconds)
      } else {
        // Create new entry
        saveJournal(content, timerSeconds)
      }
      
      setIsModified(false)
      setStatusMessage('✓ Saved')
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatusMessage('')
      }, 3000)
    } catch (error) {
      console.error('Error saving journal:', error)
      setStatusMessage('✗ Error saving')
      setTimeout(() => {
        setStatusMessage('')
      }, 3000)
    }
  }
  
  /**
   * Handle timer time update.
   * Called every second while timer is running.
   */
  const handleTimerUpdate = (elapsedSeconds) => {
    setTimerSeconds(elapsedSeconds)
    setIsModified(true)
  }
  
  /**
   * Handle timer completion.
   */
  const handleTimerComplete = () => {
    // Auto-save when timer completes
    handleSave()
    setStatusMessage('⏱ Timer complete! Entry saved.')
  }
  
  /**
   * Load past entries for modal display.
   */
  const loadPastEntries = () => {
    const entries = getAllJournalsSorted()
    setPastEntries(entries)
    setShowPastEntries(true)
  }
  
  /**
   * Load a specific past entry into the editor.
   */
  const loadPastEntry = (entry) => {
    // Only load if it's today's entry
    const today = new Date().toDateString()
    if (entry.date === today) {
      setContent(entry.content || '')
      setTimerSeconds(entry.timerSeconds || 0)
      setShowPastEntries(false)
    } else {
      alert('You can only edit today\'s entry. Past entries are read-only.')
    }
  }
  
  /**
   * Format word count display.
   */
  const getWordCount = () => {
    if (!content.trim()) return 0
    return content.trim().split(/\s+/).filter(word => word.length > 0).length
  }
  
  return (
    <div className="journal-page">
      {/* Page Header */}
      <div className="premium-page-header">
        <h2>Daily Journal</h2>
        <p>Reflect on your day with focused journaling</p>
      </div>
      
      {/* Main Journal Area */}
      <div className="journal-container">
        {/* Timer Section */}
        <Timer 
          onTimeUpdate={handleTimerUpdate}
          onComplete={handleTimerComplete}
        />
        
        {/* Journal Editor */}
        <div className="journal-editor-container">
          <div className="journal-editor-header">
            <span className="journal-date">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            <div className="journal-stats">
              {statusMessage && (
                <span className="journal-status">{statusMessage}</span>
              )}
              <span className="journal-word-count">
                {getWordCount()} words
              </span>
            </div>
          </div>
          
          <textarea
            ref={textareaRef}
            className="journal-textarea"
            value={content}
            onChange={handleContentChange}
            placeholder="Start writing your thoughts... What happened today? How are you feeling? What are you grateful for?"
            rows={15}
          />
          
          <div className="journal-editor-footer">
            <button
              className="premium-btn premium-btn-secondary"
              onClick={handleSave}
              disabled={!isModified}
            >
              💾 Save Entry
            </button>
            <button
              className="premium-btn premium-btn-secondary"
              onClick={loadPastEntries}
            >
              📚 View Past Entries
            </button>
          </div>
        </div>
      </div>
      
      {/* Past Entries Modal */}
      {showPastEntries && (
        <div className="premium-overlay" onClick={() => setShowPastEntries(false)}>
          <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
            <div className="premium-modal-header">
              <h2>Past Journal Entries</h2>
              <button
                className="premium-close-btn"
                onClick={() => setShowPastEntries(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="past-entries-content">
              {pastEntries.length === 0 ? (
                <p className="no-entries">No journal entries yet. Start writing!</p>
              ) : (
                <div className="past-entries-list">
                  {pastEntries.map((entry, index) => (
                    <div
                      key={entry.date || index}
                      className="past-entry-item"
                      onClick={() => loadPastEntry(entry)}
                    >
                      <div className="past-entry-header">
                        <span className="past-entry-date">{entry.date}</span>
                        {entry.timerSeconds > 0 && (
                          <span className="past-entry-timer">
                            ⏱ {Math.floor(entry.timerSeconds / 60)} min
                          </span>
                        )}
                      </div>
                      <div className="past-entry-preview">
                        {entry.content 
                          ? (entry.content.length > 200 
                              ? entry.content.substring(0, 200) + '...'
                              : entry.content)
                          : 'Empty entry'}
                      </div>
                      {entry.wordCount > 0 && (
                        <div className="past-entry-stats">
                          {entry.wordCount} words
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

