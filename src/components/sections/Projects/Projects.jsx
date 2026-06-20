import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Projects.module.css';
import { playTone } from '../../../utils/audio';


import { CASES_DATA } from '../../../data/projectsData';

const FolderBlueprint = ({ type }) => {
  // Renders a text/HTML diagram of the system architecture
  return (
    <div className={styles.diagramBox}>
      {type === 'stockyard' && (
        <div className={styles.diagramNodes}>
          <div className={styles.node}>Client UI (React)</div>
          <div className={styles.arrow}>↓ IPC Bridges</div>
          <div className={styles.node}>API Server (Node.js)</div>
          <div className={styles.arrow}>↓ SQL Statements</div>
          <div className={styles.node}>Local Relational DB (SQLite)</div>
        </div>
      )}
      {type === 'elearning' && (
        <div className={styles.diagramNodes}>
          <div className={styles.node}>Web Browser (React)</div>
          <div className={styles.arrow}>↓ HTTPS / JSON API</div>
          <div className={styles.node}>Auth & Streaming Core (.NET Core)</div>
          <div className={styles.arrow}>↓ Entity Queries / Webhooks</div>
          <div className={styles.node}>SQL Server DB / Stripe Integration</div>
        </div>
      )}
      {type === 'auth' && (
        <div className={styles.diagramNodes}>
          <div className={styles.node}>Blazor Client UI</div>
          <div className={styles.arrow}>↓ Login / Sign-on Handshake</div>
          <div className={styles.node}>Auth0 OIDC Gateway</div>
          <div className={styles.arrow}>↓ JWT Verification Keys</div>
          <div className={styles.node}>Target Microservices</div>
        </div>
      )}
      {type === 'crm' && (
        <div className={styles.diagramNodes}>
          <div className={styles.node}>Blazor WASM Client</div>
          <div className={styles.arrow}>↓ Persistent WebSocket (SignalR)</div>
          <div className={styles.node}>SignalR Hub Gateway</div>
          <div className={styles.arrow}>↓ Cache Read-Through</div>
          <div className={styles.node}>Redis Memory Store / SQL Server</div>
        </div>
      )}
    </div>
  );
};

