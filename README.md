# 🖥️ ThreatGuard Desktop  
## System-Wide Insider Threat Detection Using Behavioral Biometrics

Real-time user verification based on **keystroke dynamics** across the entire system.

---

## 📌 Overview

ThreatGuard Desktop is a **desktop security application** built with **Electron** that performs **continuous, system-wide user verification** using behavioral biometrics.

Instead of relying solely on passwords or traditional authentication methods, the application analyzes **typing behavior patterns** (speed, timing, rhythm) to determine whether the current user matches the authorized profile.

The app runs **locally**, operates in the **background**, and provides **real-time threat detection** through an interactive dashboard.

---

## ⚠️ Disclaimer

This project is a **proof-of-concept** for behavioral biometric security research.

It is intended for **personal, academic, or explicitly authorized environments only**.  
Monitoring user input without consent may violate local laws or organizational policies.

The author assumes **no responsibility for misuse** of this software.

---

## 🎯 Key Features

### 🌐 System-Wide Monitoring
- Tracks typing behavior across **all applications**
- Runs silently in the background
- System tray integration
- Global keyboard shortcuts
- No dependency on specific input fields

### 🧠 Behavioral Threat Detection
- Keystroke dynamics analysis
- Baseline creation after sufficient activity
- Continuous real-time threat scoring
- Detects deviations in typing patterns

### 🔒 Security Challenge System
- Identity verification using security questions
- Limited verification attempts
- Optional system lock on repeated verification failure

### 📊 Live Dashboard
- Real-time keystroke statistics
- Threat score visualization
- Activity and event log
- System monitoring status

---

## 🏗️ Architecture

### Main Process (`main.js`)
- Electron application lifecycle
- System-wide keyboard monitoring
- Behavioral analysis & threat scoring
- IPC communication
- System tray management

### Renderer Process (`renderer.js`)
- Dashboard UI
- Real-time updates
- Security modals
- User interaction handling

### Storage
- Local persistent storage
- Security configuration
- User preferences
- Session data

---

## 🛠️ Technology Stack

- **Electron**
- **Node.js (v18 LTS required)**
- **HTML / CSS / JavaScript**
- **Native system input hooks**
- **Local persistent storage**

---

## 📦 Installation

### Prerequisites
- **Node.js v18 LTS**
- npm (included with Node.js)

cd threat-detection-desktop
npm install

###🚀 How It Works
First Launch

Application starts

Security setup modal appears

User selects security questions

Answers are stored securely

Dashboard opens

Monitoring

User starts monitoring from the dashboard

Typing behavior is analyzed system-wide

Baseline profile is created after sufficient activity

Threat score updates continuously

Threat Detection

Normal typing → Low threat score

Deviating behavior → Elevated threat score

Alert prompts verification

Optional system lock on repeated failure

📊 Monitored Metrics
Behavioral Metrics

Typing speed (WPM)

Key dwell time

Timing consistency

Session duration

Threat Analysis

Threat score (0–100%)

Baseline status

Activity classification

Event history

🔐 Privacy & Data Handling
What Is Monitored

Keystroke timing patterns

Typing rhythm and speed

Statistical metadata

What Is NOT Monitored

Actual text content

Passwords

Screen activity

Personal data

Data Storage

All data stored locally

No cloud services

No external servers

No network transmission

🎛️ Controls
System Tray

Open dashboard

Start / stop monitoring

View status

Quit application

Keyboard Shortcut

Ctrl + Shift + T (Windows/Linux)

Cmd + Shift + T (macOS)

🚧 Limitations

Single-user baseline

No remote alerts

No multi-device synchronization

Local-only analysis

🔮 Future Enhancements

Multi-user support

Remote alerting

Admin dashboard

Centralized logging

Optional cloud sync

Mobile companion app

📜 License

© 2026 Abhi. All rights reserved.

This repository is provided for viewing and educational purposes only.
No permission is granted to use, copy, modify, or redistribute this code.
