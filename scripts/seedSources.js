import mongoose from 'mongoose';
import 'dotenv/config';

async function seedSources() {
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

    // Sources to create
    const sources = [
      {
        name: 'EAM',
        description: 'Enterprise Asset Management System',
        type: 'system',
        status: 'active',
        inKnowledgeGraph: true
      }
    ];

    // Insert sources
    const result = await db.collection('sources').insertMany(sources);
    console.log(`Created ${result.insertedCount} sources`);
    
    // Return the created source IDs for use in tables
    const sourceIds = Object.values(result.insertedIds);
    console.log('Source IDs:', sourceIds);

    console.log('Sources created successfully');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    return sourceIds;
  } catch (error) {
    console.error('Seeding failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Export for use in other scripts
export { seedSources }; 