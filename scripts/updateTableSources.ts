import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Table from '../src/models/Table';
import Source from '../src/models/Source';
import { logger } from '../src/utils/logger';
import { MongoClient } from 'mongodb';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

async function updateTableSources() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    logger.info('Connected to MongoDB');

    // Get the Self source
    const selfSource = await Source.findOne({ name: 'Self' });
    if (!selfSource) {
      throw new Error('Self source not found. Please run seedSources.ts first.');
    }

    // Update all tables that don't have a source
    const result = await Table.updateMany(
      { source: { $exists: false } },
      { $set: { source: selfSource._id } }
    );

    logger.info(`Updated ${result.modifiedCount} tables with default source`);

    // Close connection
    await mongoose.connection.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error updating table sources:', error);
    process.exit(1);
  }
}

async function updateTableIds() {
  const uri = "mongodb+srv://prashantkatiyar9777:mzR6KeWEpGU1jq4D@cluster0.y2rgtnx.mongodb.net/knowledge-graph";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('knowledge-graph');
    
    // Get all tables
    const tables = await db.collection('tables').find({}).toArray();
    console.log(`Found ${tables.length} tables`);

    // Get all valuefields
    const valuefields = await db.collection('valuefields').find({}).toArray();
    console.log(`Found ${valuefields.length} valuefields`);

    // Update each valuefield with a random table ID
    for (const field of valuefields) {
      // Pick a random table
      const randomTable = tables[Math.floor(Math.random() * tables.length)];
      
      // Update the valuefield with the random table's ID
      await db.collection('valuefields').updateOne(
        { _id: field._id },
        { 
          $set: { 
            tableId: randomTable._id,
            updatedAt: new Date()
          } 
        }
      );
      
      console.log(`Updated field ${field.name} to link to table ${randomTable.name}`);
    }

    console.log('\nUpdate completed successfully');

  } catch (err) {
    console.error('Error during update:', err);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

updateTableSources();
updateTableIds().catch(console.error); 