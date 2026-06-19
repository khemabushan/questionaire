import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

import env from './config/env.js'
import logger from './utils/logger.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import questionnaireRoutes from './routes/questionnaire.routes.js'

const app = express()

// ── Security headers ───────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
)

// ── CORS ───────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true)
      const allowed = env.CLIENT_ORIGIN.split(',').map((o) => o.trim())
      if (allowed.includes(origin) || env.isDevelopment) {
        return callback(null, true)
      }
      callback(new Error(`CORS: origin "${origin}" not allowed`))
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

// ── Body parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// ── HTTP request logging ────────────────────────────────────────────────
// Use Morgan for access logs, piped through Winston
app.use(
  morgan(env.isProduction ? 'combined' : 'dev', {
    stream: { write: (msg) => logger.http(msg.trim()) },
  })
)

// ── Global rate limiter (safety net — routes apply their own tighter limits) ─
app.use(
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX * 2,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, error: 'Too many requests.', code: 'RATE_LIMIT_EXCEEDED', statusCode: 429 },
  })
)

// ── Health check (no auth, no rate limit) ─────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    env: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

// ── API routes ─────────────────────────────────────────────────────────────
app.use('/api/v1/questionnaires', questionnaireRoutes)

// ── 404 handler (must be after all routes) ────────────────────────────────
app.use(notFoundHandler)

// ── Global error handler (must be last, must have 4 params) ──────────────
app.use(errorHandler)

export default app
