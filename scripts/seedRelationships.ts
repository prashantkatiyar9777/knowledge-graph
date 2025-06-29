import mongoose from 'mongoose';
import { DirectRelationship, InverseRelationship, IndirectRelationship, SelfRelationship } from '../src/models/Relationship';
import { logger } from '../src/utils/logger';

async function seedRelationships() {
  try {
    // Connect to MongoDB
    logger.info('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/knowledge-graph', {
      dbName: 'knowledge-graph'
    });
    logger.info('Connected to MongoDB');
    logger.info('Current database:', {
      database: mongoose.connection.db?.databaseName,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host
    });

    // Clear existing data
    logger.info('Clearing existing data...');
    await DirectRelationship.deleteMany({});
    await InverseRelationship.deleteMany({});
    await IndirectRelationship.deleteMany({});
    await SelfRelationship.deleteMany({});
    logger.info('Cleared existing data');

    // Sample direct relationships
    const directRelationships = [
      {
        name: 'ASSET_AT_LOCATION',
        description: 'Links each asset to its physical location',
        alternativeNames: ['Asset Location', 'Physical Location'],
        fromTable: 'AssetRegistry',
        fromField: 'LOCATION_ID',
        toTable: 'LocationHierarchy',
        toField: 'LOCATION_ID',
        inKnowledgeGraph: true
      },
      {
        name: 'EQUIPMENT_ASSET',
        description: 'Links equipment to its corresponding asset record',
        alternativeNames: ['Asset Equipment', 'Equipment Record'],
        fromTable: 'Equipment',
        fromField: 'ASSET_ID',
        toTable: 'AssetRegistry',
        toField: 'ASSET_ID',
        inKnowledgeGraph: true
      },
      {
        name: 'WORK_ORDER_ASSET',
        description: 'Links work orders to the asset they are performed on',
        alternativeNames: ['Asset Work Order', 'Maintenance Record'],
        fromTable: 'WorkOrders',
        fromField: 'ASSET_ID',
        toTable: 'AssetRegistry',
        toField: 'ASSET_ID',
        inKnowledgeGraph: true
      }
    ];

    // Sample inverse relationships
    const inverseRelationships = [
      {
        name: 'LOCATION_HAS_ASSETS',
        description: 'Shows all assets at a location (inverse of ASSET_AT_LOCATION)',
        alternativeNames: ['Location Assets', 'Assets at Location'],
        fromTable: 'LocationHierarchy',
        fromField: 'LOCATION_ID',
        toTable: 'AssetRegistry',
        toField: 'LOCATION_ID',
        inKnowledgeGraph: true
      },
      {
        name: 'ASSET_HAS_EQUIPMENT',
        description: 'Shows all equipment for an asset (inverse of EQUIPMENT_ASSET)',
        alternativeNames: ['Asset Equipment List', 'Equipment under Asset'],
        fromTable: 'AssetRegistry',
        fromField: 'ASSET_ID',
        toTable: 'Equipment',
        toField: 'ASSET_ID',
        inKnowledgeGraph: true
      }
    ];

    // Sample indirect relationships
    const indirectRelationships = [
      {
        name: 'EQUIPMENT_LOCATION',
        description: 'Links equipment to locations through asset registry',
        alternativeNames: ['Equipment Site', 'Location of Equipment'],
        fromTable: 'Equipment',
        fromField: 'ASSET_ID',
        toTable: 'LocationHierarchy',
        toField: 'LOCATION_ID',
        intermediateTable: 'AssetRegistry',
        intermediateFromField: 'ASSET_ID',
        intermediateToField: 'LOCATION_ID',
        inKnowledgeGraph: true
      },
      {
        name: 'WORK_ORDER_EQUIPMENT',
        description: 'Links work orders to equipment through asset registry',
        alternativeNames: ['Equipment Work Orders', 'Maintenance Equipment'],
        fromTable: 'WorkOrders',
        fromField: 'ASSET_ID',
        toTable: 'Equipment',
        toField: 'ASSET_ID',
        intermediateTable: 'AssetRegistry',
        intermediateFromField: 'ASSET_ID',
        intermediateToField: 'ASSET_ID',
        inKnowledgeGraph: true
      }
    ];

    // Sample self relationships
    const selfRelationships = [
      {
        name: 'RELATED_EQUIPMENT',
        description: 'Equipment that are related through common work orders',
        alternativeNames: ['Equipment Group', 'Equipment Set'],
        fromTable: 'Equipment',
        fromField: 'WORK_ORDER_ID',
        toTable: 'Equipment',
        toField: 'WORK_ORDER_ID',
        inKnowledgeGraph: true
      },
      {
        name: 'LOCATION_HIERARCHY',
        description: 'Parent-child relationship between locations',
        alternativeNames: ['Location Tree', 'Site Hierarchy'],
        fromTable: 'LocationHierarchy',
        fromField: 'PARENT_ID',
        toTable: 'LocationHierarchy',
        toField: 'LOCATION_ID',
        inKnowledgeGraph: true
      }
    ];

    // Insert new data
    await DirectRelationship.insertMany(directRelationships);
    await InverseRelationship.insertMany(inverseRelationships);
    await IndirectRelationship.insertMany(indirectRelationships);
    await SelfRelationship.insertMany(selfRelationships);

    logger.info('Successfully seeded relationships:', {
      direct: directRelationships.length,
      inverse: inverseRelationships.length,
      indirect: indirectRelationships.length,
      self: selfRelationships.length
    });

    process.exit(0);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to seed relationships:', { error: error.message });
    process.exit(1);
  }
}

seedRelationships(); 