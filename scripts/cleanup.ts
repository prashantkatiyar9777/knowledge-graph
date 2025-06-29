import mongoose from 'mongoose';
import { logger } from '../src/utils/logger.js';

async function cleanup() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/knowledge-graph');
    
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Failed to get MongoDB database instance');
    }

    // Check if old relationships collection exists
    const collections = await db.listCollections().toArray();
    const relationshipsExists = collections.some(col => col.name === 'relationships');
    
    if (relationshipsExists) {
      // Check if all data has been migrated
      const oldCount = await db.collection('relationships').countDocuments();
      const [directCount, inverseCount, indirectCount, selfCount] = await Promise.all([
        db.collection('directrelationships').countDocuments(),
        db.collection('inverserelationships').countDocuments(),
        db.collection('indirectrelationships').countDocuments(),
        db.collection('selfrelationships').countDocuments()
      ]);

      const totalNewCount = directCount + inverseCount + indirectCount + selfCount;
      
      logger.info('Collection counts:', {
        oldCollection: oldCount,
        newCollections: {
          direct: directCount,
          inverse: inverseCount,
          indirect: indirectCount,
          self: selfCount,
          total: totalNewCount
        }
      });

      if (totalNewCount >= oldCount) {
        // Safe to delete the old collection
        await db.collection('relationships').drop();
        logger.info('Successfully dropped old relationships collection');
      } else {
        logger.warn('Not safe to drop old collection - new collections have fewer documents');
        logger.warn('Please verify data migration before dropping the old collection');
      }
    } else {
      logger.info('Old relationships collection does not exist');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('Cleanup failed:', { error: error instanceof Error ? error.message : String(error) });
    process.exit(1);
  }
}

cleanup(); 