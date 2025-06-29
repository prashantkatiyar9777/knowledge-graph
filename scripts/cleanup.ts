import { config } from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../src/lib/mongodb.js';

// Load environment variables from .env file
config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/knowledge_graph';

async function cleanup() {
  try {
    console.log('Connecting to MongoDB...');
    console.log('Using connection string:', MONGODB_URI.replace(/(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@/, '$1****:****@'));
    
    const connection = await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully!');

    if (!connection.connection.db) {
      throw new Error('Database connection not established');
    }

    // Get all collections
    const collections = await connection.connection.db.collections();

    // Drop each collection
    for (const collection of collections) {
      console.log(`Dropping collection: ${collection.collectionName}`);
      await collection.drop().catch(err => {
        if (err.code === 26) {
          console.log(`Collection ${collection.collectionName} does not exist.`);
        } else {
          throw err;
        }
      });
    }

    console.log('All collections dropped successfully!');
    process.exit(0);
  } catch (error: any) {
    console.error('Cleanup failed:', error);
    process.exit(1);
  }
}

cleanup(); 