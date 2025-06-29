import mongoose from 'mongoose';
import { DirectRelationship, InverseRelationship, IndirectRelationship, SelfRelationship } from '../src/models/Relationship.js';
import { logger } from '../src/utils/logger.js';

async function migrateRelationships() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/knowledge-graph', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    const db = mongoose.connection.db;
    
    // Get all relationships from the old collection
    const oldRelationships = await db.collection('relationships').find({}).toArray();
    
    logger.info('Found relationships to migrate:', { count: oldRelationships.length });
    
    // Group relationships by type
    const direct = [];
    const inverse = [];
    const indirect = [];
    const self = [];
    
    oldRelationships.forEach(rel => {
      // Convert ObjectId to string
      const relationship = {
        ...rel,
        _id: rel._id.toString()
      };
      
      switch (rel.type) {
        case 'direct':
          direct.push(relationship);
          break;
        case 'inverse':
          inverse.push(relationship);
          break;
        case 'indirect':
          indirect.push(relationship);
          break;
        case 'self':
          self.push(relationship);
          break;
        default:
          logger.warn('Unknown relationship type:', { relationship });
      }
    });
    
    logger.info('Grouped relationships:', {
      direct: direct.length,
      inverse: inverse.length,
      indirect: indirect.length,
      self: self.length
    });
    
    // Insert relationships into new collections
    if (direct.length > 0) {
      await DirectRelationship.insertMany(direct);
      logger.info('Migrated direct relationships');
    }
    
    if (inverse.length > 0) {
      await InverseRelationship.insertMany(inverse);
      logger.info('Migrated inverse relationships');
    }
    
    if (indirect.length > 0) {
      await IndirectRelationship.insertMany(indirect);
      logger.info('Migrated indirect relationships');
    }
    
    if (self.length > 0) {
      await SelfRelationship.insertMany(self);
      logger.info('Migrated self relationships');
    }
    
    // Drop the old collection
    await db.collection('relationships').drop();
    logger.info('Dropped old relationships collection');
    
    logger.info('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateRelationships(); 