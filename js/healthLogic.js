// AstroPulse - Phase 4: Health Logic & Status Evaluation
// Thresholds and status evaluation logic for health parameters

export const STATUS = {
    NORMAL: 'NORMAL',
    WARNING: 'WARNING',
    CRITICAL: 'CRITICAL'
};

// Simulation thresholds - for demonstration purposes only (not medical guidelines)
export const HEALTH_THRESHOLDS = {
    heartRate: {
        warningHigh: 100,
        criticalHigh: 120
    },
    oxygen: {
        warningLow: 95,
        criticalLow: 90
    },
    temperature: {
        warningHigh: 37.5,
        criticalHigh: 38.5
    },
    sleep: {
        warningLow: 6.5,
        criticalLow: 5.0
    },
    exercise: {
        warningLow: 30,
        criticalLow: 15
    }
};

export function evaluateParameter(parameter, value) {
    if (typeof value !== 'number' || !isFinite(value)) {
        return { parameter, value: 0, status: STATUS.NORMAL };
    }

    switch (parameter) {
        case 'heartRate':
            if (value >= HEALTH_THRESHOLDS.heartRate.criticalHigh) {
                return { parameter, value, status: STATUS.CRITICAL };
            }
            if (value >= HEALTH_THRESHOLDS.heartRate.warningHigh) {
                return { parameter, value, status: STATUS.WARNING };
            }
            return { parameter, value, status: STATUS.NORMAL };

        case 'oxygen':
            if (value <= HEALTH_THRESHOLDS.oxygen.criticalLow) {
                return { parameter, value, status: STATUS.CRITICAL };
            }
            if (value <= HEALTH_THRESHOLDS.oxygen.warningLow) {
                return { parameter, value, status: STATUS.WARNING };
            }
            return { parameter, value, status: STATUS.NORMAL };

        case 'temperature':
            if (value >= HEALTH_THRESHOLDS.temperature.criticalHigh) {
                return { parameter, value, status: STATUS.CRITICAL };
            }
            if (value >= HEALTH_THRESHOLDS.temperature.warningHigh) {
                return { parameter, value, status: STATUS.WARNING };
            }
            return { parameter, value, status: STATUS.NORMAL };

        case 'sleep':
            if (value <= HEALTH_THRESHOLDS.sleep.criticalLow) {
                return { parameter, value, status: STATUS.CRITICAL };
            }
            if (value <= HEALTH_THRESHOLDS.sleep.warningLow) {
                return { parameter, value, status: STATUS.WARNING };
            }
            return { parameter, value, status: STATUS.NORMAL };

        case 'exercise':
            if (value <= HEALTH_THRESHOLDS.exercise.criticalLow) {
                return { parameter, value, status: STATUS.CRITICAL };
            }
            if (value <= HEALTH_THRESHOLDS.exercise.warningLow) {
                return { parameter, value, status: STATUS.WARNING };
            }
            return { parameter, value, status: STATUS.NORMAL };

        default:
            return { parameter, value, status: STATUS.NORMAL };
    }
}

export function evaluateHealthData(healthData) {
    if (!healthData || typeof healthData !== 'object') {
        return null;
    }

    return {
        heartRate: evaluateParameter('heartRate', healthData.heartRate),
        oxygen: evaluateParameter('oxygen', healthData.oxygen),
        temperature: evaluateParameter('temperature', healthData.temperature),
        sleep: evaluateParameter('sleep', healthData.sleep),
        exercise: evaluateParameter('exercise', healthData.exercise)
    };
}

export function calculateOverallStatus(parameterStatuses) {
    if (!parameterStatuses) {
        return STATUS.NORMAL;
    }

    const params = [
        parameterStatuses.heartRate,
        parameterStatuses.oxygen,
        parameterStatuses.temperature,
        parameterStatuses.sleep,
        parameterStatuses.exercise
    ];

    for (let i = 0; i < params.length; i++) {
        if (params[i] && params[i].status === STATUS.CRITICAL) {
            return STATUS.CRITICAL;
        }
    }

    for (let i = 0; i < params.length; i++) {
        if (params[i] && params[i].status === STATUS.WARNING) {
            return STATUS.WARNING;
        }
    }

    return STATUS.NORMAL;
}

export function generateAlert(parameter, value, status) {
    const paramNames = {
        heartRate: 'Heart Rate',
        oxygen: 'Oxygen Saturation',
        temperature: 'Body Temperature',
        sleep: 'Sleep Duration',
        exercise: 'Exercise Time'
    };

    const name = paramNames[parameter] || parameter;

    if (status === STATUS.CRITICAL) {
        return {
            type: STATUS.CRITICAL,
            parameter,
            message: `CRITICAL ALERT: ${name} is critically low/high`,
            value,
            timestamp: Date.now()
        };
    }

    if (status === STATUS.WARNING) {
        return {
            type: STATUS.WARNING,
            parameter,
            message: `WARNING: ${name} requires attention`,
            value,
            timestamp: Date.now()
        };
    }

    return null;
}