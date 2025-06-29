import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Table from '../src/models/Table';
import Source from '../src/models/Source';
import { logger } from '../src/utils/logger';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

async function verifyTableSources() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    logger.info('Connected to MongoDB');

    // Get all tables
    const tables = await Table.find().lean();
    logger.info(`Found ${tables.length} tables`);

    // Get the Self source
    const selfSource = await Source.findOne({ name: 'Self' });
    if (!selfSource) {
      throw new Error('Self source not found. Please run seedSources.ts first.');
    }

    // Check each table
    let tablesWithoutSource = 0;
    let tablesWithInvalidSource = 0;
    let tablesFixed = 0;

    for (const table of tables) {
      if (!table.source) {
        tablesWithoutSource++;
        await Table.updateOne(
          { _id: table._id },
          { $set: { source: selfSource._id } }
        );
        tablesFixed++;
      } else {
        // Verify if the source exists
        const sourceExists = await Source.findById(table.source);
        if (!sourceExists) {
          tablesWithInvalidSource++;
          await Table.updateOne(
            { _id: table._id },
            { $set: { source: selfSource._id } }
          );
          tablesFixed++;
        }
      }
    }

    logger.info('Table source verification complete:', {
      totalTables: tables.length,
      tablesWithoutSource,
      tablesWithInvalidSource,
      tablesFixed
    });

    // Sample verification
    const sampleTable = await Table.findOne().populate('source');
    logger.info('Sample table after fixes:', {
      name: sampleTable?.name,
      source: sampleTable?.source,
      hasSource: !!sampleTable?.source,
      sourceId: sampleTable?.source?._id
    });

    // Close connection
    await mongoose.connection.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error verifying table sources:', error);
    process.exit(1);
  }
}

verifyTableSources(); 