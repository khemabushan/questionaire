/**
 * Operational error thrown intentionally by application code.
 * The global error handler checks `isOperational` to distinguish
 * these from unexpected programmer errors.
 */
export class ApiError extends Error {
  /**
   * @param {number} statusCode  HTTP status code
   * @param {string} message     Human-readable message (sent to client)
   * @param {string} [code]      Machine-readable error code (e.g. 'VALIDATION_ERROR')
   * @param {any}    [details]   Optional structured detail payload
   */
  constructor(statusCode, message, code = 'API_ERROR', details = null) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.isOperational = true

    // Maintain proper prototype chain in TypeScript / transpiled ES
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }
  }

  // ── Factory helpers ─────────────────────────────────────────────────────

  static badRequest(message, details = null) {
    return new ApiError(400, message, 'BAD_REQUEST', details)
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message, 'UNAUTHORIZED')
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message, 'FORBIDDEN')
  }

  static notFound(resource = 'Resource') {
    return new ApiError(404, `${resource} not found`, 'NOT_FOUND')
  }

  static tooManyRequests(message = 'Too many requests. Please try again later.') {
    return new ApiError(429, message, 'RATE_LIMIT_EXCEEDED')
  }

  static internal(message = 'Internal server error') {
    return new ApiError(500, message, 'INTERNAL_ERROR')
  }

  static openAIError(message = 'AI service failed. Please try again.') {
    return new ApiError(502, message, 'OPENAI_ERROR')
  }
}

export default ApiError
