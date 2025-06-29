// Migration script to move fields from fields collection to valuefields collection

// Connect to MongoDB
const { MongoClient, ObjectId } = require('mongodb');

async function migrate() {
  const uri = "mongodb+srv://prashantkatiyar9777:mzR6KeWEpGU1jq4D@cluster0.y2rgtnx.mongodb.net/knowledge-graph";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('knowledge-graph');
    
    // First create the necessary tables if they don't exist
    const tables = [
      {
        name: "EquipmentMaster",
        description: "Master data for equipment",
        source: "68614ac08241da6339fbb9b8" // Using the same source as other tables
      },
      {
        name: "FunctionalLocationMaster", 
        description: "Master data for functional locations",
        source: "68614ac08241da6339fbb9b8"
      }
    ];

    console.log('Creating tables...');
    const tableIds = {};
    for (const table of tables) {
      const existingTable = await db.collection('tables').findOne({ name: table.name });
      if (!existingTable) {
        const result = await db.collection('tables').insertOne({
          ...table,
          serialNumber: await db.collection('tables').countDocuments() + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        tableIds[table.name] = result.insertedId;
        console.log(`Created table ${table.name} with ID ${result.insertedId}`);
      } else {
        tableIds[table.name] = existingTable._id;
        console.log(`Table ${table.name} already exists with ID ${existingTable._id}`);
      }
    }

    // Now migrate the fields
    console.log('\nMigrating fields...');
    const fields = await db.collection('fields').find({}).toArray();
    
    for (const field of fields) {
      const tableId = tableIds[field.tableName];
      if (!tableId) {
        console.log(`Warning: Could not find table ID for ${field.tableName}, skipping field ${field.name}`);
        continue;
      }

      // Check if field already exists in valuefields
      const existingField = await db.collection('valuefields').findOne({
        name: field.name,
        tableId: tableId
      });

      if (existingField) {
        console.log(`Field ${field.name} already exists in valuefields collection, skipping`);
        continue;
      }

      // Create new field in valuefields collection
      const newField = {
        _id: field._id, // Preserve original ID
        name: field.name,
        tableId: tableId,
        type: field.type,
        alternativeNames: field.alternativeNames || [],
        description: field.description || "",
        kgStatus: field.inKnowledgeGraph ? "Added" : "Not Added",
        createdAt: field.createdAt || new Date(),
        updatedAt: new Date(),
        __v: 0
      };

      await db.collection('valuefields').insertOne(newField);
      console.log(`Migrated field ${field.name} to valuefields collection`);
    }

    console.log('\nMigration completed successfully');

  } catch (err) {
    console.error('Error during migration:', err);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

migrate().catch(console.error);