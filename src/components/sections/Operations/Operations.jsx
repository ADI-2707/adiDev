import { useState, useEffect } from 'react';
import styles from './Operations.module.css';
import { playTone } from '../../../utils/audio';

import { CURRENT_LEARNING, REPOS_LIST, CURRENT_STACK } from '../../../data/operationsData';

const CONTRIB_GRID = (() => {
  const grid = [];
  for (let r = 0; r < 7; r++) {
    const row = [];
    for (let c = 0; c < 30; c++) {
      const val = Math.random() > 0.45 ? Math.floor(Math.random() * 4) : 0;
      row.push(val);
    }
    grid.push(row);
  }
  return grid;
})();

const Operations = ({ activeStage, setStage }) => {
  const [livePulse, setLivePulse] = useState(0);


  useEffect(() => {
    if (activeStage !== 7) return;
    const interval = setInterval(() => {
      setLivePulse((prev) => {
        const next = prev + 1;
        if (next % 4 === 0) {
          playTone(900, 0.01, 0.005);
        }
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [activeStage]);

  if (activeStage !== 7) return null;

  return (
    <section id="operations" className={styles.section}>
      { }
      <div className={styles.worldBackplane}>
        <div className={styles.worldGridLines} />
        <div className={styles.satelliteTracker} style={{ top: '25%', left: '40%' }} />
        <div className={styles.satelliteTracker} style={{ top: '60%', left: '70%', animationDelay: '2s' }} />
      </div>

      <div className={`${styles.container} c-space`}>
        <div className={styles.gridContainer}>
          { }
          <div className={styles.consoleHeader}>
            <div className={styles.consoleBrand}>
              <span className={styles.liveIndicator}>• LIVE</span>
              <span>MISSION OPS // REALTIME_COMMUNICATION_CENTER</span>
            </div>
            <span className={styles.pulseCount}>PULSE_COUNT: {livePulse}</span>
          </div>

          <div className={styles.panelsLayout}>
            { }
            <div className={styles.rowTop}>
              { }
              <div className="tech-panel" style={{ flex: 1.5 }}>
                <div className="tech-panel-header">
                  <span>LIVE_ACTIVITY // CONTRIBUTION_MATRIX</span>
                  <span className={styles.successText}>INTEGRITY_VERIFIED</span>
                </div>
                <div className={`${styles.panelBody} tech-panel-body`}>
                  <div className={styles.contribWrapper}>
                    <div className={styles.contribGrid}>
                      {CONTRIB_GRID.map((row, rIdx) => (

                        <div key={rIdx} className={styles.contribRow}>
                          {row.map((val, cIdx) => (
                            <div
                              key={cIdx}
                              className={`${styles.contribCell} ${val === 0
                                ? styles.cellNone
                                : val === 1
                                  ? styles.cellLow
                                  : val === 2
                                    ? styles.cellMed
                                    : styles.cellHigh
                                }`}
                              title={`${val} commits verified`}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className={styles.contribLeg}>
                      <span>Less</span>
                      <div className={`${styles.contribCell} ${styles.cellNone}`} />
                      <div className={`${styles.contribCell} ${styles.cellLow}`} />
                      <div className={`${styles.contribCell} ${styles.cellMed}`} />
                      <div className={`${styles.contribCell} ${styles.cellHigh}`} />
                      <span>More</span>
                    </div>
                  </div>
                </div>
              </div>

              { }
              <div className="tech-panel" style={{ flex: 0.8 }}>
                <div className="tech-panel-header">
                  <span>ACTIVE_STACK // ENG_TOOLS</span>
                  <span>CURRENT</span>
                </div>
                <div className={`${styles.panelBody} tech-panel-body`}>
                  <div className={styles.stackTagsGrid}>
                    {CURRENT_STACK.map((tech) => (
                      <div key={tech} className={styles.stackTag}>
                        <span className={styles.stackTagDot} />
                        {tech}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            { }
            <div className={styles.rowBottom}>
              { }
              <div className="tech-panel" style={{ flex: 1.2 }}>
                <div className="tech-panel-header">
                  <span>PUBLIC_REPOS // CODE_DECLASSIFIED</span>
                  <span>COUNT: 4</span>
                </div>
                <div className={`${styles.panelBody} tech-panel-body`}>
                  <div className={styles.reposList}>
                    {REPOS_LIST.map((repo) => (
                      <div key={repo.name} className={styles.repoItem}>
                        <div className={styles.repoHeader}>
                          <span className={styles.repoTitle}>{repo.name}</span>
                          <div className={styles.repoStats}>
                            <span>★ {repo.stars}</span>
                            <span>⌥ {repo.forks}</span>
                          </div>
                        </div>
                        <p className={styles.repoDesc}>{repo.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              { }
              <div className="tech-panel" style={{ flex: 1.1 }}>
                <div className="tech-panel-header">
                  <span>RESEARCH_LOGS // LEARNING_TRACKS</span>
                  <span className={styles.cyanText}>ACTIVE</span>
                </div>
                <div className={`${styles.panelBody} tech-panel-body`}>
                  <div className={styles.tracksList}>
                    {CURRENT_LEARNING.map((track) => (
                      <div key={track.topic} className={styles.trackItem}>
                        <span className={styles.trackTopic}>{track.topic}</span>
                        <p className={styles.trackDesc}>{track.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottomNav}>
          <button
            onClick={() => setStage(8)}
            className={styles.nextCta}
          >
            COMPILE FINAL ASSESSMENT REPORT &gt;&gt;
          </button>
        </div>
      </div>
    </section>
  );
};

export default Operations;
