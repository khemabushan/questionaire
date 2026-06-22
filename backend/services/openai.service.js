import OpenAI from 'openai'
import env from '../config/env.js'
import logger from '../utils/logger.js'
import ApiError from '../utils/ApiError.js'

// ── Client ────────────────────────────────────────────────────────────────
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  timeout: 55_000, // 55s — Express default timeout is 60s
  maxRetries: 2,
})

// ── Prompt builder ────────────────────────────────────────────────────────

function buildSystemPrompt() {
  return `You are an expert technical recruiter and senior engineering interviewer with 15+ years of experience hiring across all levels. Your job is to generate a comprehensive, realistic interview question kit tailored to a specific role, experience level, and difficulty.

RESPONSE RULES:
1. Respond ONLY with valid JSON — no markdown, no code fences, no preamble.
2. Follow the exact schema provided. Do not add or remove keys.
3. Questions must be calibrated to the experience level and difficulty specified.
4. Technical questions must reflect the actual tools, patterns, and challenges of the role.
5. Expected answers must be substantive — what a strong candidate would actually say.
6. Follow-up questions must probe deeper into the same concept, not introduce new topics.
7. Tags must be lowercase, hyphenated, and reflect the actual concept tested.`
}

function buildUserPrompt({ jobRole, experienceLevel, difficultyLevel }) {
  const levelContext = {
    junior: 'The candidate has 0–2 years of experience. Focus on fundamentals, core concepts, and learning agility. Avoid deep architecture questions.',
    mid: 'The candidate has 2–5 years of experience. Expect applied knowledge, some system design awareness, and ownership of features end-to-end.',
    senior: 'The candidate has 5–8 years of experience. Probe architecture decisions, trade-off reasoning, team leadership, and production incident experience.',
    lead: 'The candidate has 8+ years of experience. Focus on org-level impact, cross-team influence, architectural vision, and engineering culture.',
  }

  const difficultyContext = {
    easy: 'Questions should test core knowledge that any competent professional at this level should know confidently.',
    medium: 'Questions should require applied reasoning, not just recall. Include scenario-based questions.',
    hard: 'Questions should require expert-level depth, edge case awareness, and the ability to reason under ambiguity.',
  }

  const normalizedLevel = experienceLevel.toLowerCase()
  const normalizedDifficulty = difficultyLevel.toLowerCase()

  return `Generate a complete interview kit for this role:

ROLE: ${jobRole}
EXPERIENCE LEVEL: ${experienceLevel} — ${levelContext[normalizedLevel] ?? ''}
DIFFICULTY: ${difficultyLevel} — ${difficultyContext[normalizedDifficulty] ?? ''}

Produce EXACTLY:
- 10 technical questions specific to the "${jobRole}" role
- 5 behavioral questions (STAR-method compatible)
- 5 HR questions (culture fit, motivation, expectations)

For EVERY technical question, include 3 follow-up probes.
For behavioral and HR questions, followUpQuestions must be an empty array [].

Return this EXACT JSON structure (no other text):
{
  "questions": [
    {
      "category": "technical",
      "orderIndex": 1,
      "questionText": "...",
      "expectedAnswer": "...",
      "followUpQuestions": ["...", "...", "..."],
      "tags": ["tag-one", "tag-two"]
    },
    {
      "category": "behavioral",
      "orderIndex": 11,
      "questionText": "...",
      "expectedAnswer": "...",
      "followUpQuestions": [],
      "tags": ["tag-one"]
    },
    {
      "category": "hr",
      "orderIndex": 16,
      "questionText": "...",
      "expectedAnswer": "...",
      "followUpQuestions": [],
      "tags": ["tag-one"]
    }
  ]
}

Order: technical questions 1–10, behavioral 11–15, HR 16–20.`
}

// ── Response validator ────────────────────────────────────────────────────

