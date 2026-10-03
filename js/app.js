// AstroPulse - Phase 4/5: Application Controller
// Coordinates health data, logic, and UI

import {
    getInitialHealthData,
    generateNextHealthData,
    createInitialHistory,
    addToHistory,
    validateHealthData
} from './healthData.js';

import {
    STATUS,
    evaluateHealthData,
    calculateOverallStatus,
    generateAlert
} from './healthLogic.js';

import {
    updateHealthCard,
    updateOverallHealth,
    updateMissionTime,
    updateAlerts,
    updateSimulationModeButtons,
    initHistoryChart,
    updateHistoryChart
} from './ui.js';

const appState = {
    healthData: null,
    healthEvaluation: null,
    history: null,
    alerts: [],
    activeAlerts: {},
    missionStartDay: 47,
    missionTotalSeconds: 14 * 3600 + 32 * 60 + 18,
    simulationMode: 'NORMAL',
    selectedParameter: 'heartRate',
    healthUpdateTimer: null,
    missionClockTimer: null
};

function initializeApp() {
    appState.healthData = getInitialHealthData();
    appState.history = createInitialHistory(appState.healthData, 20);
    appState.healthEvaluation = evaluateHealthData(appState.healthData);
    appState.overallStatus = calculateOverallStatus(appState.healthEvaluation);
    appState.alerts = [];
    appState.activeAlerts = {};

    updateUI();
    initHistoryChart(appState.history, appState.selectedParameter);
    startTimers();
    setupSimulationControls();
    setupChartControls();
}

function updateUI() {
    if (appState.healthEvaluation) {
        updateHealthCard('heartRate', appState.healthEvaluation.heartRate);
        updateHealthCard('oxygen', appState.healthEvaluation.oxygen);
        updateHealthCard('temperature', appState.healthEvaluation.temperature);
        updateHealthCard('sleep', appState.healthEvaluation.sleep);
        updateHealthCard('exercise', appState.healthEvaluation.exercise);
    }

    const overall = appState.overallStatus || STATUS.NORMAL;
    updateOverallHealth(overall);
    updateMissionTime(appState.missionStartDay, appState.missionTotalSeconds);
    updateAlerts(appState.alerts);
    updateSimulationModeButtons(appState.simulationMode);
    updateHistoryChart(appState.history, appState.selectedParameter);
}

function setupChartControls() {
    const selector = document.getElementById('history-parameter');
    if (!selector) {
        return;
    }

    selector.value = appState.selectedParameter;
    selector.addEventListener('change', (event) => {
        appState.selectedParameter = event.target.value;
        updateHistoryChart(appState.history, appState.selectedParameter);
    });
}

function updateHealth() {
    let nextData;

    if (appState.simulationMode === 'NORMAL') {
        nextData = generateNextHealthData(appState.healthData);
    } else if (appState.simulationMode === 'WARNING') {
        nextData = generateWarningModeData();
    } else if (appState.simulationMode === 'CRITICAL') {
        nextData = generateCriticalModeData();
    } else {
        nextData = generateNextHealthData(appState.healthData);
    }

    if (!validateHealthData(nextData)) {
        nextData = appState.healthData;
    }

    appState.healthData = nextData;
    addToHistory(appState.history, nextData);
    appState.healthEvaluation = evaluateHealthData(nextData);
    appState.overallStatus = calculateOverallStatus(appState.healthEvaluation);
    processAlerts(appState.healthEvaluation);
    updateUI();
}

function generateWarningModeData() {
    return {
        heartRate: 112,
        oxygen: 94,
        temperature: 37.8,
        sleep: 6.0,
        exercise: 25
    };
}

function generateCriticalModeData() {
    return {
        heartRate: 128,
        oxygen: 87,
        temperature: 38.7,
        sleep: 4.5,
        exercise: 10
    };
}

function processAlerts(evaluation) {
    if (!evaluation) {
        return;
    }

    const params = ['heartRate', 'oxygen', 'temperature', 'sleep', 'exercise'];
    const newAlerts = [];
    const newActive = {};

    params.forEach(param => {
        const evalData = evaluation[param];
        if (evalData && (evalData.status === STATUS.WARNING || evalData.status === STATUS.CRITICAL)) {
            const alert = generateAlert(param, evalData.value, evalData.status);
            if (alert) {
                newAlerts.push(alert);
            }
            newActive[param] = evalData.status;
        }
    });

    appState.activeAlerts = newActive;
    appState.alerts = newAlerts;
}

function updateMissionClock() {
    appState.missionTotalSeconds++;
    if (appState.missionTotalSeconds >= 24 * 3600) {
        appState.missionTotalSeconds = 0;
        appState.missionStartDay++;
    }
    updateMissionTime(appState.missionStartDay, appState.missionTotalSeconds);
}

function startTimers() {
    if (appState.healthUpdateTimer) {
        clearInterval(appState.healthUpdateTimer);
    }
    if (appState.missionClockTimer) {
        clearInterval(appState.missionClockTimer);
    }

    appState.healthUpdateTimer = setInterval(updateHealth, 5000);
    appState.missionClockTimer = setInterval(updateMissionClock, 1000);
}

function setupSimulationControls() {
    const normalBtn = document.getElementById('normal-mode');
    const warningBtn = document.getElementById('warning-mode');
    const criticalBtn = document.getElementById('critical-mode');

    if (normalBtn) {
        normalBtn.addEventListener('click', () => applySimulationMode('NORMAL', getInitialHealthData()));
    }
    if (warningBtn) {
        warningBtn.addEventListener('click', () => applySimulationMode('WARNING', generateWarningModeData()));
    }
    if (criticalBtn) {
        criticalBtn.addEventListener('click', () => applySimulationMode('CRITICAL', generateCriticalModeData()));
    }
}

function applySimulationMode(mode, data) {
    appState.simulationMode = mode;
    appState.healthData = data;
    appState.healthEvaluation = evaluateHealthData(appState.healthData);
    appState.overallStatus = calculateOverallStatus(appState.healthEvaluation);
    appState.activeAlerts = {};

    if (validateHealthData(appState.healthData)) {
        addToHistory(appState.history, appState.healthData);
    }

    processAlerts(appState.healthEvaluation);
    updateSimulationModeButtons(appState.simulationMode);
    updateUI();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}