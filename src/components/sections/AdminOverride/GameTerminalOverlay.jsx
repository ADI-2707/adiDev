import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './GameTerminalOverlay.module.css';
import { playClick, playTone, playSuccess } from '../../../utils/audio';

const GameTerminalOverlay = ({
  activeZoom,
  onBack,
  onPuzzleComplete,
  completedPuzzles,
  gameTimer
}) => {
  // 5x5 Hacking Circuit Grid Node definitions
  const [grid, setGrid] = useState([
    [ { type: 'empty' }, { type: 'empty' }, { type: 'empty' }, { type: 'empty' }, { type: 'empty' } ],
    [ { type: 'empty' }, { type: 'connector', shape: 'corner', rotation: 180 }, { type: 'connector', shape: 'line', rotation: 90 }, { type: 'connector', shape: 'corner', rotation: 270 }, { type: 'empty' } ],
    [ { type: 'start' }, { type: 'connector', shape: 'corner', rotation: 0 }, { type: 'empty' }, { type: 'connector', shape: 'corner', rotation: 90 }, { type: 'end' } ],
    [ { type: 'empty' }, { type: 'empty' }, { type: 'empty' }, { type: 'empty' }, { type: 'empty' } ],
    [ { type: 'empty' }, { type: 'empty' }, { type: 'empty' }, { type: 'empty' }, { type: 'empty' } ]
  ]);

  const [activePaths, setActivePaths] = useState([]); // Array of coordinate strings like "r,c"
  const [circuitSolved, setCircuitSolved] = useState(false);
  const [beepInterval, setBeepInterval] = useState(null);

  // Direction definitions
  const UP = [-1, 0, 'UP'];
  const DOWN = [1, 0, 'DOWN'];
  const LEFT = [0, -1, 'LEFT'];
  const RIGHT = [0, 1, 'RIGHT'];

  const getOppositeDir = (dirStr) => {
    if (dirStr === 'UP') return 'DOWN';
    if (dirStr === 'DOWN') return 'UP';
    if (dirStr === 'LEFT') return 'RIGHT';
    if (dirStr === 'RIGHT') return 'LEFT';
    return null;
  };

  // Get active ports of a tile based on its shape and rotation
  const getPorts = (cell) => {
    if (cell.type === 'start') return ['RIGHT'];
    if (cell.type === 'end') return ['LEFT'];
    if (cell.type !== 'connector') return [];

    const rot = (cell.rotation % 360 + 360) % 360;

    if (cell.shape === 'line') {
      // 0 or 180 degrees connects LEFT & RIGHT. 90 or 270 connects UP & DOWN.
      if (rot === 0 || rot === 180) return ['LEFT', 'RIGHT'];
      if (rot === 90 || rot === 270) return ['UP', 'DOWN'];
    }

    if (cell.shape === 'corner') {
      if (rot === 0) return ['UP', 'RIGHT'];
      if (rot === 90) return ['RIGHT', 'DOWN'];
      if (rot === 180) return ['DOWN', 'LEFT'];
      if (rot === 270) return ['LEFT', 'UP'];
    }

    return [];
  };

  // Traverse the grid to find the energized circuit nodes starting from (2, 0)
  const calculateCircuitPath = (currentGrid) => {
    const paths = ['2,0'];
    let currR = 2;
    let currC = 0;
    let lastMoveDir = 'RIGHT'; // We move right out of the start socket
    let solved = false;

    // Safety counter to prevent infinite loops in cyclic paths
    for (let steps = 0; steps < 25; steps++) {
      const nextR = currR + (lastMoveDir === 'UP' ? -1 : lastMoveDir === 'DOWN' ? 1 : 0);
      const nextC = currC + (lastMoveDir === 'LEFT' ? -1 : lastMoveDir === 'RIGHT' ? 1 : 0);

      // Check bounds
      if (nextR < 0 || nextR >= 5 || nextC < 0 || nextC >= 5) break;

      const nextCell = currentGrid[nextR][nextC];
      const incomingPort = getOppositeDir(lastMoveDir);
      const nextPorts = getPorts(nextCell);

      // Verify alignment: does the next tile connect to the incoming port?
      if (!nextPorts.includes(incomingPort)) break;

      paths.push(`${nextR},${nextC}`);

      if (nextCell.type === 'end') {
        solved = true;
        break;
      }

      // Find the exit port on the next connector
      const exitPort = nextPorts.find((p) => p !== incomingPort);
      if (!exitPort) break;

      currR = nextR;
      currC = nextC;
      lastMoveDir = exitPort;
    }

    return { paths, solved };
  };

  // Rotate tile on click
  const handleTileClick = (r, c) => {
    if (circuitSolved || activeZoom !== 'terminal') return;
    playClick();

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          if (rIdx === r && cIdx === c && cell.type === 'connector') {
            return { ...cell, rotation: cell.rotation + 90 };
          }
          return cell;
        })
      );

      // Recalculate path instantly
      const { paths, solved } = calculateCircuitPath(newGrid);
      setActivePaths(paths);

      if (solved) {
        setCircuitSolved(true);
        playSuccess();
        setTimeout(() => {
          onPuzzleComplete('terminal');
        }, 1200);
      } else {
        playTone(380, 0.08, 0.02, 'sine');
      }

      return newGrid;
    });
  };

  // Recalculate paths when component mounts/activeZoom is set
  useEffect(() => {
    const { paths, solved } = calculateCircuitPath(grid);
    setActivePaths(paths);
    setCircuitSolved(solved);
  }, [grid]);

  // Audio sonar beacon warning beep that accelerates as the countdown shrinks
  useEffect(() => {
    if (circuitSolved || activeZoom !== 'terminal') {
      if (beepInterval) clearInterval(beepInterval);
      return;
    }

    const intervalMs = gameTimer > 15 ? 1200 : gameTimer > 8 ? 600 : 300;
    const interval = setInterval(() => {
      playTone(180, 0.05, 0.015, 'sine');
    }, intervalMs);

    return () => clearInterval(interval);
  }, [gameTimer, circuitSolved, activeZoom]);

  return (
    <div className={styles.overlayWrapper}>
      {/* HUD Top Status Bar */}
      <div className={styles.topHud}>
        <div className={styles.telemetryText}>
          <span>AEGIS_SYSTEM_GRID: INTRUDED</span>
          <span className={`${styles.timerValue} ${gameTimer <= 12 ? styles.timerWarning : ''}`}>
            SEC_TIMER: {gameTimer}s
          </span>
        </div>
        <div className={styles.objectiveProgress}>
          <span className={circuitSolved ? styles.solvedGlow : ''}>
            {circuitSolved ? 'MAINBOARD_CONNECTED' : 'CIRCUIT_BYPASS_ENGAGED'}
          </span>
        </div>
      </div>

      {/* Main Spider-Man 2 style grid deck */}
      <AnimatePresence>
        {activeZoom === 'terminal' && (
          <motion.div
            key="circuit"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={styles.puzzlePanel}
          >
            <div className={styles.panelHeader}>
              <span>SYSTEM CIRCUIT BOARD CONNECTIONS</span>
              <button onClick={onBack} className={styles.closeBtn}>[DISCONNECT]</button>
            </div>
            <div className={styles.panelBody}>
              <p className={styles.hintText}>
                ROTATE CORES TO ROUTE THE POWER SIGNAL (GREEN CONDUIT) TO THE RED TERMINAL NODE.
              </p>

              {/* 5x5 Circuit Grid Layout */}
              <div className={styles.circuitGridBoard}>
                {grid.map((row, r) =>
                  row.map((cell, c) => {
                    const isCellActive = activePaths.includes(`${r},${c}`);
                    
                    if (cell.type === 'empty') {
                      return <div key={`${r}-${c}`} className={styles.emptyGridCell} />;
                    }

                    if (cell.type === 'start') {
                      return (
                        <div key={`${r}-${c}`} className={`${styles.startNode} ${isCellActive ? styles.nodeActive : ''}`}>
                          <div className={styles.startPulseBulb} />
                          <span className={styles.nodeLabel}>START</span>
                        </div>
                      );
                    }

                    if (cell.type === 'end') {
                      return (
                        <div key={`${r}-${c}`} className={`${styles.endNode} ${circuitSolved ? styles.nodeActive : ''}`}>
                          <div className={styles.endPulseBulb} />
                          <span className={styles.nodeLabel}>CORE</span>
                        </div>
                      );
                    }

                    // Rotating Connectors
                    const rotationDegree = cell.rotation;
                    return (
                      <div
                        key={`${r}-${c}`}
                        onClick={() => handleTileClick(r, c)}
                        className={`${styles.connectorCell} ${isCellActive ? styles.connectorActive : ''}`}
                      >
                        <div 
                          className={styles.connectorGraphicWrapper}
                          style={{ transform: `rotate(${rotationDegree}deg)` }}
                        >
                          {cell.shape === 'line' ? (
                            <svg viewBox="0 0 100 100" className={styles.tileSvg}>
                              <line x1="0" y1="50" x2="100" y2="50" className={styles.tileWireBacking} />
                              <line x1="0" y1="50" x2="100" y2="50" className={styles.tileWireEnergy} />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 100 100" className={styles.tileSvg}>
                              {/* Curved path: LEFT to UP */}
                              <path d="M 0,50 A 50,50 0 0,1 50,0" className={styles.tileWireBacking} />
                              <path d="M 0,50 A 50,50 0 0,1 50,0" className={styles.tileWireEnergy} />
                            </svg>
                          )}
                          {/* Central node pin decoration */}
                          <div className={styles.wirePinJoint} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {circuitSolved && (
                <div className={styles.successLabel}>MAINFRAME LOCK OVERRIDE: VERIFIED SECURE</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Subtitles Dialogue Console */}
      <div className={styles.bottomDialogue}>
        <div className={styles.consolePrompt}>OPERATIVE_COMMAND // LOGS:</div>
        <div className={styles.consoleText}>
          {activeZoom === null && (
            <span>HOLOGRAPHIC CRT TERMINAL NODE SPOTTED. CLICK THE CENTRAL FLOATING HOLO-SCREEN TO ENGAGE SYSTEM BYPASS.</span>
          )}
          {activeZoom === 'terminal' && !circuitSolved && (
            <span>INTERCEPTED LOCK SIGNAL IDENTIFIED. ROTATE CIRCUIT MODULES TO COMPLETE DECRYPTION PATHWAYS.</span>
          )}
          {activeZoom === 'terminal' && circuitSolved && (
            <span>SECTOR CLEARED. LOCK PROTOCOL COMPROMISED. REBOOTING VAULT MATRIX BRIDGES.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameTerminalOverlay;
