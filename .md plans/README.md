# Daily Habit Tracker

An interactive web application for tracking daily habits with a beautiful, modern UI.

## Features

- ✨ Interactive habit check-offs with smooth animations
- 📊 Progress tracking with visual progress bar
- 💾 Automatic local storage - your habits persist across sessions
- 📱 Responsive design - works on desktop and mobile
- 🎯 Pre-configured daily habits (meditate, gym, brush teeth, etc.)
- 🎉 Celebration animations when completing habits

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Default Habits

The app comes pre-configured with these daily habits:
- 🦷 Brush Teeth (AM)
- 🧘 Meditate
- 💪 Gym / Exercise
- 💧 Drink Water (8 glasses)
- 📚 Read
- 🦷 Brush Teeth (PM)
- ✍️ Journal
- 📵 No Phone 1hr Before Bed

You can easily customize these in `src/App.jsx` by modifying the `DEFAULT_HABITS` array.

## Technologies Used

- React 18
- Vite
- CSS3 (with animations and gradients)
- LocalStorage API

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── HabitItem.jsx    # Individual habit component
│   │   └── HabitItem.css
│   ├── App.jsx              # Main app component
│   ├── App.css              # App styles
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies and scripts
```
