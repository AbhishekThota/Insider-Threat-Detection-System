const { ipcRenderer } = require('electron');

// State
const state = {
    questions: [
        "What is your pet's name?",
        "What city were you born in?",
        "Your first school's name?",
        "Mother's maiden name?",
        "Favorite teacher's name?",
        "Favorite childhood food?",
        "Your childhood nickname?",
        "Father's middle name?"
    ],
    selectedQuestions: [],
    answers: {},
    totalKeys: 0,
    currentChallenge: null,
    failedAttempts: 0,
    maxAttempts: 3,
    sessionStart: Date.now(),
    baseline: null,
    currentThreat: 0
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkSecurityConfig();
    setupEventListeners();
    startUIUpdates();
});

// Check if security is configured
function checkSecurityConfig() {
    ipcRenderer.send('get-security-config');
}

ipcRenderer.on('security-config', (event, config) => {
    if (config) {
        state.selectedQuestions = config.questions;
        state.answers = config.answers;
        showDashboard();
        addLog('Security configured', '🔐');
        addLog('Click "Start Monitoring" to begin', 'ℹ️');
    } else {
        showSetupModal();
    }
});

// Setup Modal
function showSetupModal() {
    const modal = document.getElementById('setup-modal');
    const list = document.getElementById('questions-list');
    
    list.innerHTML = '';
    state.questions.forEach((q, i) => {
        const div = document.createElement('div');
        div.className = 'question-option';
        div.innerHTML = `
            <div class="checkbox"></div>
            <span>${q}</span>
        `;
        div.onclick = () => toggleQuestion(div, i, q);
        list.appendChild(div);
    });
    
    modal.classList.remove('hidden');
}

function toggleQuestion(element, index, question) {
    if (element.classList.contains('selected')) {
        element.classList.remove('selected');
        state.selectedQuestions = state.selectedQuestions.filter(q => q.text !== question);
    } else {
        if (state.selectedQuestions.length < 3) {
            element.classList.add('selected');
            state.selectedQuestions.push({ id: index, text: question });
        } else {
            alert('Maximum 3 questions allowed');
        }
    }
}

function saveSetup() {
    if (state.selectedQuestions.length !== 3) {
        alert('Please select exactly 3 questions');
        return;
    }

    // Prompt for answers
    state.selectedQuestions.forEach(q => {
        const answer = prompt(`Answer: ${q.text}`);
        if (answer) {
            state.answers[q.id] = answer.toLowerCase().trim();
        }
    });

    if (Object.keys(state.answers).length !== 3) {
        alert('Please provide all answers');
        return;
    }

    // Save configuration
    ipcRenderer.send('save-security-config', {
        questions: state.selectedQuestions,
        answers: state.answers
    });

    document.getElementById('setup-modal').classList.add('hidden');
    showDashboard();
}

function showDashboard() {
    document.getElementById('dashboard').classList.remove('hidden');
    addLog('Desktop app initialized', '✅');
    addLog('System-wide monitoring ready', '📡');
}

// Event Listeners
function setupEventListeners() {
    document.getElementById('save-questions').onclick = saveSetup;
    
    document.getElementById('start-monitoring').onclick = () => {
        ipcRenderer.send('start-monitoring');
        updateMonitoringStatus(true);
        addLog('System-wide monitoring started', '▶️');
    };
    
    document.getElementById('stop-monitoring').onclick = () => {
        ipcRenderer.send('stop-monitoring');
        updateMonitoringStatus(false);
        addLog('Monitoring stopped', '⏸');
    };
    
    document.getElementById('reset-btn').onclick = resetSession;
    document.getElementById('export-btn').onclick = exportData;
    
    document.getElementById('verify-btn').onclick = showChallenge;
    document.getElementById('dismiss-btn').onclick = () => {
        ipcRenderer.send('lock-system', 'Alert dismissed');
    };
    document.getElementById('close-alert').onclick = () => {
        ipcRenderer.send('lock-system', 'Alert closed');
    };
    
    document.getElementById('submit-answer').onclick = verifyAnswer;
    document.getElementById('cancel-challenge').onclick = () => {
        ipcRenderer.send('lock-system', 'Challenge cancelled');
    };
    
    document.getElementById('unlock-btn').onclick = attemptUnlock;
    document.getElementById('unlock-pass').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') attemptUnlock();
    });
}

