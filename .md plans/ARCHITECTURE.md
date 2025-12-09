# Personal Tracker - Architecture Documentation

## 📐 Project Overview

**Personal Tracker** is a comprehensive desktop application for tracking daily habits, goals, todos, mood, and analytics. Built with React (frontend) and Python/Eel (desktop wrapper), it provides a semi sophisticated interface for personal data tracking.

---

## 🏗️ Architecture Overview

### Technology Stack

- **Frontend Framework**: React 18 with Hooks
- **Build Tool**: Vite (fast HMR, optimized builds)
- **Styling**: CSS3 with CSS Variables (premium design system)
- **Data Visualization**: Recharts
- **Desktop Framework**: Python Eel (Chrome/Edge app mode)
- **Packaging**: PyInstaller (standalone executables)
- **Data Persistence**: Browser localStorage

### Architecture Pattern

- **Component-Based Architecture**: React functional components with hooks
- **Separation of Concerns**: Clear separation between UI, business logic, and data
- **Lazy Loading**: Route-based code splitting for optimal performance
- **Local-First**: All data stored locally, no backend required

---

## 📁 Directory Structure

```
fictional-engine/
├── src/                          # Frontend source code
│   ├── main.jsx                  # React application entry point
│   ├── App.jsx                   # Root component (routing, layout)
│   ├── App.css                   # Root component styles
│   ├── index.css                 # Global CSS reset and base styles
│   │
│   ├── pages/                    # Page-level components (routes)
│   │   ├── HabitsPage.jsx       # Daily habit tracking page
│   │   ├── GoalsPage.jsx        # Goal management page
│   │   ├── ToDoPage.jsx         # Todo list management page
│   │   ├── AnalyticsPage.jsx     # Data analytics and visualizations
│   │   └── ReviewsPage.jsx       # Weekly/monthly review pages
│   │
│   ├── components/               # Reusable UI components
│   │   ├── habits/              # Habit-related components
│   │   │   ├── HabitItem.jsx    # Individual habit card
│   │   │   ├── HabitCalendar.jsx # Calendar heatmap view
│   │   │   ├── HabitDetailModal.jsx # Habit settings modal
│   │   │   ├── StreakBadge.jsx  # Streak display component
│   │   │   └── WeightInput.jsx  # Daily weight input
│   │   │
│   │   ├── goals/                # Goal-related components
│   │   │   ├── GoalItem.jsx      # Individual goal card
│   │   │   ├── GoalForm.jsx      # Goal creation/edit form
│   │   │   ├── StepItem.jsx      # Goal step item
│   │   │   └── StepForm.jsx      # Step creation/edit form
│   │   │
│   │   ├── todos/                # Todo-related components
│   │   │   ├── ToDoItem.jsx      # Individual todo item
│   │   │   ├── ToDoForm.jsx      # Todo creation/edit form
│   │   │   ├── RecurrenceManager.jsx # Recurring todo manager
│   │   │   └── TimeTracker.jsx   # Time tracking component
│   │   │
│   │   ├── analytics/             # Analytics components
│   │   │   ├── StatsView.jsx      # Statistics overview
│   │   │   ├── MoodInput.jsx     # Daily mood input
│   │   │   ├── MoodHistory.jsx   # Mood trend chart
│   │   │   └── MoodCorrelationChart.jsx # Mood-habit correlations
│   │   │
│   │   ├── forms/                 # Form components
│   │   │   ├── DifficultySelector.jsx # Habit difficulty selector
│   │   │   └── ReminderSettings.jsx # Reminder configuration
│   │   │
│   │   ├── modals/                # Modal dialogs
│   │   │   ├── DataExport.jsx     # Data export modal
│   │   │   ├── DataImport.jsx     # Data import modal
│   │   │   ├── BackupManager.jsx  # Backup management
│   │   │   ├── DayDetailModal.jsx # Day detail view
│   │   │   ├── WeeklyReview.jsx   # Weekly review modal
│   │   │   └── MonthlyReview.jsx  # Monthly review modal
│   │   │
│   │   └── ui/                     # Generic UI components (future)
│   │
│   ├── utils/                      # Utility functions and helpers
│   │   ├── storage/                # Data storage utilities
│   │   │   ├── dataStorage.js      # Habit/weight data storage
│   │   │   ├── goalStorage.js      # Goal data storage
│   │   │   ├── todoStorage.js      # Todo data storage
│   │   │   ├── moodStorage.js      # Mood data storage
│   │   │   ├── streaksStorage.js   # Streak calculation/storage
│   │   │   └── reminderStorage.js  # Reminder settings storage
│   │   │
│   │   ├── analytics/              # Analytics and calculations
│   │   │   ├── analytics.js        # General analytics functions
│   │   │   ├── moodCorrelations.js # Mood-habit correlations
│   │   │   ├── difficultyUtils.js  # Difficulty/effort calculations
│   │   │   └── reviewUtils.js      # Review generation
│   │   │
│   │   ├── notifications/          # Notification system
│   │   │   ├── notificationUtils.js # Browser notification API
│   │   │   └── reminderScheduler.js  # Reminder scheduling logic
│   │   │
│   │   ├── data/                   # Data management
│   │   │   ├── exportUtils.js      # Data export functionality
│   │   │   └── importUtils.js      # Data import functionality
│   │   │
│   │   ├── time/                   # Time-related utilities
│   │   │   ├── timeUtils.js        # Time calculations, greetings
│   │   │   ├── calendarUtils.js    # Calendar/date utilities
│   │   │   └── recurrenceUtils.js   # Recurring todo logic
│   │   │
│   │   └── config/                  # Configuration and constants
│   │       └── habitCategories.js  # Habit category definitions
│   │
│   ├── styles/                     # Shared styles
│   │   └── premium-shared.css      # Premium design system variables
│   │
│   └── constants/                  # Application constants
│       ├── appConstants.js         # App-wide constants
│       ├── storageKeys.js          # localStorage keys
│       └── defaultData.js          # Default habits, etc.
│
├── web/                            # Built React app (output of vite build)
│   ├── index.html                  # HTML entry point
│   └── assets/                     # Compiled JS/CSS assets
│
├── start.py                        # Python/Eel backend entry point
├── build.py                        # Build automation script
├── package.py                      # Packaging automation script
├── test_app.py                     # Testing utilities
│
├── index.html                      # Development HTML entry point
├── vite.config.js                 # Vite configuration
├── package.json                    # Node.js dependencies
├── requirements.txt                # Python dependencies
│
└── docs/                           # Documentation
    ├── ARCHITECTURE.md             # This file
    ├── IMPLEMENTATION_PLAN.md      # Feature implementation roadmap
    ├── FEATURE_SUGGESTIONS.md      # Future feature ideas
    └── STARTUP_OPTIMIZATION.md     # Performance optimization guide
```

