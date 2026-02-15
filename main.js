const { app, BrowserWindow, Tray, Menu, ipcMain, globalShortcut, screen } = require('electron');
const path = require('path');
const ioHook = require('iohook');
const Store = require('electron-store');

// Initialize persistent storage
const store = new Store();

// Global variables
let mainWindow;
let tray;
let isMonitoring = false;
let keystrokeData = [];
let sessionStart = Date.now();
let totalKeystrokes = 0;
let baseline = null;

// Security configuration
let securityConfig = store.get('securityConfig', null);
let isLocked = false;

// Create main window
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: path.join(__dirname, 'assets', 'icon.png'),
        show: false
    });

    mainWindow.loadFile('index.html');

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Handle window close (minimize to tray instead)
    mainWindow.on('close', (event) => {
        if (!app.isQuitting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });
}

// Create system tray icon
function createTray() {
    tray = new Tray(path.join(__dirname, 'assets', 'icon.png'));
    
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open Dashboard',
            click: () => {
                mainWindow.show();
            }
        },
        {
            label: isMonitoring ? 'Monitoring: ON' : 'Monitoring: OFF',
            enabled: false
        },
        {
            type: 'separator'
        },
        {
            label: 'Start Monitoring',
            click: () => {
                startMonitoring();
            },
            enabled: !isMonitoring
        },
        {
            label: 'Stop Monitoring',
            click: () => {
                stopMonitoring();
            },
            enabled: isMonitoring
        },
        {
            type: 'separator'
        },
        {
            label: 'Quit',
            click: () => {
                app.isQuitting = true;
                app.quit();
            }
        }
    ]);
    
    tray.setToolTip('ThreatGuard - Insider Threat Detection');
    tray.setContextMenu(contextMenu);
    
    tray.on('click', () => {
        mainWindow.show();
    });
}

// Start system-wide keystroke monitoring
function startMonitoring() {
    if (isMonitoring) return;
    
    isMonitoring = true;
    sessionStart = Date.now();
    keystrokeData = [];
    totalKeystrokes = 0;
    
    // Start iohook (system-wide keyboard listener)
    ioHook.on('keydown', (event) => {
        if (isLocked) return;
        
        keystrokeData.push({
            type: 'down',
            key: event.keycode,
            time: Date.now()
        });
        totalKeystrokes++;
        
        // Send to renderer
        if (mainWindow) {
            mainWindow.webContents.send('keystroke-update', {
                total: totalKeystrokes,
                type: 'down'
            });
        }
        
        analyzePattern();
    });
    
    ioHook.on('keyup', (event) => {
        if (isLocked) return;
        
        keystrokeData.push({
            type: 'up',
            key: event.keycode,
            time: Date.now()
        });
        
        // Send to renderer
        if (mainWindow) {
            mainWindow.webContents.send('keystroke-update', {
                total: totalKeystrokes,
                type: 'up'
            });
        }
    });
    
    ioHook.start();
    
    // Update tray
    updateTrayMenu();
    
    console.log('System-wide monitoring started');
}

// Stop monitoring
function stopMonitoring() {
    if (!isMonitoring) return;
    
    isMonitoring = false;
    ioHook.stop();
    
    // Update tray
    updateTrayMenu();
    
    console.log('Monitoring stopped');
}

// Update tray menu
function updateTrayMenu() {
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open Dashboard',
            click: () => {
                mainWindow.show();
            }
        },
        {
            label: isMonitoring ? '✓ Monitoring: ON' : '✗ Monitoring: OFF',
            enabled: false
        },
        {
            type: 'separator'
        },
        {
            label: 'Start Monitoring',
            click: () => {
                startMonitoring();
            },
            enabled: !isMonitoring
        },
        {
            label: 'Stop Monitoring',
            click: () => {
                stopMonitoring();
            },
            enabled: isMonitoring
        },
        {
            type: 'separator'
        },
        {
            label: 'Quit',
            click: () => {
                app.isQuitting = true;
                app.quit();
            }
        }
    ]);
    
    tray.setContextMenu(contextMenu);
}

