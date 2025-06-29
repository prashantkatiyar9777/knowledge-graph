import mongoose from 'mongoose';
import 'dotenv/config';
import { seedSources } from './seedSources.js';

async function seedTables() {
  try {
    // First seed sources and get the source ID
    const sourceIds = await seedSources();
    const eamSourceId = sourceIds[0]; // Get the EAM source ID

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

    // Tables to create
    const tables = [
      {
        name: 'AssetRegistry',
        description: 'Registry of all assets',
        source: eamSourceId,
        inKnowledgeGraph: true
      },
      {
        name: 'LocationHierarchy',
        description: 'Hierarchy of physical locations',
        source: eamSourceId,
        inKnowledgeGraph: true
      },
      {
        name: 'Equipment',
        description: 'Equipment details',
        source: eamSourceId,
        inKnowledgeGraph: true
      },
      {
        name: 'WorkOrders',
        description: 'Work orders for maintenance',
        source: eamSourceId,
        inKnowledgeGraph: true
      }
    ];

    // Insert tables
    const result = await db.collection('tables').insertMany(tables);
    console.log(`Created ${result.insertedCount} tables`);

    console.log('Tables created successfully');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

seedTables(); 