import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Testimonials.module.css';
import { playClick, playTone, playSuccess } from '../../../utils/audio';

const Testimonials = ({ activeStage, setStage }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (activeStage !== 8) return;
    fetchTestimonials();
  }, [activeStage]);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/testimonials');
      if (!response.ok) {
        throw new Error('Failed to retrieve mission debrief database logs.');
      }
      const data = await response.json();
      setTestimonials(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author || !role || !content) return;

    playTone(500, 0.05, 0.03);
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await fetch('/api/v1/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author,
          role,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error('Transmission failed. Check network link.');
      }

      const newTestimonial = await response.json();
      playSuccess();
      setSubmitSuccess(true);
      setTestimonials((prev) => [newTestimonial, ...prev]);
      
      // Clear form
      setAuthor('');
      setRole('');
      setContent('');
      
      // Hide success message after a few seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextStage = () => {
    playClick();
    setStage(9);
  };

  if (activeStage !== 8) return null;

  return (
    <section id="testimonials" className={styles.section}>
      <div className={styles.cadBlueprintPaper}>
        <div className={styles.cadCoordinate}>DEBRIEFING_LOGS_STAGE_8</div>
        <div className={styles.cadGridMark} style={{ top: '20%', left: '10%' }} />
        <div className={styles.cadGridMark} style={{ top: '70%', left: '80%' }} />
      </div>

      <div className={`${styles.container} c-space`}>
        <div className={styles.header}>
          <span className={styles.monoPre}>&gt; LEVEL_8 // DECLASSIFIED_MISSION_REPORTS</span>
          <h2 className={styles.title}>
            Field <span className={styles.accentText}>Debriefings</span>
          </h2>
          <p className={styles.subtitle}>
            Declassified operation logs and mission outcome debriefs from verified field agents.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Left panel: Testimonial feed */}
          <div className={styles.feedColumn}>
            <div className="tech-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="tech-panel-header">
                <span>INTELLIGENCE_REPORTS // OPERATOR_LOG_FEED</span>
                <span className={styles.liveIndicator}>LIVE_STREAM</span>
              </div>
              <div className={`${styles.panelBody} tech-panel-body`}>
                {loading ? (
                  <div className={styles.statusMsg}>
                    <div className={styles.spinner} />
                    <span>DECRYPTING LOGS...</span>
                  </div>
                ) : error ? (
                  <div className={`${styles.statusMsg} ${styles.errorMsg}`}>
                    <span>ERROR: {error}</span>
                    <button onClick={fetchTestimonials} className={styles.retryBtn}>
                      [RETRY_LINK]
                    </button>
                  </div>
                ) : testimonials.length === 0 ? (
                  <div className={styles.statusMsg}>
                    <span>NO VERIFIED MISSION LOGS RECORDED IN THE INTELLIGENCE DATABASE.</span>
                  </div>
                ) : (
                  <div className={styles.testimonialsList}>
                    <AnimatePresence initial={false}>
                      {testimonials.map((t, idx) => (
                        <motion.div
                          key={t.id || idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className={styles.testimonialCard}
                        >
                          <div className={styles.cardHeader}>
                            <span className={styles.authorBadge}>OP_LOG_{t.id || idx + 1}</span>
                            <span className={styles.timestamp}>
                              {t.created_at ? new Date(t.created_at).toLocaleDateString() : 'ARCHIVED'}
                            </span>
                          </div>
                          <p className={styles.content}>"{t.content}"</p>
                          <div className={styles.meta}>
                            <span className={styles.authorName}>{t.author}</span>
                            <span className={styles.authorRole}>{t.role}</span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right panel: Submit testimonial form */}
          <div className={styles.formColumn}>
            <div className="tech-panel">
              <div className="tech-panel-header">
                <span>RECORD_FIELD_DEBRIEF // SECURE_UPLINK</span>
                <span className={styles.terminalLabel}>SECURE_PORT</span>
              </div>
              <div className="tech-panel-body">
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="author">OPERATIVE CODENAME / AGENT NAME</label>
                    <input
                      type="text"
                      id="author"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g., Agent Jenkins"
                      required
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="role">DIVISION / ASSIGNED SECTOR</label>
                    <input
                      type="text"
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g., Systems division, Apex Automation"
                      required
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="content">MISSION LOG CONTENT / DEBRIEF STATEMENT</label>
                    <textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter tactical details and mission report..."
                      required
                      rows={5}
                      className={styles.textarea}
                    />
                  </div>

                  {submitSuccess && (
                    <div className={styles.successNotification}>
                      &gt;&gt; LOG UPLOADED. MISSION DEBRIEF SEEDED INTO SECURE INTELLIGENCE DATABASE.
                    </div>
                  )}

                  {submitError && (
                    <div className={styles.errorNotification}>
                      &gt;&gt; UPLINK FAILURE: {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className={styles.submitBtn}
                  >
                    {submitting ? 'TRANSMITTING...' : '[SUBMIT_MISSION_DEBRIEF]'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottomNav}>
          <button onClick={handleNextStage} className={styles.nextCta}>
            ASSEMBLE FINAL VERDICT RECORD &gt;&gt;
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
