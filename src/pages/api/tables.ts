import express from 'express';
import Table from '../../models/Table.js';
import { logger } from '../../utils/logger.js';

const router = express.Router();

// Get all tables
router.get('/', async (_req, res) => {
  try {
    const tables = await Table.find().populate('source').lean().exec();
    logger.info('Fetched tables with sources:', { 
      tablesCount: tables.length,
      sampleTable: tables[0] ? {
        name: tables[0].name,
        source: tables[0].source,
        hasSource: !!tables[0].source,
        sourceId: tables[0].source?._id
      } : null,
      sampleTableRaw: tables[0]
    });
    res.json(tables);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to fetch tables:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Update a table
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    logger.info('Updating table:', { 
      tableId: id,
      updates,
      body: req.body
    });
    
    const updatedTable = await Table.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('source').lean();

    if (!updatedTable) {
      logger.warn('Table not found for update:', { tableId: id });
      return res.status(404).json({ error: 'Table not found' });
    }

    logger.info('Successfully updated table:', { 
      tableId: id,
      updatedTable
    });

    res.json(updatedTable);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to update table:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

export default router; 