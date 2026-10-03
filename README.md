# AstroPulse

A browser-based simulation dashboard for monitoring astronaut health parameters during a simulated space mission.

## Overview

AstroPulse is a frontend-only simulation of an astronaut health monitoring system. It simulates health telemetry for **one astronaut** (Alex Morgan) on **one mission** (AURORA-01), demonstrating real-time health monitoring concepts in a mission-control style dashboard.

## Status

Phase 5 — Health History & Final Integration

## Features

- **One Astronaut, One Mission**: Simulated health data for Alex Morgan on mission AURORA-01
- **Five Health Parameters**: Heart Rate (BPM), Oxygen Saturation (%), Body Temperature (°C), Sleep Duration (hours), Exercise Time (minutes)
- **Health Status Evaluation**: Real-time evaluation with NORMAL, WARNING, and CRITICAL states
- **Overall Health Assessment**: Priority-based overall status (CRITICAL > WARNING > NORMAL)
- **Alert System**: Parameter-specific alerts with proper transition handling and recovery
- **Live Monitoring**: Health data updates every 5 seconds with smooth, realistic variation
- **Health History Chart**: Line chart of the last 20 readings with a parameter selector for all five health metrics
- **Mission Clock**: Simulated mission time (Mission Day 47, UTC) updating every second
- **Simulation Controls**: Demonstration modes (NORMAL, WARNING, CRITICAL) for testing scenarios
- **Responsive Design**: Works across desktop, tablet, and mobile devices
- **Accessible UI**: Semantic HTML, ARIA labels, keyboard accessible controls and charts

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
    ├── astronaut.svg
    └── favicon.svg
```

## How to Run

AstroPulse uses native ES modules, so it must be served over HTTP (opening `index.html` directly with a `file://` URL will not work because browsers block ES module imports from the local filesystem). There is no build step or install step.

Pick one of these options from the project folder:

```bash
# Python 3 (already installed on most systems)
python -m http.server 8000

# or Node.js
npx serve .

# or PHP
php -S localhost:8000
```

Then open `http://localhost:8000/` in a modern browser (Chrome, Firefox, Safari, Edge).

If you use VS Code, the **Live Server** extension works as well (right-click `index.html` → "Open with Live Server").

1. The dashboard initializes automatically with live simulation
2. Use the simulation controls (NORMAL/WARNING/CRITICAL) to test different scenarios
3. Monitor real-time health updates and alerts
4. Switch the chart's parameter selector to view history for any of the five health metrics

> **Notes:**
> - The health history chart loads Chart.js from a CDN and requires an internet connection. Without it, the dashboard still runs and the chart shows its "No historical readings available." empty state.
> - A local server is required only because of ES modules; all application logic runs entirely in the browser with no backend.

## Architecture

- **Data Layer** (`healthData.js`): Generates realistic simulated health data with smooth variation, validation, and rolling 20-reading history
- **Logic Layer** (`healthLogic.js`): Centralized thresholds, status evaluation, overall health calculation, and alert generation
- **UI Layer** (`ui.js`): Targeted DOM updates for health cards, overall status, alerts, mission clock, controls, and the history chart
- **Application Layer** (`app.js`): Orchestrates all modules, manages application state, handles timers, and coordinates chart updates

## Health Parameters & Thresholds (Simulation)

| Parameter | Normal Range | Warning | Critical | Units |
|-----------|--------------|---------|----------|-------|
| Heart Rate | ~70-100 | >100 | >120 | BPM |
| Oxygen Saturation | 95-100 | <95 | <90 | % |
| Body Temperature | 36.0-37.5 | >37.5 | >38.5 | °C |
| Sleep Duration | 6.5-10 | <6.5 | <5.0 | hours |
| Exercise Time | 30-120 | <30 | <15 | minutes |

*Note: These are simulation thresholds for demonstration purposes only, not medical guidelines.*

## Current Implementation

- Phase 1: Project setup & HTML structure ✓
- Phase 2: UI design & responsive CSS ✓  
- Phase 3: Health data engine ✓
- Phase 4: Health logic & live monitoring (stabilized) ✓
- Phase 5: Health history chart & final integration ✓

## Dependencies

- [Chart.js](https://www.chartjs.org/) v4 (loaded via CDN) — used only for the health history line chart. No package manager, build step, or bundler is required.

## Disclaimer

This project uses simulated fictional health data for demonstration and educational purposes only. It does not provide real medical monitoring, diagnosis, or clinical decision support. All data is artificial and should not be used for medical purposes.