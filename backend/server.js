import app from './app.js'
import { connectDB } from './config/db.js'
import env from './config/env.js'
import logger from './utils/logger.js'

async function startServer() {
  // 1. Connect to MongoDB before accepting traffic
  await connectDB()

  // 2. Start HTTP server
  const server = app.listen(env.PORT, () => {
    logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`)
    logger.info(`Health check: http://localhost:${env.PORT}/health`)
    logger.info(`API base:     http://localhost:${env.PORT}/api/v1`)
  })

  // ── Graceful shutdown ──────────────────────────────────────────────────
  const shutdown = async (signal) => {
    logger.info(`${signal} received — initiating graceful shutdown`)

    server.close(async () => {
      logger.info('HTTP server closed — no new connections accepted')
      // DB cleanup is handled by the listeners in config/db.js
      process.exit(0)
    })

    // Force exit after 10 s if server hasn't closed cleanly
    setTimeout(() => {
      logger.error('Graceful shutdown timed out — forcing exit')
      process.exit(1)
    }, 10_000).unref()
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))

  // ── Unhandled errors ───────────────────────────────────────────────────
  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught exception: ${err.message}`, { stack: err.stack })
    process.exit(1)
  })

  process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled rejection: ${reason}`)
    process.exit(1)
  })
}

startServer()