---

## 🔄 Data Flow

### 1. **Data Storage Flow**

```
User Action → Component Handler → Utility Function → localStorage → Component Re-render
```

**Example: Completing a Habit**
1. User clicks habit checkbox
2. `HabitItem` calls `onToggle` handler
3. Handler calls `toggleHabit` in `HabitsPage`
4. `HabitsPage` updates state
5. `useEffect` saves to `dataStorage.saveDayData()`
6. `dataStorage` writes to localStorage
7. Component re-renders with updated state

### 2. **Component Hierarchy**

```
App (Root)
├── Header (Navigation)
├── Main (Page Router)
│   ├── HabitsPage
│   │   ├── HabitItem[] (mapped from habits array)
│   │   ├── WeightInput
│   │   └── StatsView
│   ├── GoalsPage
│   │   ├── GoalItem[] (mapped from goals array)
│   │   └── GoalForm
│   ├── ToDoPage
│   │   ├── ToDoItem[] (mapped from todos array)
│   │   └── ToDoForm
│   ├── AnalyticsPage
│   │   ├── StatsView
│   │   ├── MoodHistory
│   │   └── MoodCorrelationChart
│   └── ReviewsPage
│       ├── WeeklyReview
│       └── MonthlyReview
└── Footer (Conditional)
```

### 3. **State Management**

- **Local Component State**: `useState` for component-specific data
- **Derived State**: Computed from props or other state
- **Persistent State**: Stored in localStorage, loaded on mount
- **No Global State Library**: React Context could be added if needed

---

## 🗄️ Data Models

### Habit Data Structure

```javascript
{
  id: number,                    // Unique identifier
  name: string,                   // Habit name
  emoji: string,                  // Display emoji
  completed: boolean,            // Completion status for today
  category: {                     // Category object
    name: string,
    color: string,
    bgColor: string
  },
  timeOfDay: 'morning' | 'night' | 'anytime',
  difficulty: number,             // 1-5 difficulty rating
  actualTimeSpent: number,         // Minutes spent
  reminderEnabled: boolean,        // Reminder toggle
  reminderTime: string,            // "HH:MM" format
  reminderDays: boolean[]         // [Sun, Mon, Tue, ...]
}
```

### Goal Data Structure

```javascript
{
  id: string,                     // UUID
  title: string,                  // Goal title
  description: string,            // Goal description
  emoji: string,                  // Display emoji
  targetAmount: number,           // Target value
  currentAmount: number,          // Current progress
  unit: string,                   // Unit (e.g., "$", "lbs")
  frequency: 'daily' | 'weekly' | 'monthly',
  steps: Step[],                  // Array of steps
  createdAt: string,              // ISO date string
  targetDate: string              // Optional deadline
}
```

### Todo Data Structure

