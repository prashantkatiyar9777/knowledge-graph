import mongoose from 'mongoose';

const sourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    required: true,
    enum: ['API', 'DATABASE']
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
sourceSchema.index({ name: 1 });

const Source = mongoose.model('Source', sourceSchema);

export default Source; 