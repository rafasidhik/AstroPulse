// AstroPulse - Phase 4/5: UI Updates
// DOM manipulation and rendering for dashboard

export const PARAMETER_META = {
    heartRate: { label: 'Heart Rate', unit: 'BPM', color: '#38BDF8' },
    oxygen: { label: 'Oxygen Saturation', unit: '%', color: '#22C55E' },
    temperature: { label: 'Body Temperature', unit: '°C', color: '#F59E0B' },
    sleep: { label: 'Sleep Duration', unit: 'hours', color: '#A78BFA' },
    exercise: { label: 'Exercise Time', unit: 'minutes', color: '#F472B6' }
};

function formatClock(timestamp) {
    const d = new Date(timestamp);
    const hrs = d.getHours().toString().padStart(2, '0');
    const mins = d.getMinutes().toString().padStart(2, '0');
    const secs = d.getSeconds().toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
        alertEl.style.padding = '0.875rem 1rem';
        alertEl.style.borderRadius = '8px';
        alertEl.style.lineHeight = '1.5';
        alertEl.style.wordWrap = 'break-word';
        alertEl.style.backgroundColor = alert.type === 'CRITICAL' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)';
        alertEl.style.border = `1px solid ${alert.type === 'CRITICAL' ? '#EF4444' : '#F59E0B'}`;
        alertEl.innerHTML = `<strong>${alert.message}</strong>`;
        container.appendChild(alertEl);
    });
}

export function updateSimulationModeButtons(mode) {
    const buttons = {
        NORMAL: document.getElementById('normal-mode'),
        WARNING: document.getElementById('warning-mode'),
        CRITICAL: document.getElementById('critical-mode')
    };

    Object.keys(buttons).forEach(key => {
        const btn = buttons[key];
        if (!btn) {
            return;
        }
        const isActive = key === mode;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
        btn.style.borderColor = isActive ? '#38BDF8' : 'transparent';
    });
}

/* Health History Chart */

let historyChart = null;

function buildChartData(history, parameter) {
    const meta = PARAMETER_META[parameter] || PARAMETER_META.heartRate;
    const series = (history && history[parameter]) ? history[parameter] : [];

    return {
        labels: series.map(reading => formatClock(reading.timestamp)),
        datasets: [{
            label: `${meta.label} (${meta.unit})`,
            data: series.map(reading => reading.value),
            borderColor: meta.color,
            backgroundColor: hexToRgba(meta.color, 0.12),
            borderWidth: 2,
            tension: 0.35,
            pointRadius: 2,
            pointHoverRadius: 5,
            pointBackgroundColor: meta.color,
            fill: true
        }]
    };
}

function buildChartOptions(parameter) {
    const meta = PARAMETER_META[parameter] || PARAMETER_META.heartRate;
    return {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400 },
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#0D1B2A',
                borderColor: '#14263A',
                borderWidth: 1,
                titleColor: '#94A3B8',
                bodyColor: '#F8FAFC',
                padding: 10,
                callbacks: {
                    title: (items) => (items.length ? `Time: ${items[0].label}` : ''),
                    label: (context) => `${meta.label}: ${context.parsed.y} ${meta.unit}`
                }
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(148, 163, 184, 0.08)' },
                ticks: { color: '#94A3B8', maxTicksLimit: 6, font: { size: 11 } }
            },
            y: {
                grid: { color: 'rgba(148, 163, 184, 0.08)' },
                ticks: { color: '#94A3B8', font: { size: 11 } },
                title: { display: true, text: meta.unit, color: '#94A3B8', font: { size: 11 } }
            }
        }
    };
}

function setChartVisibility(history, parameter) {
    const canvas = document.getElementById('health-history-chart');
    const empty = document.getElementById('chart-empty');
    const series = (history && history[parameter]) ? history[parameter] : [];
    const hasData = series.length > 0;
    const canRender = typeof Chart !== 'undefined';

    if (canvas) {
        canvas.hidden = !hasData || !canRender;
    }
    if (empty) {
        empty.hidden = hasData && canRender;
    }
}

function updateChartAccessibility(history, parameter) {
    const canvas = document.getElementById('health-history-chart');
    const meta = PARAMETER_META[parameter] || PARAMETER_META.heartRate;
    const series = (history && history[parameter]) ? history[parameter] : [];

    if (canvas) {
        if (series.length > 0) {
            const latest = series[series.length - 1];
            canvas.setAttribute(
                'aria-label',
                `${meta.label} history chart. ${series.length} readings. Latest value ${latest.value} ${meta.unit} at ${formatClock(latest.timestamp)}.`
            );
        } else {
            canvas.setAttribute('aria-label', `${meta.label} history chart. No data.`);
        }
    }
}

function updateChartTitle(parameter) {
    const title = document.getElementById('chart-title');
    const meta = PARAMETER_META[parameter] || PARAMETER_META.heartRate;
    if (title) {
        title.textContent = `${meta.label} — Last 20 Readings`;
    }
}

export function initHistoryChart(history, parameter) {
    const canvas = document.getElementById('health-history-chart');

    setChartVisibility(history, parameter);
    updateChartTitle(parameter);
    updateChartAccessibility(history, parameter);

    if (!canvas || typeof Chart === 'undefined') {
        return;
    }

    if (historyChart) {
        updateHistoryChart(history, parameter);
        return;
    }

    historyChart = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: buildChartData(history, parameter),
        options: buildChartOptions(parameter)
    });
}

export function updateHistoryChart(history, parameter) {
    setChartVisibility(history, parameter);
    updateChartTitle(parameter);
    updateChartAccessibility(history, parameter);

    if (!historyChart) {
        initHistoryChart(history, parameter);
        return;
    }

    historyChart.data = buildChartData(history, parameter);
    historyChart.options = buildChartOptions(parameter);
    historyChart.update();
}