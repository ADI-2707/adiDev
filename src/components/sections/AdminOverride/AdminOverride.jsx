import { useState, useEffect, useRef } from 'react';
import styles from './AdminOverride.module.css';
import { playClick, playTone, playSuccess, playScanSweep, playAccessDenied, playNotification } from '../../../utils/audio';
import Typewriter from '../../ui/Typewriter';
import { AnimatePresence } from 'framer-motion';
import AegisGameCanvas from './AegisGameCanvas';
import GameTerminalOverlay from './GameTerminalOverlay';


const AdminOverride = ({ activeStage, setStage, isFullscreen, accessMode }) => {
  const [phase, setPhase] = useState('scan'); // 'scan' | 'tracer' | 'briefing' | 'self_destruct' | 'detective_game' | 'game_over' | 'game_success' | 'auth' | 'denied' | 'dashboard'
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
  const [activeZoom, setActiveZoom] = useState(null); // null | 'terminal' | 'relay' | 'satellite'
  const [completedPuzzles, setCompletedPuzzles] = useState({}); // { relay: true, terminal: true, satellite: true }

  // Scoreboard & current user details
  const [scoreboard, setScoreboard] = useState([]);
  const [currentOperative, setCurrentOperative] = useState('');
  
  // Testimonial Pop-Up Modal (Game success flow)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAuthor, setModalAuthor] = useState('');
  const [modalRole, setModalRole] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalSuccessMsg, setModalSuccessMsg] = useState('');
  const [modalErrorMsg, setModalErrorMsg] = useState('');

  // Passcode verification states (Direct flow)
  const [passcode, setPasscode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Admin dashboard states (Direct flow)
  const [messages, setMessages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [activeTab, setActiveTab] = useState('testimonials'); // 'testimonials' | 'messages'
  const [dashLoading, setDashLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState('');

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

  // --- HELPER FUNCTION DECLARATIONS (Ordered before Effects to prevent TDZ) ---
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleSelfDestruct = () => {
    playAccessDenied();
    setPhase('self_destruct');
    setTimeout(() => {
      setStage(1);
    }, 3000);
  };

  const acceptMission = () => {
    playClick();
    setPhase('detective_game');
    setActiveZoom(null);
    setCompletedPuzzles({});
    setGameTimer(75);
  };

  const handleSelectProp = (propKey) => {
    if (completedPuzzles[propKey]) return;
    playTone(480, 0.08, 0.03);
    setActiveZoom(propKey);
  };

  const handleBackToDesk = () => {
    playClick();
    setActiveZoom(null);
  };

  const handlePuzzleComplete = (puzzleKey) => {
    const updated = { ...completedPuzzles, [puzzleKey]: true };
    setCompletedPuzzles(updated);

    if (updated.relay && updated.terminal && updated.satellite) {
      setTimeout(() => {
        setPhase('game_success');
      }, 1000);
    }
  };

  const handleGameAbort = () => {
    playAccessDenied();
    setPhase('game_over');

    const saved = localStorage.getItem('detective_scoreboard');
    let list = [];
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch {}
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
      setGameError('INCORRECT SECTOR OFFSET ACCESS REJECTED. 10 SEC PENALTY INCURRED.');
      setGameTimer(prev => Math.max(0, prev - 10));
      playTone(180, 0.25, 0.05, 'triangle');
    }
  };

  const closeTestimonialModal = () => {
    playClick();
    setIsModalOpen(false);
    setBaseCountdown(3);
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

  const handleDenied = () => {
    playAccessDenied();
    setPhase('denied');
    setTimeout(() => {
      setStage(0);
    }, 4000);
  };

  const fetchDashboardData = async (code = passcode) => {
    setDashLoading(true);
    const authHeaders = { 'X-Admin-Passcode': code || sessionStorage.getItem('adminPasscode') };
    try {
      const [messagesRes, testimonialsRes] = await Promise.all([
        fetch('/api/v1/admin/messages', { headers: authHeaders }),
        fetch('/api/v1/admin/testimonials', { headers: authHeaders })
      ]);
      
      if (messagesRes.ok && testimonialsRes.ok) {
        const msgs = await messagesRes.json();
        const tests = await testimonialsRes.json();
        setMessages(msgs);
        setTestimonials(tests);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setDashLoading(false);
    }
  };

  const validatePasscode = async (code) => {
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/v1/admin/testimonials', {
        headers: { 'X-Admin-Passcode': code }
      });
      if (res.ok) {
        sessionStorage.setItem('adminPasscode', code);
        setPhase('dashboard');
        fetchDashboardData(code);
      } else {
        sessionStorage.removeItem('adminPasscode');
        if (phase === 'auth') {
          handleDenied();
        }
      }
    } catch {
      setErrorMsg("CONNECTION_FAILED: Server offline or proxy blocked.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitAuth = (e) => {
    e.preventDefault();
    if (!passcode || submitting) return;
    validatePasscode(passcode);
  };

  const handleApprove = async (id) => {
    playClick();
    const code = passcode || sessionStorage.getItem('adminPasscode');
    setActionStatus(`Approving testimonial ${id}...`);
    try {
      const res = await fetch(`/api/v1/testimonials/${id}/approve`, {
        method: 'PUT',
        headers: { 'X-Admin-Passcode': code }
      });
      if (res.ok) {
        playSuccess();
        setActionStatus(`Testimonial ${id} approved successfully.`);
        fetchDashboardData();
      } else {
        setActionStatus(`Failed to approve testimonial.`);
      }
    } catch {
      setActionStatus(`Uplink error during approval.`);
    }
    setTimeout(() => setActionStatus(''), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Force deletion of testimonial ${id}?`)) return;
    playClick();
    const code = passcode || sessionStorage.getItem('adminPasscode');
    setActionStatus(`Purging testimonial ${id}...`);
    try {
      const res = await fetch(`/api/v1/testimonials/${id}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Passcode': code }
      });
      if (res.ok) {
        playTone(300, 0.2, 0.05, 'sawtooth');
        setActionStatus(`Testimonial ${id} deleted.`);
        fetchDashboardData();
      } else {
        setActionStatus(`Failed to delete testimonial.`);
      }
    } catch {
      setActionStatus(`Uplink error during deletion.`);
    }
    setTimeout(() => setActionStatus(''), 3000);
  };

  const handleLogout = () => {
    playClick();
    sessionStorage.removeItem('adminPasscode');
    setStage(0);
  };

  // --- EFFECT HOOKS ---

  // Mount initialization: split between game flow and direct passcode entry flow
  useEffect(() => {
    if (activeStage === 10) {
      if (accessMode === 'direct') {
        setPhase('auth');
      } else {
        setPhase('scan');
      }
    }
  }, [activeStage, accessMode]);

  // Check if session storage already has valid passcode on mount
  useEffect(() => {
    const cachedCode = sessionStorage.getItem('adminPasscode');
    if (cachedCode && activeStage === 10 && accessMode === 'direct') {
      validatePasscode(cachedCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStage, accessMode]);

  // Start webcam retinal scan simulation
  useEffect(() => {
    if (phase !== 'scan') return;
    
    playScanSweep();
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
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
    } else {
      console.log("Retinal Scan: mediaDevices not supported or unavailable.");
    }
      
    const timer = setTimeout(() => {
      stopWebcam();
      setPhase('tracer');
    }, 4500);
    
    return () => {
      clearTimeout(timer);
      stopWebcam();
    };
  }, [phase]);

  // Run geolocation lookup & fetch host user
  useEffect(() => {
    if (phase !== 'tracer' && phase !== 'auth') return;

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

  // Scoreboard loader on victory
  useEffect(() => {
    if (phase !== 'game_success') return;

    let list = [];
    try {
      const saved = localStorage.getItem('detective_scoreboard');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          list = parsed;
        }
      }
    } catch (e) {
      console.error("Failed to read scoreboard from localStorage:", e);
    }

    if (list.length === 0) {
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
    } while (list.some(item => item && item.operative === currentOp) && attempts < 100);

    setCurrentOperative(currentOp);
    setModalAuthor(currentOp);
    setModalRole(`Assigned Sector: ${geoData?.city || 'NODE_SECTOR'}`);

    const newList = [{ operative: currentOp, outcome: 'WON' }, ...list].slice(0, 10);
    setScoreboard(newList);
    try {
      localStorage.setItem('detective_scoreboard', JSON.stringify(newList));
    } catch (e) {
      console.error("Failed to write scoreboard to localStorage:", e);
    }

    playSuccess();
    
    // Open the feedback testimonial modal
    setTimeout(() => {
      setIsModalOpen(true);
    }, 2000);
  }, [phase, geoData]);

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
        <div className={styles.canvasGameWrapper}>
          <AegisGameCanvas activeZoom={activeZoom} onSelectProp={handleSelectProp} />
          
          <GameTerminalOverlay
            activeZoom={activeZoom}
            onBack={handleBackToDesk}
            onPuzzleComplete={handlePuzzleComplete}
            completedPuzzles={completedPuzzles}
            gameTimer={gameTimer}
          />
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

      {/* --- DIRECT PASSCODE / AUTH FLOW PHASES --- */}
      {phase === 'auth' && (
        <div className={styles.authContainer}>
          <div className={styles.authBox}>
            <div className={styles.authHeader}>SYSTEM OVERRIDE CLEARED // SIGNATURE MATCH</div>
            <div className={styles.authBody}>
              <p className={styles.authLabel}>ENTER TWO-FACTOR SECURITY OVERRIDE PASSCODE:</p>
              
              <form onSubmit={handleSubmitAuth} className={styles.authForm}>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="********"
                  autoFocus
                  required
                  className={styles.authInput}
                  disabled={submitting}
                />
                
                {errorMsg && <div className={styles.errorText}>{errorMsg}</div>}
                
                <button type="submit" disabled={submitting} className={styles.authSubmit}>
                  {submitting ? 'VALIDATING SECURITY...' : '[ DECRYPT_OVERRIDE_GATE ]'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {phase === 'denied' && (
        <div className={styles.deniedContainer}>
          <div className={styles.deniedBox}>
            <h1 className={styles.deniedAlert}>⚠️ ACCESS DENIED ⚠️</h1>
            <p className={styles.deniedSubText}>AUTHENTICATION FAILURE. ACCESS REJECTED.</p>
            <div className={styles.alarmStaticGrid}>
              <span>OVERRIDE_LOG_PURGED</span>
              <span>SEC_BREACH_LOGGED</span>
              <span>KICKBACK_TERMINATED</span>
            </div>
            <p className={styles.timerText}>SYSTEM REBOOTING IN 3 SECONDS...</p>
          </div>
        </div>
      )}

      {phase === 'dashboard' && (
        <div className={styles.dashboardContainer}>
          <div className={styles.dashPanel}>
            <div className={styles.dashHeader}>
              <div className={styles.dashBrand}>
                <span>AGIS_COMMAND_CENTER // OPERATIONS</span>
                <span className={styles.clearanceBadge}>LEVEL_10_CLEARANCE</span>
              </div>
              <div className={styles.dashActions}>
                <button onClick={() => fetchDashboardData()} className={styles.dashBtn}>[REFRESH_LOGS]</button>
                <button onClick={handleLogout} className={`${styles.dashBtn} ${styles.logoutBtn}`}>[DISCONNECT_TERMINAL]</button>
              </div>
            </div>

            <div className={styles.tabBar}>
              <button 
                onClick={() => { playClick(); setActiveTab('testimonials'); }}
                className={`${styles.tabBtn} ${activeTab === 'testimonials' ? styles.tabActive : ''}`}
              >
                TESTIMONIALS MODERATION ({testimonials.length})
              </button>
              <button 
                onClick={() => { playClick(); setActiveTab('messages'); }}
                className={`${styles.tabBtn} ${activeTab === 'messages' ? styles.tabActive : ''}`}
              >
                CONTACT MESSAGE ARCHIVE ({messages.length})
              </button>
            </div>

            {actionStatus && <div className={styles.statusBar}>{actionStatus}</div>}

            <div className={styles.dashBody}>
              {dashLoading ? (
                <div className={styles.dashLoading}>
                  <div className={styles.spinner} />
                  <span>SYNCING DIRECTORY DATABASE LOGS...</span>
                </div>
              ) : activeTab === 'testimonials' ? (
                <div className={styles.testimonialsList}>
                  {testimonials.length === 0 ? (
                    <div className={styles.emptyMsg}>NO TESTIMONIALS LOGS RECORDED.</div>
                  ) : (
                    testimonials.map((t) => (
                      <div key={t.id} className={styles.testCard}>
                        <div className={styles.cardHeader}>
                          <span className={styles.cardId}>OP_LOG_{t.id}</span>
                          <span className={t.is_approved ? styles.approvedBadge : styles.pendingBadge}>
                            {t.is_approved ? 'APPROVED' : 'AWAITING_MODERATION'}
                          </span>
                        </div>
                        <p className={styles.cardContent}>"{t.content}"</p>
                        <div className={styles.cardMeta}>
                          <div className={styles.metaDetails}>
                            <span className={styles.metaAuthor}>{t.author}</span>
                            <span className={styles.metaRole}>{t.role}</span>
                          </div>
                          <div className={styles.cardButtons}>
                            {!t.is_approved && (
                              <button onClick={() => handleApprove(t.id)} className={styles.approveBtn}>
                                [APPROVE]
                              </button>
                            )}
                            <button onClick={() => handleDelete(t.id)} className={styles.deleteBtn}>
                              [PURGE]
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className={styles.messagesTableContainer}>
                  {messages.length === 0 ? (
                    <div className={styles.emptyMsg}>NO CONTACT MESSAGES SUBMITTED YET.</div>
                  ) : (
                    <table className={styles.messagesTable}>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>OPERATIVE</th>
                          <th>EMAIL</th>
                          <th>MESSAGE CONTENT</th>
                          <th>DATE RECORDED</th>
                        </tr>
                      </thead>
                      <tbody>
                        {messages.map((m) => (
                          <tr key={m.id}>
                            <td>{m.id}</td>
                            <td className={styles.boldText}>{m.name}</td>
                            <td>{m.email}</td>
                            <td className={styles.messageContentCol}>{m.content}</td>
                            <td>{m.created_at ? new Date(m.created_at).toLocaleString() : 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Testimonial Form Modal Pop-up (Game flow) */}
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
