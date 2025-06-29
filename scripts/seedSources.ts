import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Source from '../src/models/Source';
import { logger } from '../src/utils/logger';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

const sources = [
  {
    name: 'Self',
    description: 'Internal system data source',
    type: 'DATABASE',
    config: {
      type: 'internal'
    }
  },
  {
    name: 'SAP',
    description: 'SAP ERP system integration',
    type: 'API',
    config: {
      type: 'erp',
      system: 'sap'
    }
  },
  {
    name: 'Maximo',
    description: 'IBM Maximo Asset Management system',
    type: 'API',
    config: {
      type: 'asset_management',
      system: 'maximo'
    }
  },
  {
    name: 'Pronto',
    description: 'Pronto ERP system',
    type: 'API',
    config: {
      type: 'erp',
      system: 'pronto'
    }
  },
  {
    name: 'Salesforce',
    description: 'Salesforce CRM integration',
    type: 'API',
    config: {
      type: 'crm',
      system: 'salesforce'
    }
  }
] as const;

async function seedSources() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    logger.info('Connected to MongoDB');

    // Clear existing sources
    await Source.deleteMany({});
    logger.info('Cleared existing sources');

    // Insert new sources
    const result = await Source.insertMany(sources);
    logger.info(`Added ${result.length} sources`);

    // Close connection
    await mongoose.connection.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error seeding sources:', error);
    process.exit(1);
  }
}

seedSources(); 