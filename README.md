# Personal Tracker

A comprehensive desktop application for tracking daily habits, goals, todos, mood, and analytics. Built with React and packaged as a standalone desktop app using Python Eel.

## ✨ Features

- **Habit Tracking**: Track daily habits with categories, streaks, and time-based filtering
- **Goal Management**: Create goals with daily/weekly/monthly steps
- **Todo Lists**: Manage todos with urgency, time commitment, and due dates
- **Mood Tracking**: Log daily mood and see correlations with habit completion
- **Analytics Dashboard**: Comprehensive analytics and visualizations
- **Weekly/Monthly Reviews**: Automated review generation
- **Reminders**: Habit reminders with customizable schedules
- **Data Export/Import**: Backup and restore your data
- **Calendar Heatmap**: Visual calendar showing habit completion

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Python 3.7+ (for desktop app)
- Microsoft Edge or Google Chrome (for desktop app)

### Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Navigate to the URL shown in terminal (usually `http://localhost:5173`)

### Building for Production

1. **Build React app:**
   ```bash
   npm run build
   ```

2. **Preview production build:**
   ```bash
   npm run preview
   ```

## 🖥️ Desktop Application

### Setup

1. **Create Python virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Build React app:**
   ```bash
   npm run build
   ```

### Running Desktop App

**Development:**
```bash
source venv/bin/activate
python3 start.py
```

**Packaging:**
```bash
# Build React app first
npm run build

# Package with PyInstaller
source venv/bin/activate
python3 package.py

# Create macOS app bundle
./create_app_bundle.sh

# Install to Applications (macOS)
cp -r dist/PersonalTracker.app /Applications/
```

See `PACKAGING.md` for detailed packaging instructions.

## 📁 Project Structure

```
fictional-engine/
├── src/                    # React source code
│   ├── components/         # Reusable components
│   ├── pages/              # Page components
│   ├── utils/              # Utility functions
│   ├── constants/          # App constants
│   └── styles/             # Shared styles
├── web/                    # Built React app (output)
├── start.py                # Python/Eel backend
├── build.py                # Build automation
├── package.py              # Packaging automation
└── requirements.txt        # Python dependencies
```

## 🛠️ Technologies

- **Frontend**: React 18, Vite
- **Styling**: CSS3 with CSS Variables
- **Charts**: Recharts
- **Desktop**: Python Eel, PyInstaller
- **Storage**: Browser localStorage

## 📊 Data Storage

All data is stored locally in browser localStorage:
- Habits and weight data
- Goals and steps
- Todos
- Mood entries
- Reminder settings
- Streak data

Data can be exported/imported as JSON for backup.

## 🎨 Features in Detail

### Habit Tracking
- Color-coded categories (Health, Fitness, Nutrition, Mental, Lifestyle, Avoidance)
- Morning/Night/Anytime filtering
- Streak tracking
- Reminder notifications
- Calendar heatmap view

### Goals
- Custom goals with target amounts
- Daily/Weekly/Monthly step tracking
- Progress visualization
- Step completion tracking

### Todos
- Urgency levels (Low, Medium, High)
- Time commitment (Short, Medium, Long)
- Due dates
- Recurring todos
- Completion tracking

### Analytics
- Habit completion rates
- Productivity trends
- Mood history and correlations
- Todo statistics
- Calendar heatmap

## 🔧 Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Style

- Use functional components with hooks
- Follow JSDoc documentation standards
- Use constants from `src/constants/`
- Keep components modular and reusable

## 📝 Documentation

All documentation has been organized into the [`docs/`](./docs/) directory:

- **[Setup Guides](./docs/setup/)** - Build, installation, and setup instructions
- **[Feature Documentation](./docs/features/)** - Detailed feature documentation
- **[Development Guides](./docs/development/)** - Architecture, refactoring, and technical docs
- **[User Guides](./docs/user-guides/)** - End-user documentation

See [docs/README.md](./docs/README.md) for a complete documentation index.

## 🐛 Troubleshooting

### Desktop App Issues

- **App won't launch**: Check that Chrome/Edge is installed
- **App opens in Safari**: Install Microsoft Edge or Google Chrome
- **Build errors**: Ensure `npm run build` completed successfully
- **Port conflicts**: Change `FIXED_PORT` in `start.py`

### Development Issues

- **Module not found**: Run `npm install`
- **Build fails**: Check Node.js version (v18+)
- **Hot reload not working**: Restart dev server

## 📄 License

This project is for personal use.

## 🙏 Acknowledgments

Built with React, Vite, Recharts, Python Eel, and PyInstaller.

---

**Version**: 1.0.0  
**Last Updated**: December 2024

