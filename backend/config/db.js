import mongoose from 'mongoose'
import env from './env.js'
import logger from '../utils/logger.js'

const MONGOOSE_OPTIONS = {
  // Connection pool
  maxPoolSize: 10,
  minPoolSize: 2,
  // Timeouts
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  // Heartbeat
  heartbeatFrequencyMS: 10000,
}

let isConnected = false

export async function connectDB() {
  if (isConnected) {
    logger.info('MongoDB: reusing existing connection')
    return
  }

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, MONGOOSE_OPTIONS)
    isConnected = true

    logger.info(`MongoDB connected: ${conn.connection.host}`)
    logger.info(`Database: ${conn.connection.name}`)
  } catch (err) {
    logger.error(`MongoDB connection failed: ${err.message}`)
    // Exit process — app cannot function without DB
    process.exit(1)
  }
}

// Connection event listeners
mongoose.connection.on('connected', () => {
  logger.info('Mongoose: connected to MongoDB')
})

mongoose.connection.on('error', (err) => {
  logger.error(`Mongoose connection error: ${err.message}`)
  isConnected = false
})

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose: disconnected from MongoDB')
  isConnected = false
})

// Graceful shutdown
async function gracefulShutdown(signal) {
  logger.info(`${signal} received — closing MongoDB connection`)
  await mongoose.connection.close()
  logger.info('MongoDB connection closed')
  process.exit(0)
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))

export default mongoose
