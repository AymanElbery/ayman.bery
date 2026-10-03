/**
 * Case studies. Details of client systems are intentionally generalized —
 * several of these platforms run in government and restricted environments.
 * Diagram coordinates are node centers in the diagram's own viewBox.
 */

export type NodeTone = 'default' | 'accent' | 'signal' | 'store' | 'external';

export interface DiagramNode {
  id: string;
  x: number;
  y: number;
  label: string;
  sub?: string;
  tone?: NodeTone;
  w?: number;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
  flow?: boolean;
}

export interface Diagram {
  width: number;
  height: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  lanes?: { y: number; label: string }[];
}

export interface Project {
  slug: string;
  index: string;
  title: string;
  tagline: string;
  org: string;
  period: string;
  domain: string;
  summary: string;
  context: string;
  challenges: string[];
  approach: { title: string; body: string }[];
  outcomes: string[];
  stack: string[];
  diagram: Diagram;
  featured?: boolean;
}

export const PROJECTS: Project[] = [
  {
    slug: 'enterprise-identity-sso',
    index: '01',
    title: 'Centralized Identity & SSO Platform',
    tagline: 'One identity layer for many enterprise systems.',
    org: 'Royal Saudi Air Force',
    period: '2023 — Present',
    domain: 'Identity & Security',
    featured: true,
    summary:
      'A centralized Identity & Access Management architecture built on Keycloak and Oracle IDM, giving multiple enterprise applications a single, secure sign-on with consistent roles and MFA.',
    context:
      'Several internal systems each handled authentication on their own — different login flows, duplicated role models and tokens stored in the browser. The goal was one identity layer that every application could adopt without rewriting its business logic, running entirely inside a restricted network.',
    challenges: [
      'Keep access and refresh tokens out of the browser for Angular single-page applications.',
      'Federate existing identities from Oracle IDM instead of migrating users.',
      'Support MFA/OTP and fine-grained RBAC consistently across applications.',
      'Operate with no dependency on public internet services.',
    ],
    approach: [
      {
        title: 'Backend-for-Frontend session boundary',
        body: 'Each Angular application talks only to its NestJS BFF using an HttpOnly, SameSite session cookie. The BFF performs the Authorization Code flow with PKCE, holds tokens server-side and attaches them to downstream API calls.',
      },
      {
        title: 'Keycloak as the identity broker',
        body: 'Realms, clients and role mappings were standardized so a new application onboards by configuration. Oracle IDM is federated as the user source, keeping a single system of record.',
      },
      {
        title: 'Roles as a contract',
        body: 'RBAC claims are mapped to explicit permissions consumed by APIs and by Angular route guards, so authorization is enforced on the server and reflected — not decided — in the UI.',
      },
    ],
    outcomes: [
      'Single sign-on across multiple enterprise applications.',
      'No bearer tokens exposed to browser JavaScript.',
      'A repeatable onboarding pattern for new systems.',
      'Centralized MFA/OTP and role management.',
    ],
    stack: ['Keycloak', 'Oracle IDM', 'OAuth 2.0', 'OIDC', 'PKCE', 'NestJS', 'Angular', 'Redis'],
    diagram: {
      width: 760,
      height: 400,
      nodes: [
        { id: 'spa', x: 110, y: 60, label: 'Angular SPA', sub: 'browser · no tokens' },
        { id: 'bff', x: 380, y: 60, label: 'BFF · NestJS', sub: 'session · token vault', tone: 'accent' },
        { id: 'kc', x: 650, y: 60, label: 'Keycloak', sub: 'OIDC · PKCE · MFA', tone: 'signal' },
        { id: 'redis', x: 160, y: 200, label: 'Redis', sub: 'session store', tone: 'store' },
        { id: 'api', x: 400, y: 200, label: 'Domain APIs', sub: 'JWT · RBAC' },
        { id: 'idm', x: 650, y: 200, label: 'Oracle IDM', sub: 'user federation', tone: 'external' },
        { id: 'apps', x: 400, y: 335, label: 'Enterprise systems', sub: 'onboarded by config', tone: 'external' },
      ],
      edges: [
        { from: 'spa', to: 'bff', label: 'HttpOnly cookie', flow: true },
        { from: 'bff', to: 'kc', label: 'code + PKCE', flow: true },
        { from: 'bff', to: 'redis', dashed: true },
        { from: 'bff', to: 'api', label: 'access token', flow: true },
        { from: 'kc', to: 'idm', dashed: true, label: 'LDAP' },
        { from: 'api', to: 'apps', flow: true },
      ],
    },
  },
  {
    slug: 'national-service-integrations',
    index: '02',
    title: 'National Identity & Government Service Integrations',
    tagline: 'Enterprise platforms talking to national infrastructure — reliably.',
    org: 'RSAF · Saudi Electronic University',
    period: '2019 — Present',
    domain: 'Enterprise Integration',
    featured: true,
    summary:
      'Integrations between enterprise platforms and national services — Nafath digital identity, Yakeen verification and the NIC travel permission service — designed for auditability and graceful failure.',
    context:
      'Government services are authoritative but external: they have their own availability windows, contracts and security requirements. Business workflows had to depend on them without becoming fragile.',
    challenges: [
      'Strict security and contract requirements for each national service.',
      'Long-running and asynchronous verification flows.',
      'Full audit trail of every request and response.',
      'Partial outages of upstream services must not block users.',
    ],
    approach: [
      {
        title: 'Anti-corruption integration layer',
        body: 'A dedicated integration service translates between internal domain models and each external contract, so application code never depends on SOAP envelopes or vendor-specific payloads.',
      },
      {
        title: 'Asynchronous by default',
        body: 'Requests that do not need an immediate answer go through RabbitMQ with retries and dead-letter queues, turning upstream instability into delayed — not failed — work.',
      },
      {
        title: 'Auditable by design',
        body: 'Every exchange is correlated and persisted, supporting compliance reviews and fast diagnosis when an upstream behaves unexpectedly.',
      },
    ],
    outcomes: [
      'Secure digital identity verification via Nafath and Yakeen.',
      'Travel permission workflows integrated with NIC.',
      'Upstream failures isolated from user-facing features.',
      'A reusable pattern for onboarding further government APIs.',
    ],
    stack: ['NestJS', 'Laravel', 'RabbitMQ', 'webMethods', 'REST', 'SOAP', 'Oracle'],
    diagram: {
      width: 760,
      height: 420,
      nodes: [
        { id: 'portal', x: 380, y: 55, label: 'Enterprise portal', sub: 'Angular' },
        { id: 'int', x: 380, y: 160, label: 'Integration layer', sub: 'adapters · NestJS', tone: 'accent' },
        { id: 'audit', x: 115, y: 160, label: 'Audit log', sub: 'Oracle', tone: 'store' },
        { id: 'mq', x: 645, y: 160, label: 'RabbitMQ', sub: 'retries · DLX', tone: 'signal' },
        { id: 'esb', x: 380, y: 265, label: 'Enterprise ESB', sub: 'webMethods' },
        { id: 'nafath', x: 150, y: 370, label: 'Nafath', sub: 'digital identity', tone: 'external' },
        { id: 'yakeen', x: 380, y: 370, label: 'Yakeen', sub: 'verification', tone: 'external' },
        { id: 'nic', x: 610, y: 370, label: 'NIC', sub: 'travel permission', tone: 'external' },
      ],
      edges: [
        { from: 'portal', to: 'int', flow: true },
        { from: 'int', to: 'audit', dashed: true },
        { from: 'int', to: 'mq', label: 'async', flow: true },
        { from: 'int', to: 'esb', flow: true },
        { from: 'esb', to: 'nafath', flow: true },
        { from: 'esb', to: 'yakeen', flow: true },
        { from: 'esb', to: 'nic', flow: true },
      ],
    },
  },
  {
    slug: 'event-driven-workflow-platform',
    index: '03',
    title: 'Event-Driven Enterprise Workflow Platform',
    tagline: 'Complex workflows, decoupled through messages.',
    org: 'Royal Saudi Air Force',
    period: '2023 — Present',
    domain: 'Distributed Systems',
    featured: true,
    summary:
      'Microservices and a BFF layer built with NestJS, RabbitMQ and Redis to run multi-step enterprise workflows asynchronously, with clear service boundaries and resilient processing.',
    context:
      'Enterprise workflows spanned approvals, notifications and several downstream systems. A synchronous, request-chained design made every step as fragile as the slowest dependency.',
    challenges: [
      'Multi-step workflows crossing several systems of record.',
      'Operation in load-balanced, high-availability deployments.',
      'Idempotency when messages are redelivered.',
      'Keeping the Angular client simple despite back-end complexity.',
    ],
    approach: [
      {
        title: 'BFF as the only public surface',
        body: 'The Angular client sees one API shaped for its screens. The BFF composes services and publishes commands, hiding topology changes from the UI.',
      },
      {
        title: 'Topic exchanges and consumer ownership',
        body: 'Each service owns its queues and bindings. Events describe facts; consumers decide what to do, which keeps producers unaware of downstream growth.',
      },
      {
        title: 'Redis for coordination',
        body: 'Caching, short-lived state and distributed locks live in Redis, while durable business state stays in Oracle.',
      },
    ],
    outcomes: [
      'Workflows resilient to individual service outages.',
      'Services deployable and scalable independently.',
      'A consistent pattern for adding new workflow steps.',
    ],
    stack: ['NestJS', 'RabbitMQ', 'Redis', 'Oracle', 'Angular', 'Docker', 'Keycloak'],
    diagram: {
      width: 760,
      height: 440,
      nodes: [
        { id: 'web', x: 380, y: 55, label: 'Angular', sub: 'workflow UI' },
        { id: 'bff', x: 380, y: 155, label: 'BFF · NestJS', sub: 'composition', tone: 'accent' },
        { id: 'kc', x: 640, y: 155, label: 'Keycloak', sub: 'identity', tone: 'signal' },
        { id: 'redis', x: 120, y: 155, label: 'Redis', sub: 'cache · locks', tone: 'store' },
        { id: 'mq', x: 380, y: 260, label: 'RabbitMQ', sub: 'topic exchanges', tone: 'signal' },
        { id: 'wf', x: 130, y: 380, label: 'Workflow service', sub: 'state machine' },
        { id: 'notify', x: 380, y: 380, label: 'Notification service', sub: 'SMS · email' },
        { id: 'integ', x: 630, y: 380, label: 'Integration service', sub: 'external systems' },
      ],
      edges: [
        { from: 'web', to: 'bff', flow: true },
        { from: 'bff', to: 'kc', dashed: true },
        { from: 'bff', to: 'redis', dashed: true },
        { from: 'bff', to: 'mq', label: 'commands', flow: true },
        { from: 'mq', to: 'wf', flow: true },
        { from: 'mq', to: 'notify', flow: true },
        { from: 'mq', to: 'integ', flow: true },
      ],
    },
  },
  {
    slug: 'on-prem-rag-document-intelligence',
    index: '04',
    title: 'On-Premise RAG Document Intelligence',
    tagline: 'Ask questions of organizational knowledge — without leaving the network.',
    org: 'Royal Saudi Air Force',
    period: '2023 — Present',
    domain: 'AI & LLM',
    summary:
      'A retrieval-augmented generation platform that lets users query internal documents in natural language, with answers grounded in cited sources and every component running on-premise.',
    context:
      'Valuable knowledge was locked in large collections of documents. Public AI services were not an option, so ingestion, embeddings, vector search and generation all had to run inside a restricted environment.',
    challenges: [
      'No access to hosted LLM or embedding APIs.',
      'Answers must be traceable to source documents.',
      'Mixed document formats and quality.',
      'Respecting existing access controls on documents.',
    ],
    approach: [
      {
        title: 'Separate ingestion and query paths',
        body: 'Documents are parsed, chunked and embedded asynchronously; the query path only retrieves and generates, keeping latency predictable.',
      },
      {
        title: 'Qdrant for vector search',
        body: 'Chunks are stored with metadata for filtering by collection and permission, so retrieval honours the same access model as the source systems.',
      },
      {
        title: 'Grounded, cited responses',
        body: 'Prompts are assembled from retrieved passages only, and responses carry references back to the original documents.',
      },
    ],
    outcomes: [
      'Natural-language search over internal document collections.',
      'Fully offline operation with local models.',
      'Answers users can verify against sources.',
    ],
    stack: ['RAG', 'LLMs', 'Qdrant', 'Embeddings', 'NestJS', 'Angular', 'Docker'],
    diagram: {
      width: 760,
      height: 370,
      lanes: [
        { y: 22, label: 'ingest' },
        { y: 212, label: 'query' },
      ],
      nodes: [
        { id: 'docs', x: 95, y: 80, label: 'Documents', sub: 'PDF · DOCX', tone: 'external' },
        { id: 'parse', x: 285, y: 80, label: 'Parse & chunk', sub: 'workers' },
        { id: 'embed', x: 475, y: 80, label: 'Embeddings', sub: 'local model' },
        { id: 'qdrant', x: 665, y: 80, label: 'Qdrant', sub: 'vectors · metadata', tone: 'store' },
        { id: 'ui', x: 95, y: 290, label: 'Angular chat', sub: 'citations' },
        { id: 'api', x: 285, y: 290, label: 'RAG API', sub: 'NestJS', tone: 'accent' },
        { id: 'ret', x: 475, y: 290, label: 'Retriever', sub: 'top-k · filters' },
        { id: 'llm', x: 665, y: 290, label: 'LLM', sub: 'on-premise', tone: 'signal' },
      ],
      edges: [
        { from: 'docs', to: 'parse', flow: true },
        { from: 'parse', to: 'embed', flow: true },
        { from: 'embed', to: 'qdrant', flow: true },
        { from: 'ui', to: 'api', flow: true },
        { from: 'api', to: 'ret', flow: true },
        { from: 'ret', to: 'qdrant', dashed: true, label: 'search' },
        { from: 'ret', to: 'llm', label: 'grounded prompt', flow: true },
      ],
    },
  },
  {
    slug: 'university-digital-platforms',
    index: '05',
    title: 'University Digital Platforms at Scale',
    tagline: 'Academic and administrative systems for 70,000+ users.',
    org: 'Saudi Electronic University',
    period: '2019 — 2023',
    domain: 'Digital Transformation',
    summary:
      'Large-scale academic and administrative platforms for students, faculty and staff — student services, learning platforms and reporting — with SSO, RBAC and government integrations.',
    context:
      'A fast-growing university needed its student services and administrative workflows to move online, reliably, for a user base in the tens of thousands with sharp seasonal peaks around registration and exams.',
    challenges: [
      'Seasonal traffic peaks across 70,000+ users.',
      'Several enterprise data sources: Oracle, SQL Server, MySQL.',
      'Distinct roles for students, faculty and administrators.',
      'Integration with national services such as Nafath and Yakeen.',
    ],
    approach: [
      {
        title: 'Angular front ends over shared APIs',
        body: 'Portals were built in Angular on top of Laravel and Node.js APIs, allowing several applications to share the same back-end capabilities.',
      },
      {
        title: 'SSO and role-based access',
        body: 'Oracle IDM provides single sign-on, and role-based access control maps each user type to the right features and data.',
      },
      {
        title: 'High availability and query performance',
        body: 'Load-balanced deployments on Linux and IIS, combined with query optimization against enterprise databases, kept the platforms responsive during peaks.',
      },
    ],
    outcomes: [
      'Platforms serving 70,000+ students, faculty and staff.',
      'Digitized student services and administrative workflows.',
      'Secure, SSO-based access across applications.',
    ],
    stack: ['Angular', 'Laravel', 'Node.js', 'TypeScript', 'Oracle IDM', 'Oracle', 'SQL Server', 'MySQL'],
    diagram: {
      width: 760,
      height: 410,
      nodes: [
        { id: 'users', x: 380, y: 50, label: '70,000+ users', sub: 'students · faculty · staff', tone: 'external', w: 190 },
        { id: 'lb', x: 380, y: 145, label: 'Load balancer', sub: 'Apache · IIS' },
        { id: 'portals', x: 140, y: 250, label: 'Angular portals', sub: 'services · learning' },
        { id: 'api', x: 380, y: 250, label: 'Platform APIs', sub: 'Laravel · Node.js', tone: 'accent' },
        { id: 'idm', x: 620, y: 250, label: 'Oracle IDM', sub: 'SSO · RBAC', tone: 'signal' },
        { id: 'oracle', x: 140, y: 360, label: 'Oracle', sub: 'records', tone: 'store' },
        { id: 'sql', x: 380, y: 360, label: 'SQL Server · MySQL', sub: 'operational data', tone: 'store', w: 170 },
        { id: 'gov', x: 620, y: 360, label: 'Nafath · Yakeen', sub: 'national services', tone: 'external' },
      ],
      edges: [
        { from: 'users', to: 'lb', flow: true },
        { from: 'lb', to: 'portals', flow: true },
        { from: 'lb', to: 'api', flow: true },
        { from: 'api', to: 'idm', dashed: true },
        { from: 'api', to: 'oracle', flow: true },
        { from: 'api', to: 'sql', flow: true },
        { from: 'api', to: 'gov', flow: true },
      ],
    },
  },
  {
    slug: 'real-time-fleet-tracking',
    index: '06',
    title: 'Real-Time Fleet & Geospatial Tracking',
    tagline: 'Thousands of moving points, turned into operational decisions.',
    org: 'Afaqy · Buseet',
    period: '2017 — 2019',
    domain: 'Geospatial & Real-Time',
    summary:
      'GPS tracking, fleet management and mobility platforms — processing device telemetry, detecting geofence events with Tile38 and visualizing live vehicle movement on map dashboards.',
    context:
      'Transportation operators needed to see where every vehicle was, react when vehicles entered or left zones, and manage trips, routes and bookings from one set of tools.',
    challenges: [
      'Continuous telemetry from tracking devices.',
      'Low-latency geofencing and proximity queries.',
      'Live map visualization for operations teams.',
      'Production stability under constant load.',
    ],
    approach: [
      {
        title: 'Purpose-built geospatial store',
        body: 'Tile38 handles vehicle positions, geofences and proximity queries in memory, keeping geospatial work out of the transactional database.',
      },
      {
        title: 'Event-based live updates',
        body: 'Location changes and geofence events are pushed to dashboards in real time instead of being polled.',
      },
      {
        title: 'Operational tooling',
        body: 'Admin dashboards for trips, routes, vehicles and bookings gave operations teams direct control of the service.',
      },
    ],
    outcomes: [
      'Live vehicle tracking with geofencing and proximity search.',
      'Interactive map dashboards for operations.',
      'Improved platform stability through production diagnostics.',
    ],
    stack: ['Tile38', 'Angular', 'Laravel', 'Leaflet', 'WebSockets', 'REST APIs'],
    diagram: {
      width: 760,
      height: 380,
      nodes: [
        { id: 'dev', x: 100, y: 60, label: 'GPS devices', sub: 'telemetry', tone: 'external' },
        { id: 'ingest', x: 340, y: 60, label: 'Ingestion API', sub: 'normalize', tone: 'accent' },
        { id: 'tile', x: 610, y: 60, label: 'Tile38', sub: 'geofence · nearby', tone: 'signal' },
        { id: 'db', x: 340, y: 195, label: 'Fleet database', sub: 'trips · routes', tone: 'store' },
        { id: 'rt', x: 610, y: 195, label: 'Real-time push', sub: 'WebSockets' },
        { id: 'ops', x: 340, y: 320, label: 'Admin tools', sub: 'bookings · vehicles' },
        { id: 'map', x: 610, y: 320, label: 'Map dashboards', sub: 'Leaflet', tone: 'external' },
      ],
      edges: [
        { from: 'dev', to: 'ingest', flow: true },
        { from: 'ingest', to: 'tile', flow: true },
        { from: 'ingest', to: 'db', dashed: true },
        { from: 'tile', to: 'rt', label: 'events', flow: true },
        { from: 'rt', to: 'map', flow: true },
        { from: 'db', to: 'ops', flow: true },
      ],
    },
  },
];

export const findProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