function updateMonitoringStatus(isActive) {
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');
    const startBtn = document.getElementById('start-monitoring');
    const stopBtn = document.getElementById('stop-monitoring');
    
    if (isActive) {
        dot.style.background = '#00ff88';
        text.textContent = 'MONITORING ACTIVE';
        startBtn.disabled = true;
        stopBtn.disabled = false;
        startBtn.style.opacity = '0.5';
        stopBtn.style.opacity = '1';
    } else {
        dot.style.background = '#ff3366';
        text.textContent = 'MONITORING INACTIVE';
        startBtn.disabled = false;
        stopBtn.disabled = true;
        startBtn.style.opacity = '1';
        stopBtn.style.opacity = '0.5';
    }
}

// IPC Listeners - Receive from main process
ipcRenderer.on('keystroke-update', (event, data) => {
    state.totalKeys = data.total;
    updateKeystrokeDisplay();
});

ipcRenderer.on('baseline-established', (event, baseline) => {
    state.baseline = baseline;
    document.getElementById('baseline-status').innerHTML = '✅ Baseline Established';
    document.getElementById('baseline-text').textContent = 'Established';
    addLog('Baseline profile established', '✅');
});

ipcRenderer.on('threat-update', (event, data) => {
    state.currentThreat = data.score;
    updateThreatScore(data.score);
    updateActivityValues(data.features);
});

ipcRenderer.on('show-alert', (event, data) => {
    showAlert(data.score);
});

ipcRenderer.on('system-locked', (event, data) => {
    showLockscreen(data.reason);
});

// UI Updates
function updateKeystrokeDisplay() {
    document.getElementById('keystrokes').textContent = state.totalKeys;
    
    const progress = Math.min(100, state.totalKeys);
    document.getElementById('baseline-progress').textContent = `${progress}/100`;
    
    if (!state.baseline && state.totalKeys < 100) {
        document.getElementById('baseline-status').innerHTML = 
            `Collecting data... <span id="baseline-progress">${progress}/100</span> keystrokes`;
    }
}

function updateActivityValues(features) {
    if (features) {
        document.getElementById('wpm').textContent = features.wpm;
        document.getElementById('dwell').textContent = Math.round(features.avgDwell) + 'ms';
    }
}

function updateThreatScore(score) {
    document.getElementById('threat-score').textContent = Math.round(score);
    
    const circle = document.getElementById('threat-circle');
    const circumference = 2 * Math.PI * 80;
    const offset = circumference - (score / 100) * circumference;
    circle.style.strokeDashoffset = offset;

    const badge = document.getElementById('status-badge');
    const level = document.getElementById('threat-level');
    badge.classList.remove('warning', 'danger');
    
    if (score < 30) {
        badge.textContent = 'NORMAL BEHAVIOR';
        circle.style.stroke = '#00ff88';
        level.textContent = 'Low';
        level.style.color = '#00ff88';
    } else if (score < 60) {
        badge.textContent = 'SUSPICIOUS ACTIVITY';
        badge.classList.add('warning');
        circle.style.stroke = '#ffaa00';
        level.textContent = 'Medium';
        level.style.color = '#ffaa00';
        addLog('Unusual pattern detected', '⚠️');
    } else {
        badge.textContent = 'THREAT DETECTED';
        badge.classList.add('danger');
        circle.style.stroke = '#ff3366';
        level.textContent = 'High';
        level.style.color = '#ff3366';
        addLog('High threat level!', '🚨');
    }
}

function showAlert(score) {
    const alert = document.getElementById('alert-popup');
    if (!alert.classList.contains('hidden')) return;
    
    alert.classList.remove('hidden');
    document.getElementById('alert-bar').style.width = score + '%';
    document.getElementById('alert-percent').textContent = Math.round(score) + '%';
    
    addLog('Security alert triggered', '🚨');
}

function showChallenge() {
    document.getElementById('alert-popup').classList.add('hidden');
    
    const modal = document.getElementById('challenge-modal');
    const q = state.selectedQuestions[Math.floor(Math.random() * state.selectedQuestions.length)];
    state.currentChallenge = q;
    
    document.getElementById('challenge-question').textContent = q.text;
    document.getElementById('challenge-answer').value = '';
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('attempts-left').textContent = state.maxAttempts - state.failedAttempts;
    
    modal.classList.remove('hidden');
    addLog('Security challenge initiated', '🔒');
}

