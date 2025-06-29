import mongoose from 'mongoose';
import 'dotenv/config';

async function seedDirectRelationships() {
  try {
    // Connect to MongoDB using the URI from .env
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected successfully');
    
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Failed to get MongoDB database instance');
    }

    // Get table IDs
    const tables = await db.collection('tables').find({}).toArray();
    const tableNameToId = {};
    tables.forEach(table => {
      tableNameToId[table.name] = table._id;
    });

    // Direct relationships to create
    const relationships = [
      {
        fieldName: 'LOCATION_ID',
        tableName: tableNameToId['AssetRegistry'],
        mappedTo: tableNameToId['LocationHierarchy'],
        mappedField: 'LOCATION_ID',
        alternativeNames: ['Asset Location', 'Physical Location'],
        description: 'Links each asset to its physical location',
        inKnowledgeGraph: true
      },
      {
        fieldName: 'ASSET_ID',
        tableName: tableNameToId['Equipment'],
        mappedTo: tableNameToId['AssetRegistry'],
        mappedField: 'ASSET_ID',
        alternativeNames: ['Asset Equipment', 'Equipment Record'],
        description: 'Links equipment to its corresponding asset record',
        inKnowledgeGraph: true
      },
      {
        fieldName: 'ASSET_ID',
        tableName: tableNameToId['WorkOrders'],
        mappedTo: tableNameToId['AssetRegistry'],
        mappedField: 'ASSET_ID',
        alternativeNames: ['Asset Work Order', 'Maintenance Record'],
        description: 'Links work orders to the asset they are performed on',
        inKnowledgeGraph: true
      }
    ];

    // Insert relationships
    const result = await db.collection('directrelationships').insertMany(relationships);
    console.log(`Created ${result.insertedCount} direct relationships`);

    console.log('Direct relationships created successfully');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

seedDirectRelationships();