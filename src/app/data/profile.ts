/**
 * Single source of truth for profile content, derived from Ayman-Elbery-CV.pdf.
 * Update this file (not the templates) when the résumé changes.
 */

export const PROFILE = {
  name: 'Ayman Elbery',
  role: 'Senior Full-Stack Software Engineer',
  roles: ['Senior Full-Stack Engineer', 'Technical Team Leader', 'Enterprise Architect'],
  location: 'Riyadh, Saudi Arabia',
  email: 'ayman.bery@gmail.com',
  linkedin: 'https://linkedin.com/in/aymanelbery/',
  github: 'https://github.com/AymanElbery/',
  resume: 'Ayman-Elbery-CV.pdf',
  summary:
    'Senior Full-Stack Software Engineer with 10+ years of experience designing and delivering scalable, enterprise-grade applications and digital platforms — from secure identity architectures and government integrations to event-driven microservices and AI-powered document intelligence.',
  longSummary: [
    'I design and build enterprise software that has to work under real constraints: restricted networks, strict security requirements, legacy systems that cannot simply be switched off, and user bases in the tens of thousands.',
    'My work sits between hands-on engineering and architecture — Angular front-end platforms, NestJS and Laravel back ends, Keycloak-based identity and SSO, RabbitMQ and Redis event-driven systems, and integrations with national services such as Nafath, Yakeen, and NIC.',
    'I care about the parts of software that outlive the first release: clear boundaries, secure defaults, observable production behaviour, and engineering standards that let a team keep moving fast years later.',
  ],
} as const;

export const METRICS = [
  { value: '10+', label: 'Years building production software' },
  { value: '70k+', label: 'Users on university platforms I built' },
  { value: '5', label: 'Organizations across KSA & Egypt' },
  { value: 'v9→v20', label: 'Angular, from legacy to signals' },
] as const;

export interface FocusArea {
  code: string;
  title: string;
  body: string;
  tags: string[];
  icon: 'shield' | 'network' | 'landmark' | 'brain' | 'layers' | 'server';
}

export const FOCUS_AREAS: FocusArea[] = [
  {
    code: 'IAM',
    icon: 'shield',
    title: 'Identity & Access Management',
    body: 'Centralized SSO across multiple enterprise systems with Keycloak and Oracle IDM — OAuth 2.0, OIDC, PKCE, RBAC, MFA/OTP and secure BFF session handling.',
    tags: ['Keycloak', 'OIDC', 'PKCE', 'Oracle IDM'],
  },
  {
    code: 'EDA',
    icon: 'network',
    title: 'Event-Driven Architecture',
    body: 'Microservices and BFF layers built on NestJS, RabbitMQ and Redis for complex enterprise workflows that need to be resilient, asynchronous and auditable.',
    tags: ['NestJS', 'RabbitMQ', 'Redis', 'BFF'],
  },
  {
    code: 'GOV',
    icon: 'landmark',
    title: 'Government Integrations',
    body: 'Secure integrations with national services — Nafath, Yakeen and the NIC travel permission service — alongside ESB, SOAP and third-party enterprise APIs.',
    tags: ['Nafath', 'Yakeen', 'NIC', 'webMethods'],
  },
  {
    code: 'FE',
    icon: 'layers',
    title: 'Front-End Platform Architecture',
    body: 'Angular platforms with shared libraries, reusable component systems and coding standards that keep large codebases coherent across teams.',
    tags: ['Angular', 'RxJS', 'NgRx', 'Tailwind'],
  },
  {
    code: 'AI',
    icon: 'brain',
    title: 'AI & Document Intelligence',
    body: 'RAG pipelines and LLM-enabled applications that let people query organizational knowledge — designed to run inside restricted, on-premise environments.',
    tags: ['RAG', 'LLMs', 'Qdrant', 'Embeddings'],
  },
  {
    code: 'OPS',
    icon: 'server',
    title: 'High-Availability & Offline Delivery',
    body: 'Deploying and troubleshooting across Linux, Docker, Apache and Nginx — load-balanced, high-availability and fully air-gapped environments.',
    tags: ['RHEL', 'Docker', 'Nginx', 'Air-gapped'],
  },
];

