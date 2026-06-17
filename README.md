# adiDev Portfolio

A modern, high-performance web portfolio featuring advanced 3D graphics, smooth scroll behaviors, and interactive companion mechanisms.

## Technology Stack

* **Core**: React 19, JavaScript (ES6+), CSS3 Modules, HTML5.
* **Build System**: Vite.
* **Runtime Environment**: Node.js.

## Third-Party Libraries

* **Three.js**: Main WebGL rendering engine.
* **React Three Fiber (R3F)**: React wrapper for Three.js scene-graph management.
* **React Three Drei**: Helper abstractions for loading models, animations, environments, shadows, and floating physics.
* **GSAP (GreenSock Animation Platform)**: Handles precise, physics-like programmatic animations and scale transitions.
* **Framer Motion**: Manages smooth scroll-triggered 2D animations and entry reveals.
* **Lenis**: Provides uniform, high-performance smooth scroll behavior across all web browsers.

## Advanced Concepts and Implementations

### Dynamic WebGL Stencil Masking
To achieve the passport-sized hologram effect inside the Contact section, a custom WebGL stencil mask is used. An invisible ring geometry renders at the exact screen coordinates of the 3D globe and writes a reference value to the WebGL stencil buffer. The astronaut model meshes dynamically enable stencil checking, restricting rendering only to pixels within the globe's boundaries.

### DOM-to-WebGL Coordinate Projection
Calculates bounding client rectangles of HTML elements (such as the globe wrapper) in pixels and projects their center coordinates into Three.js 3D world units at specific camera depths using camera-depth viewport parameters. This bridges the layout gap between standard DOM elements and overlay canvases, ensuring exact positioning.

### Single-Loop Synchronized Rendering
To prevent render-order synchronization lag (which causes dynamic meshes to float away or drift from parent components during fast movements), the 3D space tether is computed inside the main rendering loop. The attachment point calculates the local unscaled backpack offset, multiplies it by the active group scale, applies the rotation quaternion, and regenerates the Catmull-Rom curve and TubeGeometry in the same frame.

### Double-Layered Shader-Like Materials
The space tether uses a concentric double-layered mesh structure:
* **Outer Sheath**: A thick, semi-translucent metallic sheath with high reflectivity and low roughness to catch directional specular highlights.
* **Inner Core**: A thin energy line with high emissive intensity that pulses over time, creating a premium sci-fi tether appearance.

### Global Raycasting and Pointer Constraints
Since the overlay canvas is set to pass clicks through to the underlying HTML structure (using pointer-events: none), native Three.js pointer interactions are blocked. This project bypasses this constraint by implementing global window listeners for mouse movement and click events, running manual raycasting intersections against the astronaut meshes to trigger hover cursors and click-to-flip animations.

### Physics-Cushioned Target Interpolation
Astronaut head-tracking uses linear vector interpolation (LERP) to track targets. When switching between cursor coordinates and active shooting stars, the target coordinates themselves are interpolated with custom speed curves, preventing sudden visual snaps and simulating natural muscle acceleration.
