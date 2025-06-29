import mongoose, { ConnectOptions } from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

// Mask sensitive information in the connection string for logging
function maskConnectionString(uri: string): string {
  try {
    return uri.replace(/(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@/, '$1****:****@');
  } catch {
    return 'Invalid connection string';
  }
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global as any;
cached.mongoose = cached.mongoose || { conn: null, promise: null };

async function connectWithRetry(uri: string, retryCount = 0): Promise<typeof mongoose> {
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

  try {
    const db = await mongoose.connect(uri, opts);
    console.log('MongoDB connected successfully!');
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await db.disconnect();
        console.log('MongoDB disconnected through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error during MongoDB disconnection:', err);
        process.exit(1);
      }
    });

    return db;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.warn(`MongoDB connection attempt ${retryCount + 1} failed. Retrying in ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectWithRetry(uri, retryCount + 1);
    }
    console.error('Failed to connect to MongoDB after maximum retries:', error);
    throw error;
  }
}

export async function connectToMongoDB() {
  if (cached.mongoose.conn) {
    return cached.mongoose.conn;
  }

  if (!cached.mongoose.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.mongoose.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.mongoose.conn = await cached.mongoose.promise;
  } catch (e) {
    cached.mongoose.promise = null;
    throw e;
  }

  return cached.mongoose.conn;
}

// Monitor connection status
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection disconnected');
});

export default connectToMongoDB; 