export interface Role {
  company: string;
  short: string;
  title: string;
  location: string;
  start: string;
  end: string;
  summary: string;
  highlights: string[];
  stack: string[];
}

export const EXPERIENCE: Role[] = [
  {
    company: 'The Royal Saudi Air Force',
    short: 'RSAF',
    title: 'Senior Full-Stack Engineer',
    location: 'Riyadh, Saudi Arabia',
    start: '05/2023',
    end: 'Present',
    summary:
      'Leading front-end architecture and designing secure, integration-heavy enterprise systems inside an offline environment.',
    highlights: [
      'Lead Angular front-end architecture — reusable components, shared libraries, coding standards and scalable application structure in an offline environment.',
      'Design and implement RESTful APIs, microservices, BFF architectures and event-driven solutions for complex enterprise workflows.',
      'Architect centralized Identity & Access Management and SSO with Keycloak and Oracle IDM — OAuth 2.0/OIDC, RBAC, MFA/OTP and secure authentication flows.',
      'Integrate enterprise platforms with national services such as the NIC travel permission service, plus internal and third-party systems.',
      'Build AI-powered solutions, including RAG-based document intelligence and LLM-enabled enterprise applications.',
      'Deploy and troubleshoot across Linux, Docker, Apache, load-balanced, high-availability and restricted/offline environments.',
      'Provide technical leadership and mentoring through architecture and code reviews, and resolve complex production issues.',
    ],
    stack: ['Angular', 'NestJS', 'Keycloak', 'Oracle IDM', 'RabbitMQ', 'Redis', 'Docker', 'RHEL', 'Qdrant'],
  },
  {
    company: 'Saudi Electronic University',
    short: 'SEU',
    title: 'Senior Full-Stack Software Engineer',
    location: 'Riyadh, Saudi Arabia',
    start: '11/2019',
    end: '05/2023',
    summary:
      'Built and operated large-scale academic and administrative platforms serving 70,000+ students, faculty and staff.',
    highlights: [
      'Designed, developed and maintained large-scale university platforms serving 70,000+ users with a focus on scalability and high availability.',
      'Built modern web applications with Angular, Laravel, PHP, Node.js and TypeScript across academic and administrative systems.',
      'Designed enterprise APIs and integrations connecting university platforms with internal, external and government services — including Nafath and Yakeen.',
      'Implemented authentication, authorization, SSO with Oracle IDM and role-based access control for students, faculty and administrators.',
      'Delivered complex workflows for student services, learning platforms, reporting and digital transformation initiatives.',
      'Integrated with Oracle, SQL Server and MySQL, optimizing queries and application performance.',
    ],
    stack: ['Angular', 'Laravel', 'Node.js', 'Oracle', 'SQL Server', 'Oracle IDM', 'IIS', 'Apache'],
  },
  {
    company: 'Buseet',
    short: 'Buseet',
    title: 'Senior Software Engineer',
    location: 'Cairo, Egypt',
    start: '01/2019',
    end: '11/2019',
    summary: 'Back-end services and operational tooling for a transportation and mobility platform.',
    highlights: [
      'Built back-end services and APIs for trip management, bookings, users, routes, vehicles and operations.',
      'Implemented real-time geospatial tracking with Tile38 — vehicle location, geofencing and proximity queries.',
      'Built administrative dashboards for monitoring trips and managing transportation services.',
      'Diagnosed production issues and performance bottlenecks, improving platform stability.',
    ],
    stack: ['Tile38', 'REST APIs', 'Geofencing', 'Admin Dashboards'],
  },
  {
    company: 'Afaqy',
    short: 'Afaqy',
    title: 'Full-Stack Engineer',
    location: 'Cairo, Egypt',
    start: '12/2017',
    end: '01/2019',
    summary: 'GPS tracking and fleet management platforms for real-time monitoring of vehicles and assets.',
    highlights: [
      'Built scalable web applications and services with Angular, PHP/Laravel and TypeScript.',
      'Implemented real-time vehicle tracking, processing GPS coordinates and telemetry from tracking devices.',
      'Built interactive map-based dashboards for vehicle locations, movements and routes.',
    ],
    stack: ['Angular', 'Laravel', 'TypeScript', 'REST APIs', 'Maps & Telemetry'],
  },
  {
    company: 'Speakol',
    short: 'Speakol',
    title: 'Backend Engineer',
    location: 'Cairo, Egypt',
    start: '01/2016',
    end: '08/2016',
    summary: 'Back-end services for content recommendation, publisher management and advertising.',
    highlights: [
      'Built features for content recommendation, publisher management, advertising campaigns and engagement.',
      'Optimized database queries and back-end processes to improve response times.',
      'Refactored legacy PHP applications built on Phalcon, improving maintainability and performance without changing business behaviour.',
    ],
    stack: ['PHP', 'Laravel', 'Phalcon', 'MySQL'],
  },
];

