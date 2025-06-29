import mongoose, { Schema, Document } from 'mongoose';
import { Relationship as IRelationship } from '../types';

const RelationshipSchema = new Schema({
  name: { type: String, required: true },
  alternativeNames: [String],
  description: String,
  type: {
    type: String,
    enum: ['direct', 'inverse', 'indirect', 'self'],
    required: true
  },
  sourceTable: {
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true }
  },
  targetTable: {
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true }
  },
  sourceField: {
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true }
  },
  targetField: {
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true }
  },
  tablePath: [String],
  primaryTable: String,
  referenceTable: String,
  inKnowledgeGraph: { type: Boolean, default: false },
  kgStatus: {
    type: String,
    enum: ['Added to KG', 'Not Added'],
    default: 'Not Added'
  }
}, {
  timestamps: true
});

export default mongoose.model<IRelationship & Document>('Relationship', RelationshipSchema); 