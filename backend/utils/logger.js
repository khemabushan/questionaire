import winston from 'winston'
import env from '../config/env.js'

const { combine, timestamp, printf, colorize, errors, json } = winston.format

// Dev format: colored, human-readable
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack }) => {
    return stack
      ? `${timestamp} [${level}] ${message}\n${stack}`
      : `${timestamp} [${level}] ${message}`
  })
)

// Production format: structured JSON for log aggregators
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
)

const transports = [
  new winston.transports.Console({
    format: env.isProduction ? prodFormat : devFormat,
  }),
]

// File transports in production
if (env.isProduction) {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: prodFormat,
      maxsize: 10 * 1024 * 1024, // 10 MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: prodFormat,
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    })
  )
}

const logger = winston.createLogger({
  level: env.isDevelopment ? 'debug' : 'info',
  transports,
  // Prevent winston from exiting on uncaught exceptions
  exitOnError: false,
})

export default logger
