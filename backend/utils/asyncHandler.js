/**
 * Wraps an async Express route handler and forwards any rejected promise
 * to the next() error handler — no try/catch needed in controllers.
 *
 * Usage:
 *   router.post('/generate', asyncHandler(questionnaireController.generate))
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

export default asyncHandler
