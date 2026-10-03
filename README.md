# AstroPulse

A browser-based simulation dashboard for monitoring astronaut health parameters during a simulated space mission.

## Overview

AstroPulse is a frontend-only simulation of an astronaut health monitoring system. It simulates health telemetry for **one astronaut** (Alex Morgan) on **one mission** (AURORA-01), demonstrating real-time health monitoring concepts in a mission-control style dashboard.

## Status

Phase 4 — Health Logic & Live Monitoring (Stabilized)

## Features

- **One Astronaut, One Mission**: Simulated health data for Alex Morgan on mission AURORA-01
- **Five Health Parameters**: Heart Rate (BPM), Oxygen Saturation (%), Body Temperature (°C), Sleep Duration (hours), Exercise Time (minutes)
- **Health Status Evaluation**: Real-time evaluation with NORMAL, WARNING, and CRITICAL states
- **Overall Health Assessment**: Priority-based overall status (CRITICAL > WARNING > NORMAL)
- **Alert System**: Parameter-specific alerts with proper transition handling and recovery
- **Live Monitoring**: Health data updates every 5 seconds with smooth, realistic variation
- **Mission Clock**: Simulated mission time (Mission Day 47, UTC) updating every second
- **Simulation Controls**: Demonstration modes (NORMAL, WARNING, CRITICAL) for testing scenarios
- **Responsive Design**: Works across desktop, tablet, and mobile devices
- **Accessible UI**: Semantic HTML, ARIA labels, keyboard accessible controls

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

1. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)
2. The dashboard will initialize automatically with live simulation
3. Use the simulation controls (NORMAL/WARNING/CRITICAL) to test different scenarios
4. Monitor real-time health updates and alerts

## Architecture

- **Data Layer** (`healthData.js`): Generates realistic simulated health data with smooth variation, validation, and rolling 20-reading history
- **Logic Layer** (`healthLogic.js`): Centralized thresholds, status evaluation, overall health calculation, and alert generation
- **UI Layer** (`ui.js`): Targeted DOM updates for health cards, overall status, alerts, mission clock, and controls
- **Application Layer** (`app.js`): Orchestrates all modules, manages application state, and handles timers

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

## Disclaimer

This project uses simulated fictional health data for demonstration and educational purposes only. It does not provide real medical monitoring, diagnosis, or clinical decision support. All data is artificial and should not be used for medical purposes.