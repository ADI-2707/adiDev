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
  // --- PUZZLE 1: POWER RELAY (Left) ---
  const [activeSocket, setActiveSocket] = useState(null); // 'A' | 'B' | 'C' | 'D'
  const [connections, setConnections] = useState({}); // { A: 3, B: 1 }
  const [wireSway, setWireSway] = useState(0);

  // Bezier curve physical sway timer
  useEffect(() => {
    let frame;
    const updateSway = () => {
      setWireSway(Math.sin(Date.now() / 240) * 12);
      frame = requestAnimationFrame(updateSway);
    };
    frame = requestAnimationFrame(updateSway);
    return () => cancelAnimationFrame(frame);
  }, []);

  const relayCoordinates = {
    // Sockets pixel offsets relative to SVG container
    left: { A: [40, 60], B: [40, 120], C: [40, 180], D: [40, 240] },
    right: { 1: [320, 60], 2: [320, 120], 3: [320, 180], 4: [320, 240] }
  };

  const handleSocketClick = (side, key) => {
    playClick();
    if (side === 'left') {
      setActiveSocket(key);
    } else if (side === 'right' && activeSocket) {
      // Connect active left socket to this right socket
      const newConns = { ...connections, [activeSocket]: key };
      setConnections(newConns);
      setActiveSocket(null);

      // Verify connection rule
      const correct = { A: 3, B: 1, C: 4, D: 2 };
      const allDone = ['A', 'B', 'C', 'D'].every((k) => newConns[k] === correct[k]);
      if (allDone) {
        playSuccess();
        onPuzzleComplete('relay');
      } else {
        playTone(320, 0.1, 0.03, 'sine');
      }
    }
  };

  const clearRelay = () => {
    playTone(150, 0.15, 0.05, 'sawtooth');
    setConnections({});
    setActiveSocket(null);
  };

  // --- PUZZLE 2: CIPHER NODE (Center) ---
  const [selectedHex, setSelectedHex] = useState(null);
  const [cipherStatus, setCipherStatus] = useState('AWAITING_DECRYPTION');
  
  const hexNodes = [
    { val: '2A', dec: 42, label: '0x2A' },
    { val: 'E5', dec: 229, label: '0xE5' },
    { val: '7F', dec: 127, label: '0x7F' },
    { val: 'B2', dec: 178, label: '0xB2' },
    { val: '3C', dec: 60, label: '0x3C' },
    { val: 'F4', dec: 244, label: '0xF4' },
    { val: 'A9', dec: 169, label: '0xA9' },
    { val: 'D1', dec: 209, label: '0xD1' },
    { val: '6E', dec: 110, label: '0x6E' }
  ];

  const handleHexClick = (node) => {
    if (completedPuzzles.terminal) return;
    playClick();
    setSelectedHex(node.val);

    // Target decimal: 127 -> Hex 0x7F
    if (node.val === '7F') {
      setCipherStatus('CIPHER_SOLVED // DECRYPTED');
      playSuccess();
      onPuzzleComplete('terminal');
    } else {
      setCipherStatus('DECRYPT_FAILURE // GATE_REJECTED');
      playTone(180, 0.25, 0.05, 'triangle');
      setTimeout(() => setCipherStatus('AWAITING_DECRYPTION'), 1500);
    }
  };

  // --- PUZZLE 3: SATELLITE TUNER (Right) ---
  const [freq, setFreq] = useState(0.8);
  const [phase, setPhase] = useState(-1.5);
  const [isTuned, setIsTuned] = useState(false);

  // Handle tuning check
  const handleTune = (type, val) => {
    if (completedPuzzles.satellite) return;
    playTone(300 + val * 100, 0.02, 0.015, 'sine');
    if (type === 'freq') setFreq(val);
    if (type === 'phase') setPhase(val);
  };

  useEffect(() => {
    if (completedPuzzles.satellite) {
      setIsTuned(true);
      return;
    }
    // Target: Freq = 1.5, Phase = 0.0 (Tolerances 0.1)
    const freqMatch = Math.abs(freq - 1.5) < 0.1;
    const phaseMatch = Math.abs(phase - 0.0) < 0.12;

    if (freqMatch && phaseMatch) {
      setIsTuned(true);
      playSuccess();
      onPuzzleComplete('satellite');
    }
  }, [freq, phase, completedPuzzles.satellite]);

  // Generate SVG wave path coordinates
  const getWavePath = (frequency, phaseOffset) => {
    let points = [];
    const width = 320;
    const height = 150;
    const centerY = height / 2;

    for (let x = 0; x <= width; x += 4) {
      const radians = (x / width) * Math.PI * 4 * frequency + phaseOffset;
      const y = centerY + Math.sin(radians) * 45;
      points.push(`${x},${y}`);
    }
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className={styles.overlayWrapper}>
      {/* HUD Top Status Row */}
      <div className={styles.topHud}>
        <div className={styles.telemetryText}>
          <span>AEGIS_MAIN: ONLINE</span>
          <span className={styles.timerValue}>TIMER_DURATION: {gameTimer}s</span>
        </div>
        <div className={styles.objectiveProgress}>
          <span>SOLVED: {Object.keys(completedPuzzles).length} / 3</span>
          <div className={styles.progressTrack}>
            <div 
              className={styles.progressBar} 
              style={{ width: `${(Object.keys(completedPuzzles).length / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main interactive panel container */}
      <AnimatePresence mode="wait">
        {activeZoom === 'relay' && (
          <motion.div
            key="relay"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={styles.puzzlePanel}
          >
            <div className={styles.panelHeader}>
              <span>JUNCTION RELAY CABLING MODULE</span>
              <button onClick={onBack} className={styles.closeBtn}>[X]</button>
            </div>
            <div className={styles.panelBody}>
              <p className={styles.hintText}>
                ROUTE NODE CONNECTIONS IN THE SEQUENCE: A &rarr; 3, B &rarr; 1, C &rarr; 4, D &rarr; 2
              </p>

              <div className={styles.relayGrid}>
                {/* Wires Connection Overlay SVG */}
                <svg className={styles.wiresSvg}>
                  {Object.entries(connections).map(([left, right]) => {
                    const start = relayCoordinates.left[left];
                    const end = relayCoordinates.right[right];
                    const ctrlX = (start[0] + end[0]) / 2;
                    const ctrlY = (start[1] + end[1]) / 2 + wireSway;
                    return (
                      <path
                        key={left}
                        d={`M ${start[0]} ${start[1]} Q ${ctrlX} ${ctrlY} ${end[0]} ${end[1]}`}
                        className={styles.connectingWire}
                      />
                    );
                  })}
                </svg>

                {/* Left Sockets Column */}
                <div className={styles.socketsCol}>
                  {Object.keys(relayCoordinates.left).map((k) => {
                    const isSelected = activeSocket === k;
                    const isConnected = !!connections[k];
                    return (
                      <button
                        key={k}
                        disabled={completedPuzzles.relay || isConnected}
                        onClick={() => handleSocketClick('left', k)}
                        className={`${styles.socketBtn} ${isSelected ? styles.socketActive : ''} ${isConnected ? styles.socketConnected : ''}`}
                      >
                        PORT_{k}
                      </button>
                    );
                  })}
                </div>

                {/* Right Sockets Column */}
                <div className={styles.socketsCol}>
                  {Object.keys(relayCoordinates.right).map((k) => {
                    const isConnected = Object.values(connections).includes(Number(k));
                    return (
                      <button
                        key={k}
                        disabled={completedPuzzles.relay || isConnected}
                        onClick={() => handleSocketClick('right', Number(k))}
                        className={`${styles.socketBtn} ${isConnected ? styles.socketConnected : ''}`}
                      >
                        NODE_{k}
                      </button>
                    );
                  })}
                </div>
              </div>

              {!completedPuzzles.relay && (
                <button onClick={clearRelay} className={styles.resetBtn}>
                  [ RESET CABLING PATHS ]
                </button>
              )}

              {completedPuzzles.relay && (
                <div className={styles.successLabel}>RELAY POWER INTEGRITY OVERRIDE: SECURED</div>
              )}
            </div>
          </motion.div>
        )}

        {activeZoom === 'terminal' && (
          <motion.div
            key="terminal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={styles.puzzlePanel}
          >
            <div className={styles.panelHeader}>
              <span>CIPHER MAIN CONSOLE DECRYPT</span>
              <button onClick={onBack} className={styles.closeBtn}>[X]</button>
            </div>
            <div className={styles.panelBody}>
              <p className={styles.hintText}>
                INTRUSION SECURITY BYPASS: CHOOSE TARGET HEXADECIMAL OF DECIMAL VALUE 127
              </p>

              <div className={styles.cipherStatusRow}>{cipherStatus}</div>

              <div className={styles.hexGrid}>
                {hexNodes.map((node) => {
                  const isSelected = selectedHex === node.val;
                  const isCorrect = node.val === '7F';
                  return (
                    <button
                      key={node.val}
                      disabled={completedPuzzles.terminal}
                      onClick={() => handleHexClick(node)}
                      className={`${styles.hexCard} ${isSelected ? (isCorrect ? styles.hexCorrect : styles.hexWrong) : ''}`}
                    >
                      <span className={styles.hexValue}>{node.label}</span>
                      <span className={styles.hexMeta}>DEC_{node.dec}</span>
                    </button>
                  );
                })}
              </div>

              {completedPuzzles.terminal && (
                <div className={styles.successLabel}>CIPHER GATEWAY KEY SIGNATURE: VERIFIED</div>
              )}
            </div>
          </motion.div>
        )}

        {activeZoom === 'satellite' && (
          <motion.div
            key="satellite"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={styles.puzzlePanel}
          >
            <div className={styles.panelHeader}>
              <span>SATELLITE FREQUENCY ALIGNMENT</span>
              <button onClick={onBack} className={styles.closeBtn}>[X]</button>
            </div>
            <div className={styles.panelBody}>
              <p className={styles.hintText}>
                TUNE FREQUENCY TO 1.5 AND PHASE ANGLE TO 0.0 TO ALIGN SPECTRUMS
              </p>

              {/* Sine Wave Graphic Tuning Screen */}
              <div className={styles.tuningScreen}>
                <svg className={styles.waveSvgContainer}>
                  {/* Reference Sine Wave (Static Red) */}
                  <path d={getWavePath(1.5, 0.0)} className={styles.refWave} />
                  {/* Dynamic Tuned Wave (Green) */}
                  <path 
                    d={getWavePath(freq, phase)} 
                    className={`${styles.tunedWave} ${isTuned ? styles.alignedWave : ''}`} 
                  />
                </svg>
              </div>

              <div className={styles.controlsRow}>
                <div className={styles.sliderGroup}>
                  <label>CARRIER FREQUENCY: {parseFloat(freq).toFixed(2)}Hz (Target: 1.5)</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.05"
                    value={freq}
                    disabled={completedPuzzles.satellite}
                    onChange={(e) => handleTune('freq', parseFloat(e.target.value))}
                    className={styles.tunerSlider}
                  />
                </div>
                
                <div className={styles.sliderGroup}>
                  <label>PHASE ANGLE Offset: {parseFloat(phase).toFixed(2)} rad (Target: 0.0)</label>
                  <input
                    type="range"
                    min="-3.14"
                    max="3.14"
                    step="0.08"
                    value={phase}
                    disabled={completedPuzzles.satellite}
                    onChange={(e) => handleTune('phase', parseFloat(e.target.value))}
                    className={styles.tunerSlider}
                  />
                </div>
              </div>

              {isTuned && (
                <div className={styles.successLabel}>SATELLITE WAVE SPECTRUM SYNC: COMPLETED</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Narrative Dialogue Subtitles Console */}
      <div className={styles.bottomDialogue}>
        <div className={styles.consolePrompt}>OPERATIVE_COMMAND // DIALOGUE:</div>
        <div className={styles.consoleText}>
          {activeZoom === null && (
            <span>SELECT COGNITIVE PROTOCOLS FROM CORES (LEFT RELAY / CENTER CIPHER / RIGHT SATELLITE) TO COMMENCE BYPASS.</span>
          )}
          {activeZoom === 'relay' && !completedPuzzles.relay && (
            <span>PATCH TERMINALS TO BRIDGE THE BROKEN JUNCTION GRID CORE.</span>
          )}
          {activeZoom === 'terminal' && !completedPuzzles.terminal && (
            <span>IDENTIFY THE HEXADECIMAL DECRYPTION OFFSET VALUE TO BYPASS INTRUSION DETECTORS.</span>
          )}
          {activeZoom === 'satellite' && !completedPuzzles.satellite && (
            <span>MATCH SINE WAVE ALIGNMENTS TO HOOK SATELLITE COMMUNICATIONS GATE.</span>
          )}
          {activeZoom !== null && completedPuzzles[activeZoom] && (
            <span>SECTOR SOLVED. CLICK CLOSE [X] IN THE PUZZLE PANEL TO RETURN TO CORE DESK VIEW.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameTerminalOverlay;
