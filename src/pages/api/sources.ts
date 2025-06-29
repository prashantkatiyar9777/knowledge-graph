import express from 'express';
import Source from '../../models/Source.js';
import { logger } from '../../utils/logger.js';

const router = express.Router();

// Get all sources
router.get('/', async (_req, res) => {
  try {
    const sources = await Source.find().exec();
    res.json(sources);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to fetch sources:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

export default router; 