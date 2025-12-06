# Text Check-in Feature - Quick Implementation Guide

## 🎯 Feature Overview

End-of-night text message asking "What habits did you complete?" and auto-completing them from your response.

---

## 📊 Implementation Options (Easiest → Hardest)

### ✅ **Option 1: In-App Desktop Notification** (EASIEST - Recommended First)
**Time**: 1-2 hours | **Cost**: Free | **Difficulty**: ⭐ Easy

**What you get:**
- Desktop notification at 9 PM (or your chosen time)
- Quick reply modal with habit checkboxes
- Text input to type habit names
- Auto-complete based on your response

**Pros:**
- ✅ Immediate value
- ✅ No external services
- ✅ Works right now
- ✅ Easy to test

**Cons:**
- ❌ Requires app to be running
- ❌ Not a real SMS/text

---

### ✅ **Option 2: macOS iMessage Integration** (MODERATE)
**Time**: 3-4 hours | **Cost**: Free | **Difficulty**: ⭐⭐ Moderate

**What you get:**
- Real iMessage/SMS sent to your phone
- Reply via Messages app
- Auto-completes habits from your text response

**Pros:**
- ✅ Real text messages
- ✅ Works with iPhone
- ✅ No monthly costs

**Cons:**
- ❌ macOS only
- ❌ Requires Messages app setup
- ❌ More complex

---

### ✅ **Option 3: Twilio SMS** (ADVANCED)
**Time**: 4-6 hours | **Cost**: ~$1-5/month | **Difficulty**: ⭐⭐⭐ Hard

**What you get:**
- Real SMS to any phone
- Reply via text
- Works when app is closed (with server)

**Pros:**
- ✅ Works on any phone
- ✅ Professional service
- ✅ Reliable

**Cons:**
- ❌ Costs money
- ❌ Requires API setup
- ❌ Most complex

---

## 🚀 Recommended: Start with Option 1

**Why?** Fastest to implement, immediate value, can upgrade later to Option 2.

---

## 💻 Quick Implementation Example

### Step 1: Create Nightly Scheduler (30 min)

```javascript
// src/utils/nightlyCheckinScheduler.js

import { createNotification } from './notificationUtils'
import { getAllStoredData, getTodayKey } from './dataStorage'

let checkinInterval = null
const DEFAULT_CHECKIN_TIME = '21:00' // 9 PM

export const startNightlyCheckin = () => {
  checkinInterval = setInterval(() => {
    checkIfTimeForCheckin()
  }, 60000) // Check every minute
}

const checkIfTimeForCheckin = () => {
  const now = new Date()
  const checkinTime = getCheckinTime() // e.g., '21:00'
  const [hours, minutes] = checkinTime.split(':').map(Number)
  
  // Check if it's the check-in time
  if (now.getHours() === hours && now.getMinutes() === minutes) {
    const todayKey = getTodayKey()
    const allData = getAllStoredData()
    const todayData = allData[todayKey]
    
    if (todayData && todayData.habits) {
      const incompleteHabits = todayData.habits.filter(h => !h.completed)
      
      if (incompleteHabits.length > 0) {
        sendCheckinNotification(incompleteHabits)
      }
    }
  }
}

const sendCheckinNotification = (incompleteHabits) => {
  const habitNames = incompleteHabits.map(h => h.name).join(', ')
  
  createNotification('🌙 End of Day Check-in', {
    body: `You have ${incompleteHabits.length} incomplete habits: ${habitNames}`,
    tag: 'nightly-checkin',
    requireInteraction: true,
    onClick: () => {
      window.focus()
      // Open check-in modal
      window.dispatchEvent(new CustomEvent('open-checkin-modal'))
    }
  })
}
```

### Step 2: Create Check-in Modal (45 min)

