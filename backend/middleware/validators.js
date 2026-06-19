import { body, param, validationResult } from 'express-validator'
import ApiError from '../utils/ApiError.js'

/**
 * Runs validation results and throws ApiError(400) with field-level details
 * if any validator failed. Mount this AFTER the rule arrays.
 */
export function validateRequest(req, res, next) {
  const result = validationResult(req)
  if (result.isEmpty()) return next()

  const details = result.array().map((e) => ({
    field: e.path,
    message: e.msg,
    value: e.value,
  }))

  throw ApiError.badRequest('Validation failed', details)
}

// ── Questionnaire ─────────────────────────────────────────────────────────

export const validateGenerate = [
  body('jobRole')
    .trim()
    .notEmpty().withMessage('jobRole is required')
    .isLength({ min: 2, max: 150 }).withMessage('jobRole must be between 2 and 150 characters')
    .matches(/^[a-zA-Z0-9\s\-\/\+\.#]+$/).withMessage('jobRole contains invalid characters'),

  body('experienceLevel')
    .trim()
    .notEmpty().withMessage('experienceLevel is required')
    .toLowerCase()
    .isIn(['junior', 'mid', 'senior', 'lead']).withMessage('experienceLevel must be junior, mid, senior, or lead'),

  body('difficultyLevel')
    .trim()
    .notEmpty().withMessage('difficultyLevel is required')
    .toLowerCase()
    .isIn(['easy', 'medium', 'hard']).withMessage('difficultyLevel must be easy, medium, or hard'),

  validateRequest,
]

export const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .isMongoId().withMessage(`${paramName} must be a valid MongoDB ObjectId`),
  validateRequest,
]

// ── Questionnaire update ──────────────────────────────────────────────────

export const validateUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('title cannot exceed 200 characters'),

  body('isFavorited')
    .optional()
    .isBoolean().withMessage('isFavorited must be a boolean'),

  validateRequest,
]