// Calculate features from keystroke data
function calculateFeatures() {
    if (keystrokeData.length < 4) return null;

    const dwellTimes = [];
    const flightTimes = [];
    const keyMap = new Map();

    keystrokeData.forEach(event => {
        if (event.type === 'down') {
            keyMap.set(event.key, event.time);
        } else if (event.type === 'up' && keyMap.has(event.key)) {
            const dwell = event.time - keyMap.get(event.key);
            dwellTimes.push(dwell);
            keyMap.delete(event.key);
        }
    });

    const upEvents = keystrokeData.filter(e => e.type === 'up');
    for (let i = 1; i < upEvents.length; i++) {
        const flight = upEvents[i].time - upEvents[i-1].time;
        if (flight > 0 && flight < 2000) {
            flightTimes.push(flight);
        }
    }

    const duration = (Date.now() - sessionStart) / 1000 / 60;
    const words = totalKeystrokes / 5;
    const wpm = duration > 0 ? Math.round(words / duration) : 0;

    return {
        dwellTimes,
        flightTimes,
        avgDwell: avg(dwellTimes),
        avgFlight: avg(flightTimes),
        wpm
    };
}

function avg(arr) {
    if (!arr || arr.length === 0) return 0;
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

function std(arr) {
    if (!arr || arr.length === 0) return 1;
    const mean = avg(arr);
    const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
    return Math.sqrt(variance) || 1;
}

// Analyze pattern and calculate threat
function analyzePattern() {
    const features = calculateFeatures();
    if (!features) return;

    // Establish baseline
    if (!baseline && totalKeystrokes >= 100) {
        baseline = features;
        if (mainWindow) {
            mainWindow.webContents.send('baseline-established', baseline);
        }
        console.log('Baseline established');
        return;
    }

    // Calculate threat
    if (baseline && totalKeystrokes > 100) {
        let score = 0;

        const dwellDev = Math.abs(features.avgDwell - baseline.avgDwell) / std(baseline.dwellTimes);
        score += dwellDev * 30;

        const flightDev = Math.abs(features.avgFlight - baseline.avgFlight) / std(baseline.flightTimes);
        score += flightDev * 25;

        const speedDev = Math.abs(features.wpm - baseline.wpm) / (baseline.wpm || 1);
        score += speedDev * 45;

        const threatScore = Math.min(100, score);

        if (mainWindow) {
            mainWindow.webContents.send('threat-update', {
                score: threatScore,
                features: features
            });
        }

        // Show alert if high threat
        if (threatScore > 60 && !isLocked) {
            showThreatAlert(threatScore);
        }
    }
}

// Show threat alert (native notification)
function showThreatAlert(score) {
    if (mainWindow) {
        mainWindow.webContents.send('show-alert', { score });
        mainWindow.show();
        mainWindow.focus();
    }
}

// Lock system
function lockSystem(reason) {
    isLocked = true;
    
    if (mainWindow) {
        mainWindow.webContents.send('system-locked', { reason });
        mainWindow.show();
        mainWindow.setFullScreen(true);
        mainWindow.setAlwaysOnTop(true, 'screen-saver');
    }
}

// Unlock system
function unlockSystem() {
    isLocked = false;
    
    if (mainWindow) {
        mainWindow.setFullScreen(false);
        mainWindow.setAlwaysOnTop(false);
    }
}

// IPC Handlers
ipcMain.on('save-security-config', (event, config) => {
    securityConfig = config;
    store.set('securityConfig', config);
    event.reply('config-saved');
});

ipcMain.on('get-security-config', (event) => {
    event.reply('security-config', securityConfig);
});

ipcMain.on('start-monitoring', () => {
    startMonitoring();
});

ipcMain.on('stop-monitoring', () => {
    stopMonitoring();
});

ipcMain.on('lock-system', (event, reason) => {
    lockSystem(reason);
});

ipcMain.on('unlock-system', () => {
    unlockSystem();
});

ipcMain.on('reset-session', () => {
    keystrokeData = [];
    totalKeystrokes = 0;
    sessionStart = Date.now();
    baseline = null;
});

ipcMain.on('get-monitoring-status', (event) => {
    event.reply('monitoring-status', {
        isMonitoring,
        totalKeystrokes,
        sessionDuration: Math.floor((Date.now() - sessionStart) / 1000)
    });
});

// App lifecycle
app.whenReady().then(() => {
    createWindow();
    createTray();
    
    // Register global shortcut to show dashboard
    globalShortcut.register('CommandOrControl+Shift+T', () => {
        mainWindow.show();
    });
    
    // Auto-start monitoring if configured
    if (securityConfig) {
        setTimeout(() => {
            startMonitoring();
        }, 2000);
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // Don't quit on window close, keep running in tray
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('before-quit', () => {
    stopMonitoring();
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});