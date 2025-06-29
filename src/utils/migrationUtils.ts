import { createClient } from '@supabase/supabase-js';
import { MongoDBService } from '../services/mongodb.service';
import connectDB from '../lib/mongodb';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function migrateToMongoDB() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');

    // 1. Migrate Sources
    console.log('Migrating sources...');
    const { data: sources, error: sourcesError } = await supabase
      .from('sources')
      .select('*');

    if (sourcesError) throw sourcesError;

    for (const source of sources || []) {
      await MongoDBService.createSource({
        name: source.name,
      });
    }
    console.log(`Migrated ${sources?.length || 0} sources`);

    // 2. Migrate Tables
    console.log('Migrating tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('tables')
      .select('*');

    if (tablesError) throw tablesError;

    for (const table of tables || []) {
      // Find corresponding source in MongoDB
      const sourceData = sources?.find(s => s.id === table.source_id);
      if (!sourceData) continue;

      const mongoSource = await MongoDBService.getSources();
      const matchingSource = mongoSource.find(s => s.name === sourceData.name);
      if (!matchingSource) continue;

      await MongoDBService.createTable({
        name: table.name,
        alternativeNames: table.alternative_names || [],
        sourceId: matchingSource._id.toString(),
        description: table.description,
      });
    }
    console.log(`Migrated ${tables?.length || 0} tables`);

    // 3. Migrate Value Fields
    console.log('Migrating value fields...');
    const { data: fields, error: fieldsError } = await supabase
      .from('value_fields')
      .select('*');

    if (fieldsError) throw fieldsError;

    for (const field of fields || []) {
      // Find corresponding table in MongoDB
      const tableData = tables?.find(t => t.id === field.table_id);
      if (!tableData) continue;

      const mongoTables = await MongoDBService.getTables();
      const matchingTable = mongoTables.find(t => t.name === tableData.name);
      if (!matchingTable) continue;

      await MongoDBService.createValueField({
        name: field.name,
        tableId: matchingTable._id.toString(),
        type: field.type,
        alternativeNames: field.alternative_names || [],
        description: field.description,
      });
    }
    console.log(`Migrated ${fields?.length || 0} value fields`);

    console.log('Migration completed successfully!');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
} 