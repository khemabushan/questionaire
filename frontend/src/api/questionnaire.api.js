import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Mock data for frontend demo (remove when backend is live) ──────────────
const MOCK_DELAY = 3000

function buildMockQuestionnaire({ jobRole, experienceLevel, difficultyLevel }) {
  const role = jobRole || 'Software Engineer'

  return {
    _id: 'mock-' + Date.now(),
    jobRole: role,
    experienceLevel,
    difficultyLevel,
    createdAt: new Date().toISOString(),
    questions: [
      // ── Technical (10) ──────────────────────────────────────────────────
      {
        _id: 'q1',
        category: 'technical',
        orderIndex: 1,
        questionText: `Explain the difference between synchronous and asynchronous programming in ${role} contexts. When would you choose one over the other?`,
        expectedAnswer: `Synchronous code executes line-by-line, blocking until each operation completes. Asynchronous code allows the program to initiate an operation and continue executing other code while waiting for the result — essential for I/O-bound tasks like network requests or file operations. In ${role} work, async patterns (Promises, async/await, callbacks) prevent blocking the event loop and improve throughput.`,
        followUpQuestions: [
          'How do you handle errors in async/await patterns?',
          'Can you describe a real scenario where switching from sync to async improved performance?',
          'What is the difference between concurrency and parallelism?',
        ],
        tags: ['async', 'programming-fundamentals'],
      },
      {
        _id: 'q2',
        category: 'technical',
        orderIndex: 2,
        questionText: `Describe your experience with RESTful API design. What principles guide your decisions when designing endpoints for a ${role} project?`,
        expectedAnswer: `RESTful APIs follow constraints: statelessness, uniform interface, layered system, and cacheable responses. Key principles include using HTTP verbs semantically (GET/POST/PUT/PATCH/DELETE), designing resource-oriented URLs, returning appropriate status codes, versioning APIs (/v1/), and providing consistent error shapes. Pagination, filtering, and rate-limiting are standard considerations.`,
        followUpQuestions: [
          'How would you version an API that already has clients in production?',
          'What is HATEOAS and have you ever implemented it?',
          'How do you secure a REST API?',
        ],
        tags: ['api-design', 'rest'],
      },
      {
        _id: 'q3',
        category: 'technical',
        orderIndex: 3,
        questionText: `What is the difference between SQL and NoSQL databases? How do you decide which to use for a given ${role} project?`,
        expectedAnswer: `SQL databases are relational, enforce schema, and excel at complex joins and ACID transactions (PostgreSQL, MySQL). NoSQL databases offer flexible schemas and horizontal scalability, suited to unstructured data, high-write-volume use cases, or document-oriented models (MongoDB, Redis, Cassandra). Decision factors: data relationships, consistency requirements, query patterns, scale expectations, and team familiarity.`,
        followUpQuestions: [
          'Have you ever migrated from one database type to another? What was the hardest part?',
          'How do you handle schema migrations in a production SQL database?',
          'What is eventual consistency and when is it acceptable?',
        ],
        tags: ['databases', 'architecture'],
      },
      {
        _id: 'q4',
        category: 'technical',
        orderIndex: 4,
        questionText: `Explain the concept of time complexity. How does Big-O notation affect the architectural decisions you make as a ${role}?`,
        expectedAnswer: `Big-O notation describes how an algorithm's runtime or space requirements grow with input size. Common complexities: O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n) linearithmic, O(n²) quadratic. In practice, it guides data structure selection (hash maps for O(1) lookups vs arrays for O(n)), helps anticipate bottlenecks, and informs decisions about caching, indexing, and query optimization at scale.`,
        followUpQuestions: [
          'Can you walk me through optimizing a nested loop from O(n²) to O(n)?',
          'When is O(n²) acceptable?',
          'How does space complexity factor into your decisions on memory-constrained systems?',
        ],
        tags: ['algorithms', 'performance'],
      },
      {
        _id: 'q5',
        category: 'technical',
        orderIndex: 5,
        questionText: `What design patterns have you used most frequently as a ${role}? Walk me through one concrete implementation.`,
        expectedAnswer: `Common patterns: Singleton (single instance, e.g. DB connection pool), Factory (object creation abstraction), Observer (event-driven communication), Strategy (interchangeable algorithms), Repository (data access abstraction). A concrete example: the Repository pattern decouples business logic from data persistence — a UserRepository interface can have a MongoUserRepository or PostgresUserRepository implementation, making the service layer testable with mocks.`,
        followUpQuestions: [
          'What is the difference between the Adapter and Decorator patterns?',
          'When have you seen a design pattern overused or misapplied?',
          'How do design patterns relate to SOLID principles?',
        ],
        tags: ['design-patterns', 'architecture'],
      },
      {
        _id: 'q6',
        category: 'technical',
        orderIndex: 6,
        questionText: `How do you approach testing in your projects as a ${role}? Describe the testing pyramid and how you apply it.`,
        expectedAnswer: `The testing pyramid has three layers: many fast unit tests (isolated functions/classes), fewer integration tests (modules working together, DB interactions), and a small number of E2E tests (full user flows). As a ${role}, I prioritize unit tests for business logic, integration tests for API routes and service interactions, and E2E tests for critical user paths. Tools like Jest, Vitest, Supertest, and Playwright/Cypress cover the layers.`,
        followUpQuestions: [
          'How do you test code that depends on external APIs?',
          'What is the difference between a stub, a mock, and a spy?',
          'How do you measure test coverage and what percentage do you aim for?',
        ],
        tags: ['testing', 'quality'],
      },
      {
        _id: 'q7',
        category: 'technical',
        orderIndex: 7,
        questionText: `Explain how you would architect a system to handle 100,000 concurrent users. What trade-offs would you make as a ${role}?`,
        expectedAnswer: `Key strategies: horizontal scaling behind a load balancer, stateless application servers (sessions in Redis), CDN for static assets, database read replicas, caching layers (Redis/Memcached), async job queues (BullMQ/SQS) for heavy work, and observability (metrics, logs, traces). Trade-offs: consistency vs availability (CAP theorem), cost vs performance, operational complexity vs throughput. Start with a well-indexed monolith and scale proven bottlenecks.`,
        followUpQuestions: [
          'At what point would you move from a monolith to microservices?',
          'How would you implement rate limiting at scale?',
          'Describe your experience with message queues or event streaming.',
        ],
        tags: ['system-design', 'scalability'],
      },
      {
        _id: 'q8',
        category: 'technical',
        orderIndex: 8,
        questionText: `What is your approach to code reviews as a ${role}? What do you look for, and how do you give constructive feedback?`,
        expectedAnswer: `Code review goals: catch bugs early, share knowledge, maintain standards. I look for: correctness, readability, test coverage, security issues (injection, auth gaps), performance hotspots, and adherence to patterns. Constructive feedback uses questions ("Have you considered...?") rather than directives, acknowledges good work, prioritizes critical issues over style nits (use linters for those), and explains the why.`,
        followUpQuestions: [
          'How do you handle a review where you strongly disagree with the author?',
          'What automated tools do you use to reduce the cognitive load on reviewers?',
          'Have you established a code review process from scratch? What did you learn?',
        ],
        tags: ['collaboration', 'code-quality'],
      },
      {
        _id: 'q9',
        category: 'technical',
        orderIndex: 9,
        questionText: `Describe your experience with CI/CD pipelines. How would you set one up from scratch for a ${role} project?`,
        expectedAnswer: `A CI/CD pipeline automates: code linting and formatting checks, unit + integration test runs, security scanning (SAST, dependency audits), build artifact creation, and deployment to staged environments (dev → staging → production) with approval gates. Tools: GitHub Actions or GitLab CI for orchestration, Docker for consistent builds, Terraform or Pulumi for infra-as-code, and Datadog/Grafana for post-deploy monitoring.`,
        followUpQuestions: [
          'How do you handle database migrations in a zero-downtime deployment?',
          'What is blue-green deployment and when would you use it?',
          'How do you roll back a bad deployment quickly?',
        ],
        tags: ['devops', 'ci-cd'],
      },
      {
        _id: 'q10',
        category: 'technical',
        orderIndex: 10,
        questionText: `How do you stay current with the rapidly evolving ${role} ecosystem? Describe your learning process.`,
        expectedAnswer: `Strategies: follow curated newsletters (TLDR, JavaScript Weekly), read official changelogs and RFCs, engage with the community on GitHub and Discord, build small proof-of-concepts with new tools before adopting in production, attend or watch conference talks, and allocate deliberate learning time (20% rule or dedicated learning sprints). I prioritize learning that solves real pain points over chasing novelty.`,
        followUpQuestions: [
          'What was the last technology you adopted? How did you evaluate it?',
          'How do you balance learning new things with delivering project work?',
          'Have you ever introduced a new technology to a team? How did you handle adoption?',
        ],
        tags: ['growth', 'learning'],
      },

      // ── Behavioral (5) ─────────────────────────────────────────────────
      {
        _id: 'q11',
        category: 'behavioral',
        orderIndex: 11,
        questionText: `Tell me about a time you had to deliver a project under a very tight deadline. How did you manage your time and communicate with stakeholders?`,
        expectedAnswer: `Look for STAR structure: Situation (project context and deadline constraint), Task (their specific responsibility), Action (prioritization, scope negotiation, communication cadence, delegation), Result (outcome, what was delivered, what was learned). Strong answers include proactive communication, trade-off discussions with stakeholders, and a retrospective on what they'd do differently.`,
        followUpQuestions: [],
        tags: ['time-management', 'communication'],
      },
      {
        _id: 'q12',
        category: 'behavioral',
        orderIndex: 12,
        questionText: `Describe a situation where you had to work with a difficult colleague or stakeholder. How did you handle the conflict?`,
        expectedAnswer: `Strong candidates demonstrate empathy, direct but respectful communication, and a focus on shared goals rather than personal positions. They describe: attempting private, direct resolution first; seeking to understand the other perspective; escalating constructively when needed; and reflecting on what they learned. Red flags: blaming others entirely, avoiding the conflict, or burning bridges.`,
        followUpQuestions: [],
        tags: ['conflict-resolution', 'teamwork'],
      },
      {
        _id: 'q13',
        category: 'behavioral',
        orderIndex: 13,
        questionText: `Give an example of a time you failed or made a significant mistake. What happened, and how did you recover?`,
        expectedAnswer: `This tests self-awareness and growth mindset. Strong answers own the mistake clearly without minimizing, describe the immediate impact honestly, explain the recovery steps taken (communication, fixes, mitigations), and articulate the specific process or habit change they made as a result. Candidates who cannot cite a real failure or who only describe minor mistakes are a yellow flag.`,
        followUpQuestions: [],
        tags: ['self-awareness', 'accountability'],
      },
      {
        _id: 'q14',
        category: 'behavioral',
        orderIndex: 14,
        questionText: `Tell me about a time you had to learn a new technology or skill quickly to complete a project. How did you approach it?`,
        expectedAnswer: `Look for: a structured learning approach (docs first, then tutorials, then build something), time-boxing, asking for help early, and applying the learning to the actual project rather than getting lost in theory. Good answers also mention how they shared learnings with the team and what they'd do to fill gaps if more time were available.`,
        followUpQuestions: [],
        tags: ['adaptability', 'learning-agility'],
      },
      {
        _id: 'q15',
        category: 'behavioral',
        orderIndex: 15,
        questionText: `Describe a time you took ownership of something that was outside your formal responsibilities. What motivated you, and what was the outcome?`,
        expectedAnswer: `This assesses initiative and ownership. Strong candidates describe identifying a gap or problem proactively, taking action without being asked, the impact of that action, and their motivation (improving team effectiveness, user experience, product quality). They should also acknowledge collaborating with the right people rather than acting unilaterally on things that affected others.`,
        followUpQuestions: [],
        tags: ['ownership', 'initiative'],
      },

      // ── HR (5) ─────────────────────────────────────────────────────────
      {
        _id: 'q16',
        category: 'hr',
        orderIndex: 16,
        questionText: `Why are you interested in this role, and why our company specifically?`,
        expectedAnswer: `Strong answers demonstrate genuine research into the company: product, mission, culture, recent news, and team. They connect the company's work to the candidate's specific interests and career goals — not just "great culture and growth opportunities." The best candidates articulate both what they offer the company and what the company offers their development.`,
        followUpQuestions: [],
        tags: ['motivation', 'culture-fit'],
      },
      {
        _id: 'q17',
        category: 'hr',
        orderIndex: 17,
        questionText: `Where do you see yourself professionally in the next 3–5 years?`,
        expectedAnswer: `Look for: clarity of direction (not generic ambition), alignment between their goals and what this role offers, and realistic self-awareness. Strong candidates express a growth trajectory (technical depth, leadership, or scope expansion) that is plausibly achievable in this company context. Avoid candidates with no answer or whose stated goal is entirely disconnected from the role.`,
        followUpQuestions: [],
        tags: ['career-goals', 'motivation'],
      },
      {
        _id: 'q18',
        category: 'hr',
        orderIndex: 18,
        questionText: `What is your preferred working style — remote, hybrid, or in-office — and how do you stay productive and connected to your team?`,
        expectedAnswer: `Assess alignment with the company's working model. Beyond logistics, look for maturity around async communication, self-management, boundary-setting, proactive check-ins, and use of tools. Candidates who've worked remotely should describe specific practices (structured daily routines, documentation habits, over-communication norms) rather than just stating a preference.`,
        followUpQuestions: [],
        tags: ['working-style', 'remote-work'],
      },
      {
        _id: 'q19',
        category: 'hr',
        orderIndex: 19,
        questionText: `What are your salary expectations, and what factors beyond compensation matter most to you in this role?`,
        expectedAnswer: `Candidates who've researched market rates and can give a specific but flexible range demonstrate preparation and confidence. Beyond salary: equity/RSUs, learning budget, flexibility, team quality, meaningful work, and growth opportunity are common factors. Assess alignment between what they value and what the company genuinely offers.`,
        followUpQuestions: [],
        tags: ['compensation', 'expectations'],
      },
      {
        _id: 'q20',
        category: 'hr',
        orderIndex: 20,
        questionText: `Do you have any questions for us?`,
        expectedAnswer: `Strong candidates have 3–5 prepared, specific questions about: the team's current challenges, what success looks like in the first 90 days, the engineering culture (how decisions are made, how failure is handled), growth paths, and something specific from earlier in the interview. Candidates with no questions are a red flag. Avoid questions answered on the company website.`,
        followUpQuestions: [],
        tags: ['curiosity', 'engagement'],
      },
    ],
  }
}

// ── API functions ──────────────────────────────────────────────────────────

export async function generateQuestionnaire(payload) {
  return api.post('/questionnaires/generate', payload)
}

export async function getQuestionnaire(id) {
  return api.get(`/questionnaires/${id}`)
}

export async function listQuestionnaires(params = {}) {
  return api.get('/questionnaires', { params })
}

export async function exportQuestionnaire(id, format = 'pdf') {
  return api.get(`/questionnaires/${id}/export`, {
    params: { format },
    responseType: format === 'pdf' ? 'blob' : 'json',
  })
}
