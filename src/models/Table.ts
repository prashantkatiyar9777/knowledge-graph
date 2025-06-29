import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  serialNumber: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes
tableSchema.index({ name: 1 });
tableSchema.index({ serialNumber: 1 });

const Table = mongoose.models.Table || mongoose.model('Table', tableSchema);

export default Table; 