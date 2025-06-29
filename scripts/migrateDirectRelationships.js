import mongoose from 'mongoose';
import 'dotenv/config';

async function migrateDirectRelationships() {
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

    // Get all tables to create a mapping of table names to ObjectIds
    const tables = await db.collection('tables').find({}).toArray();
    const tableNameToId = {};
    tables.forEach(table => {
      tableNameToId[table.name] = table._id;
    });

    // Get all direct relationships
    const relationships = await db.collection('directrelationships').find({}).toArray();
    console.log(`Found ${relationships.length} direct relationships to migrate`);

    for (const rel of relationships) {
      const fromTableId = tableNameToId[rel.fromTable];
      const toTableId = tableNameToId[rel.toTable];
      if (!fromTableId) {
        console.warn(`Table ${rel.fromTable} not found for relationship ${rel._id}`);
        continue;
      }
      if (!toTableId) {
        console.warn(`Table ${rel.toTable} not found for relationship ${rel._id}`);
        continue;
      }

      // Create new document format
      const newDoc = {
        fieldName: rel.fromField,
        tableName: fromTableId,
        mappedTo: toTableId,
        mappedField: rel.toField,
        alternativeNames: rel.alternativeNames || [],
        description: rel.description || '',
        inKnowledgeGraph: rel.inKnowledgeGraph || false
      };

      // Update the document
      await db.collection('directrelationships').updateOne(
        { _id: rel._id },
        { $set: newDoc }
      );

      // Remove old fields
      await db.collection('directrelationships').updateOne(
        { _id: rel._id },
        { 
          $unset: { 
            name: "",
            type: "",
            fromTable: "",
            fromField: "",
            toTable: "",
            toField: "",
            createdAt: "",
            updatedAt: "",
            __v: ""
          }
        }
      );
    }

    console.log('Migration completed successfully');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

migrateDirectRelationships(); 