import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectToMongoDB } from './src/lib/mongodb.js';
import Table from './src/models/Table.js';
import Source from './src/models/Source.js';
import AuditLog from './src/models/AuditLog.js';
import SyncJob from './src/models/SyncJob.js';
import { z } from 'zod';
import { validate } from './src/middleware/validation.js';
import { handleError, AppError } from './src/utils/errors.js';
import { logger } from './src/utils/logger.js';
import ValueField from './src/models/ValueField.js';
import Relationship from './src/models/Relationship.js';

const app = express();

app.use(cors());
app.use(express.json());

// Initialize MongoDB connection
let isConnected = false;
const initializeMongoDB = async () => {
  try {
    await connectToMongoDB();
    isConnected = true;
    logger.info('MongoDB connection initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize MongoDB connection:', error);
    throw error;
  }
};

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check MongoDB connection
    const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.json({
      status: 'ok',
      mongodb: mongoStatus,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      error: 'Health check failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Middleware to check MongoDB connection
const checkMongoDBConnection = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!isConnected) {
    try {
      await initializeMongoDB();
    } catch (error) {
      return res.status(500).json({ error: 'Database connection error. Please try again later.' });
    }
  }
  next();
};

// Apply MongoDB connection check middleware to all API routes except health check
app.use('/api', (req, res, next) => {
  if (req.path === '/health') {
    return next();
  }
  return checkMongoDBConnection(req, res, next);
});

// API Routes
app.get('/api/tables', async (req, res) => {
  try {
    const tables = await Table.find().sort({ serialNumber: 1 });
    res.json(tables);
  } catch (error) {
    logger.error('Error fetching tables:', error);
    res.status(500).json({ error: 'Failed to fetch tables', details: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

app.get('/api/sources', async (req, res) => {
  try {
    const sources = await Source.find();
    res.json(sources);
  } catch (error) {
    logger.error('Error fetching sources:', error);
    res.status(500).json({ error: 'Failed to fetch sources', details: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

app.get('/api/audit-logs', async (req, res) => {
  try {
    const auditLogs = await AuditLog.find().sort({ timestamp: -1 });
    res.json(auditLogs);
  } catch (error) {
    logger.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs', details: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

app.get('/api/sync-jobs', async (req, res) => {
  try {
    const syncJobs = await SyncJob.find().sort({ startTime: -1 });
    res.json(syncJobs);
  } catch (error) {
    logger.error('Error fetching sync jobs:', error);
    res.status(500).json({ error: 'Failed to fetch sync jobs', details: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

// Initialize MongoDB connection for production
if (process.env.NODE_ENV === 'production') {
  initializeMongoDB().catch((error) => {
    logger.error('Failed to initialize MongoDB in production:', error);
    process.exit(1);
  });
}

// Export for Vercel
export default app; 