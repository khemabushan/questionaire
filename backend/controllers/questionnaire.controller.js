import Questionnaire from '../models/Questionnaire.model.js'
import { generateInterviewQuestions } from '../services/openai.service.js'
import ApiError from '../utils/ApiError.js'
import logger from '../utils/logger.js'

// ── POST /api/v1/questionnaires/generate ──────────────────────────────────

export async function generate(req, res) {
  const { jobRole, experienceLevel, difficultyLevel } = req.body

  logger.info(`Generate request: "${jobRole}" | ${experienceLevel} | ${difficultyLevel}`)

  // Call OpenAI service
  const { questions, usage, generationMs, modelUsed } = await generateInterviewQuestions({
    jobRole,
    experienceLevel,
    difficultyLevel,
  })

  // Persist to MongoDB
  const questionnaire = await Questionnaire.create({
    userId: req.user?._id ?? null, // optional auth
    jobRole,
    experienceLevel: experienceLevel.toLowerCase(),
    difficultyLevel: difficultyLevel.toLowerCase(),
    questions,
    modelUsed,
    promptTokens: usage.promptTokens,
    completionTokens: usage.completionTokens,
    totalTokens: usage.totalTokens,
    generationMs,
  })

  logger.info(`Questionnaire saved: ${questionnaire._id} (${questions.length} questions, ${generationMs}ms)`)

  // Return shape expected by frontend:
  // { success, data: { _id, jobRole, experienceLevel, difficultyLevel, questions, ... } }
  return res.status(201).json({
    success: true,
    data: questionnaire.toJSON(),
  })
}

// ── GET /api/v1/questionnaires ────────────────────────────────────────────

export async function list(req, res) {
  const {
    page = 1,
    limit = 10,
    role,
    difficulty,
    experience,
    favorited,
    sort = '-createdAt',
  } = req.query

  const filter = { deletedAt: null }

  // Optional owner filter (once auth is wired)
  if (req.user) filter.userId = req.user._id

  if (role) {
    filter.jobRole = { $regex: new RegExp(role, 'i') }
  }
  if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
    filter.difficultyLevel = difficulty
  }
  if (experience && ['junior', 'mid', 'senior', 'lead'].includes(experience)) {
    filter.experienceLevel = experience
  }
  if (favorited === 'true') {
    filter.isFavorited = true
  }

  const pageNum = Math.max(1, parseInt(page, 10))
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)))
  const skip = (pageNum - 1) * limitNum

  const [questionnaires, total] = await Promise.all([
    Questionnaire.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .select('-questions') // list view: omit heavy question array
      .lean(),
    Questionnaire.countDocuments(filter),
  ])

  return res.status(200).json({
    success: true,
    data: questionnaires,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: pageNum < Math.ceil(total / limitNum),
      hasPrevPage: pageNum > 1,
    },
  })
}

// ── GET /api/v1/questionnaires/:id ────────────────────────────────────────

export async function getById(req, res) {
  const questionnaire = await Questionnaire.findOne({
    _id: req.params.id,
    deletedAt: null,
  })

  if (!questionnaire) {
    throw ApiError.notFound('Questionnaire')
  }

  // Owner check when auth present
  if (req.user && questionnaire.userId && questionnaire.userId.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden()
  }

  return res.status(200).json({
    success: true,
    data: questionnaire.toJSON(),
  })
}

// ── PATCH /api/v1/questionnaires/:id ─────────────────────────────────────

export async function update(req, res) {
  const questionnaire = await Questionnaire.findOne({
    _id: req.params.id,
    deletedAt: null,
  })

  if (!questionnaire) throw ApiError.notFound('Questionnaire')

  if (req.user && questionnaire.userId && questionnaire.userId.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden()
  }

  const allowed = ['title', 'isFavorited']
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) {
      questionnaire[field] = req.body[field]
    }
  })

  await questionnaire.save()

  return res.status(200).json({
    success: true,
    data: questionnaire.toJSON(),
  })
}

// ── DELETE /api/v1/questionnaires/:id ────────────────────────────────────

export async function remove(req, res) {
  const questionnaire = await Questionnaire.findOne({
    _id: req.params.id,
    deletedAt: null,
  })

  if (!questionnaire) throw ApiError.notFound('Questionnaire')

  if (req.user && questionnaire.userId && questionnaire.userId.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden()
  }

  await questionnaire.softDelete()

  return res.status(200).json({
    success: true,
    message: 'Questionnaire deleted',
  })
}

// ── GET /api/v1/questionnaires/:id/export ─────────────────────────────────

export async function exportQuestionnaire(req, res) {
  const { format = 'json' } = req.query

  const questionnaire = await Questionnaire.findOne({
    _id: req.params.id,
    deletedAt: null,
  })

  if (!questionnaire) throw ApiError.notFound('Questionnaire')

  if (format === 'json') {
    res.setHeader('Content-Disposition', `attachment; filename="questionnaire-${questionnaire._id}.json"`)
    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json(questionnaire.toJSON())
  }

  // For PDF: return the raw data and let the client render
  // (or wire pdfmake here in a future iteration)
  return res.status(200).json({
    success: true,
    message: 'PDF export not yet implemented server-side. Use the JSON format and render on the client.',
    data: questionnaire.toJSON(),
  })
}

// ── GET /api/v1/questionnaires/stats ──────────────────────────────────────

export async function stats(req, res) {
  const filter = { deletedAt: null }
  if (req.user) filter.userId = req.user._id

  const [totals, byDifficulty, byExperience, recent] = await Promise.all([
    Questionnaire.countDocuments(filter),

    Questionnaire.aggregate([
      { $match: filter },
      { $group: { _id: '$difficultyLevel', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),

    Questionnaire.aggregate([
      { $match: filter },
      { $group: { _id: '$experienceLevel', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),

    Questionnaire.find(filter)
      .sort('-createdAt')
      .limit(5)
      .select('jobRole experienceLevel difficultyLevel createdAt')
      .lean(),
  ])

  return res.status(200).json({
    success: true,
    data: {
      total: totals,
      byDifficulty,
      byExperience,
      recent,
    },
  })
}
