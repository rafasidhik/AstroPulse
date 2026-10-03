# AstroPulse

AstroPulse is a browser-based astronaut health monitoring simulation dashboard designed to demonstrate real-time health telemetry, threshold-based status evaluation, alerting, and historical health trends in a mission-control style interface.

The system simulates the health of one astronaut, Alex Morgan, during the AURORA-01 space mission. All health data is fictional and generated locally in the browser.

## Overview

AstroPulse demonstrates how a health monitoring dashboard can:

- Monitor multiple health parameters in real time
- Evaluate measurements against predefined thresholds
- Display NORMAL, WARNING, and CRITICAL health states
- Generate and clear parameter-specific alerts
- Calculate an overall health status
- Visualize recent health trends
- Simulate different health conditions
- Adapt to desktop, tablet, and mobile screens

The application is completely frontend-based and does not require a backend, database, authentication system, or build process.

## Features

### Astronaut Monitoring

- Single simulated astronaut: Alex Morgan
- Mission: AURORA-01
- Mission Day: 47
- Live mission monitoring interface
- Simulated mission clock

### Health Parameters

- Heart Rate — BPM
- Oxygen Saturation — %
- Body Temperature — °C
- Sleep Duration — Hours
- Exercise Time — Minutes

Health values are updated every 5 seconds with controlled variation to simulate changing astronaut telemetry.

### Health Status & Alerts

Each health parameter is evaluated as:

- **NORMAL**
- **WARNING**
- **CRITICAL**

The overall health status follows this priority:

```text
CRITICAL > WARNING > NORMAL
```

Parameter-specific alerts are generated as readings cross into WARNING or CRITICAL, and are cleared automatically when values return to normal.

### Health History Chart

- Line chart of the most recent 20 readings
- Parameter selector for all five health metrics
- Updates live alongside the dashboard
- Displays a "No historical readings available." empty state when no data is present

The chart is powered by Chart.js, loaded from a CDN.

### Simulation Controls

- **NORMAL**, **WARNING**, and **CRITICAL** demonstration modes
- Switching mode applies the corresponding health scenario and refreshes statuses and alerts
- Returning to NORMAL restores healthy values and clears alerts

### Responsive & Accessible Design

- Adapts across desktop, tablet, and mobile layouts
- Semantic HTML structure with ARIA labels
- Keyboard-accessible controls and chart

## Health Parameters & Thresholds

| Parameter | Normal Range | Warning | Critical | Units |
|-----------|--------------|---------|----------|-------|
| Heart Rate | ~70-100 | >100 | >120 | BPM |
| Oxygen Saturation | 95-100 | <95 | <90 | % |
| Body Temperature | 36.0-37.5 | >37.5 | >38.5 | °C |
| Sleep Duration | 6.5-10 | <6.5 | <5.0 | hours |
| Exercise Time | 30-120 | <30 | <15 | minutes |

*These are simulation thresholds for demonstration purposes only, not medical guidelines.*

## Project Structure

```text
AstroPulse/
│
├── index.html
├── README.md
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js           # Application controller & live monitoring
│   ├── healthData.js    # Health data generation engine
│   ├── healthLogic.js   # Thresholds, evaluation & alerts
│   └── ui.js            # DOM updates & rendering
│
└── assets/
    └── astronaut.svg
```

## How to Run

AstroPulse uses native ES modules, so it must be served over HTTP. Opening `index.html` directly with a `file://` URL will not work, because browsers block ES module imports from the local filesystem. There is no install or build step.

From the project folder, pick one of these options:

```bash
# Python 3 (already installed on most systems)
python -m http.server 8000

# or Node.js
npx serve .

# or PHP
php -S localhost:8000
```

Then open `http://localhost:8000/` in a modern browser (Chrome, Firefox, Safari, or Edge).

If you use VS Code, the **Live Server** extension works as well (right-click `index.html` → "Open with Live Server").

## Architecture

The application is organized into four focused layers with a one-way data flow:

- **Data Layer** (`healthData.js`): Generates realistic simulated health data with smooth variation, validation, and a rolling 20-reading history.
- **Logic Layer** (`healthLogic.js`): Defines centralized thresholds and performs status evaluation, overall health calculation, and alert generation.
- **Application Layer** (`app.js`): Orchestrates the modules, holds application state, drives the update timers, and coordinates chart updates.
- **UI Layer** (`ui.js`): Performs targeted DOM updates for the health cards, overall status, alerts, mission clock, controls, and history chart.

```text
healthData.js  →  healthLogic.js  →  app.js  →  ui.js  →  index.html
```

## Dependencies

- [Chart.js](https://www.chartjs.org/) v4.4.1 (loaded via CDN) — used only for the health history line chart. No package manager, build step, or bundler is required.

## Disclaimer

This project uses simulated, fictional health data for demonstration and educational purposes only. It does not provide real medical monitoring, diagnosis, or clinical decision support. All data is artificial and must not be used for medical purposes.
