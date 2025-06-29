import express from 'express';
import { DirectRelationship, InverseRelationship, IndirectRelationship, SelfRelationship } from '../../models/Relationship.js';
import { logger } from '../../utils/logger.js';

const router = express.Router();

// Get all relationships
router.get('/', async (_req, res) => {
  try {
    const [direct, inverse, indirect, self] = await Promise.all([
      DirectRelationship.find()
        .populate('tableName')
        .populate('mappedTo')
        .lean(),
      InverseRelationship.find().lean(),
      IndirectRelationship.find().lean(),
      SelfRelationship.find().lean()
    ]);
    
    // Return relationships grouped by type
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

// Get inverse relationships
router.get('/inverse', async (_req, res) => {
  try {
    const relationships = await InverseRelationship.find().lean();
    res.json(relationships);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to fetch inverse relationships:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Get indirect relationships
router.get('/indirect', async (_req, res) => {
  try {
    const relationships = await IndirectRelationship.find().lean();
    res.json(relationships);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to fetch indirect relationships:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Get self relationships
router.get('/self', async (_req, res) => {
  try {
    const relationships = await SelfRelationship.find().lean();
    res.json(relationships);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to fetch self relationships:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Create a direct relationship
router.post('/', async (req, res) => {
  try {
    const relationship = new DirectRelationship(req.body);
    await relationship.save();
    res.status(201).json(relationship);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to create direct relationship:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Create an inverse relationship
router.post('/inverse', async (req, res) => {
  try {
    const relationship = new InverseRelationship(req.body);
    await relationship.save();
    res.status(201).json(relationship);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to create inverse relationship:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Create an indirect relationship
router.post('/indirect', async (req, res) => {
  try {
    const relationship = new IndirectRelationship(req.body);
    await relationship.save();
    res.status(201).json(relationship);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to create indirect relationship:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Create a self relationship
router.post('/self', async (req, res) => {
  try {
    const relationship = new SelfRelationship(req.body);
    await relationship.save();
    res.status(201).json(relationship);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to create self relationship:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Update routes for each type
router.put('/:id', async (req, res) => {
  try {
    const relationship = await DirectRelationship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).lean();
    if (!relationship) {
      return res.status(404).json({ error: 'Direct relationship not found' });
    }
    res.json(relationship);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to update direct relationship:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

router.put('/inverse/:id', async (req, res) => {
  try {
    const relationship = await InverseRelationship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).lean();
    if (!relationship) {
      return res.status(404).json({ error: 'Inverse relationship not found' });
    }
    res.json(relationship);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to update inverse relationship:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

router.put('/indirect/:id', async (req, res) => {
  try {
    const relationship = await IndirectRelationship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).lean();
    if (!relationship) {
      return res.status(404).json({ error: 'Indirect relationship not found' });
    }
    res.json(relationship);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to update indirect relationship:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

router.put('/self/:id', async (req, res) => {
  try {
    const relationship = await SelfRelationship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).lean();
    if (!relationship) {
      return res.status(404).json({ error: 'Self relationship not found' });
    }
    res.json(relationship);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to update self relationship:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Delete routes for each type
router.delete('/:id', async (req, res) => {
  try {
    const relationship = await DirectRelationship.findByIdAndDelete(req.params.id);
    if (!relationship) {
      return res.status(404).json({ error: 'Direct relationship not found' });
    }
    res.status(204).send();
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to delete direct relationship:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

router.delete('/inverse/:id', async (req, res) => {
  try {
    const relationship = await InverseRelationship.findByIdAndDelete(req.params.id);
    if (!relationship) {
      return res.status(404).json({ error: 'Inverse relationship not found' });
    }
    res.status(204).send();
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to delete inverse relationship:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

router.delete('/indirect/:id', async (req, res) => {
  try {
    const relationship = await IndirectRelationship.findByIdAndDelete(req.params.id);
    if (!relationship) {
      return res.status(404).json({ error: 'Indirect relationship not found' });
    }
    res.status(204).send();
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to delete indirect relationship:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

router.delete('/self/:id', async (req, res) => {
  try {
    const relationship = await SelfRelationship.findByIdAndDelete(req.params.id);
    if (!relationship) {
      return res.status(404).json({ error: 'Self relationship not found' });
    }
    res.status(204).send();
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to delete self relationship:', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

export default router; 