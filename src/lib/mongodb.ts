import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/knowledge-graph';

export async function connectToMongoDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      logger.info('MongoDB is already connected');
      logger.info('Current database:', { database: mongoose.connection.db?.databaseName });
      return mongoose;
    }

    logger.info('Connecting to MongoDB...', { uri: MONGODB_URI });
    await mongoose.connect(MONGODB_URI, {
      retryWrites: true,
      w: 'majority',
      dbName: 'knowledge-graph'
    });
    logger.info('Successfully connected to MongoDB');
    logger.info('Connected to database:', { database: mongoose.connection.db?.databaseName });

    // Handle connection errors
    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
      logger.info('Reconnected to database:', { database: mongoose.connection.db?.databaseName });
    });

    return mongoose;
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to connect to MongoDB:', { error: error.message });
    throw error;
  }
}

// Export the mongoose instance for use in other files
export default mongoose; 