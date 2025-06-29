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
  alternativeNames: {
    type: [String],
    default: []
  },
  source: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Source',
    required: true,
    autopopulate: true
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
tableSchema.index({ serialNumber: 1 });
tableSchema.index({ source: 1 });

// Always populate source field
tableSchema.pre('find', function() {
  this.populate('source');
});

tableSchema.pre('findOne', function() {
  this.populate('source');
});

const Table = mongoose.models.Table || mongoose.model('Table', tableSchema);

export default Table; 