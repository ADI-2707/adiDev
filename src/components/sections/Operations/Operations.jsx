import { useState, useEffect } from 'react';
import styles from './Operations.module.css';
import { playTone } from '../../../utils/audio';

import { CURRENT_LEARNING, REPOS_LIST, CURRENT_STACK } from '../../../data/operationsData';

const GITHUB_USERNAME = 'ADI-2707';

const Operations = ({ activeStage, setStage }) => {
  const [livePulse, setLivePulse] = useState(0);
  const [contribGrid, setContribGrid] = useState([]);
  const [isLoadingContribs, setIsLoadingContribs] = useState(true);

  // Fetch GitHub Contributions
  useEffect(() => {
    if (activeStage !== 7) return;

    const fetchContributions = async () => {
      try {
        const res = await fetch(`https://github-contributions-api.deno.dev/${GITHUB_USERNAME}.json`);
        if (!res.ok) throw new Error('Failed to fetch github data');
        const data = await res.json();

        // Data format: data.contributions is an array of weeks (columns), each week is an array of days (rows)
        // We slice the last 53 weeks for a full-year matrix
        const weeks = data.contributions || [];
        const recentWeeks = weeks.slice(-53);

        // Map intensity 0-3 for each day in each week
        const grid = recentWeeks.map((week) => {
          const days = Array.isArray(week) ? week : [];
          return days.map((dayData) => {
            const count = dayData ? dayData.contributionCount : 0;
            // Map count to intensity 0-3
            let val = 0;
            if (count > 0 && count <= 3) val = 1;
            else if (count > 3 && count <= 8) val = 2;
            else if (count > 8) val = 3;
            return val;
          });
        });
        setContribGrid(grid);
      } catch (err) {
        console.error("Could not load github contributions:", err);
        // Fallback to empty grid: 53 columns (weeks), each containing 7 rows (days)
        const emptyGrid = Array(53).fill(null).map(() => Array(7).fill(0));
        setContribGrid(emptyGrid);
      } finally {
        setIsLoadingContribs(false);
      }
    };

    fetchContributions();
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
                    {isLoadingContribs ? (
                      <div className={styles.loadingContribs}>[ FETCHING DATA FROM GITHUB_SAT ]</div>
                    ) : (
                      <div className={styles.contribGrid}>
                        {contribGrid.map((week, wIdx) => (
                          <div key={wIdx} className={styles.contribCol}>
                            {week.map((val, dIdx) => (
                              <div
                                key={dIdx}
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
                    )}
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
