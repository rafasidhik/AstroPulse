// AstroPulse - Phase 4: UI Updates
// DOM manipulation and rendering for dashboard

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600) % 24;
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} UTC`;
}

export function updateHealthCard(parameter, data) {
    const valueMap = {
        heartRate: 'heart-rate-value',
        oxygen: 'oxygen-value',
        temperature: 'temperature-value',
        sleep: 'sleep-value',
        exercise: 'exercise-value'
    };
    const statusMap = {
        heartRate: 'heart-rate-status',
        oxygen: 'oxygen-status',
        temperature: 'temperature-status',
        sleep: 'sleep-status',
        exercise: 'exercise-status'
    };
    const updatedMap = {
        heartRate: 'heart-rate-updated',
        oxygen: 'oxygen-updated',
        temperature: 'temperature-updated',
        sleep: 'sleep-updated',
        exercise: 'exercise-updated'
    };

    const valueEl = document.getElementById(valueMap[parameter]);
    const statusEl = document.getElementById(statusMap[parameter]);
    const updatedEl = document.getElementById(updatedMap[parameter]);

    if (valueEl && data) {
        valueEl.textContent = data.value;
    }

    if (statusEl && data) {
        statusEl.textContent = data.status;
        statusEl.classList.remove('status-normal', 'status-warning', 'status-critical');
        if (data.status === 'CRITICAL') {
            statusEl.classList.add('status-critical');
        } else if (data.status === 'WARNING') {
            statusEl.classList.add('status-warning');
        } else {
            statusEl.classList.add('status-normal');
        }
    }

    if (updatedEl) {
        updatedEl.textContent = 'just now';
    }
}

export function updateOverallHealth(status) {
    const statusText = document.querySelector('#overall-status .status-text');
    const indicator = document.querySelector('#overall-status .status-indicator');

    if (statusText) {
        statusText.textContent = status;
        statusText.classList.remove('status-normal', 'status-warning', 'status-critical');
        if (status === 'CRITICAL') {
            statusText.classList.add('status-critical');
        } else if (status === 'WARNING') {
            statusText.classList.add('status-warning');
        } else {
            statusText.classList.add('status-normal');
        }
    }

    if (indicator) {
        indicator.style.backgroundColor = status === 'CRITICAL' ? '#EF4444' : status === 'WARNING' ? '#F59E0B' : '#22C55E';
    }
}

export function updateMissionTime(day, totalSeconds) {
    const dayDisplay = document.getElementById('mission-day') || document.getElementById('mission-day-display');
    const timeDisplay = document.getElementById('mission-time');

    if (dayDisplay) {
        dayDisplay.textContent = day;
    }
    if (timeDisplay) {
        const hrs = Math.floor(totalSeconds / 3600) % 24;
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        timeDisplay.textContent = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} UTC`;
    }
}

export function updateAlerts(alerts) {
    const container = document.getElementById('alerts-container');
    const noAlerts = document.getElementById('no-alerts');

    if (!container) {
        return;
    }

    if (!alerts || alerts.length === 0) {
        if (noAlerts) {
            noAlerts.style.display = 'block';
        }
        const alertElements = container.querySelectorAll('.alert-item');
        alertElements.forEach(el => el.remove());
        return;
    }

    if (noAlerts) {
        noAlerts.style.display = 'none';
    }

    const alertElements = container.querySelectorAll('.alert-item');
    alertElements.forEach(el => el.remove());

    alerts.forEach(alert => {
        const alertEl = document.createElement('div');
        alertEl.className = 'alert-item';
        alertEl.style.padding = '0.75rem';
        alertEl.style.marginBottom = '0.5rem';
        alertEl.style.borderRadius = '6px';
        alertEl.style.backgroundColor = alert.type === 'CRITICAL' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)';
        alertEl.style.border = `1px solid ${alert.type === 'CRITICAL' ? '#EF4444' : '#F59E0B'}`;
        alertEl.innerHTML = `<strong>${alert.message}</strong><br><small style="color: var(--color-muted)">${alert.parameter}: ${alert.value}</small>`;
        container.appendChild(alertEl);
    });
}

export function updateSimulationModeButtons(mode) {
    const normalBtn = document.getElementById('normal-mode');
    const warningBtn = document.getElementById('warning-mode');
    const criticalBtn = document.getElementById('critical-mode');

    if (normalBtn) normalBtn.style.borderColor = mode === 'NORMAL' ? '#38BDF8' : 'transparent';
    if (warningBtn) warningBtn.style.borderColor = mode === 'WARNING' ? '#38BDF8' : 'transparent';
    if (criticalBtn) criticalBtn.style.borderColor = mode === 'CRITICAL' ? '#38BDF8' : 'transparent';
}