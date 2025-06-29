import { config } from 'dotenv';
import { mockTableData, mockAuditLogs, mockSyncJobs } from '../src/utils/mockData.js';
import { MongoDBService } from '../src/services/mongodb.service.js';
import mongoose from 'mongoose';
import { TableData } from '../src/types/index.js';

// Load environment variables from .env file
config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/knowledge_graph';

async function seedMongoDB() {
  try {
    console.log('Connecting to MongoDB...');
    console.log('Using connection string:', MONGODB_URI.replace(/(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@/, '$1****:****@'));
    
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully!');

    // First, create sources from unique source names in mockTableData
    console.log('\nSeeding sources...');
    const uniqueSources = [...new Set(mockTableData.map((table: TableData) => table.source))];
    for (const sourceName of uniqueSources) {
      const source = await MongoDBService.createSource({ name: sourceName });
      console.log(`Created source: ${sourceName}`);
    }

    // Get all sources to use their IDs
    const sources = await MongoDBService.getSources();

    // Create tables with proper source references
    console.log('\nSeeding tables...');
    for (const tableData of mockTableData) {
      const sourceDoc = sources.find(s => s.name === tableData.source);
      if (!sourceDoc) {
        console.warn(`Source not found for table: ${tableData.name}`);
        continue;
      }

      const table = await MongoDBService.createTable({
        name: tableData.name,
        alternativeNames: tableData.alternateNames,
        sourceId: sourceDoc._id.toString(),
        description: tableData.description,
        fieldsCount: tableData.fields,
        recordsCount: tableData.records,
        kgRecordsCount: tableData.kgRecords || 0,
        kgStatus: tableData.kgStatus === 'mapped' ? 'Added to KG' :
                 tableData.kgStatus === 'partially_mapped' ? 'Partially Added' :
                 tableData.kgStatus === 'pending' ? 'Not Added' : 'Error'
      });
      console.log(`Created table: ${tableData.name}`);
    }

    // Create audit logs collection and seed data
    console.log('\nSeeding audit logs...');
    const auditLogModel = await MongoDBService.createAuditLogs(mockAuditLogs);
    console.log(`Created ${mockAuditLogs.length} audit logs`);

    // Create sync jobs collection and seed data
    console.log('\nSeeding sync jobs...');
    const syncJobModel = await MongoDBService.createSyncJobs(mockSyncJobs);
    console.log(`Created ${mockSyncJobs.length} sync jobs`);

    console.log('\nSeeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedMongoDB(); 