# Database Architecture Explained

## Overview

This application uses **browser localStorage** as its database. It's a client-side, file-based storage system that persists data in the browser, making it perfect for a desktop application that doesn't need a server.

---

## 🗄️ Storage Mechanism: localStorage

### What is localStorage?
- **Browser-based storage** that persists data even after the browser closes
- **Key-value pairs** stored as strings
- **5-10 MB limit** per domain (plenty for this app)
- **Synchronous API** - data is immediately available
- **Local only** - data stays on your computer

### Why localStorage for this app?
✅ Perfect for desktop apps (no server needed)  
✅ Data persists across app restarts  
✅ Fast (no network latency)  
✅ Works offline  
✅ Simple API  
✅ Privacy (data never leaves your computer)

---

## 📦 Data Structure

The app stores different types of data in separate localStorage keys. Here's the complete structure:

### 1. **Habit & Weight Data** (Main Daily Data)
**Storage Key**: `'habit-tracker-data'`

```javascript
{
  "Mon Dec 01 2024": {
    date: "Mon Dec 01 2024",
    habits: [
      {
        id: 1,
        name: "Brush Teeth (AM)",
        emoji: "🦷",
        category: { name: "Health", color: "#10b981" },
        completed: true,
        timeOfDay: "morning"
      },
      {
        id: 2,
        name: "Meditate",
        emoji: "🧘",
        category: { name: "Wellness", color: "#3b82f6" },
        completed: false,
        timeOfDay: "anytime"
      }
      // ... more habits
    ],
    weight: 150.5,
    completedCount: 8,
    totalCount: 12,
    timestamp: "2024-12-01T10:30:00.000Z"
  },
  "Tue Dec 02 2024": {
    // Next day's data
  },
  // ... more days
}
```

**Key Features:**
- **Date-based keys**: Each day is stored with its date string (e.g., "Mon Dec 01 2024")
- **Habits array**: All habits for that day with completion status
- **Weight tracking**: Optional daily weight measurement
- **Auto-calculated stats**: `completedCount` and `totalCount`
- **Timestamp**: When the data was last updated

---

### 2. **Goals Data**
**Storage Key**: `'goals-data'`

```javascript
[
  {
    id: "goal-123",
    title: "Save $300/month",
    emoji: "💰",
    description: "Build emergency fund",
    targetAmount: 300,
    unit: "dollars",
    completedTodosCount: 5,
    createdAt: "2024-12-01T10:00:00.000Z"
  },
  // ... more goals
]
```

**Storage Key for Goal Steps**: `'goal-steps-data'`

```javascript
[
  {
    id: "step-456",
    goalId: "goal-123",
    title: "Save $50",
    description: "Weekly savings goal",
    frequency: "weekly", // daily, weekly, monthly
    amount: 50,
    completions: [
      {
        date: "Mon Dec 01 2024",
        timestamp: "2024-12-01T10:30:00.000Z"
      }
    ]
  },
  // ... more steps
]
```

---

### 3. **Todos Data**
**Storage Key**: `'todos-data'`

```javascript
[
  {
    id: "todo-789",
    title: "Make food",
    description: "Prepare dinner",
    priority: "now", // now, next, later
    timeCommitment: "short", // short, medium, long
    dueDate: "2024-12-02T00:00:00.000Z",
    linkedGoalId: "goal-123", // Optional link to goal
    completed: false,
    createdAt: "2024-12-01T10:00:00.000Z",
    isRecurring: false,
    // ... more fields
  },
  // ... more todos
]
```

---

### 4. **Mood Data**
**Storage Key**: `'mood-data'`

```javascript
{
  "Mon Dec 01 2024": {
    date: "Mon Dec 01 2024",
    mood: 4, // 1-5 rating
    notes: "Feeling great today!",
    timestamp: "2024-12-01T20:00:00.000Z"
  },
  // ... more days
}
```

---

### 5. **Journal Entries**
**Storage Key**: `'habit-tracker-journals'`

```javascript
{
  "Mon Dec 01 2024": {
    date: "Mon Dec 01 2024",
    content: "Today was productive...",
    timerSeconds: 600, // 10 minutes
    timestamp: "2024-12-01T21:00:00.000Z"
  },
  // ... more entries
}
```

---

### 6. **Reminders**
**Storage Key**: `'habit-tracker-reminders'`

```javascript
[
  {
    habitId: 1,
    enabled: true,
    time: "09:00", // HH:MM format
    days: [1, 2, 3, 4, 5], // Days of week (0=Sunday)
    snoozeDuration: 15 // minutes
  },
  // ... more reminders
]
```

