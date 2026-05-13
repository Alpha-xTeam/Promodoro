# Pomodoro Timer - SPEC.md

## 1. Project Overview

- **Project Name**: Pomodoro Timer
- **Type**: Web Application (React SPA)
- **Core Functionality**: Timer for work sessions with break periods, tracking focus statistics
- **Target Users**: Professionals, students, anyone wanting to improve productivity

## 2. UI/UX Specification

### Layout Structure

- **Single Page App** with centered content
- **Header**: App title, settings button
- **Main Area**: Large circular timer display with controls
- **Statistics Panel**: Session history and focus metrics
- **Footer**: Minimal, app version

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Visual Design - Apple-inspired

**Color Palette**
- Background: `#000000` (pure black)
- Card Background: `#1C1C1E` (dark gray)
- Primary Accent: `#FF9500` (warm orange - for active/working)
- Secondary Accent: `#30D158` (green - for breaks)
- Text Primary: `#FFFFFF`
- Text Secondary: `#8E8E93`
- Text Muted: `#636366`

**Typography**
- Font Family: SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif
- Timer Display: 72px (desktop), 56px (mobile), light weight
- Headings: 24px semibold
- Body: 17px regular
- Small: 13px

**Spacing System**
- Base unit: 8px
- Section padding: 32px (desktop), 16px (mobile)
- Component gap: 16px

**Visual Effects**
- Cards: 20px border-radius, subtle backdrop blur
- Timer ring: Animated stroke with glow effect
- Buttons: 12px border-radius, smooth scale on hover (1.02)
- Transitions: 300ms ease-out for all interactive elements

### Components

**Timer Display**
- Circular progress ring (stroke-width: 8px)
- Time display in center (MM:SS format)
- Mode indicator below time (Work/Break)
- Pulsing glow animation when running

**Control Buttons**
- Start/Pause: Large pill button, 48px height
- Reset: Secondary button, 40px height
- Skip: Icon button for skipping to next session

**Session Tabs**
- Segmented control: Work | Short Break | Long Break
- Active state with background highlight

**Statistics Cards**
- Total Focus Time (today)
- Sessions Completed (today)
- Current Streak (days)
- Weekly chart (simple bar visualization)

**Settings Panel**
- Work duration slider (15-60 min)
- Short break slider (3-10 min)
- Long break slider (10-30 min)
- Sessions before long break (2-6)
- Sound toggle
- Dark/Light toggle (optional)

## 3. Functionality Specification

### Core Features

**Timer Logic**
- Default: 25 min work, 5 min short break, 15 min long break
- Auto-advance to break after work session
- Long break after 4 work sessions (configurable)
- Pause/resume capability
- Reset timer to current mode's default
- Skip current session

**Session Tracking**
- Store completed sessions in localStorage
- Track: date, duration, session type
- Calculate daily totals
- Calculate streak (consecutive days with 4+ sessions)

**Notifications**
- Browser notification on session complete
- Optional sound alert

**Data Persistence**
- Save settings to localStorage
- Save session history to localStorage

### User Interactions
- Click Start → Timer begins counting down
- Click Pause → Timer pauses, can resume
- Click Reset → Timer resets to mode default
- Click Skip → Move to next session type
- Click mode tab → Switch timer mode
- Drag slider → Adjust duration setting

### Edge Cases
- Tab becomes inactive: Continue timer via Web Worker or interval
- Page refresh: Restore timer state if was running
- First visit: Set default values, show welcome state

## 4. Acceptance Criteria

1. ✅ Timer counts down accurately (1 second intervals)
2. ✅ Timer transitions between work/break modes automatically
3. ✅ Statistics display correct data from localStorage
4. ✅ Settings persist across page refreshes
5. ✅ Design matches Apple aesthetic (dark mode, clean, minimal)
6. ✅ Responsive on mobile, tablet, desktop
7. ✅ Smooth animations and transitions
8. ✅ Works with pnpm as package manager