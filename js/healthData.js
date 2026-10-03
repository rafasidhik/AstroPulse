// AstroPulse - Phase 3: Health Data Engine
// Generates realistic simulated astronaut health data with smooth variation
// All generated values are fictional simulation data, not medical measurements.

export const INITIAL_HEALTH_DATA = {
    heartRate: 78,
    oxygen: 98,
    temperature: 36.7,
    sleep: 7.5,
    exercise: 52
};

/*
 * These limits are simulation constraints only.
 * They are not medical guidelines or diagnostic thresholds.
 */
export const HEALTH_LIMITS = {
    heartRate: {
        min: 40,
        max: 140
    },
    oxygen: {
        min: 85,
        max: 100
    },
    temperature: {
        min: 34.5,
        max: 40.0
    },
    sleep: {
        min: 3,
        max: 10
    },
    exercise: {
        min: 0,
        max: 120
    }
};

/**
 * Clamp a value between min and max bounds
 */
export function clamp(value, min, max) {
    if (typeof value !== 'number' || !isFinite(value)) {
        return min;
    }
    return Math.min(Math.max(value, min), max);
}

/**
 * Round a value to specified decimal places
 */
export function roundTo(value, decimals) {
    if (typeof value !== 'number' || !isFinite(value)) {
        return 0;
    }
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}

/**
 * Generate small random variation
 */
export function randomVariation(currentValue, maxChange) {
    if (typeof currentValue !== 'number' || !isFinite(currentValue)) {
        currentValue = 0;
    }
    if (typeof maxChange !== 'number' || !isFinite(maxChange) || maxChange < 0) {
        maxChange = 0;
    }
    const change = (Math.random() - 0.5) * 2 * maxChange;
    return currentValue + change;
}

/**
 * Get initial health data
 */
export function getInitialHealthData() {
    return { ...INITIAL_HEALTH_DATA };
}

/**
 * Generate next health reading based on previous data with smooth variation
 */
export function generateNextHealthData(previousData) {
    if (!previousData || typeof previousData !== 'object') {
        return getInitialHealthData();
    }

    // Heart Rate: ±1 to ±4 BPM (integer)
    const nextHeartRate = Math.round(
        clamp(
            randomVariation(previousData.heartRate || 78, 3),
            HEALTH_LIMITS.heartRate.min,
            HEALTH_LIMITS.heartRate.max
        )
    );

    // Oxygen Saturation: ±0 to ±1% (integer)
    const nextOxygen = Math.round(
        clamp(
            randomVariation(previousData.oxygen || 98, 0.8),
            HEALTH_LIMITS.oxygen.min,
            HEALTH_LIMITS.oxygen.max
        )
    );

    // Body Temperature: ±0.05°C to ±0.15°C (1 decimal place)
    const nextTemperature = roundTo(
        clamp(
            randomVariation(previousData.temperature || 36.7, 0.1),
            HEALTH_LIMITS.temperature.min,
            HEALTH_LIMITS.temperature.max
        ),
        1
    );

    // Sleep Duration: ±0 to ±0.3 hours (1 decimal place)
    const nextSleep = roundTo(
        clamp(
            randomVariation(previousData.sleep || 7.5, 0.15),
            HEALTH_LIMITS.sleep.min,
            HEALTH_LIMITS.sleep.max
        ),
        1
    );

    // Exercise Time: ±0 to ±3 minutes (integer)
    const nextExercise = Math.round(
        clamp(
            randomVariation(previousData.exercise || 52, 1.5),
            HEALTH_LIMITS.exercise.min,
            HEALTH_LIMITS.exercise.max
        )
    );

    return {
        heartRate: nextHeartRate,
        oxygen: nextOxygen,
        temperature: nextTemperature,
        sleep: nextSleep,
        exercise: nextExercise
    };
}

/**
 * Validate health data structure and values
 */
export function validateHealthData(data) {
    if (!data || typeof data !== 'object') {
        return false;
    }

    const required = ['heartRate', 'oxygen', 'temperature', 'sleep', 'exercise'];

    for (let i = 0; i < required.length; i++) {
        const key = required[i];
        if (!(key in data)) {
            return false;
        }
        const value = data[key];
        if (typeof value !== 'number' || !isFinite(value)) {
            return false;
        }
        if (value < -Infinity || value > Infinity) {
            return false;
        }
    }

    // Check against simulation boundaries
    if (data.heartRate < HEALTH_LIMITS.heartRate.min || data.heartRate > HEALTH_LIMITS.heartRate.max) {
        return false;
    }
    if (data.oxygen < HEALTH_LIMITS.oxygen.min || data.oxygen > HEALTH_LIMITS.oxygen.max) {
        return false;
    }
    if (data.temperature < HEALTH_LIMITS.temperature.min || data.temperature > HEALTH_LIMITS.temperature.max) {
        return false;
    }
    if (data.sleep < HEALTH_LIMITS.sleep.min || data.sleep > HEALTH_LIMITS.sleep.max) {
        return false;
    }
    if (data.exercise < HEALTH_LIMITS.exercise.min || data.exercise > HEALTH_LIMITS.exercise.max) {
        return false;
    }

    return true;
}

/**
 * Create initial health history with 20 readings
 */
export function createInitialHistory(initialData, count = 20) {
    const history = {
        heartRate: [],
        oxygen: [],
        temperature: [],
        sleep: [],
        exercise: []
    };

    let current = { ...initialData };
    for (let i = 0; i < count; i++) {
        // Generate slight variation to create realistic sequence
        const reading = generateNextHealthData(current);
        const timestamp = Date.now() - (count - i) * 5000; // 5 second intervals backwards

        history.heartRate.push({ timestamp: timestamp, value: reading.heartRate });
        history.oxygen.push({ timestamp: timestamp, value: reading.oxygen });
        history.temperature.push({ timestamp: timestamp, value: reading.temperature });
        history.sleep.push({ timestamp: timestamp, value: reading.sleep });
        history.exercise.push({ timestamp: timestamp, value: reading.exercise });

        current = reading;
    }

    return history;
}

/**
 * Add a health reading to history (maintains max 20 readings)
 */
export function addToHistory(history, healthData) {
    if (!history || typeof history !== 'object') {
        return;
    }
    if (!validateHealthData(healthData)) {
        return;
    }

    const timestamp = Date.now();

    history.heartRate.push({ timestamp: timestamp, value: healthData.heartRate });
    history.oxygen.push({ timestamp: timestamp, value: healthData.oxygen });
    history.temperature.push({ timestamp: timestamp, value: healthData.temperature });
    history.sleep.push({ timestamp: timestamp, value: healthData.sleep });
    history.exercise.push({ timestamp: timestamp, value: healthData.exercise });

    // Maintain max 20 readings
    if (history.heartRate.length > 20) {
        history.heartRate.shift();
    }
    if (history.oxygen.length > 20) {
        history.oxygen.shift();
    }
    if (history.temperature.length > 20) {
        history.temperature.shift();
    }
    if (history.sleep.length > 20) {
        history.sleep.shift();
    }
    if (history.exercise.length > 20) {
        history.exercise.shift();
    }
}