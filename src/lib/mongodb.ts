import mongoose, { ConnectOptions } from 'mongoose';
import { logger } from '../utils/logger.js';

const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

logger.info('Environment setup:', {
  MONGODB_URI: MONGODB_URI ? 'Set' : 'Not set',
  NODE_ENV,
});

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

interface CachedMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: CachedMongoose | undefined;
}

const cached: CachedMongoose = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

async function connectWithRetry(retryCount = 0): Promise<typeof mongoose> {
  if (cached.conn) {
    logger.info('Using existing MongoDB connection');
    return cached.conn;
  }

  try {
    const opts: ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: NODE_ENV === 'production' ? 50 : 10,
      minPoolSize: NODE_ENV === 'production' ? 10 : 1,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 5000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      ...(NODE_ENV === 'production' ? {
        autoIndex: false,
        compressors: ['zlib' as const],
      } : {})
    };

    if (!cached.promise && MONGODB_URI) {
      logger.info('Creating new MongoDB connection');
      cached.promise = mongoose.connect(MONGODB_URI, opts);
    }

    if (cached.promise) {
      cached.conn = await cached.promise;
      logger.info('MongoDB connected successfully!');
      return cached.conn;
    }

    throw new Error('MongoDB connection failed: No connection promise available');
  } catch (error) {
    cached.promise = null;
    
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
  logger.info('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error:', { error: err });
});

mongoose.connection.on('disconnected', () => {
  logger.info('MongoDB connection disconnected');
  cached.conn = null;
  cached.promise = null;
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