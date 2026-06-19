import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })

function required(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function optional(name, defaultValue = '') {
  return process.env[name] ?? defaultValue
}

const env = {
  NODE_ENV: optional('NODE_ENV', 'development'),
  PORT: parseInt(optional('PORT', '5000'), 10),

  MONGODB_URI: required('MONGODB_URI'),

  OPENAI_API_KEY: required('OPENAI_API_KEY'),
  OPENAI_MODEL: optional('OPENAI_MODEL', 'gpt-4o'),
  OPENAI_MAX_TOKENS: parseInt(optional('OPENAI_MAX_TOKENS', '4000'), 10),
  OPENAI_TEMPERATURE: parseFloat(optional('OPENAI_TEMPERATURE', '0.7')),

  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: optional('JWT_EXPIRES_IN', '7d'),

  RATE_LIMIT_WINDOW_MS: parseInt(optional('RATE_LIMIT_WINDOW_MS', '900000'), 10),
  RATE_LIMIT_MAX: parseInt(optional('RATE_LIMIT_MAX', '100'), 10),
  GENERATE_RATE_LIMIT_MAX: parseInt(optional('GENERATE_RATE_LIMIT_MAX', '10'), 10),

  CLIENT_ORIGIN: optional('CLIENT_ORIGIN', 'http://localhost:3000'),

  get isProduction() {
    return this.NODE_ENV === 'production'
  },
  get isDevelopment() {
    return this.NODE_ENV === 'development'
  },
}

export default env
