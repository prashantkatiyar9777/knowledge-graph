import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectToMongoDB } from './src/lib/mongodb';
import { logger } from './src/utils/logger';
import Table from './src/models/Table';
import Source from './src/models/Source';
import AuditLog from './src/models/AuditLog';
import SyncJob from './src/models/SyncJob';
import ValueField from './src/models/ValueField';
import { DirectRelationship, InverseRelationship, IndirectRelationship, SelfRelationship } from './src/models/Relationship';

// Import routers
import fieldsRouter from './src/pages/api/fields';
import tablesRouter from './src/pages/api/tables';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize MongoDB connection
connectToMongoDB().catch((err) => {
  logger.error('Failed to connect to MongoDB on startup:', { error: err.message });
  process.exit(1);
});

// Health check endpoint
app.get('/api/health', async (_req, res) => {
  try {
    const mongoose = await connectToMongoDB();
    const isConnected = mongoose.connection.readyState === 1;
    
    res.json({
      status: isConnected ? 'ok' : 'error',
      mongodb: isConnected ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      ...(isConnected ? {} : { error: 'MongoDB is not connected' })
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Health check failed:', { error: error.message });
    res.status(500).json({
      status: 'error',
      mongodb: 'disconnected',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Use routers
app.use('/api/fields', fieldsRouter);
app.use('/api/tables', tablesRouter);

// Direct API routes
app.get('/api/sources', async (_req, res) => {
  try {
    const sources = await Source.find();
    res.json(sources);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to fetch sources:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/audit-logs', async (_req, res) => {
  try {
    const logs = await AuditLog.find();
    res.json(logs);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to fetch audit logs:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/sync-jobs', async (_req, res) => {
  try {
    const jobs = await SyncJob.find();
    res.json(jobs);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to fetch sync jobs:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/relationships', async (_req, res) => {
  try {
    logger.info('Fetching relationships...');
    await connectToMongoDB();

    // Use Mongoose models with explicit collection names
    const direct = await DirectRelationship.find()
      .populate('tableName')
      .populate('mappedTo')
      .exec();
    logger.info('Direct relationships:', { count: direct.length });

    const inverse = await InverseRelationship.find().exec();
    logger.info('Inverse relationships:', { count: inverse.length });

    const indirect = await IndirectRelationship.find().exec();
    logger.info('Indirect relationships:', { count: indirect.length });

    const self = await SelfRelationship.find().exec();
    logger.info('Self relationships:', { count: self.length });

    res.json({
      direct,
      inverse,
      indirect,
      self
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to fetch relationships:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error:', { error: err.message, stack: err.stack });
  res.status(500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Starting graceful shutdown...');
  try {
    const mongoose = (await import('mongoose')).default;
    await mongoose.disconnect();
    logger.info('MongoDB disconnected through app termination');
    process.exit(0);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Error during graceful shutdown:', { error: error.message });
    process.exit(1);
  }
});

// Export for Vercel
export default app; 