# Styling Guide - Personal Tracker

This document explains the styling architecture and where to find styles for different parts of the application.

---

## 📁 CSS File Organization

### Core Styles (Global)

1. **`src/index.css`**
   - Global CSS reset
   - Base body styles
   - Fallback styles
   - **Purpose**: Sets up the foundation for all styles

2. **`src/App.css`**
   - Main application layout
   - Header and navigation styles
   - Habit grid layout
   - Progress bars
   - Responsive breakpoints
   - **Purpose**: Core app structure and layout

3. **`src/styles/premium-shared.css`**
   - Reusable modal styles
   - Form components
   - Button variants
   - Card components
   - **Purpose**: Shared components used across pages

### Component Styles (Scoped)

4. **`src/components/habits/HabitItem.css`**
   - Individual habit card styling
   - Checkbox and checkmark
   - Badges (time, category, reminder)
   - Completion animations
   - **Purpose**: Styling for habit items in the list

5. **Page-Specific Styles:**
   - `src/pages/AnalyticsPage.css` - Analytics dashboard
   - `src/pages/GoalsPage.css` - Goals page
   - `src/pages/ToDoPage.css` - Todos page
   - `src/pages/ReviewsPage.css` - Reviews page

6. **Component-Specific Styles:**
   - Each component has its own CSS file in the same directory
   - Example: `src/components/analytics/StatsView.css`

---

## 🎨 Design System

### CSS Custom Properties (Variables)

All design tokens are defined in **`src/App.css`** under `:root`:

#### Colors
- **Black/Gray Palette**: Shades of black and gray for sophisticated look
- **Accent Colors**: Emerald, Sapphire, Amber (used sparingly)
- **Light Colors**: Platinum, Ivory, Cream for contrast

#### Typography
- **Elegant Font**: `Cormorant Garamond` (serif) - for headings
- **Modern Font**: `Inter` (sans-serif) - for body text and UI

#### Spacing Scale
- `--spacing-xs`: 0.5rem (8px)
- `--spacing-sm`: 1rem (16px)
- `--spacing-md`: 1.5rem (24px)
- `--spacing-lg`: 2rem (32px)
- `--spacing-xl`: 3rem (48px)

#### Shadows
- `--shadow-subtle`: Subtle depth
- `--shadow-elegant`: Moderate depth
- `--shadow-premium`: Strong depth
- `--shadow-glow`: Glowing effect

#### Transitions
- `--transition-smooth`: Standard transitions
- `--transition-elegant`: Slower, more elegant transitions

---

## 📍 Where to Find Styles For...

### App Layout & Navigation
- **Location**: `src/App.css`
- **Sections**: 
  - `.app-header` - Header with title and date
  - `.main-nav-tabs` - Top navigation (Habits, Goals, etc.)
  - `.app-main` - Main content area

### Habit Items
- **Location**: `src/components/habits/HabitItem.css`
- **Key Classes**:
  - `.habit-item` - Main habit card
  - `.habit-checkbox` - Completion checkbox
  - `.habit-badges` - Badge container
  - `.habit-item.completed` - Completed state

### Habit Grid Layout
- **Location**: `src/App.css`
- **Sections**:
  - `.habits-container` - Grid container
  - `.habit-category-column` - Individual category column
  - `.category-header` - Category header
  - `.category-habits` - Habits within category

### Forms & Modals
- **Location**: `src/styles/premium-shared.css`
- **Key Classes**:
  - `.premium-modal` - Modal container
  - `.premium-form` - Form container
  - `.premium-btn-primary` - Primary buttons
  - `.premium-btn-secondary` - Secondary buttons

### Progress Bars
- **Location**: `src/App.css`
- **Sections**:
  - `.progress-bar` - Progress track
  - `.progress-fill` - Progress indicator

### Charts & Analytics
- **Location**: `src/pages/AnalyticsPage.css`
- **Purpose**: Styles for Recharts visualizations

---

## 🎯 Design Principles

### 1. **Glassmorphism**
- Semi-transparent backgrounds
- Backdrop blur effects
- Creates depth and elegance

### 2. **Smooth Animations**
- All interactions have smooth transitions
- Uses cubic-bezier easing functions
- Provides polished feel

### 3. **Visual Hierarchy**
- Typography scale (larger headings, smaller body)
- Color contrast (light text on dark backgrounds)
- Spacing scale for consistent rhythm

### 4. **Responsive Design**
- Mobile-first approach
- Breakpoints at 768px and 480px
- Flexible grid layouts

### 5. **Accessibility**
- High contrast for readability
- Large clickable areas
- Clear visual feedback

---

## 🔧 Making Style Changes

### Changing Colors

Edit CSS variables in `src/App.css`:
```css
:root {
  --platinum: #E5E4E2;  /* Change this value */
}
```

### Changing Spacing

Edit spacing variables in `src/App.css`:
```css
:root {
  --spacing-lg: 2rem;  /* Change this value */
}
```

### Changing Typography

Edit font variables in `src/App.css`:
```css
:root {
  --font-elegant: 'Your Font', serif;
  --font-modern: 'Your Font', sans-serif;
}
```

### Adding New Styles

1. **Component-specific**: Add to component's CSS file
2. **Global/reusable**: Add to `premium-shared.css`
3. **Layout**: Add to `App.css`

---

## 📝 Style Documentation Status

### ✅ Fully Documented
- `src/App.css` - Main application styles
- `src/index.css` - Global reset
- `src/styles/premium-shared.css` - Shared components
- `src/components/habits/HabitItem.css` - Habit items

### ⚠️ Needs Documentation
- Page-specific CSS files (AnalyticsPage, GoalsPage, etc.)
- Component-specific CSS files
- Modal CSS files

**Note**: All files have been commented with comprehensive explanations explaining what each section does and how it contributes to the app's appearance.

---

## 🎨 Visual Features Explained

### Glassmorphism
- Used in: Headers, modals, cards
- Effect: Semi-transparent backgrounds with blur
- Purpose: Modern, elegant depth

### Gradient Backgrounds
- Used in: App background, text effects
- Effect: Smooth color transitions
- Purpose: Sophisticated appearance

### Hover Effects
- Used in: Buttons, cards, navigation
- Effect: Lift, glow, scale transformations
- Purpose: Interactive feedback

### Completion Animations
- Used in: Habit items when completed
- Effect: Pulse, scale, rotate
- Purpose: Visual celebration and feedback

---

**Last Updated**: December 2024  
**All styles are fully commented with explanations**