```javascript
{
  id: string,                     // UUID
  title: string,                  // Todo title
  description: string,            // Optional description
  completed: boolean,             // Completion status
  urgency: 'low' | 'medium' | 'high',
  timeCommitment: 'short' | 'medium' | 'long',
  dueDate: string,                // ISO date string
  createdAt: string,              // ISO date string
  completedAt: string,            // ISO date string (if completed)
  timeToCompletion: number,       // Minutes to complete
  isRecurring: boolean,           // Recurring todo flag
  recurrencePattern: string,       // 'daily', 'weekly', 'monthly'
  recurrenceInterval: number,      // Every N days/weeks/months
  nextDueDate: string,            // Next occurrence date
  recurrenceEndDate: string       // Optional end date
}
```

### Day Data Structure (localStorage)

```javascript
{
  "Mon Dec 01 2024": {
    date: "Mon Dec 01 2024",
    habits: Habit[],
    weight: number,
    completedCount: number,
    totalCount: number,
    timestamp: "2024-12-01T10:30:00.000Z"
  }
}
```

---

## 🎨 Styling Architecture

### Design System

- **CSS Variables**: Centralized in `premium-shared.css`
- **Color Palette**: Shades of black/gray with accent colors
- **Typography**: Elegant serif (Cormorant Garamond) + modern sans-serif (Inter)
- **Spacing**: Consistent spacing scale (xs, sm, md, lg, xl)
- **Shadows**: Subtle, elegant shadow system
- **Transitions**: Smooth cubic-bezier animations

### Component Styling

- **Scoped CSS**: Each component has its own `.css` file
- **BEM-like Naming**: Component-specific class names
- **CSS Variables**: Use design system variables
- **Responsive**: Mobile-first approach with media queries

---

## ⚡ Performance Optimizations

### Implemented

1. **Lazy Loading**: Pages loaded on-demand with `React.lazy()`
2. **localStorage Caching**: 5-second cache for parsed data
3. **Deferred Initialization**: Reminder scheduler starts after render
4. **Reduced Startup Delay**: 0.2s instead of 1s browser launch delay

### Future Optimizations

1. **Code Splitting**: Route-based chunks in Vite config
2. **Memoization**: `React.memo` for expensive components
3. **Virtual Scrolling**: For long lists
4. **Web Workers**: Heavy calculations off main thread

---

## 🔐 Data Persistence

### Storage Strategy

- **Primary**: Browser localStorage (persistent across sessions)
- **Backup**: Export/Import JSON functionality
- **No Cloud**: Fully local-first (privacy-focused)

### Storage Keys

- `habit-tracker-data`: Main data storage
- `habit-tracker-goals`: Goals data
- `habit-tracker-todos`: Todos data
- `habit-tracker-mood`: Mood data
- `habit-tracker-reminders`: Reminder settings
- `reminder-logs`: Reminder trigger logs

---

## 🧪 Testing Strategy

### Current State

- Manual testing during development
- No automated test suite (yet)

### Recommended Testing

1. **Unit Tests**: Jest for utility functions
2. **Component Tests**: React Testing Library
3. **Integration Tests**: User flow testing
4. **E2E Tests**: Playwright/Cypress (optional)

---

## 🚀 Build & Deployment

### Development

```bash
npm run dev        # Start Vite dev server
```

### Production Build

```bash
npm run build      # Build React app to web/
python3 build.py   # Verify build
python3 package.py # Package with PyInstaller
```

### Desktop App

1. React app built to `web/` directory
2. Python/Eel serves `web/` directory
3. PyInstaller packages Python + React into executable
4. macOS `.app` bundle created for native experience

---

## 📝 Code Style Guidelines

### JavaScript/React

- **Functional Components**: Use function components, not classes
- **Hooks**: Prefer hooks over HOCs
- **Naming**: PascalCase for components, camelCase for functions
- **Comments**: JSDoc for functions, inline comments for complex logic
- **Imports**: Group imports (React, third-party, local)

### Python

- **PEP 8**: Follow Python style guide
- **Docstrings**: Use docstrings for functions/classes
- **Type Hints**: Add type hints where helpful

### CSS

- **BEM-like**: Component-specific class names
- **Variables**: Use CSS variables from design system
- **Mobile-First**: Start with mobile, add desktop styles

---

## 🔄 Future Architecture Considerations

### Potential Improvements

1. **State Management**: Add React Context or Zustand for global state
2. **Routing**: Add React Router for proper URL routing
3. **TypeScript**: Migrate to TypeScript for type safety
4. **Backend API**: Optional cloud sync backend
5. **PWA**: Make installable as Progressive Web App
6. **Offline Support**: Service worker for offline functionality

---

## 📚 Additional Documentation

- `IMPLEMENTATION_PLAN.md`: Feature roadmap
- `FEATURE_SUGGESTIONS.md`: Future feature ideas
- `STARTUP_OPTIMIZATION.md`: Performance guide
- `README.md`: Quick start guide

---

**Last Updated**: December 2024
**Version**: 1.0.0

