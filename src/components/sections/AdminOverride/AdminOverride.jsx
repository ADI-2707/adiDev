import { useState, useEffect, useRef } from 'react';
import styles from './AdminOverride.module.css';
import { playClick, playTone, playSuccess, playScanSweep, playAccessDenied, playNotification } from '../../../utils/audio';

const AdminOverride = ({ activeStage, setStage }) => {
  const [phase, setPhase] = useState('scan'); // 'scan' | 'tracer' | 'auth' | 'denied' | 'dashboard'
  const [passcode, setPasscode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Geolocation & local host data state
  const [geoData, setGeoData] = useState(null);
  const [hostUser, setHostUser] = useState('OPERATIVE_GUEST');
  const [visibleTraces, setVisibleTraces] = useState([]);
  
  // Admin dashboard states
  const [messages, setMessages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [activeTab, setActiveTab] = useState('testimonials'); // 'testimonials' | 'messages'
  const [dashLoading, setDashLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState('');

  // Camera stream elements
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  
  // Start webcam retinal scan simulation
  useEffect(() => {
    if (phase !== 'scan') return;
    
    playScanSweep();
    
    // Attempt webcam activation
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
      
    // Retinal Scan Phase takes 4.5 seconds
    const timer = setTimeout(() => {
      // Clean up stream
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

  // Run geolocation lookup & typewriting tracer logs
  useEffect(() => {
    if (phase !== 'tracer') return;

    // Fetch IP geo location info (legally spooks viewer)
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data);
      })
      .catch(() => {
        // Fallback simulated tracer metrics
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

    // Fetch host username from local backend
    fetch('/api/v1/admin/detect-host')
      .then((res) => res.json())
      .then((data) => {
        setHostUser(data.username);
      })
      .catch(() => setHostUser('OPERATIVE_GUEST'));

  }, [phase]);

  // Construct and render tracer outputs line-by-line
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
      `[>] ENVIRONMENT DECRPYT COMPLETE. SYSTEM GATEWAY Bypassed.`,
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < traceLines.length) {
        setVisibleTraces((prev) => [...prev, traceLines[currentIdx]]);
        playTone(600 + currentIdx * 50, 0.03, 0.01, 'sine');
        currentIdx++;
      } else {
        clearInterval(interval);
        // Complete printout and proceed to auth entry after 1.5 seconds
        setTimeout(() => {
          playNotification();
          setPhase('auth');
        }, 1500);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [phase, geoData, hostUser]);

  // Check if session storage already has valid passcode on mount
  useEffect(() => {
    const cachedCode = sessionStorage.getItem('adminPasscode');
    if (cachedCode && activeStage === 10) {
      // Validate cached code
      validatePasscode(cachedCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStage]);

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

  const handleDenied = () => {
    playAccessDenied();
    setPhase('denied');
    setTimeout(() => {
      // Kick them back to boot stage
      setStage(0);
    }, 4000);
  };

  const handleSubmitAuth = (e) => {
    e.preventDefault();
    if (!passcode || submitting) return;
    validatePasscode(passcode);
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

  return (
    <section className={styles.section}>
      <div className={styles.backgroundMask} />

      {phase === 'scan' && (
        <div className={styles.scanContainer}>
          <div className={styles.scannerWrapper}>
            <div className={styles.laserLine} />
            <div className={styles.videoCircle}>
              {/* Webcam stream */}
              <video ref={videoRef} autoPlay playsInline muted className={styles.webcamVideo} />
              
              {/* Procedural fallback when camera is blocked */}
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
    </section>
  );
};

export default AdminOverride;
