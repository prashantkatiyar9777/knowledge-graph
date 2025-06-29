import express from 'express';
import cors from 'cors';
import { connectToMongoDB } from './src/lib/mongodb';
import { Table } from './src/models/Table';
import { Source } from './src/models/Source';
import { AuditLog } from './src/models/AuditLog';
import { SyncJob } from './src/models/SyncJob';
import { z } from 'zod';
import { validate } from './src/middleware/validation.js';
import { handleError, AppError } from './src/utils/errors.js';
import { logger } from './src/utils/logger.js';
import ValueField from './src/models/ValueField.js';
import Relationship from './src/models/Relationship.js';

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectToMongoDB();

// API Routes
app.get('/api/tables', async (req, res) => {
  try {
    const tables = await Table.find().sort({ serialNumber: 1 });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
});

app.get('/api/sources', async (req, res) => {
  try {
    const sources = await Source.find();
    res.json(sources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sources' });
  }
});

app.get('/api/audit-logs', async (req, res) => {
  try {
    const auditLogs = await AuditLog.find().sort({ timestamp: -1 });
    res.json(auditLogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

app.get('/api/sync-jobs', async (req, res) => {
  try {
    const syncJobs = await SyncJob.find().sort({ startTime: -1 });
    res.json(syncJobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sync jobs' });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
export default app; 