```javascript
// src/components/modals/HabitCheckinModal.jsx

import { useState } from 'react'
import { getDayData, saveDayData, getTodayKey } from '../../utils/dataStorage'
import { parseHabitNames } from '../../utils/habitParser'

function HabitCheckinModal({ isOpen, onClose }) {
  const [textInput, setTextInput] = useState('')
  const [selectedHabits, setSelectedHabits] = useState([])
  
  const todayKey = getTodayKey()
  const todayData = getDayData(todayKey)
  const incompleteHabits = todayData?.habits?.filter(h => !h.completed) || []
  
  const handleTextSubmit = () => {
    // Parse habit names from text
    const habitNames = parseHabitNames(textInput)
    
    // Match to actual habits and complete them
    const habits = todayData.habits.map(habit => {
      if (habitNames.includes(habit.name.toLowerCase())) {
        return { ...habit, completed: true }
      }
      return habit
    })
    
    // Save updated habits
    saveDayData(todayKey, habits, todayData.weight)
    
    // Show confirmation
    alert(`✅ Completed ${habitNames.length} habits!`)
    onClose()
  }
  
  const handleCheckboxChange = (habitId) => {
    setSelectedHabits(prev => 
      prev.includes(habitId) 
        ? prev.filter(id => id !== habitId)
        : [...prev, habitId]
    )
  }
  
  const handleCheckboxSubmit = () => {
    const habits = todayData.habits.map(habit => ({
      ...habit,
      completed: selectedHabits.includes(habit.id) || habit.completed
    }))
    
    saveDayData(todayKey, habits, todayData.weight)
    alert(`✅ Completed ${selectedHabits.length} habits!`)
    onClose()
  }
  
  if (!isOpen) return null
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>🌙 End of Day Check-in</h2>
        <p>Which habits did you complete today?</p>
        
        {/* Option 1: Checkboxes */}
        <div className="habit-checkboxes">
          {incompleteHabits.map(habit => (
            <label key={habit.id}>
              <input
                type="checkbox"
                checked={selectedHabits.includes(habit.id)}
                onChange={() => handleCheckboxChange(habit.id)}
              />
              {habit.emoji} {habit.name}
            </label>
          ))}
        </div>
        
        {/* Option 2: Text Input */}
        <div className="text-input-section">
          <p>Or type habit names:</p>
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="e.g., brush teeth, meditate, gym"
          />
        </div>
        
        <div className="modal-actions">
          <button onClick={handleCheckboxSubmit}>Complete Selected</button>
          <button onClick={handleTextSubmit}>Complete from Text</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
```

### Step 3: Create Habit Parser (30 min)

```javascript
// src/utils/habitParser.js

/**
 * Parse habit names from natural language text.
 * 
 * Examples:
 * "brush teeth, meditate" → ["brush teeth", "meditate"]
 * "did gym and workout" → ["gym"]
 * "brushed my teeth" → ["brush teeth"]
 */
export const parseHabitNames = (text) => {
  // Get all habits from today
  const todayData = getDayData(getTodayKey())
  const allHabits = todayData?.habits || []
  
  // Normalize text
  const normalizedText = text.toLowerCase()
  
  // Match habits
  const matchedHabits = []
  
  allHabits.forEach(habit => {
    const habitName = habit.name.toLowerCase()
    
    // Direct match
    if (normalizedText.includes(habitName)) {
      matchedHabits.push(habit.name)
      return
    }
    
    // Partial match (handle variations)
    const words = habitName.split(' ')
    const hasMatch = words.some(word => 
      word.length > 3 && normalizedText.includes(word)
    )
    
    if (hasMatch) {
      matchedHabits.push(habit.name)
    }
  })
  
  return matchedHabits
}
```

---

## 📱 Real Text Message Version (Option 2)

### macOS iMessage Example

```python
# nightly_checkin.py

import subprocess
import applescript
from datetime import datetime
import json
import os

def send_checkin_message():
    """Send iMessage asking about completed habits"""
    
    # Get incomplete habits
    # (This would read from localStorage via Eel or JSON file)
    
    message = """
    🌙 End of Day Check-in
    
    Which habits did you complete today?
    Reply with habit names like: "brush teeth, meditate, gym"
    """
    
    # Send via AppleScript
    script = f'''
    tell application "Messages"
        set targetService to 1st service whose service type = iMessage
        set targetBuddy to buddy "+1234567890" of targetService
        send "{message}" to targetBuddy
    end tell
    '''
    
    applescript.run(script)

def monitor_messages():
    """Monitor Messages app for replies"""
    # Check Messages database or use automation
    # Parse reply and update habits
    pass

if __name__ == '__main__':
    send_checkin_message()
```

---

## 🎯 Quick Start Recommendation

**Phase 1 (2 hours):** Implement in-app notification
- Desktop notification at set time
- Modal with checkboxes and text input
- Parse and complete habits

**Phase 2 (3-4 hours):** Add iMessage integration
- Real text messages
- Reply parsing
- Auto-complete from SMS

---

## 💡 Natural Language Parsing Examples

User types: `"did brush teeth and meditated"`
Parsed: `["brush teeth", "meditate"]`

User types: `"gym workout exercise"`
Parsed: `["gym"]` (matched to "gym" habit)

User types: `"all done"`
Parsed: All incomplete habits completed

---

## 🔧 Settings to Add

- Enable/disable nightly check-in
- Set check-in time (default: 9 PM)
- Choose notification method (desktop/iMessage/SMS)
- Customize message text

---

**Would you like me to implement Option 1 (in-app notification) first? It's the quickest way to get this working!**

