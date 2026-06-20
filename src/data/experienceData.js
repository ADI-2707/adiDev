export const FACILITIES_DATA = [
  {
    id: 'fac-01',
    name: 'VSM Venture Control Systems',
    code: 'FACILITY_VSM_01',
    role: 'Full-Stack Developer',
    period: '2023 – Present',
    projects: 'Shipped the next-gen web telemetry console for industrial sensors; built the core notification engine handling 10k+ dynamic events/day.',
    systems: 'Deployed React + C# .NET microservices on Azure, integrated Redis queues, scaled database indexing for sensor data.',
    scope: 'Sole ownership of the telemetry UI codebase; managed API endpoints, led database query speed optimization sprints.',
    lessons: 'In industrial telemetry, network packet sizes are critical. Optimized API payloads by switching to lightweight binary representations, reducing bandwidth overhead by 45%.'
  },
  {
    id: 'fac-02',
    name: 'Apex Automation Labs',
    code: 'FACILITY_APEX_02',
    role: 'Junior Developer',
    period: '2022 – 2023',
    projects: 'Developed a localized machine dashboard using Blazor WebAssembly; built an automated testing suite reducing manual QA tasks by 70%.',
    systems: 'Integrated Auth0 authentication configurations, configured local SQLite configurations on machine hosts, shipped REST service APIs.',
    scope: 'Maintained the core Blazor UI libraries; wrote unit tests, documented REST API specifications.',
    lessons: 'Real-time graphs can lock the browser thread if rendered improperly. Optimized render loops in Blazor by throttling incoming socket updates, keeping performance at a stable 60fps.'
  },
  {
    id: 'fac-03',
    name: 'Horizon Control Systems',
    code: 'FACILITY_HORIZON_03',
    role: 'Intern — Software Development',
    period: '2021 – 2022',
    projects: 'Programmed custom dashboard views for monitoring factory floor diagnostics; fixed over 50 UI bugs in the legacy portal.',
    systems: 'Integrated HTML/CSS and vanilla JS scripts into ASP.NET endpoints; automated weekly file backups.',
    scope: 'Supported senior developers with frontend adjustments; wrote documentation scripts.',
    lessons: 'Clear, structured documentation is as valuable as code. Created a unified developer handbook that cut team onboarding cycles by 3 days.'
  }
];
