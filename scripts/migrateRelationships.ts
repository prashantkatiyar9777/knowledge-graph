import mongoose from 'mongoose';
import { DirectRelationship, InverseRelationship, IndirectRelationship, SelfRelationship } from '../src/models/Relationship';
import { logger } from '../src/utils/logger';

interface RelationshipDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  type: 'direct' | 'inverse' | 'indirect' | 'self';
  description?: string;
  alternativeNames?: string[];
  fromTable: string;
  fromField: string;
  toTable: string;
  toField: string;
  inKnowledgeGraph: boolean;
  intermediateTable?: string;
  intermediateFromField?: string;
  intermediateToField?: string;
  createdAt: Date;
  updatedAt: Date;
}

type RelationshipInput = Omit<RelationshipDocument, '_id'> & {
  _id: string;
};

function validateRelationship(rel: RelationshipDocument): boolean {
  if (!rel.name || !rel.type || !rel.fromTable || !rel.fromField || !rel.toTable || !rel.toField) {
    logger.warn('Missing required fields in relationship:', { relationship: JSON.parse(JSON.stringify(rel)) });
    return false;
  }
  return true;
}

async function migrateRelationships() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/knowledge-graph');
    
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Failed to get MongoDB database instance');
    }

    // Drop new collections if they exist
    const collections = await db.listCollections().toArray();
    const collectionsToDrop = ['directrelationships', 'inverserelationships', 'indirectrelationships', 'selfrelationships'];
    
    for (const collection of collectionsToDrop) {
      if (collections.some(col => col.name === collection)) {
        await db.collection(collection).drop();
        logger.info(`Dropped ${collection} collection`);
      }
    }
    
    // Get all relationships from the old collection
    const oldRelationships = await db.collection<RelationshipDocument>('relationships').find({}).toArray();
    
    logger.info('Found relationships to migrate:', { count: oldRelationships.length });
    
    // Group relationships by type
    const direct: RelationshipInput[] = [];
    const inverse: RelationshipInput[] = [];
    const indirect: RelationshipInput[] = [];
    const self: RelationshipInput[] = [];
    
    oldRelationships.forEach(rel => {
      // Convert ObjectId to string and ensure type safety
      if (!rel || typeof rel !== 'object') {
        logger.warn('Invalid relationship document:', { relationship: JSON.parse(JSON.stringify(rel)) });
        return;
      }

      // Validate required fields
      if (!validateRelationship(rel)) {
        return;
      }
      
      const relationship = {
        ...rel,
        _id: rel._id?.toString() || new mongoose.Types.ObjectId().toString(),
        // Ensure required fields have default values if missing
        name: rel.name || 'Unnamed Relationship',
        fromTable: rel.fromTable || 'Unknown',
        fromField: rel.fromField || 'Unknown',
        toTable: rel.toTable || 'Unknown',
        toField: rel.toField || 'Unknown',
        inKnowledgeGraph: rel.inKnowledgeGraph || false,
        description: rel.description || '',
        alternativeNames: rel.alternativeNames || []
      } as RelationshipInput;
      
      switch (relationship.type) {
        case 'direct':
          direct.push(relationship);
          break;
        case 'inverse':
          inverse.push(relationship);
          break;
        case 'indirect':
          // For indirect relationships, ensure intermediate fields are present
          if (rel.intermediateTable && rel.intermediateFromField && rel.intermediateToField) {
            indirect.push(relationship);
          } else {
            logger.warn('Skipping indirect relationship due to missing intermediate fields:', { relationship: JSON.parse(JSON.stringify(rel)) });
          }
          break;
        case 'self':
          // For self relationships, toTable should be the same as fromTable
          self.push({
            ...relationship,
            toTable: relationship.fromTable
          });
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
    
    try {
      // Drop the old collection if it exists
      const relationshipsExists = collections.some(col => col.name === 'relationships');
      
      if (relationshipsExists) {
        await db.collection('relationships').drop();
        logger.info('Dropped old relationships collection');
      } else {
        logger.warn('Collection relationships does not exist, skipping drop');
      }
    } catch (error) {
      logger.error('Failed to drop old collection:', error);
      // Continue with the migration even if drop fails
    }
    
    logger.info('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateRelationships();
