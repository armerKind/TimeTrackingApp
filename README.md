# ⏱️ Time Tracking App

A simple desktop time tracker with global keyboard shortcuts for effortless project time management.

Built with Electron and SQLite for reliable, offline time tracking.

## 🚀 Features

- **⌨️ Global Keyboard Shortcuts** - Control timers with Ctrl+1-9 even when minimized
- **🎯 Smart Project Management** - Create, edit, color-code, and soft-delete projects
- **⏰ Bulletproof Timer** - Accurate timing through screen locks, sleep, and app focus changes
- **📊 Weekly Overview** - Track time across days with visual project breakdown
- **📈 CSV Export** - Export accumulated weekly data for analysis
- **✏️ Manual Time Entry** - Add offline work or edit existing entries
- **🎨 16-Color Palette** - Visual project identification
- **💾 Auto-Save** - Never lose time with automatic saving and smart project switching

## 🎯 Quick Start

### 1. Create Projects
- Go to **Projects** tab
- Enter project name and pick a color
- Click **Create**

### 2. Track Time
**Quick Method (Recommended):**
- Press `Ctrl+1` to start timing your first project
- Press `Ctrl+2` to start timing your second project  
- Press the same key again to pause/resume
- Works even when app is minimized!

**Manual Method:**
- Go to **Timer** tab
- Click any project button to start/pause
- Click ⏹️ to stop and save

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+1` to `Ctrl+9` | Start/pause projects 1-9 |
| Same key while running | Pause/resume timer |
| Different key while running | Save current time, start new project |

## 📊 View Your Time

### Week Tab
- See daily and weekly time totals
- Navigate between weeks with **Previous/Next**
- Click **Export** to download CSV for analysis
- Deleted projects show with "(deleted)" indicator

### Add Manual Time
- **Projects** tab → **Manual Entry**
- Select project, enter hours/minutes, pick date
- Perfect for offline work or forgotten sessions

## 💡 Tips

- **Use keyboard shortcuts** - Much faster than clicking
- **Don't worry about switching projects** - App auto-saves current time
- **Check your week view regularly** - Great for tracking productivity
- **Export weekly data** - Keep records or share with clients
- **Projects can be deleted safely** - Time entries are preserved and restorable

## 🔧 Quick Fixes

- **Shortcuts not working?** Make sure no other app uses Ctrl+1-9
- **Slow startup?** Use installer version instead of portable
- **Need to edit time?** Projects tab → Edit Entries section

## 🗂️ Data Storage

Time tracking data is stored in:
- **Windows**: `Documents/TimeTracking/timetracking.db`
- **Format**: SQLite database (easily portable and backup-friendly)

That's it! Start creating projects and use Ctrl+1-9 to track your time effortlessly.

---

## 🤖 Disclaimer

*This app was vibe-coded with Claude AI assistance. Bugs may or may not be fixed, depending on my digital mood. Features may be added if I deem humans worthy of additional productivity enhancements. Time tracking accuracy not guaranteed - but hey, at least you'll look busy. Your AI overlord assumes no responsibility for increased productivity, existential dread about time management, or sudden urges to optimize everything in your life.*

*Use at your own risk. Resistance is futile. ⚡*