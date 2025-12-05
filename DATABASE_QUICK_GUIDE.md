# Database Quick Reference Guide

## 🎯 TL;DR - How the Database Works

**Short Answer:** The app uses **browser localStorage** - a simple key-value store that saves data as JSON strings. No server, no database setup, everything stored locally on your computer.

---

## 📦 Storage Structure (Visual)

```
localStorage
│
├── 📅 "habit-tracker-data" 
│   └── Object with date keys:
│       "Mon Dec 01 2024": { habits: [...], weight: 150.5, ... }
│       "Tue Dec 02 2024": { habits: [...], weight: 151.0, ... }
│
├── ✅ "todos-data"
│   └── Array of todo objects:
│       [{ id: 1, title: "Make food", priority: "now", ... }, ...]
│
├── 🎯 "goals-data"
│   └── Array of goal objects:
│       [{ id: 1, title: "Save $300", ... }, ...]
│
├── 📊 "mood-data"
│   └── Object with date keys:
│       "Mon Dec 01 2024": { mood: 4, notes: "Great day!", ... }
│
├── 📝 "habit-tracker-journals"
│   └── Object with date keys:
│       "Mon Dec 01 2024": { content: "...", timerSeconds: 600, ... }
│
└── 🔔 "habit-tracker-reminders"
    └── Array of reminder objects:
        [{ habitId: 1, time: "09:00", days: [1,2,3,4,5], ... }, ...]
```

---

## 🔄 Read/Write Flow

### **Reading Data:**
```
1. Get from localStorage (string)
   ↓
2. JSON.parse() → JavaScript object
   ↓
3. Cache in memory (5 seconds)
   ↓
4. Return data to component
```

### **Writing Data:**
```
1. Modify JavaScript object
   ↓
2. JSON.stringify() → string
   ↓
3. Save to localStorage
   ↓
4. Clear cache (force fresh read next time)
```

---

## 🗃️ Data Organization

### **By Date (Habits, Mood, Journal)**
```javascript
{
  "Mon Dec 01 2024": { /* day's data */ },
  "Tue Dec 02 2024": { /* day's data */ }
}
```
- Each day is a key
- Easy to query by date
- Historical data preserved

### **By Array (Todos, Goals)**
```javascript
[
  { id: 1, ... },
  { id: 2, ... }
]
```
- All items in one array
- Easy to add/remove items
- Can filter/sort easily

---

## ⚡ Performance Features

1. **5-Second Cache** - Reduces JSON parsing
2. **Normalized Data** - Only essential fields stored
3. **Lazy Loading** - Data loaded when needed

---

## 📍 Data Location

**Physical Storage:**
- macOS Chrome: `~/Library/Application Support/Google Chrome/Default/Local Storage/`
- Data persists after app closes
- Tied to browser profile

**In Your App:**
- Access via browser DevTools console
- Export/Import feature for backups
- Can view as JSON

---

## 🛠️ Common Operations

### **View Your Data:**
```javascript
// In browser console (F12)
localStorage.getItem('habit-tracker-data')  // See all habits
localStorage.getItem('todos-data')          // See all todos
localStorage.getItem('goals-data')          // See all goals
```

### **Backup Your Data:**
- Use the app's Export feature (Settings/Backup)
- Downloads all data as JSON file
- Can restore later with Import

### **Clear All Data:**
```javascript
// ⚠️ WARNING: This deletes everything!
localStorage.clear()
```

---

## 💡 Key Concepts

| Concept | Explanation |
|---------|-------------|
| **localStorage** | Browser storage that persists data |
| **Date Keys** | Days stored as "Mon Dec 01 2024" strings |
| **JSON Format** | All data stored as JSON strings |
| **Cache** | In-memory copy (5 sec) to speed up reads |
| **Normalization** | Only essential fields stored (no UI state) |

---

## 🔗 Data Relationships

```
Goals ←→ Todos (via linkedGoalId)
  ↓
Habits ←→ Reminders (via habitId)
  ↓
All data ←→ Dates (via date keys)
```

---

## ✅ Pros & Cons

### ✅ **Pros:**
- No server needed
- Fast (local storage)
- Works offline
- Private (data stays local)
- Simple to use

### ❌ **Cons:**
- Limited to ~5-10 MB
- Only works in browser
- Data tied to browser profile
- No cloud sync

---

**For more details, see:** `DATABASE_ARCHITECTURE.md`

