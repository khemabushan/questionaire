import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const { JsonWebTokenError, TokenExpiredError } = jwt
import ApiError from '../utils/ApiError.js'
import logger from '../utils/logger.js'
import env from '../config/env.js'

/**
 * Normalize any thrown value into a consistent { statusCode, message, code, details } shape.
 */
function normalizeError(err) {
  // Already an ApiError — pass through
  if (err instanceof ApiError) return err

  // Mongoose: CastError (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    return new ApiError(400, `Invalid ${err.path}: "${err.value}"`, 'INVALID_ID')
  }

  // Mongoose: ValidationError (schema-level validation failed)
  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }))
    return new ApiError(400, 'Validation failed', 'VALIDATION_ERROR', details)
  }

  // Mongoose: duplicate key (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'field'
    const value = err.keyValue?.[field]
    return new ApiError(409, `Duplicate value for ${field}: "${value}"`, 'DUPLICATE_KEY')
  }

  // JWT: expired token
  if (err instanceof TokenExpiredError) {
    return new ApiError(401, 'Token has expired. Please log in again.', 'TOKEN_EXPIRED')
  }

  // JWT: invalid token
  if (err instanceof JsonWebTokenError) {
    return new ApiError(401, 'Invalid token. Please log in again.', 'TOKEN_INVALID')
  }

  // Express body-parser SyntaxError (malformed JSON body)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return new ApiError(400, 'Malformed JSON in request body', 'MALFORMED_JSON')
  }

  // Unknown — treat as 500
  return new ApiError(500, 'An unexpected error occurred', 'INTERNAL_ERROR')
}

/**
 * Global Express error-handling middleware.
 * Must have 4 parameters — Express identifies error handlers by arity.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const normalized = normalizeError(err)

  // Log all 5xx and unexpected errors at error level; 4xx at warn
  if (normalized.statusCode >= 500) {
    logger.error({
      message: `${normalized.statusCode} ${normalized.message}`,
      code: normalized.code,
      path: req.path,
      method: req.method,
      stack: err.stack,
    })
  } else {
    logger.warn(`${normalized.statusCode} ${normalized.message} — ${req.method} ${req.path}`)
  }

  const body = {
    success: false,
    error: normalized.message,
    code: normalized.code,
    statusCode: normalized.statusCode,
    ...(normalized.details ? { details: normalized.details } : {}),
    // Include stack only in development for debugging
    ...(env.isDevelopment && !normalized.isOperational ? { stack: err.stack } : {}),
  }

  return res.status(normalized.statusCode).json(body)
}

/**
 * 404 handler — mount AFTER all routes.
 */
export function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl}`))
}
