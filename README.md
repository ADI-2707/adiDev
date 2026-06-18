# adiDev // PROJECT AEGIS: Personnel Assessment Console

PROJECT AEGIS is a simulated restricted-access Personnel Assessment Console and Engineer Evaluation Interface, designed to showcase the work, projects, and skills of Aditya Singh in a premium, gamified format. Visitors act as system operators, navigating through clearances, system logs, and security evaluations.

---

## 🖥️ System Architecture & Mechanics

### 1. Instrumentation HUD & State Control
*   **Sequential Stage Controller:** Built on a single-page React state engine (managing Stages 0 to 8) synchronized with window hash routes (`#boot`, `#dossier`, `#evaluation`, `#systems`, `#cases`, `#facilities`, `#philosophy`, `#operations`, `#report`).
*   **Mechanical Panel Transitions:** Programmed horizontal sliding steel security doors that part and close during stage switches, styled with custom shadows and border beams.
*   **Telemetry Navbar HUD:** Includes ticking system clocks, clearance level monitors, audio status indicators, and locked/unlocked indicators corresponding to the operator's evaluation progress.

### 2. Procedural 3D Wireframe Telemetry
*   **React Three Fiber Globe:** Renders a custom 3D wireframe telemetry globe with orbiting satellite trackers that transition dynamically in rotation, position, scale, and opacity as stages change.
*   **Adaptive Stacking Layering:** The canvas container dynamically swaps z-indexes (`15` in Dossier and Report stages to render in front of solid backgrounds; `2` in other stages to float behind interactive content panels), ensuring readability and preventing clipping.

### 3. Synthesized UI Audio System
*   **Web Audio API Synthesizer:** Fully procedural offline UI sounds (mechanical typewriter keyboard clicks, heavy hydraulic door sweeps, status warning/success beeps, and continuous thermal printer whirrs) generated in real-time with zero audio asset downloads.
*   **Global Mute Hook:** Accessible in the header HUD to toggle audio feedback, defaulting to muted.

### 4. Interactive Console Sections
*   **Stage 0: Boot sequence:** A command-line logging terminal that types out server initialization logs and runs load percentages leading to a white coordinate handoff flash.
*   **Stage 1: Dossier File:** Restricted candidate record files detailing security clearance levels, status indicators, and specialization areas.
*   **Stage 2: Active Scanners:** Multi-scanner panels executing visual grid animations, expandable candidate story modules, and vertical event timeline log charts.
*   **Stage 3: Systems Registry:** Interactive documentation panels for core languages and frameworks. Selecting a module triggers real-time SVG schematic animations of micro-architectures.
*   **Stage 4: Bureau Desk:** Manila project folders spread across a steel grid desk. Opening folders displays project autopsy logs, constraint parameters, obstacle summaries, decision logs (Decision/Reason/Trade-off), and success metric logs.
*   **Stage 5: Deployment Facilities:** Industrial facility status logs with rotating hardware cogwheels.
*   **Stage 6: Engineering Philosophy:** Trade-off analysis records answering "Why X?" for core technologies.
*   **Stage 7: Live Operations:** GitHub contribution matrix grids, live activity radars, and active tool registries.
*   **Stage 8: Verdict Output:** A virtual thermal slot printer that rolls out a final evaluation report and stamps "APPROVED" with spring-cushioned scaling.

---

## 🛠️ Technology Stack

*   **Core**: React 19, JavaScript (ES6+), CSS3 Modules, HTML5.
*   **Build Environment**: Vite, npm.
*   **Graphics & Animation**:
    *   Three.js (WebGL rendering)
    *   React Three Fiber (Declarative R3F wrapper)
    *   Framer Motion (React 2D transitions & door mechanisms)
*   **Styling**: JetBrains Mono, Space Grotesk, and Inter typography; custom crosshair pointers; carbon, graphite, electric blue, and cyan highlight tokens.

---

## 🚀 Local Operations & Building

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Server
```bash
npm run dev
```

### 3. Compile Production Bundle
```bash
npm run build
```

### 4. Run Linter
```bash
npm run lint
```
