import mongoose, { ConnectOptions } from 'mongoose';
import { logger } from '../utils/logger.js';

const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

logger.info('Environment setup:', {
  MONGODB_URI: MONGODB_URI ? 'Set' : 'Not set',
  NODE_ENV,
});

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

// For serverless environment, we want faster connection timeouts
const opts: ConnectOptions = {
  bufferCommands: false,
  maxPoolSize: NODE_ENV === 'production' ? 10 : 5,
  minPoolSize: NODE_ENV === 'production' ? 1 : 1,
  socketTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 5000,
  heartbeatFrequencyMS: 10000,
  retryWrites: true,
  ...(NODE_ENV === 'production' ? {
    autoIndex: false,
    compressors: ['zlib' as const],
  } : {})
};

// Keep track of connection status
let isConnected = false;

async function connectWithRetry(retryCount = 0): Promise<typeof mongoose> {
  try {
    if (isConnected) {
      logger.info('Using existing MongoDB connection');
      return mongoose;
    }

    if (mongoose.connection.readyState === 1) {
      isConnected = true;
      logger.info('Using existing MongoDB connection');
      return mongoose;
    }

    if (!MONGODB_URI) {
      throw new Error('MongoDB URI is not defined');
    }

    logger.info('Creating new MongoDB connection');
    await mongoose.connect(MONGODB_URI, opts);
    isConnected = true;
    logger.info('MongoDB connected successfully!');
    return mongoose;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      logger.warn(`MongoDB connection attempt ${retryCount + 1} failed. Retrying in ${RETRY_DELAY}ms...`, { error });
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectWithRetry(retryCount + 1);
    }
    
    logger.error('Failed to connect to MongoDB after maximum retries:', { error });
    throw error;
  }
}

// Monitor connection status
mongoose.connection.on('connected', () => {
  isConnected = true;
  logger.info('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  logger.error('MongoDB connection error:', { error: err });
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  logger.info('MongoDB connection disconnected');
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB disconnected through app termination');
    process.exit(0);
  } catch (err) {
    logger.error('Error during MongoDB disconnection:', { error: err });
    process.exit(1);
  }
});

export const connectToMongoDB = connectWithRetry;
export default connectToMongoDB; 