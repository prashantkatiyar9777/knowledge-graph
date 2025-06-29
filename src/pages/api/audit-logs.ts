import express from 'express';
import { MongoDBService } from '../../services/mongodb.service.js';
import { logger } from '../../utils/logger.js';

const router = express.Router();

// Get all audit logs
router.get('/', async (_req, res) => {
  try {
    const auditLogs = await MongoDBService.getAuditLogs();
    res.json(auditLogs);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to fetch audit logs:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

export default router; 