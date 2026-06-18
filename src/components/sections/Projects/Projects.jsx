
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import styles from './Projects.module.css';
import { playTone } from '../../../utils/audio';


const CASES_DATA = [
  {
    id: '001',
    subject: 'Stockyard System',
    objectiveName: 'Offline Warehouse Platform',
    status: 'CLOSED', 
    accent: '#34D399',
    docs: {
      objective: {
        title: 'MISSION OBJECTIVE',
        text: 'Architect a desktop-first warehouse inventory management system capable of operating 100% offline in remote facilities, synchronizing database changes back to a central cloud server whenever a connection is established.'
      },
      constraints: {
        title: 'OPERATIONAL CONSTRAINTS',
        text: 'Must support low-powered local workstation nodes. Must require zero deployment setup from staff. Must remain functional even during extended internet outages spanning several days. Data integrity is critical.'
      },
      reconnaissance: {
        title: 'RECONNAISSANCE REPORT',
        text: 'Legacy operations relied on paper logs and static spreadsheet exports. Outages caused inventory desynchronization, leading to redundant deliveries, lost stock records, and manual reconciliation delays.'
      },
      blueprint: {
        title: 'SYSTEM BLUEPRINT',
        diagram: 'stockyard'
      },
      timeline: {
        title: 'EXECUTION TIMELINE',
        events: [
          { phase: 'Phase 1: IPC Shell', desc: 'Bootstrap Electron renderer and main process handshake loops.' },
          { phase: 'Phase 2: Sync Engine', desc: 'Build SQLite schemas and transaction logs tracking local edits.' },
          { phase: 'Phase 3: Conflict Resolve', desc: 'Deploy vector clocks to merge remote database states.' }
        ]
      },
      decisions: {
        title: 'ENGINEERING DECISIONS',
        items: [
          { decision: 'SQLite Database', reason: 'Zero setup required, lightweight single file relational storage, robust integrity.', tradeoff: 'Lacks native support for concurrent write requests.' }
        ]
      },
      incidents: {
        title: 'INCIDENT LOGS',
        reports: [
          { bug: 'SQLite DB Lock Error', cause: 'Concurrent UI logs locked the local database file.', solution: 'Queue write processes in a background thread using a single connection worker.' }
        ]
      },
      outcome: {
        title: 'MISSION OUTCOME',
        text: 'Successfully deployed across 5 remote distribution hubs. Zero data loss recorded over 12 months. Reduced inventory auditing times by 65% due to automatic local indexing.',
        links: { github: 'https://github.com', live: '#' }
      }
    }
  },
  {
    id: '002',
    subject: 'E-Learning Platform',
    objectiveName: 'Scalable Streaming Service',
    status: 'CLOSED',
    accent: '#3A86FF',
    docs: {
      objective: {
        title: 'MISSION OBJECTIVE',
        text: 'Build a scalable online education platform with high-speed video streaming interfaces, progress tracking tools, and robust Stripe payment integration for 500+ students.'
      },
      constraints: {
        title: 'OPERATIONAL CONSTRAINTS',
        text: 'Must support high concurrent video viewers (500+ students) during exam weeks. Subscription gate must be bulletproof. Page latency must remain under 200ms.'
      },
      reconnaissance: {
        title: 'RECONNAISSANCE REPORT',
        text: 'The legacy system crashed under concurrent exam load. Streaming buffering times averaged 3.2s, prompting high user drop-offs during core study periods.'
      },
      blueprint: {
        title: 'SYSTEM BLUEPRINT',
        diagram: 'elearning'
      },
      timeline: {
        title: 'EXECUTION TIMELINE',
        events: [
          { phase: 'Phase 1: API Core', desc: 'Develop .NET Core models, controllers and security middleware.' },
          { phase: 'Phase 2: Streaming', desc: 'Implement HTTP Range streaming endpoints for video slices.' },
          { phase: 'Phase 3: Billing', desc: 'Connect Stripe webhooks to automate user clearance grants.' }
        ]
      },
      decisions: {
        title: 'ENGINEERING DECISIONS',
        items: [
          { decision: 'C# .NET Core Backend', reason: 'High-performance request handling, strongly typed, enterprise ecosystem.', tradeoff: 'Slightly slower development setup times compared to Express.js.' }
        ]
      },
      incidents: {
        title: 'INCIDENT LOGS',
        reports: [
          { bug: 'Buffering Overhead Spikes', cause: 'High concurrent reads from disk for large raw video files.', solution: 'Deploy Nginx static file caching and integrate CloudFront CDN distribution.' }
        ]
      },
      outcome: {
        title: 'MISSION OUTCOME',
        text: 'Zero platform crashes recorded during final exams. Processed over 400 subscriptions. Content load times reduced by 40% globally.',
        links: { github: 'https://github.com', live: '#' }
      }
    }
  },
  {
    id: '003',
    subject: 'Multi-Tenant Auth',
    objectiveName: 'Identity Microservice',
    status: 'CLOSED',
    accent: '#3A86FF',
    docs: {
      objective: {
        title: 'MISSION OBJECTIVE',
        text: 'Develop a centralized, multi-tenant authentication microservice using Auth0, provisioning role-based permissions and secure audit trails across 3 separate company systems.'
      },
      constraints: {
        title: 'OPERATIONAL CONSTRAINTS',
        text: 'Token validation times must not exceed 50ms. Must adhere strictly to HIPAA compliance guidelines. Must isolate user credentials completely per tenant.'
      },
      reconnaissance: {
        title: 'RECONNAISSANCE REPORT',
        text: 'Scattered user tables across old applications led to security audit failures. Credentials sync failed regularly, prompting locked-out customer claims.'
      },
      blueprint: {
        title: 'SYSTEM BLUEPRINT',
        diagram: 'auth'
      },
      timeline: {
        title: 'EXECUTION TIMELINE',
        events: [
          { phase: 'Phase 1: Schema Design', desc: 'Establish multi-tenant user groupings and permission maps.' },
          { phase: 'Phase 2: Integration', desc: 'Integrate Auth0 SDK and configure token signature checkers.' },
          { phase: 'Phase 3: Security Logs', desc: 'Deploy structured audit log syncs to persistent databases.' }
        ]
      },
      decisions: {
        title: 'ENGINEERING DECISIONS',
        items: [
          { decision: 'Auth0 Service', reason: 'Proven enterprise-grade security compliance, out-of-the-box multi-factor auth.', tradeoff: 'Adds third-party API dependencies and runtime platform subscription costs.' }
        ]
      },
      incidents: {
        title: 'INCIDENT LOGS',
        reports: [
          { bug: 'Auth Token Latency In Asia', cause: 'Public key lookup queries pinging US Auth0 endpoints.', solution: 'Cache public encryption keys in memory on the local gateway server.' }
        ]
      },
      outcome: {
        title: 'MISSION OUTCOME',
        text: 'Passed all external security compliance audits. Single sign-on deployed successfully for 3 primary workspaces, eliminating sync errors.',
        links: { github: 'https://github.com', live: '#' }
      }
    }
  },
  {
    id: '004',
    subject: 'Real-Time CRM',
    objectiveName: 'Sales Tracking Dashboard',
    status: 'CLOSED',
    accent: '#34D399',
    docs: {
      objective: {
        title: 'MISSION OBJECTIVE',
        text: 'Design a real-time sales and agent tracking CRM dashboard implementing WebSockets to push live customer statuses and activity logs to support staff.'
      },
      constraints: {
        title: 'OPERATIONAL CONSTRAINTS',
        text: 'Latency between agent action and dashboard sync must be under 1s. Bandwidth footprint must remain minimal. Must failover gracefully.'
      },
      reconnaissance: {
        title: 'RECONNAISSANCE REPORT',
        text: 'Support teams relied on manual table refreshes. Agents frequently picked duplicate customer cases because statuses were not synchronized in real time.'
      },
      blueprint: {
        title: 'SYSTEM BLUEPRINT',
        diagram: 'crm'
      },
      timeline: {
        title: 'EXECUTION TIMELINE',
        events: [
          { phase: 'Phase 1: DB & Hub', desc: 'Establish SQL database entities and configure SignalR hubs.' },
          { phase: 'Phase 2: Wasm Client', desc: 'Develop Blazor WebAssembly frontend modules and graph engines.' },
          { phase: 'Phase 3: Redis Sync', desc: 'Integrate Redis cache store to sync sockets across server instances.' }
        ]
      },
      decisions: {
        title: 'ENGINEERING DECISIONS',
        items: [
          { decision: 'SignalR Sockets', reason: 'Native C# websocket abstraction, automatic reconnection fallbacks, low latency.', tradeoff: 'Requires persistent stateful websocket connections on server hosts.' }
        ]
      },
      incidents: {
        title: 'INCIDENT LOGS',
        reports: [
          { bug: 'Socket Drops on Mobile Sleep', cause: 'Mobile browsers suspend background tasks and sever connections.', solution: 'Implement client reconnect logic with exponential backoff and status polling.' }
        ]
      },
      outcome: {
        title: 'MISSION OUTCOME',
        text: 'Reduced agent response collision rates to 0%. Dashboard feeds sync within 150ms. Shipped to 50 active support agents.',
        links: { github: 'https://github.com', live: '#' }
      }
    }
  }
];

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
              {}
              <div className={styles.openFolderHeader}>
                <div className={styles.openFolderBrand}>
                  <span className={styles.brandPrompt}>&gt;</span>
                  <span>RECORD_FILE: CASE_{currentCase.id} // SUBJECT: {currentCase.subject.toUpperCase()}</span>
                </div>
                <button onClick={handleCloseCase} className={styles.closeFolderBtn}>
                  [x] CLOSE_CASE_FILE
                </button>
              </div>

              {}
              <div className={styles.folderContentGrid}>
                {}
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

                {}
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
                      
                      {}
                      {currentCase.docs[activeTab]?.text && (
                        <p className={styles.documentPageBodyText}>
                          {currentCase.docs[activeTab].text}
                        </p>
                      )}

                      {}
                      {activeTab === 'blueprint' && (
                        <div className={styles.documentSchematicBox}>
                          <FolderBlueprint type={currentCase.docs.blueprint.diagram} />
                        </div>
                      )}

                      {}
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

                      {}
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

                      {}
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

                      {}
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