---

### 7. **Streak Data**
**Storage Key**: `'habit-tracker-streaks'`

```javascript
{
  "1": { // habit ID
    currentStreak: 7,
    longestStreak: 30,
    lastCompletedDate: "Mon Dec 01 2024"
  },
  // ... more habits
}
```

---

## 🔄 How Data Operations Work

### Read Operations

#### 1. **Get All Data** (with caching)
```javascript
// src/utils/dataStorage.js

// In-memory cache to avoid repeated JSON parsing
let dataCache = null
let cacheTimestamp = null
const CACHE_TTL = 5000 // 5 seconds

export const getAllStoredData = (useCache = true) => {
  // Check if cache is still valid (within 5 seconds)
  if (useCache && dataCache && cacheTimestamp) {
    const age = Date.now() - cacheTimestamp
    if (age < CACHE_TTL) {
      return dataCache // Return cached data (fast!)
    }
  }
  
  // Cache expired - read from localStorage
  const data = localStorage.getItem('habit-tracker-data')
  dataCache = data ? JSON.parse(data) : {}
  cacheTimestamp = Date.now()
  
  return dataCache
}
```

**Why caching?**
- localStorage stores data as **strings**
- Every read requires **JSON.parse()** (expensive)
- Cache reduces parsing from every read to every 5 seconds
- Significantly improves performance

#### 2. **Get Specific Day's Data**
```javascript
export const getDayData = (dateKey) => {
  const allData = getAllStoredData()
  return allData[dateKey] || null
}

// Usage:
const today = getTodayKey() // "Mon Dec 01 2024"
const todayData = getDayData(today)
```

#### 3. **Get Date Range**
```javascript
export const getDateRange = (startDate, endDate) => {
  const allData = getAllStoredData()
  const range = []
  
  // Iterate through each day in range
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toDateString()
    if (allData[dateKey]) {
      range.push(allData[dateKey])
    }
  }
  
  return range
}
```

---

### Write Operations

#### 1. **Save Day Data** (Habits + Weight)
```javascript
export const saveDayData = (dateKey, habits, weight = null) => {
  // 1. Load all data (without cache to ensure freshness)
  const allData = getAllStoredData(false)
  
  // 2. Merge new data with existing
  allData[dateKey] = {
    ...allData[dateKey], // Preserve existing fields (mood, etc.)
    date: dateKey,
    habits: habits.map(h => ({
      id: h.id,
      name: h.name,
      emoji: h.emoji,
      category: h.category,
      completed: h.completed,
      timeOfDay: h.timeOfDay || 'anytime',
    })),
    completedCount: habits.filter(h => h.completed).length,
    totalCount: habits.length,
    weight: weight !== null ? weight : allData[dateKey]?.weight,
    timestamp: new Date().toISOString(),
  }
  
  // 3. Save to localStorage (as JSON string)
  localStorage.setItem('habit-tracker-data', JSON.stringify(allData))
  
  // 4. Clear cache (next read will be fresh)
  clearDataCache()
}
```

**Process:**
1. Load all data from localStorage
2. Update specific day's data
3. Normalize data (only store essential fields)
4. Calculate statistics (completedCount, etc.)
5. Save back to localStorage (as JSON string)
6. Clear cache

#### 2. **Save Todo**
```javascript
export const saveTodo = (todo) => {
  const todos = getAllTodos() // Load existing todos
  const existingIndex = todos.findIndex(t => t.id === todo.id)
  
  if (existingIndex >= 0) {
    todos[existingIndex] = todo // Update existing
  } else {
    todos.push(todo) // Add new
  }
  
  localStorage.setItem('todos-data', JSON.stringify(todos))
}
```

---

## 🧠 Performance Optimizations

### 1. **In-Memory Caching**
- Parsed JSON cached for 5 seconds
- Reduces expensive JSON.parse() operations
- Cache automatically invalidated on writes

### 2. **Data Normalization**
- Only essential fields stored (prevents bloat)
- Habits normalized when saved:
  ```javascript
  // Only store: id, name, emoji, category, completed, timeOfDay
  // Don't store: UI state, temporary data, etc.
  ```

### 3. **Lazy Loading**
- Components load data only when needed
- React lazy loading for pages
- Data fetched on-demand

---

## 🔗 Data Relationships

### Goals ↔ Todos
- Todos can link to goals via `linkedGoalId`
- Goals track completed todos via `completedTodosCount`
- When todo completes, goal count updates

