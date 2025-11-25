import { useState, useEffect } from 'react'
import { saveMood, getTodayMood, getMoodEmoji } from '../utils/moodStorage'
import { getTodayKey } from '../utils/dataStorage'
import './MoodInput.css'

const MOOD_OPTIONS = [
  { value: 1, emoji: '😢', label: 'Very Bad' },
  { value: 2, emoji: '😕', label: 'Bad' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '😊', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' },
]

function MoodInput() {
  const [selectedMood, setSelectedMood] = useState(null)
  const [notes, setNotes] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const todayMood = getTodayMood()
    if (todayMood) {
      setSelectedMood(todayMood.mood)
      setNotes(todayMood.notes || '')
    }
  }, [])

  const handleMoodSelect = (moodValue) => {
    setSelectedMood(moodValue)
    setIsEditing(true)
    const todayKey = getTodayKey()
    saveMood(todayKey, moodValue, notes)
  }

  const handleNotesChange = (e) => {
    const newNotes = e.target.value
    setNotes(newNotes)
    if (selectedMood) {
      const todayKey = getTodayKey()
      saveMood(todayKey, selectedMood, newNotes)
    }
  }

  const handleNotesBlur = () => {
    if (selectedMood) {
      setIsEditing(false)
    }
  }

  return (
    <div className="mood-input-container">
      <div className="mood-header">
        <span className="mood-icon">💭</span>
        <h3>How are you feeling today?</h3>
      </div>
      
      <div className="mood-selector">
        {MOOD_OPTIONS.map(option => (
          <button
            key={option.value}
            className={`mood-option ${selectedMood === option.value ? 'selected' : ''}`}
            onClick={() => handleMoodSelect(option.value)}
            title={option.label}
          >
            <span className="mood-emoji">{option.emoji}</span>
            {selectedMood === option.value && (
              <span className="mood-check">✓</span>
            )}
          </button>
        ))}
      </div>

      {selectedMood && (
        <div className="mood-notes">
          <textarea
            placeholder="Add notes about your mood (optional)..."
            value={notes}
            onChange={handleNotesChange}
            onBlur={handleNotesBlur}
            onFocus={() => setIsEditing(true)}
            className="mood-notes-input"
            rows="2"
          />
        </div>
      )}

      {selectedMood && !isEditing && (
        <div className="mood-selected">
          <span>Today: {getMoodEmoji(selectedMood)} {MOOD_OPTIONS.find(o => o.value === selectedMood)?.label}</span>
        </div>
      )}
    </div>
  )
}

export default MoodInput
