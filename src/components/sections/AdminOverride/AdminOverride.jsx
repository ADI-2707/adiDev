import { useState, useEffect, useRef } from 'react';
import styles from './AdminOverride.module.css';
import { playClick, playTone, playSuccess, playScanSweep, playAccessDenied, playNotification } from '../../../utils/audio';
import Typewriter from '../../ui/Typewriter';

const AdminOverride = ({ activeStage, setStage, isFullscreen }) => {
  const [phase, setPhase] = useState('scan'); // 'scan' | 'tracer' | 'briefing' | 'self_destruct' | 'detective_game' | 'game_over' | 'game_success'
  const [geoData, setGeoData] = useState(null);
  const [hostUser, setHostUser] = useState('OPERATIVE_GUEST');
  const [visibleTraces, setVisibleTraces] = useState([]);
  
  // Briefing states
  const [briefingPrinted, setBriefingPrinted] = useState(false);
  const [briefingCountdown, setBriefingCountdown] = useState(5);
  const [briefingTimerActive, setBriefingTimerActive] = useState(false);

  // Game states
  const [gameStage, setGameStage] = useState(1); // 1 | 2 | 3
  const [gameTimer, setGameTimer] = useState(40);
  const [selectedClue, setSelectedClue] = useState(null);
  const [gameError, setGameError] = useState('');
  const [hintActive, setHintActive] = useState(false);

  // Scoreboard & current user details
  const [scoreboard, setScoreboard] = useState([]);
  const [currentOperative, setCurrentOperative] = useState('');
  
  // Testimonial Pop-Up Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAuthor, setModalAuthor] = useState('');
  const [modalRole, setModalRole] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalSuccessMsg, setModalSuccessMsg] = useState('');
  const [modalErrorMsg, setModalErrorMsg] = useState('');

  // Returning to base state
  const [baseCountdown, setBaseCountdown] = useState(null);

  // Camera stream elements
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const BRIEFING_TEXT = "YOUR MISSION, SHOULD YOU CHOOSE TO ACCEPT IT, IS TO INVESTIGATE AND DISMANTLE THE SHADOW SYNDICATE'S SECURE COMMAND NETWORK. AS ALWAYS, SHOULD YOU OR ANY OF YOUR FORCE BE CAUGHT OR KILLED, THE SECRETARY WILL DISAVOW ANY KNOWLEDGE OF YOUR ACTIONS.";

  // Puzzles definitions
  const PUZZLES = {
    1: {
      question: "TACTICAL BREACH: We intercepted an encrypted message from the operative: 'U.D.I.G.R.A.V.I.T.Y'. Tracing indicates a letter-shift offset of -1. Restore the codename to locate the database.",
      hint: "Check the name of your agentic assistant!",
      options: [
        { label: "A) ANTIGRAVITY", value: "A" },
        { label: "B) SUPERGRAVITY", value: "B" },
        { label: "C) HYPERDRIVE", value: "C" }
      ],
      correct: "A"
    },
    2: {
      question: "NETWORK PENETRATION: The mainframe's gate node is secured. Intrusion detection shows the entry port is represented by the hexadecimal value '0x2A'. Convert it to decimal to override the firewall.",
      hint: "Multiply 2 * 16 and add 10.",
      options: [
        { label: "A) Port 24", value: "A" },
        { label: "B) Port 42", value: "B" },
        { label: "C) Port 84", value: "C" }
      ],
      correct: "B"
    },
    3: {
      question: "DECRYPTION LOCK: The bypass code follows a mathematical sequence: 3, 8, 15, 24, ? . Find the missing value to open the vault.",
      hint: "The terms are n^2 - 1 for n = 2, 3, 4, 5. Calculate 6^2 - 1.",
      options: [
        { label: "A) 31", value: "A" },
        { label: "B) 35", value: "B" },
        { label: "C) 39", value: "C" }
      ],
      correct: "B"
    }
  };

  // Start webcam retinal scan simulation
  useEffect(() => {
    if (phase !== 'scan') return;
    
    playScanSweep();
    
    navigator.mediaDevices.getUserMedia({ video: { width: 300, height: 300 } })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.log("Retinal Scan: Camera blocked or unavailable. Falling back to wireframe simulation.", err);
      });
      
    const timer = setTimeout(() => {
      stopWebcam();
      setPhase('tracer');
    }, 4500);
    
    return () => {
      clearTimeout(timer);
      stopWebcam();
    };
  }, [phase]);

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Run geolocation lookup & fetch host user
  useEffect(() => {
    if (phase !== 'tracer') return;

    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data);
      })
      .catch(() => {
        setGeoData({
          ip: "192.168.1.1",
          city: "UNKNOWN_SECTOR",
          region: "GRID_NODE",
          country_name: "CYBER_VOIDS",
          org: "LOCAL_GATEWAY_NODE",
          latitude: "0.00",
          longitude: "0.00"
        });
      });

    fetch('/api/v1/admin/detect-host')
      .then((res) => res.json())
      .then((data) => {
        setHostUser(data.username);
      })
      .catch(() => setHostUser('OPERATIVE_GUEST'));
  }, [phase]);

  // Typewriting tracer logs
  useEffect(() => {
    if (phase !== 'tracer' || !geoData) return;

    const traceLines = [
      `[>] ESTABLISHING ENCRYPTED OVERRIDE LOG...`,
      `[>] EXTRACTING ENVIRONMENT VARIABLES...`,
      `[>] CLIENT DEVICE IDENTIFIED: ${navigator.platform || 'UNKNOWN_CHASSIS'} // ${navigator.languages?.[0] || 'EN-US'}`,
      `[>] OPERATIVE USER DIRECTORY: C:\\Users\\${hostUser}`,
      `[>] SCANNING ACTIVE PORT INTRUSION...`,
      `[>] IP ADDRESS TRACKED: ${geoData.ip || '127.0.0.1'}`,
      `[>] SATELLITE LOC NODE: ${geoData.city || 'LOCAL'}, ${geoData.region || 'DEV'}, ${geoData.country_name || 'HOST'}`,
      `[>] RADAR COORDS: Lat ${geoData.latitude || '28.6'}, Long ${geoData.longitude || '77.2'}`,
      `[>] CARRIER FREQUENCY: ${geoData.org || 'STANDALONE_ISP'}`,
      `[>] ENVIRONMENT DECRYPT COMPLETE. SYSTEM GATEWAY BYPASSED.`,
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < traceLines.length) {
        setVisibleTraces((prev) => [...prev, traceLines[currentIdx]]);
        playTone(600 + currentIdx * 50, 0.03, 0.01, 'sine');
        currentIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          playNotification();
          setPhase('briefing');
        }, 1200);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [phase, geoData, hostUser]);

  // Briefing typewriter completed timer trigger
  useEffect(() => {
    if (phase !== 'briefing' || !briefingPrinted) return;

    const timer = setTimeout(() => {
      setBriefingTimerActive(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [phase, briefingPrinted]);

  // Briefing 5s countdown timer
  useEffect(() => {
    if (phase !== 'briefing' || !briefingTimerActive) return;

    const interval = setInterval(() => {
      setBriefingCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSelfDestruct();
          return 0;
        }
        playTone(150, 0.15, 0.06, 'sawtooth');
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, briefingTimerActive]);

  // key listener for "1" during briefing
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (phase === 'briefing' && briefingTimerActive && e.key === '1') {
        acceptMission();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, briefingTimerActive]);

  // Detective game timer decrement
  useEffect(() => {
    if (phase !== 'detective_game') return;

    const interval = setInterval(() => {
      setGameTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleGameAbort();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  // Scoreboard loader on victory
  useEffect(() => {
    if (phase !== 'game_success') return;

    const saved = localStorage.getItem('detective_scoreboard');
    let list = [];
    if (saved) {
      list = JSON.parse(saved);
    } else {
      // Load mock items
      list = [
        { operative: 'OPERATIVE_118', outcome: 'WON' },
        { operative: 'OPERATIVE_982', outcome: 'LOST' },
        { operative: 'OPERATIVE_405', outcome: 'WON' },
        { operative: 'OPERATIVE_211', outcome: 'WON' },
        { operative: 'OPERATIVE_734', outcome: 'LOST' },
        { operative: 'OPERATIVE_509', outcome: 'WON' },
        { operative: 'OPERATIVE_861', outcome: 'WON' },
        { operative: 'OPERATIVE_190', outcome: 'LOST' },
        { operative: 'OPERATIVE_623', outcome: 'WON' },
        { operative: 'OPERATIVE_475', outcome: 'WON' }
      ];
    }

    // Generate unique user operative ID
    let currentOp = '';
    let rand = 0;
    let attempts = 0;
    do {
      rand = Math.floor(100 + Math.random() * 900);
      currentOp = `OPERATIVE_${rand}`;
      attempts++;
    } while (list.some(item => item.operative === currentOp) && attempts < 100);

    setCurrentOperative(currentOp);
    setModalAuthor(currentOp);
    setModalRole(`Assigned Sector: ${geoData?.city || 'NODE_SECTOR'}`);

    const newList = [{ operative: currentOp, outcome: 'WON' }, ...list].slice(0, 10);
    setScoreboard(newList);
    localStorage.setItem('detective_scoreboard', JSON.stringify(newList));

    playSuccess();
    
    // Open the feedback testimonial modal
    setTimeout(() => {
      setIsModalOpen(true);
    }, 2000);
  }, [phase, geoData]);

  // Base returning countdown timer
  useEffect(() => {
    if (baseCountdown === null) return;
    if (baseCountdown <= 0) {
      setStage(1);
      return;
    }
    const timer = setTimeout(() => {
      setBaseCountdown(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [baseCountdown]);

  const acceptMission = () => {
    playClick();
    setPhase('detective_game');
    setGameStage(1);
    setGameTimer(40);
  };

  const handleSelfDestruct = () => {
    playAccessDenied();
    setPhase('self_destruct');
    setTimeout(() => {
      setStage(1);
    }, 3000);
  };

  const handleGameAbort = () => {
    playAccessDenied();
    setPhase('game_over');

    // Save lost attempt to scoreboard log
    const saved = localStorage.getItem('detective_scoreboard');
    let list = [];
    if (saved) {
      list = JSON.parse(saved);
    }
    const rand = Math.floor(100 + Math.random() * 900);
    const mockLost = [{ operative: `OPERATIVE_${rand}`, outcome: 'LOST' }, ...list].slice(0, 10);
    localStorage.setItem('detective_scoreboard', JSON.stringify(mockLost));

    setTimeout(() => {
      setStage(1);
    }, 4000);
  };

  const handleSelectClue = (val) => {
    playClick();
    const correct = PUZZLES[gameStage].correct;
    if (val === correct) {
      setGameError('');
      setHintActive(false);
      if (gameStage === 3) {
        setPhase('game_success');
      } else {
        setGameStage(prev => prev + 1);
        setGameTimer(40);
      }
    } else {
      // 10 second penalty for wrong answer
      setGameError('INCORRECT SECTOR OFFSET ACCESS REJECTED. 10 SEC PENALTY INCURRED.');
      setGameTimer(prev => Math.max(0, prev - 10));
      playTone(180, 0.25, 0.05, 'triangle');
    }
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    if (!modalAuthor || !modalRole || !modalContent) return;

    setModalSubmitting(true);
    setModalSuccessMsg('');
    setModalErrorMsg('');
    playTone(500, 0.05, 0.03);

    try {
      const response = await fetch('/api/v1/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: modalAuthor,
          role: modalRole,
          content: modalContent
        })
      });

      if (!response.ok) {
        throw new Error('Signal transmission blocked.');
      }
      playSuccess();
      setModalSuccessMsg('DEBRIEF LOG RECEIVED. DATABASE UPDATED.');
      setTimeout(() => {
        closeTestimonialModal();
      }, 1500);
    } catch {
      setModalErrorMsg('UPLINK FAILURE. MESSAGE LOG DUMPED LOCALLY.');
    } finally {
      setModalSubmitting(false);
    }
  };

  const closeTestimonialModal = () => {
    playClick();
    setIsModalOpen(false);
    setBaseCountdown(3);
  };

  return (
    <section className={`${styles.section} ${isFullscreen ? styles.fullscreenSection : ''}`}>
      <div className={styles.backgroundMask} />

      {phase === 'scan' && (
        <div className={styles.scanContainer}>
          <div className={styles.scannerWrapper}>
            <div className={styles.laserLine} />
            <div className={styles.videoCircle}>
              <video ref={videoRef} autoPlay playsInline muted className={styles.webcamVideo} />
              
              <div className={styles.eyeFallback}>
                <svg viewBox="0 0 100 100" className={styles.eyeSvg}>
                  <circle cx="50" cy="50" r="45" stroke="var(--accent-cyan)" strokeWidth="0.5" fill="none" opacity="0.3" />
                  <circle cx="50" cy="50" r="30" stroke="var(--accent-cyan)" strokeWidth="1" fill="none" strokeDasharray="3, 3" />
                  <ellipse cx="50" cy="50" rx="20" ry="12" stroke="var(--accent-cyan)" strokeWidth="1.5" fill="none" className={styles.pulseEye} />
                  <circle cx="50" cy="50" r="7" fill="var(--accent-cyan)" className={styles.pupil} />
                  <line x1="10" y1="50" x2="90" y2="50" stroke="var(--accent-cyan)" strokeWidth="0.5" opacity="0.5" />
                  <line x1="50" y1="10" x2="50" y2="90" stroke="var(--accent-cyan)" strokeWidth="0.5" opacity="0.5" />
                </svg>
              </div>
            </div>
            <div className={styles.scannerHud}>
              <div className={styles.scanHeader}>AEGIS_BIOMETRICS_DECRYPT</div>
              <div className={styles.scanSubtitle}>SCANNING RETINAL ANGLE MATRIX...</div>
              <div className={styles.progressBar} />
            </div>
          </div>
        </div>
      )}

      {phase === 'tracer' && (
        <div className={styles.tracerContainer}>
          <div className={styles.terminalPanel}>
            <div className={styles.terminalHeader}>
              <span>SECURE_UPLINK // INTRUSION_TRACE</span>
              <span className={styles.blinkingRed}>TRACING_NODE</span>
            </div>
            <div className={styles.terminalBody}>
              {visibleTraces.map((line, idx) => (
                <div key={idx} className={styles.traceLine}>{line}</div>
              ))}
              <div className={styles.terminalCursor} />
            </div>
          </div>
        </div>
      )}

      {phase === 'briefing' && (
        <div className={styles.briefingContainer}>
          <div className={styles.briefingPanel}>
            <div className={styles.briefingHeader}>
              <span>INCOMING TRANSMISSION // SECURE CHANNEL</span>
              <span className={styles.blinkingRed}>DECRYPTED BRIEFING</span>
            </div>
            <div className={styles.briefingBody}>
              <Typewriter
                text={BRIEFING_TEXT}
                speed={20}
                showCursor={!briefingPrinted}
                onComplete={() => setBriefingPrinted(true)}
              />
              
              {briefingPrinted && (
                <div className={styles.acceptBlock}>
                  <p className={styles.briefingQuestion}>DO YOU ACCEPT THIS CASE?</p>
                  
                  {briefingTimerActive && (
                    <p className={styles.selfDestructText}>
                      THIS MESSAGE WILL SELF-DESTRUCT IN:{' '}
                      <span className={styles.countdownRed}>{briefingCountdown} SECONDS</span>
                    </p>
                  )}
                  
                  <button onClick={acceptMission} className={styles.acceptButton}>
                    [ ACCEPT CASE / PRESS 1 ]
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {phase === 'self_destruct' && (
        <div className={styles.blackoutContainer}>
          <div className={styles.destructMsg}>
            <Typewriter text="self destruct initiated...." speed={50} showCursor={true} />
          </div>
        </div>
      )}

      {phase === 'detective_game' && (
        <div className={styles.gameContainer}>
          <div className={styles.gamePanel}>
            <div className={styles.gameHeader}>
              <span>TACTICAL COMMAND PANEL // DECIPHER PUZZLE</span>
              <span className={styles.stageIndicator}>CLUE {gameStage} OF 3</span>
            </div>
            <div className={styles.gameBody}>
              <div className={styles.timerRow}>
                <span className={styles.timerLabel}>REMAINING NODE DURATION:</span>
                <span className={`${styles.timerValue} ${gameTimer <= 10 ? styles.timerWarning : ''}`}>
                  {gameTimer}s
                </span>
              </div>

              <p className={styles.gameQuestion}>{PUZZLES[gameStage].question}</p>

              {gameError && <div className={styles.gameErrorText}>{gameError}</div>}

              <div className={styles.optionsGrid}>
                {PUZZLES[gameStage].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectClue(opt.value)}
                    className={styles.optionBtn}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className={styles.helpRow}>
                {hintActive ? (
                  <div className={styles.hintBox}>
                    <strong>HINT:</strong> {PUZZLES[gameStage].hint}
                  </div>
                ) : (
                  <button onClick={() => { playClick(); setHintActive(true); }} className={styles.hintBtn}>
                    [ REQUEST INTEL HINT ]
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {phase === 'game_over' && (
        <div className={styles.abortContainer}>
          <div className={styles.abortBox}>
            <h1 className={styles.abortHeader}>COMMAND - MISSION ABORT.....TIMES UP</h1>
            <p className={styles.abortSubText}>DECRYPT COMPROMISED. REBOOTING SYSTEM BRIDGE...</p>
          </div>
        </div>
      )}

      {phase === 'game_success' && (
        <div className={styles.successContainer}>
          <div className={styles.successWrapper}>
            <h2 className={styles.successTitle}>
              <Typewriter text="You've officially cracked your first case. Congratulations Agent!" speed={25} showCursor={false} />
            </h2>
            
            {/* SVG Saluting Detective */}
            <div className={styles.salutingAgent}>
              <svg viewBox="0 0 100 100" className={styles.agentSvg}>
                <path d="M20 90 L80 90 L75 60 L65 40 L35 40 L25 60 Z" fill="#1e293b" stroke="var(--accent-cyan)" strokeWidth="2" />
                <path d="M40 40 L50 60 L60 40" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" />
                <circle cx="50" cy="30" r="10" fill="#334155" stroke="var(--accent-cyan)" strokeWidth="2" />
                <path d="M35 25 C35 15, 65 15, 65 25 Z" fill="#0f172a" stroke="var(--accent-cyan)" strokeWidth="2" />
                <ellipse cx="50" cy="25" rx="20" ry="3" fill="#0f172a" stroke="var(--accent-cyan)" strokeWidth="2" />
                <path d="M43 30 Q47 30 47 33 Q43 36 43 33 Z" fill="#000" stroke="var(--accent-cyan)" strokeWidth="1" />
                <path d="M57 30 Q53 30 53 33 Q57 36 57 33 Z" fill="#000" stroke="var(--accent-cyan)" strokeWidth="1" />
                <line x1="47" y1="31" x2="53" y2="31" stroke="var(--accent-cyan)" strokeWidth="1.5" />
                <g className={styles.salutingArmG}>
                  <path d="M25 65 L10 50 L25 35" fill="none" stroke="var(--accent-cyan)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </svg>
            </div>

            {/* Scoreboard table */}
            <div className={styles.scoreboardWrapper}>
              <h3 className={styles.scoreboardTitle}>AGENTS CENTRAL DEBRIEF BOARD (LAST 10 ATTEMPTS)</h3>
              <table className={styles.scoreboardTable}>
                <thead>
                  <tr>
                    <th>OPERATIVE</th>
                    <th>MISSION OUTCOME</th>
                  </tr>
                </thead>
                <tbody>
                  {scoreboard.map((row, idx) => (
                    <tr key={idx} className={row.operative === currentOperative ? styles.highlightRow : ''}>
                      <td>{row.operative}</td>
                      <td className={row.outcome === 'WON' ? styles.outcomeWon : styles.outcomeLost}>
                        {row.outcome}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {baseCountdown !== null && (
              <div className={styles.rebootText}>
                Returning to base in {baseCountdown}...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Testimonial Form Modal Pop-up */}
      <AnimatePresence>
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <span>RECORD FIELD DEBRIEF // FEEDBACK UPLINK</span>
                <button className={styles.modalCloseBtn} onClick={closeTestimonialModal}>[X]</button>
              </div>
              <div className={styles.modalBody}>
                <form onSubmit={handleTestimonialSubmit} className={styles.modalForm}>
                  <div className={styles.modalInputGroup}>
                    <label>OPERATIVE IDENTIFIER</label>
                    <input
                      type="text"
                      value={modalAuthor}
                      onChange={(e) => setModalAuthor(e.target.value)}
                      required
                      className={styles.modalInput}
                    />
                  </div>
                  <div className={styles.modalInputGroup}>
                    <label>TACTICAL SECTOR DIVISION</label>
                    <input
                      type="text"
                      value={modalRole}
                      onChange={(e) => setModalRole(e.target.value)}
                      required
                      className={styles.modalInput}
                    />
                  </div>
                  <div className={styles.modalInputGroup}>
                    <label>MISSION DEBRIEF MESSAGE / FEEDBACK</label>
                    <textarea
                      value={modalContent}
                      onChange={(e) => setModalContent(e.target.value)}
                      required
                      rows={4}
                      placeholder="Write your tactical evaluation..."
                      className={styles.modalTextarea}
                    />
                  </div>

                  {modalSuccessMsg && <div className={styles.modalSuccessText}>{modalSuccessMsg}</div>}
                  {modalErrorMsg && <div className={styles.modalErrorText}>{modalErrorMsg}</div>}

                  <div className={styles.modalFormButtons}>
                    <button type="submit" disabled={modalSubmitting} className={styles.modalSubmitBtn}>
                      {modalSubmitting ? 'TRANSMITTING...' : '[ TRANSMIT DEBRIEF ]'}
                    </button>
                    <button type="button" onClick={closeTestimonialModal} className={styles.modalCancelBtn}>
                      [ CLOSE AND BASE DEPART ]
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AdminOverride;