export interface SkillGroup {
  key: string;
  items: string[];
}

export const SKILLS: SkillGroup[] = [
  { key: 'frontend', items: ['Angular (v9–v20)', 'TypeScript', 'RxJS', 'NgRx', 'Angular Material', 'Tailwind CSS', 'Responsive Design'] },
  { key: 'backend', items: ['NestJS', 'Node.js', 'Laravel', 'PHP', 'Express.js', 'REST', 'SOAP', 'Microservices', 'BFF'] },
  { key: 'identity', items: ['Keycloak', 'SSO', 'OAuth 2.0', 'OIDC', 'PKCE', 'JWT', 'Oracle IDM'] },
  { key: 'data', items: ['Oracle', 'SQL Server', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'TypeORM'] },
  { key: 'messaging', items: ['RabbitMQ', 'WebSockets', 'Event-Driven Architecture', 'Async Processing'] },
  { key: 'geospatial', items: ['Tile38', 'Leaflet', 'Geofencing', 'GPS Tracking'] },
  { key: 'ai', items: ['RAG', 'LLM Integration', 'Vector Databases', 'Qdrant', 'Prompt Engineering'] },
  { key: 'infrastructure', items: ['Docker', 'Docker Compose', 'RHEL', 'Apache HTTPD', 'Nginx', 'Load Balancing', 'systemd', 'Air-gapped'] },
  { key: 'integration', items: ['webMethods', 'Nafath', 'Yakeen', 'NIC', 'SMS & Payment Gateways'] },
  { key: 'architecture', items: ['Clean Architecture', 'SOLID', 'Design Patterns', 'System Design', 'API Design', 'High Availability'] },
];

export const CERTIFICATIONS = [
  { name: 'AWS Technical Essentials', issuer: 'AWS' },
  { name: 'Docker & Kubernetes: The Practical Guide', issuer: 'Udemy' },
];

export const EDUCATION = {
  degree: "Bachelor's Degree in Computer Science",
  school: 'Faculty of Computers & Information, Benha University',
  location: 'Egypt',
  year: '2016',
};

export const LANGUAGES = [
  { name: 'Arabic', level: 'Native' },
  { name: 'English', level: 'Professional working proficiency' },
];

export const PRINCIPLES = [
  { title: 'Security is a default, not a feature', body: 'Tokens stay server-side, roles are explicit, and every integration assumes the network is hostile.' },
  { title: 'Boundaries before frameworks', body: 'Clear contracts between services outlast any library choice. I design the seams first.' },
  { title: 'Operate what you build', body: 'Software that runs in air-gapped, high-availability environments must be diagnosable by the people on call.' },
  { title: 'Standards that scale teams', body: 'Shared libraries, conventions and reviews turn individual skill into organizational capability.' },
];