### Habits ↔ Reminders
- Reminders reference habits via `habitId`
- Reminders stored separately but linked

### Dates ↔ All Data
- All daily data keyed by date string
- Format: `"Mon Dec 01 2024"` (from `Date.toDateString()`)
- Enables easy date-based queries

---

## 📊 Storage Keys Summary

All keys are defined in `src/constants/storageKeys.js`:

| Key | Purpose | Data Type |
|-----|---------|-----------|
| `habit-tracker-data` | Daily habits & weight | Object (date-keyed) |
| `goals-data` | User goals | Array |
| `goal-steps-data` | Goal steps/actions | Array |
| `todos-data` | Todo items | Array |
| `mood-data` | Daily mood ratings | Object (date-keyed) |
| `habit-tracker-journals` | Journal entries | Object (date-keyed) |
| `habit-tracker-reminders` | Habit reminders | Array |
| `habit-tracker-streaks` | Streak calculations | Object (habitId-keyed) |
| `reminder-logs` | Reminder history | Array |

---

## 🔐 Data Persistence

### Where is data stored?

**Browser localStorage location:**
- **Chrome/Edge (macOS)**: `~/Library/Application Support/Google Chrome/Default/Local Storage/leveldb/`
- **Chrome/Edge (Windows)**: `%LOCALAPPDATA%\Google\Chrome\User Data\Default\Local Storage\leveldb\`
- **Safari**: `~/Library/Safari/LocalStorage/`

**For Eel desktop app:**
- Data stored in the browser's localStorage
- Persists even when app is closed
- Tied to the app's origin URL

### Data Backup

The app includes export/import functionality:
- **Export**: Download all data as JSON file
- **Import**: Restore data from JSON file
- **Backup**: Automatic backups (configurable)

---

## 🛠️ Storage Utilities

### Main Storage Files

1. **`src/utils/dataStorage.js`** - Habits & weight data
2. **`src/utils/goalStorage.js`** - Goals & steps
3. **`src/utils/todoStorage.js`** - Todos
4. **`src/utils/moodStorage.js`** - Mood tracking
5. **`src/utils/journalStorage.js`** - Journal entries
6. **`src/utils/reminderStorage.js`** - Reminders
7. **`src/utils/streaksStorage.js`** - Streak calculations

Each utility provides:
- `getAll*()` - Read all data
- `save*()` - Write data
- `delete*()` - Remove data
- Helper functions for queries

---

## 🚨 Limitations & Considerations

### localStorage Limits
- **5-10 MB** storage limit (usually plenty)
- **Synchronous API** (blocks UI thread)
- **String-only** (must JSON.parse/stringify)

### Data Loss Risks
- **Browser data clearing** - User clears browser data
- **Private/Incognito mode** - Data cleared on close
- **Storage quota exceeded** - Rare but possible

### Mitigation
- ✅ Export/import feature for backups
- ✅ Automatic backup system
- ✅ Data validation on read/write
- ✅ Error handling for corrupted data

---

## 📈 Example: Complete Data Flow

### User completes a habit:

```
1. User clicks checkbox on "Brush Teeth"
   ↓
2. HabitsPage calls toggleHabit(id)
   ↓
3. Habit's completed status changes
   ↓
4. useEffect triggers saveDayData()
   ↓
5. dataStorage.saveDayData() called:
   - Loads all data from localStorage
   - Updates today's habits array
   - Calculates completedCount
   - Saves back to localStorage
   - Clears cache
   ↓
6. React re-renders with new data
   ↓
7. Streak calculations update
   ↓
8. Analytics refresh
```

---

## 🎯 Key Takeaways

1. **No server needed** - All data stored locally
2. **Date-based structure** - Easy day-by-day queries
3. **Cached reads** - Performance optimized
4. **Normalized storage** - Only essential data saved
5. **Separate keys** - Each data type isolated
6. **JSON format** - Human-readable, easy to debug
7. **Automatic persistence** - Data saves on changes

---

## 🔍 Inspecting Data

You can view your data in browser DevTools:

```javascript
// Open browser console (F12)

// View all habit data
JSON.parse(localStorage.getItem('habit-tracker-data'))

// View all todos
JSON.parse(localStorage.getItem('todos-data'))

// View all goals
JSON.parse(localStorage.getItem('goals-data'))

// Clear all data (be careful!)
localStorage.clear()
```

---

This architecture provides a simple, fast, and private data storage solution perfect for a personal desktop tracking application!

