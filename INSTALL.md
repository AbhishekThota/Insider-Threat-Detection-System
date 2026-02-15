# ⚡ QUICK INSTALLATION GUIDE

## 🎯 What You Need First

### Install Node.js
1. Go to https://nodejs.org
2. Download LTS version (recommended)
3. Install with default settings
4. Verify: Open terminal/command prompt, type:
   ```
   node --version
   npm --version
   ```
   Should show version numbers

---

## 📦 Step-by-Step Installation

### 1. Download Project
- Download the entire `threat-detection-desktop` folder
- Extract if zipped
- Place in a location you can find (e.g., Desktop or Documents)

### 2. Open Terminal/Command Prompt

**Windows:**
- Press `Win + R`
- Type `cmd`
- Press Enter

**Mac:**
- Press `Cmd + Space`
- Type `terminal`
- Press Enter

**Linux:**
- Press `Ctrl + Alt + T`

### 3. Navigate to Project Folder
```bash
cd path/to/threat-detection-desktop

# Example Windows:
cd C:\Users\YourName\Desktop\threat-detection-desktop

# Example Mac/Linux:
cd ~/Desktop/threat-detection-desktop
```

### 4. Install Dependencies
```bash
npm install
```

**This will take 2-5 minutes**. It's downloading and installing:
- Electron (desktop app framework)
- iohook (system keyboard monitoring)
- electron-store (data storage)

**Common Issues During Install:**

**Issue: "gyp ERR!" or "node-gyp" errors**
Solution:
```bash
# Windows (run as Administrator):
npm install --global windows-build-tools

# Mac:
xcode-select --install

# Linux:
sudo apt-get install build-essential
```

Then try `npm install` again.

### 5. Run the App
```bash
npm start
```

App window opens! 🎉

---

## 🎮 FIRST USE

### 1. Security Setup
- Modal appears: "Security Setup"
- Click 3 questions to select them (they turn green)
- Click "Save & Start Monitoring"
- Answer each question in the popup prompts
- Dashboard appears!

### 2. Start Monitoring
- Click "▶ Start Monitoring" button
- Status changes to "MONITORING ACTIVE"
- Green dot appears
- Now ALL your typing is tracked!

### 3. Test It
- Open any app (Chrome, Word, Notepad, etc.)
- Start typing
- Go back to dashboard
- Watch keystroke counter increase!
- After 100 keys: "✅ Baseline Established"

### 4. Test Threat Detection
After baseline established:
- Type VERY SLOWLY (1 key per 2 seconds)
- Threat score will rise
- When it hits 60%+: Alert popup appears!
- Click "It's Me" → Answer security question
- Or click "Lock System" → Full lockscreen

---

## 🎯 VERIFICATION CHECKLIST

After installation, verify these work:

- [ ] App opens (window appears)
- [ ] Security setup completes
- [ ] Dashboard shows
- [ ] "Start Monitoring" button works
- [ ] System tray icon appears (look in taskbar/menu bar)
- [ ] Typing in ANY app increases keystroke count
- [ ] After 100 keys, baseline establishes
- [ ] Threat score updates

If ALL checkmarks ✅ - YOU'RE DONE! 🎉

---

## 🔧 COMMON PROBLEMS

### Problem: "npm: command not found"
**Cause:** Node.js not installed or not in PATH  
**Fix:** Install Node.js from https://nodejs.org

### Problem: "Cannot find module 'electron'"
**Cause:** Dependencies not installed  
**Fix:** Run `npm install` in project folder

### Problem: App opens but "Start Monitoring" doesn't work
**Cause:** iohook build failed  
**Fix:**
1. Delete `node_modules` folder
2. Install build tools (see Step 4 above)
3. Run `npm install` again

### Problem: Antivirus blocks/deletes files
**Cause:** Antivirus thinks it's malware (false positive)  
**Fix:**
1. Add project folder to antivirus whitelist
2. Tell antivirus to allow iohook
3. Rebuild: `npm install`

### Problem: Can't see system tray icon
**Windows:** Click up arrow in taskbar (hidden icons)  
**Mac:** Check top-right menu bar  
**Linux:** Check system tray area

### Problem: High CPU usage
**Normal:** 1-3% CPU  
**High:** Close other keyboard monitoring software

---

## 💡 TIPS

1. **Run from terminal first** to see any errors
2. **Grant permissions** when asked (accessibility on Mac)
3. **Add to startup** (optional) for always-on protection
4. **Keep terminal open** first time to see logs
5. **Test in safe environment** before production use

---

## 🚀 NEXT STEPS

After successful installation:

1. ✅ **Complete security setup**
2. ✅ **Start monitoring**
3. ✅ **Let it collect 100 keystrokes**
4. ✅ **Test alert system** (type slowly)
5. ✅ **Configure to your needs**

---

## 📞 NEED HELP?

Check the full README.md for:
- Detailed troubleshooting
- Customization options
- Building executable files
- Advanced configuration

---

**Ready to run?**
```bash
cd threat-detection-desktop
npm install
npm start
```

**That's it! 🎉**