import express from 'express';
import ValueField from '../../models/ValueField.js';
import { logger } from '../../utils/logger.js';

const router = express.Router();

// Get all fields
router.get('/', async (_req, res) => {
  try {
    const fields = await ValueField.find()
      .populate('tableId')
      .lean()
      .exec();

    logger.info('Fetched fields with table references:', { 
      fieldsCount: fields.length,
      sampleField: fields[0] ? {
        name: fields[0].name,
        table: fields[0].tableId ? {
          id: fields[0].tableId._id,
          name: (fields[0].tableId as any).name
        } : null
      } : null
    });

    res.json(fields);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to fetch fields:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Update a field
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedField = await ValueField.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    ).populate('tableId');

    if (!updatedField) {
      return res.status(404).json({ error: 'Field not found' });
    }

    res.json(updatedField);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to update field:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

export default router; 