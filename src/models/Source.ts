import mongoose from 'mongoose';

const sourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    default: ''
  },
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
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      return ret;
    }
  }
});

// Index for faster queries
sourceSchema.index({ name: 1 });

const Source = mongoose.models.Source || mongoose.model('Source', sourceSchema);

export default Source; 