import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import * as controller from '../controllers/questionnaire.controller.js'
import {
  validateGenerate,
  validateObjectId,
  validateUpdate,
} from '../middleware/validators.js'
import asyncHandler from '../utils/asyncHandler.js'
import env from '../config/env.js'

const router = Router()

// ── Rate limiters ─────────────────────────────────────────────────────────

/**
 * Strict limiter for the AI generation endpoint.
 * Prevents runaway OpenAI spend and abuse.
 */
const generateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS, // 15 minutes by default
  max: env.GENERATE_RATE_LIMIT_MAX,   // 10 requests per window by default
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many generation requests. Please wait before trying again.',
    code: 'RATE_LIMIT_EXCEEDED',
    statusCode: 429,
  },
  keyGenerator: (req) => req.user?._id?.toString() ?? req.ip,
})

/**
 * General limiter for read/write operations.
 */
const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please slow down.',
    code: 'RATE_LIMIT_EXCEEDED',
    statusCode: 429,
  },
})

// ── Routes ────────────────────────────────────────────────────────────────

// POST   /api/v1/questionnaires/generate
// — Must be declared BEFORE /:id to avoid "generate" being treated as an ObjectId
router.post(
  '/generate',
  generateLimiter,
  validateGenerate,
  asyncHandler(controller.generate)
)

// GET    /api/v1/questionnaires/stats
router.get(
  '/stats',
  generalLimiter,
  asyncHandler(controller.stats)
)

// GET    /api/v1/questionnaires
router.get(
  '/',
  generalLimiter,
  asyncHandler(controller.list)
)

// GET    /api/v1/questionnaires/:id
router.get(
  '/:id',
  generalLimiter,
  validateObjectId('id'),
  asyncHandler(controller.getById)
)

// PATCH  /api/v1/questionnaires/:id
router.patch(
  '/:id',
  generalLimiter,
  validateObjectId('id'),
  validateUpdate,
  asyncHandler(controller.update)
)

// DELETE /api/v1/questionnaires/:id
router.delete(
  '/:id',
  generalLimiter,
  validateObjectId('id'),
  asyncHandler(controller.remove)
)

// GET    /api/v1/questionnaires/:id/export
router.get(
  '/:id/export',
  generalLimiter,
  validateObjectId('id'),
  asyncHandler(controller.exportQuestionnaire)
)

export default router
