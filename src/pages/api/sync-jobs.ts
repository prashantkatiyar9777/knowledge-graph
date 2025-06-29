import express from 'express';
import { MongoDBService } from '../../services/mongodb.service.js';
import { logger } from '../../utils/logger.js';

const router = express.Router();

// Get all sync jobs
router.get('/', async (_req, res) => {
  try {
    const syncJobs = await MongoDBService.getSyncJobs();
    res.json(syncJobs);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to fetch sync jobs:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

export default router; 