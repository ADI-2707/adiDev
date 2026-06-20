export const RATIONALE_DATA = [
  {
    id: 'react',
    title: 'Why React?',
    decision: 'Single Page UI Rendering Core',
    reason: 'Modular component isolation, rich declarative state hooks, and robust virtual DOM tree reconcilers.',
    tradeoff: 'Increased client-side JavaScript download payload and initial render loading latency.'
  },
  {
    id: 'django',
    title: 'Why Django?',
    decision: 'Secure Relational MVC API Layer',
    reason: 'Out-of-the-box admin interfaces, comprehensive security middleware arrays, and structured ORM models.',
    tradeoff: 'Rigid architectural design limits flexibility; heavier runtime package footprint than Node Express.'
  },
  {
    id: 'electron',
    title: 'Why Electron?',
    decision: 'Cross-Platform Local Desktop Shell',
    reason: 'Bridges web stack designs directly to local system OS APIs, native files, and local relational databases.',
    tradeoff: 'Substantially larger executable package binaries and high memory usage profiles per running instance.'
  },
  {
    id: 'postgres',
    title: 'Why PostgreSQL?',
    decision: 'Primary Relational Data Store',
    reason: 'Strict ACID transaction compliance, rich query indexes, support for concurrent read pools, and native JSON queries.',
    tradeoff: 'Horizontal scaling is complex, requiring database read-replicas and connection pooling layers.'
  },
  {
    id: 'docker',
    title: 'Why Docker?',
    decision: 'Containerized Infrastructure Isolation',
    reason: 'Ensures strict configuration parity between local developer environments and remote production VPS hosts.',
    tradeoff: 'Increases container build pipeline complexity and introduces container networking/orchestration overhead.'
  }
];