const Projects = ({ activeStage, setStage }) => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [activeTab, setActiveTab] = useState('objective');

  if (activeStage !== 4) return null;

  const handleOpenCase = (c) => {
    playTone(550, 0.08, 0.03);
    setSelectedCase(c);
    setActiveTab('objective');
  };

  const handleCloseCase = () => {
    playTone(450, 0.08, 0.02);
    setSelectedCase(null);
  };

  const currentCase = CASES_DATA.find((c) => c.id === selectedCase);

  return (
    <section id="projects" className={styles.section}>
      <div className={`${styles.container} c-space`}>
        <AnimatePresence mode="wait">
          {!selectedCase ? (
            <motion.div
              key="case-list-room"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.deskWrapper}
            >
              <div className={styles.deskHeader}>
                <span className={styles.deskHeaderTitle}>PROJECT INVESTIGATION BUREAU // DOSSIER_RACKS</span>
                <span className={styles.deskHeaderSubtitle}>INVESTIGATION_DIVISION_L4</span>
              </div>

              <div className={styles.foldersGrid}>
                {CASES_DATA.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleOpenCase(c.id)}
                    className={`${styles.folderItem} tech-panel`}
                  >
                    <div className={styles.folderTab}>
                      <span className={styles.folderTabNumber}>CASE {c.id}</span>
                    </div>
                    <div className={`${styles.folderBody} tech-panel-body`}>
                      <span className={styles.folderStatus} style={{ color: c.accent }}>
                        • STATUS: {c.status}
                      </span>
                      <h3 className={styles.folderSubject}>{c.subject.toUpperCase()}</h3>
                      <p className={styles.folderObjective}>{c.objectiveName}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="case-detail-room"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className={`${styles.openFolderWrapper} tech-panel`}
            >
              { }
              <div className={styles.openFolderHeader}>
                <div className={styles.openFolderBrand}>
                  <span className={styles.brandPrompt}>&gt;</span>
                  <span>RECORD_FILE: CASE_{currentCase.id} // SUBJECT: {currentCase.subject.toUpperCase()}</span>
                </div>
                <button onClick={handleCloseCase} className={styles.closeFolderBtn}>
                  [x] CLOSE_CASE_FILE
                </button>
              </div>

              { }
              <div className={styles.folderContentGrid}>
                { }
                <div className={styles.documentTabsColumn}>
                  {[
                    { id: 'objective', label: '1. OBJECTIVE' },
                    { id: 'constraints', label: '2. CONSTRAINTS' },
                    { id: 'reconnaissance', label: '3. RECONNAISSANCE' },
                    { id: 'blueprint', label: '4. BLUEPRINT' },
                    { id: 'timeline', label: '5. TIMELINE' },
                    { id: 'decisions', label: '6. DECISIONS' },
                    { id: 'incidents', label: '7. INCIDENTS' },
                    { id: 'outcome', label: '8. OUTCOME' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        playTone(600, 0.03, 0.01);
                        setActiveTab(tab.id);
                      }}
                      className={`${styles.docTabButton} ${activeTab === tab.id ? styles.docTabButtonActive : ''}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                { }
                <div className={styles.documentPageSheet}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className={styles.documentPageContent}
                    >
                      <h4 className={styles.documentPageTitle}>
                        {currentCase.docs[activeTab]?.title || activeTab.toUpperCase()}
                      </h4>

                      { }
                      {currentCase.docs[activeTab]?.text && (
                        <p className={styles.documentPageBodyText}>
                          {currentCase.docs[activeTab].text}
                        </p>
                      )}

                      { }
                      {activeTab === 'blueprint' && (
                        <div className={styles.documentSchematicBox}>
                          <FolderBlueprint type={currentCase.docs.blueprint.diagram} />
                        </div>
                      )}

                      { }
                      {activeTab === 'timeline' && (
                        <div className={styles.documentTimelineList}>
                          {currentCase.docs.timeline.events.map((evt, index) => (
                            <div key={index} className={styles.documentTimelineItem}>
                              <span className={styles.docTimelinePhase}>{evt.phase}</span>
                              <span className={styles.docTimelineDesc}>{evt.desc}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      { }
                      {activeTab === 'decisions' && (
                        <div className={styles.documentDecisionList}>
                          {currentCase.docs.decisions.items.map((item, index) => (
                            <div key={index} className={styles.docDecisionItem}>
                              <div className={styles.docDecisionField}>
                                <span className={styles.docLabel}>DECISION</span>
                                <span className={styles.docDecisionVal}>{item.decision}</span>
                              </div>
                              <div className={styles.docDecisionRow}>
                                <div className={styles.docDecisionField}>
                                  <span className={styles.docLabel}>REASON</span>
                                  <span className={styles.docValSmall}>{item.reason}</span>
                                </div>
                                <div className={styles.docDecisionField}>
                                  <span className={styles.docLabel}>TRADEOFF</span>
                                  <span className={styles.docValSmall}>{item.tradeoff}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      { }
                      {activeTab === 'incidents' && (
                        <div className={styles.documentIncidentList}>
                          {currentCase.docs.incidents.reports.map((rpt, index) => (
                            <div key={index} className={styles.docIncidentItem}>
                              <span className={styles.docIncidentBug}>BUG REPORT: {rpt.bug}</span>
                              <div className={styles.docIncidentField}>
                                <span className={styles.docLabel}>ROOT CAUSE</span>
                                <span className={styles.docValSmall}>{rpt.cause}</span>
                              </div>
                              <div className={styles.docIncidentField}>
                                <span className={styles.docLabel}>RESOLUTION</span>
                                <span className={styles.docValSmall} style={{ color: 'var(--status-success)' }}>{rpt.solution}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      { }
                      {activeTab === 'outcome' && currentCase.docs.outcome.links && (
                        <div className={styles.outcomeLinksRow}>
                          <a
                            href={currentCase.docs.outcome.links.github}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.outcomeLink}
                          >
                            [RECON_SOURCE_GITHUB]
                          </a>
                          <a
                            href={currentCase.docs.outcome.links.live}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.outcomeLink}
                          >
                            [EXECUTE_LIVE_DEMO]
                          </a>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedCase && (
          <div className={styles.bottomNav}>
            <button
              onClick={() => setStage(5)}
              className={styles.nextCta}
            >
              ACCESS DEPLOYMENT ARCHIVES &gt;&gt;
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