function validateAndNormalize(parsed, { jobRole, experienceLevel, difficultyLevel }) {
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Parsed response is not an object')
  }

  if (!Array.isArray(parsed.questions)) {
    throw new Error('Response missing "questions" array')
  }

  const VALID_CATEGORIES = ['technical', 'behavioral', 'hr']
  const questions = parsed.questions.map((q, i) => {
    if (!VALID_CATEGORIES.includes(q.category)) {
      throw new Error(`Question ${i + 1} has invalid category: "${q.category}"`)
    }
    if (typeof q.questionText !== 'string' || q.questionText.trim().length === 0) {
      throw new Error(`Question ${i + 1} is missing questionText`)
    }
    if (typeof q.expectedAnswer !== 'string' || q.expectedAnswer.trim().length === 0) {
      throw new Error(`Question ${i + 1} is missing expectedAnswer`)
    }

    return {
      category: q.category,
      orderIndex: typeof q.orderIndex === 'number' ? q.orderIndex : i + 1,
      questionText: q.questionText.trim(),
      expectedAnswer: q.expectedAnswer.trim(),
      followUpQuestions: Array.isArray(q.followUpQuestions)
        ? q.followUpQuestions.filter((s) => typeof s === 'string' && s.trim())
        : [],
      tags: Array.isArray(q.tags)
        ? q.tags.filter((s) => typeof s === 'string' && s.trim())
        : [],
    }
  })

  // Soft-validate counts (warn, don't reject — partial kits are still useful)
  const technicalCount = questions.filter((q) => q.category === 'technical').length
  const behavioralCount = questions.filter((q) => q.category === 'behavioral').length
  const hrCount = questions.filter((q) => q.category === 'hr').length

  logger.debug(`Question counts — technical: ${technicalCount}, behavioral: ${behavioralCount}, hr: ${hrCount}`)

  if (technicalCount === 0) {
    logger.warn('OpenAI returned zero technical questions')
  }

  return questions
}

// ── Main service function ─────────────────────────────────────────────────

/**
 * Call OpenAI and return a validated, normalized questions array.
 *
 * @param {{ jobRole: string, experienceLevel: string, difficultyLevel: string }} params
 * @returns {{ questions: Array, usage: object, generationMs: number }}
 */
export async function generateInterviewQuestions(params) {
  const { jobRole, experienceLevel, difficultyLevel } = params
  const startTime = Date.now()

  logger.info(`OpenAI: generating questions for "${jobRole}" (${experienceLevel}/${difficultyLevel})`)

  let rawContent = ''

  try {
    const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 1500,
    temperature: env.OPENAI_TEMPERATURE,
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: buildUserPrompt({...}) }
    ]
  })

    rawContent = completion.choices[0]?.message?.content ?? ''
    const generationMs = Date.now() - startTime

    logger.info(`OpenAI: completed in ${generationMs}ms — tokens: ${completion.usage?.total_tokens ?? 0}`)

    if (!rawContent) {
      throw new Error('OpenAI returned empty content')
    }

    // Strip accidental markdown fences (shouldn't happen with json_object mode, but defensive)
    const cleaned = rawContent.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()

    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch (parseErr) {
      logger.error(`JSON parse failed: ${parseErr.message}`)
      logger.debug(`Raw content: ${rawContent.slice(0, 500)}`)
      throw new Error(`Invalid JSON from OpenAI: ${parseErr.message}`)
    }

    const questions = validateAndNormalize(parsed, params)

    return {
      questions,
      usage: {
        promptTokens: completion.usage?.prompt_tokens ?? 0,
        completionTokens: completion.usage?.completion_tokens ?? 0,
        totalTokens: completion.usage?.total_tokens ?? 0,
      },
      generationMs,
      modelUsed: completion.model,
    }
  } catch (err) {
    const generationMs = Date.now() - startTime
    logger.error(`OpenAI service error after ${generationMs}ms: ${err.message}`)

    // Re-throw as ApiError with client-safe message
    if (err.status === 429) {
      throw ApiError.tooManyRequests('AI service is temporarily rate-limited. Please try again in a moment.')
    }
    if (err.status === 401) {
      throw ApiError.internal('AI service authentication failed. Contact support.')
    }
    if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT' || err.message.includes('timeout')) {
      throw ApiError.openAIError('AI service timed out. Please try again.')
    }
    if (err instanceof ApiError) throw err

    throw ApiError.openAIError(err.message ?? 'Failed to generate questions. Please try again.')
  }
}

export default { generateInterviewQuestions }
