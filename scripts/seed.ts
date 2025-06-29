import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Source from '../src/models/Source.js';
import Table from '../src/models/Table.js';
import AuditLog from '../src/models/AuditLog.js';
import SyncJob from '../src/models/SyncJob.js';
import { logger } from '../src/utils/logger.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  logger.error('MONGODB_URI not found in environment variables');
  process.exit(1);
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
];

async function seedSources() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || '');
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

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Source.deleteMany({}),
      Table.deleteMany({}),
      AuditLog.deleteMany({}),
      SyncJob.deleteMany({})
    ]);
    logger.info('Cleared existing data');

    // Create sources
    const sources = await Source.create([
      {
        name: 'CRM System',
        type: 'API',
        config: {
          baseUrl: 'https://api.crm.example.com',
          apiKey: 'sample-key-1'
        }
      },
      {
        name: 'ERP Database',
        type: 'DATABASE',
        config: {
          host: 'db.erp.example.com',
          port: 5432,
          database: 'erp_prod'
        }
      },
      {
        name: 'Marketing Platform',
        type: 'API',
        config: {
          baseUrl: 'https://api.marketing.example.com',
          apiKey: 'sample-key-2'
        }
      }
    ]);
    logger.info(`Created ${sources.length} sources`);

    // Create tables for each source
    const tables = await Table.create([
      {
        name: 'Customers',
        sourceId: sources[0]._id,
        schema: {
          fields: ['id', 'name', 'email', 'phone', 'created_at']
        },
        metadata: {
          primaryKey: 'id',
          lastSync: new Date()
        }
      },
      {
        name: 'Orders',
        sourceId: sources[0]._id,
        schema: {
          fields: ['id', 'customer_id', 'total', 'status', 'created_at']
        },
        metadata: {
          primaryKey: 'id',
          lastSync: new Date()
        }
      },
      {
        name: 'Products',
        sourceId: sources[1]._id,
        schema: {
          fields: ['id', 'name', 'price', 'stock', 'category']
        },
        metadata: {
          primaryKey: 'id',
          lastSync: new Date()
        }
      },
      {
        name: 'Campaigns',
        sourceId: sources[2]._id,
        schema: {
          fields: ['id', 'name', 'status', 'budget', 'start_date', 'end_date']
        },
        metadata: {
          primaryKey: 'id',
          lastSync: new Date()
        }
      }
    ]);
    logger.info(`Created ${tables.length} tables`);

    // Create audit logs
    const auditLogs = await AuditLog.create([
      {
        action: 'CREATE',
        entityType: 'SOURCE',
        entityId: sources[0]._id,
        changes: { name: 'CRM System', type: 'API' },
        performedBy: 'system'
      },
      {
        action: 'CREATE',
        entityType: 'TABLE',
        entityId: tables[0]._id,
        changes: { name: 'Customers', sourceId: sources[0]._id },
        performedBy: 'system'
      }
    ]);
    logger.info(`Created ${auditLogs.length} audit logs`);

    // Create sync jobs
    const syncJobs = await SyncJob.create([
      {
        sourceId: sources[0]._id,
        status: 'COMPLETED',
        startedAt: new Date(Date.now() - 3600000),
        completedAt: new Date(),
        progress: 100,
        details: {
          recordsProcessed: 1000,
          recordsSuccess: 998,
          recordsFailed: 2
        }
      },
      {
        sourceId: sources[1]._id,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
        progress: 45,
        details: {
          recordsProcessed: 500,
          recordsSuccess: 500,
          recordsFailed: 0
        }
      }
    ]);
    logger.info(`Created ${syncJobs.length} sync jobs`);

    logger.info('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedSources();
seed(); 