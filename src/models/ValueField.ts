import mongoose from 'mongoose';

const valueFieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true
  },
  type: {
    type: String,
    required: true
  },
  alternativeNames: [{
    type: String
  }],
  description: String,
  kgStatus: {
    type: String,
    enum: ['Added to KG', 'Partially Added', 'Not Added', 'Error'],
    default: 'Not Added'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for faster queries and to ensure uniqueness within a table
valueFieldSchema.index({ name: 1, tableId: 1 }, { unique: true });

const ValueField = mongoose.models.ValueField || mongoose.model('ValueField', valueFieldSchema);

export default ValueField; 