function verifyAnswer() {
    const input = document.getElementById('challenge-answer').value.toLowerCase().trim();
    const correct = state.answers[state.currentChallenge.id];
    const feedback = document.getElementById('feedback');
    
    if (input === correct) {
        feedback.textContent = '✓ Correct! Identity verified';
        feedback.className = 'feedback correct';
        feedback.classList.remove('hidden');
        
        setTimeout(() => {
            document.getElementById('challenge-modal').classList.add('hidden');
            document.getElementById('alert-popup').classList.add('hidden');
            state.failedAttempts = 0;
            addLog('Identity verified successfully', '✅');
            
            // Reset baseline
            ipcRenderer.send('reset-session');
            state.baseline = null;
            state.totalKeys = 0;
        }, 1500);
        
    } else {
        state.failedAttempts++;
        feedback.textContent = `✗ Incorrect. ${state.maxAttempts - state.failedAttempts} attempts left`;
        feedback.className = 'feedback incorrect';
        feedback.classList.remove('hidden');
        document.getElementById('attempts-left').textContent = state.maxAttempts - state.failedAttempts;
        
        addLog(`Failed attempt ${state.failedAttempts}/3`, '❌');
        
        if (state.failedAttempts >= state.maxAttempts) {
            setTimeout(() => {
                ipcRenderer.send('lock-system', 'Multiple failed verification attempts');
            }, 1000);
        }
    }
}

function showLockscreen(reason) {
    document.getElementById('challenge-modal').classList.add('hidden');
    document.getElementById('alert-popup').classList.add('hidden');
    
    const lock = document.getElementById('lockscreen');
    document.getElementById('lock-reason').textContent = reason;
    document.getElementById('lock-time').textContent = new Date().toLocaleTimeString();
    document.getElementById('lock-threat').textContent = Math.round(state.currentThreat);
    
    lock.classList.remove('hidden');
    addLog('System locked', '🔒');
}

function attemptUnlock() {
    const pass = document.getElementById('unlock-pass').value;
    if (pass.trim()) {
        ipcRenderer.send('unlock-system');
        document.getElementById('lockscreen').classList.add('hidden');
        document.getElementById('unlock-pass').value = '';
        state.failedAttempts = 0;
        addLog('System unlocked', '✅');
    } else {
        alert('Enter a password');
    }
}

function resetSession() {
    if (confirm('Reset session? This will clear all collected data.')) {
        ipcRenderer.send('reset-session');
        state.totalKeys = 0;
        state.baseline = null;
        state.currentThreat = 0;
        state.failedAttempts = 0;
        
        document.getElementById('keystrokes').textContent = '0';
        document.getElementById('wpm').textContent = '0';
        document.getElementById('dwell').textContent = '0ms';
        document.getElementById('threat-score').textContent = '0';
        document.getElementById('baseline-status').innerHTML = 'Collecting data... <span id="baseline-progress">0/100</span> keystrokes';
        document.getElementById('baseline-text').textContent = 'Not Established';
        
        updateThreatScore(0);
        
        document.getElementById('activity-log').innerHTML = '';
        addLog('Session reset', '✅');
        addLog('Monitoring continues', '📊');
    }
}

function exportData() {
    const data = {
        timestamp: new Date().toISOString(),
        totalKeystrokes: state.totalKeys,
        baseline: state.baseline,
        currentThreat: state.currentThreat,
        sessionDuration: Math.floor((Date.now() - state.sessionStart) / 1000)
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threat-data-desktop-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    addLog('Data exported', '📁');
}

function addLog(message, icon = 'ℹ️') {
    const log = document.getElementById('activity-log');
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
        <span class="log-time">${time}</span>
        <span>${icon} ${message}</span>
    `;
    log.insertBefore(entry, log.firstChild);
    
    while (log.children.length > 15) {
        log.removeChild(log.lastChild);
    }
}

// Update timer
function startUIUpdates() {
    setInterval(() => {
        const elapsed = Math.floor((Date.now() - state.sessionStart) / 1000);
        const mins = Math.floor(elapsed / 60);
        const secs = elapsed % 60;
        document.getElementById('uptime').textContent = 
            `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }, 1000);
}