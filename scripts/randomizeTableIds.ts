import { MongoClient } from 'mongodb';

async function randomizeTableIds() {
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

randomizeTableIds().catch(console.error); 