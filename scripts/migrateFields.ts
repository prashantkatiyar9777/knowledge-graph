import dotenv from 'dotenv';
import { connectToMongoDB } from '../src/lib/mongodb.js';
import Table from '../src/models/Table.js';
import ValueField from '../src/models/ValueField.js';
import { logger } from '../src/utils/logger.js';
import mongoose from 'mongoose';

dotenv.config();

// Map old table names to new table names
const TABLE_NAME_MAP: Record<string, string> = {
  'EquipmentMaster': 'Asset', // Based on the field having equipment tag, this is likely an asset
  'FunctionalLocationMaster': 'AlFunctionalLocation', // Based on the available tables
  // Add more mappings as needed
};

async function migrateFields() {
  try {
    // Connect to MongoDB
    const mongoose = await connectToMongoDB();
    console.log('Connected to MongoDB');

    // Get all fields
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }
    const fields = await db.collection('fields').find().toArray() as any[];
    console.log(`Found ${fields.length} fields to migrate`);

    // Get all tables with a name index
    const tables = await Table.find().lean() as any[];
    const tablesByName = new Map(tables.map(table => [table.name, table]));
    console.log(`Found ${tables.length} tables for reference`);
    console.log('Available tables:', Array.from(tablesByName.keys()));

    // Log table name mapping
    console.log('Using table name mapping:', TABLE_NAME_MAP);

    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const mappingResults: Record<string, string> = {};

    // Clear existing valuefields collection
    await db.collection('valuefields').deleteMany({});
    console.log('Cleared existing valuefields collection');

    // Migrate each field
    for (const field of fields) {
      try {
        console.log(`\nProcessing field: ${field.name} (${field.tableName})`);
        console.log('Original field:', JSON.stringify(field, null, 2));

        // Try to find the table using the mapping or the original name
        const mappedTableName = TABLE_NAME_MAP[field.tableName] || field.tableName;
        console.log(`Mapped table name: ${mappedTableName}`);
        let table = tablesByName.get(mappedTableName);

        if (!table) {
          console.log(`No exact match found for ${mappedTableName}, trying similar names...`);
          // If no exact match, try to find a similar table name
          const similarTableName = Array.from(tablesByName.keys()).find(name => 
            name.toLowerCase().includes(field.tableName.toLowerCase()) ||
            field.tableName.toLowerCase().includes(name.toLowerCase())
          );
          
          if (similarTableName) {
            table = tablesByName.get(similarTableName);
            console.log(`Found similar table: ${similarTableName}`);
            mappingResults[field.tableName] = similarTableName;
          }
        } else {
          console.log(`Found exact match: ${mappedTableName}`);
          mappingResults[field.tableName] = mappedTableName;
        }

        if (!table) {
          console.log(`No table found for "${field.tableName}" (mapped to "${mappedTableName}")`);
          skippedCount++;
          continue;
        }

        console.log(`Using table: ${table.name} (${table._id})`);

        // Create the field document with the original _id
        const newField = {
          _id: new mongoose.Types.ObjectId(field._id.toString()),
          name: field.name,
          tableId: new mongoose.Types.ObjectId(table._id.toString()),
          type: field.type,
          alternativeNames: field.alternativeNames || [],
          description: field.description || '',
          kgStatus: field.inKnowledgeGraph ? 'Added to KG' : 'Not Added',
          createdAt: new Date(field.createdAt),
          updatedAt: new Date(field.updatedAt)
        };

        console.log('New field to insert:', JSON.stringify(newField, null, 2));

        // Insert the field directly into the collection
        await db.collection('valuefields').insertOne(newField);

        console.log('Created field:', {
          id: newField._id.toString(),
          name: newField.name,
          tableId: newField.tableId.toString()
        });

        migratedCount++;
        if (migratedCount % 100 === 0) {
          console.log(`Migrated ${migratedCount} fields...`);
        }
      } catch (error) {
        console.error(`Error migrating field "${field.name}":`, error);
        errorCount++;
      }
    }

    console.log('\nField migration complete:', {
      total: fields.length,
      migrated: migratedCount,
      skipped: skippedCount,
      errors: errorCount,
      mappingResults
    });

    // Sample verification
    const sampleField = await ValueField.findOne().populate('tableId').lean() as any;
    if (sampleField) {
      console.log('\nSample field after migration:', {
        name: sampleField.name,
        table: {
          id: sampleField.tableId?._id,
          name: sampleField.tableId?.name
        }
      });
    }

    // Close connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error during field migration:', error);
    process.exit(1);
  }
}

migrateFields(); 