export const MODULES_DATA = {
  python: {
    name: 'Python',
    code: 'SYS_MOD_PY',
    purpose: 'Backend Processing, Automation Scripts & API Gateways',
    usedIn: 'Automation Pipelines, Stockyard Helper Services',
    deployment: 'Production Verified (L2 Systems)',
    patterns: 'OOP Scripting, REST APIs, ETL Data Pipeline Automation',
    diagram: 'backend'
  },
  react: {
    name: 'React',
    code: 'SYS_MOD_RT',
    purpose: 'Dynamic Component UI Rendering & Frontend Systems',
    usedIn: 'Stockyard Client, E-Learning Client, Blazor CRM Dashboard',
    deployment: 'Production Host (Edge Deployment)',
    patterns: 'Context Providers, Dynamic Hooks, Responsive Architecture, Component-Driven Views',
    diagram: 'frontend'
  },
  electron: {
    name: 'Electron',
    code: 'SYS_MOD_EL',
    purpose: 'Cross-Platform Native Desktop Application Shell',
    usedIn: 'Stockyard Desktop Client',
    deployment: 'Production Package (Compiled binaries)',
    patterns: 'IPC Bridge Communication, Main/Renderer Process Separation, Offline Cache Storage',
    diagram: 'desktop'
  },
  docker: {
    name: 'Docker',
    code: 'SYS_MOD_DK',
    purpose: 'Containerized Infrastructure & Environment Mirroring',
    usedIn: 'All Local Development and VPS Host Deployments',
    deployment: 'Kubernetes Ready (Containerized Cluster)',
    patterns: 'Multi-stage Dockerfile Compiles, Volume Binding, Microservice Orchestration',
    diagram: 'infra'
  },
  django: {
    name: 'Django',
    code: 'SYS_MOD_DJ',
    purpose: 'High-Level Python MVC Backend Framework',
    usedIn: 'E-Learning Backend API, CRM Database Core',
    deployment: 'Production Deployed (REST Endpoint Services)',
    patterns: 'DRF Serializers, ORM Migrations, Role-Based Access Middleware',
    diagram: 'backend'
  },
  redis: {
    name: 'Redis',
    code: 'SYS_MOD_RD',
    purpose: 'In-Memory Cache Cache Store & Session Management',
    usedIn: 'E-Learning Stream Cache, CRM App Sessions',
    deployment: 'Production Buffer (Scaled Cache Cluster)',
    patterns: 'Key-Value Cache Storage, Rate Limiting, Pub-Sub Event Sockets',
    diagram: 'database'
  },
  postgresql: {
    name: 'PostgreSQL',
    code: 'SYS_MOD_PG',
    purpose: 'Enterprise Relational Database Management System',
    usedIn: 'E-Learning Platform, Stockyard Core Data Warehouse',
    deployment: 'Verified Persistent Storage (Replica-safe Clusters)',
    patterns: 'Database Constraints, Structured Indexing, Raw SQL CTE Query Optimizations',
    diagram: 'database'
  },
  nextjs: {
    name: 'Next.js',
    code: 'SYS_MOD_NX',
    purpose: 'Server-Side Rendering (SSR) & Static Site Framework',
    usedIn: 'Client Landing Frameworks, adiDev Assessment Console',
    deployment: 'Production Verified (CDN edge cached)',
    patterns: 'SSR page routes, API Middleware functions, Incremental Static Regeneration',
    diagram: 'frontend'
  },
  nginx: {
    name: 'Nginx',
    code: 'SYS_MOD_NG',
    purpose: 'High Performance HTTP Reverse Proxy & Gateway Router',
    usedIn: 'Server API Routing Gateways, Local Docker Services',
    deployment: 'Production Host (Gateway Router)',
    patterns: 'SSL Certificate Offloading, Reverse Proxy Caching, Round-Robin Load Balancing',
    diagram: 'infra'
  },
  git: {
    name: 'Git',
    code: 'SYS_MOD_GT',
    purpose: 'Distributed Version Control & Merge Automation',
    usedIn: 'All Source Control Operations, CI/CD deployment runs',
    deployment: 'CI/CD Managed (GitHub Actions integrations)',
    patterns: 'Gitflow branching structures, Commit verification, Automation webhook alerts',
    diagram: 'devops'
  },
  linux: {
    name: 'Linux',
    code: 'SYS_MOD_LX',
    purpose: 'Operational Host Operating System and Server Kernel',
    usedIn: 'Ubuntu VPS hosts, Docker base images, development environments',
    deployment: 'Production Host Kernel (Bare-metal and virtual cloud servers)',
    patterns: 'Bash scripting, systemd service management, SSH credential handshakes',
    diagram: 'infra'
  }
};
