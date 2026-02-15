# 🖥️ ThreatGuard Desktop - System-Wide Insider Threat Detection

**Real-time behavioral biometric authentication across your entire system**

![Version](https://img.shields.io/badge/Version-1.0-00ff88) ![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Mac%20%7C%20Linux-blue) ![Electron](https://img.shields.io/badge/Electron-28.0-purple)

---

## 🎯 WHAT THIS IS

A **desktop application** that monitors ALL typing across your entire computer system:
- ✅ Chrome browser
- ✅ Microsoft Word
- ✅ Email clients
- ✅ Notepad/TextEdit
- ✅ Slack, Teams, Discord
- ✅ ANY application where you type!

---

## ✨ KEY FEATURES

### 🌐 System-Wide Monitoring
- Tracks typing in **ALL applications**
- Runs in background
- System tray icon
- Global keyboard shortcuts
- No need to type in specific text box

### 🧠 Machine Learning Detection
- Random Forest classifier
- Establishes baseline after 100 keystrokes
- Real-time threat scoring
- Behavioral biometric analysis

### 🔒 Security Challenge System
- Identity verification
- 3 security questions
- 3 attempts maximum
- Full system lock on failure

### 📊 Live Dashboard
- Real-time stats
- Threat visualization
- Activity log
- System status monitor

---

## 📦 INSTALLATION

### Prerequisites
- Node.js (v16 or higher)
- npm (comes with Node.js)

### Step 1: Install Dependencies
```bash
cd threat-detection-desktop
npm install
```

This installs:
- `electron` - Desktop app framework
- `iohook` - System-wide keyboard monitoring
- `electron-store` - Persistent storage

### Step 2: Run the App
```bash
npm start
```

---

## 🚀 HOW IT WORKS

### First Launch

1. **Security Setup**
   ```
   App opens → Security setup modal
   ↓
   Select 3 questions (click to select)
   ↓
   Click "Save & Start Monitoring"
   ↓
   Prompts for answers to each question
   ↓
   Dashboard appears
   ```

2. **Start Monitoring**
   ```
   Click "▶ Start Monitoring" button
   ↓
   System tray shows "Monitoring: ON"
   ↓
   Now ALL your typing is tracked!
   ```

### Normal Operation

```
Type anywhere on your computer:
├── Chrome: Writing email in Gmail ✅
├── Word: Working on document ✅
├── Slack: Sending messages ✅
├── Code Editor: Writing code ✅
└── ANY app with text input ✅

Dashboard updates automatically:
├── Keystroke count increases
├── WPM calculated
├── Dwell time tracked
└── Threat score computed
```

### Baseline Establishment

```
After 100 system-wide keystrokes:
├── Baseline profile created
├── "✅ Baseline Established" appears
├── ML model starts comparing patterns
└── Threat detection active
```

### Threat Detection

```
Normal typing (You):
├── Dwell: 100ms, Speed: 65 WPM
└── Threat: 10-25% (Green - Normal)

Different typing (Someone else):
├── Dwell: 150ms, Speed: 35 WPM
└── Threat: 70% (Red - Alert!)

Alert Appears:
├── Popup in corner
├── "It's Me" or "Lock System"
├── Click "It's Me" → Security question
└── Wrong 3x → Full system lock
```

---

## 🎮 USAGE SCENARIOS

### Scenario 1: Coffee Break
```
You: Leave laptop unlocked, go for coffee
Colleague: Sits down, starts typing
System: Detects different pattern → Alert
Colleague: Clicks "It's Me" → Can't answer your security question
System: LOCKS after 3 wrong attempts
```

### Scenario 2: Different Mood
```
You: Normally type 60 WPM
You: Today tired, typing 40 WPM
System: Detects change → Alert
You: Click "It's Me" → Answer security question correctly
System: ✅ Verified → Adjusts baseline to current state
```

---

## 🎛️ CONTROLS

### System Tray Menu
```
Right-click tray icon:
├── Open Dashboard
├── Monitoring Status (ON/OFF)
├── Start/Stop Monitoring
└── Quit
```

### Dashboard Buttons
- **▶ Start Monitoring** - Begin system-wide tracking
- **⏸ Stop Monitoring** - Pause tracking
- **Reset Session** - Clear data, start fresh
- **Export Data** - Download JSON with metrics

### Global Shortcuts
- **Ctrl+Shift+T** (Windows/Linux)
- **Cmd+Shift+T** (Mac)
- Opens dashboard from anywhere

---

## 📊 MONITORED METRICS

### Real-Time Stats
1. **System Keystrokes** - Total keys pressed across all apps
2. **WPM** - Words per minute (typing speed)
3. **Avg Dwell Time** - How long keys are held
4. **Session Time** - Monitoring duration

### Threat Analysis
- **Threat Score** - 0-100% (ML calculated)
- **Status Badge** - Green/Yellow/Red
- **Baseline Status** - Established or collecting
- **Activity Monitor** - Current app, threat level

### Activity Log
- Timestamped events
- Security alerts
- System status changes
- User actions

---

## 🔐 PRIVACY & SECURITY

### What is Monitored:
✅ **Timing patterns** (when keys pressed/released)  
✅ **Key codes** (which key, but not for recording)  
✅ **Typing speed and rhythm**  
✅ **Statistical patterns**  

### What is NOT Monitored:
❌ **Actual text content**  
❌ **Passwords**  
❌ **Sensitive information**  
❌ **Screen content**  

### Data Storage:
- All data stored **locally** on your computer
- Security answers encrypted
- No cloud sync
- No external servers

---

## 🛠️ TECHNICAL DETAILS

### Architecture
```
Main Process (main.js)
├── Electron app lifecycle
├── iohook (system-wide keyboard monitoring)
├── ML threat analysis
├── IPC communication
└── System tray management

Renderer Process (renderer.js)
├── Dashboard UI
├── Real-time updates
├── Security modals
└── User interactions

Storage (electron-store)
├── Security configuration
├── User preferences
└── Persistent data
```

### System Requirements
- **OS**: Windows 10+, macOS 10.13+, Linux (Ubuntu 18+)
- **RAM**: 100MB minimum
- **CPU**: Any modern processor
- **Disk**: 150MB

### Technologies
- **Electron** - Cross-platform desktop framework
- **iohook** - Native keyboard hooks
- **Node.js** - Backend runtime
- **HTML/CSS/JS** - Frontend interface

---

## 📱 BUILD EXECUTABLES

### Windows (.exe)
```bash
npm run build-win
```
Output: `dist/ThreatGuard Setup 1.0.0.exe`

### macOS (.dmg)
```bash
npm run build-mac
```
Output: `dist/ThreatGuard-1.0.0.dmg`

### Linux (.AppImage)
```bash
npm run build-linux
```
Output: `dist/ThreatGuard-1.0.0.AppImage`

---

## 🐛 TROUBLESHOOTING

### Issue: "npm install" fails with iohook error
**Solution:**
```bash
# Install build tools first
# Windows:
npm install --global windows-build-tools

# Mac:
xcode-select --install

# Linux:
sudo apt-get install build-essential
```

### Issue: Monitoring doesn't start
**Solution:**
- Check permissions (may need admin on Windows)
- Restart app as administrator
- Check firewall/antivirus settings

### Issue: Can't see system tray icon
**Solution:**
- **Windows**: Check hidden icons in taskbar
- **Mac**: Look in menu bar (top-right)
- **Linux**: Check system tray area

### Issue: High CPU usage
**Solution:**
- Normal: 1-3% CPU when monitoring
- If higher: Check for interference with other keyboard tools
- Stop other keystroke logging software

---

## ⚠️ IMPORTANT NOTES

### Permissions
- **Windows**: May require admin rights first run
- **Mac**: System Preferences → Security → Accessibility
- **Linux**: Usually works without extra permissions

### Antivirus Warnings
Some antivirus software may flag this as "keylogger" because it monitors keystrokes. This is normal - add to whitelist.

### Background Running
App runs in system tray. Closing window doesn't quit app - use "Quit" from tray menu.

---

## 🎨 CUSTOMIZATION

### Change Threat Threshold
Edit `main.js`:
```javascript
// Line ~180
if (threatScore > 60) { // Change 60 to your value
    showThreatAlert(threatScore);
}
```

### Change Baseline Size
Edit `main.js`:
```javascript
// Line ~151
if (!baseline && totalKeystrokes >= 100) { // Change 100
    baseline = features;
}
```

### Change Security Attempts
Edit `renderer.js`:
```javascript
// Line ~5
maxAttempts: 3, // Change to 5, 10, etc.
```

---

## 📋 FILE STRUCTURE

```
threat-detection-desktop/
├── package.json          # Dependencies & build config
├── main.js               # Main Electron process
├── renderer.js           # Frontend JavaScript
├── index.html            # Dashboard UI
├── style.css             # Styling
├── README.md             # This file
└── assets/               # Icons (create this folder)
    ├── icon.png
    ├── icon.ico          # Windows
    └── icon.icns         # macOS
```

---

## 🚧 LIMITATIONS

### Current Version:
- ✅ Tracks typing patterns
- ✅ ML threat detection
- ✅ Security challenges
- ❌ No remote alerts (email/SMS)
- ❌ No multi-user support
- ❌ No centralized logging

### Future Enhancements:
- Email/SMS alerts
- Admin dashboard
- Multi-user management
- Cloud sync (optional)
- Mobile companion app
- Hardware key support

---

## 📖 USAGE TIPS

1. **Let it learn**: Type normally for first 100 keystrokes
2. **Keep running**: Best protection when always on
3. **Test it**: After setup, try typing slowly to see alert
4. **Check logs**: Activity log shows all events
5. **Use shortcuts**: Ctrl+Shift+T for quick dashboard access

---

## 🤝 SUPPORT

### Getting Help
- Check this README first
- Review error messages in dashboard log
- Run `npm start` from terminal to see errors

### Common Questions

**Q: Does this record my passwords?**  
A: No! Only timing patterns, never content.

**Q: Can I use with other security software?**  
A: Yes, but avoid other keystroke loggers.

**Q: Will it slow down my computer?**  
A: No, uses <3% CPU and <100MB RAM.

**Q: Can employer see my personal typing?**  
A: All data stored locally. No remote access.

---

## 📜 LICENSE

MIT License - Free to use, modify, and distribute.

---

## ⚡ QUICK START CHECKLIST

- [ ] Install Node.js
- [ ] Run `npm install`
- [ ] Run `npm start`
- [ ] Complete security setup (3 questions)
- [ ] Click "Start Monitoring"
- [ ] Type anywhere on your computer
- [ ] Watch dashboard update in real-time!

---

**🔒 Protecting Your System Through Behavioral Biometrics**  
**Made with 💚 Electron + Node.js + Machine Learning**