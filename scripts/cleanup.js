import mongoose from 'mongoose';
import 'dotenv/config';

async function cleanup() {
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

    // Drop collections if they exist
    const collections = await db.listCollections().toArray();
    const collectionsToDrop = ['sources', 'tables', 'directrelationships', 'inverserelationships', 'indirectrelationships', 'selfrelationships'];
    
    for (const collection of collectionsToDrop) {
      if (collections.some(col => col.name === collection)) {
        await db.collection(collection).drop();
        console.log(`Dropped ${collection} collection`);
      } else {
        console.log(`Collection ${collection} does not exist`);
      }
    }

    console.log('Cleanup completed successfully');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Cleanup failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

cleanup(); 