import mongoose from 'mongoose';

const baseRelationshipSchema = {
  name: {
    type: String,
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
  fromTable: {
    type: String,
    required: true
  },
  fromField: {
    type: String,
    required: true
  },
  toTable: {
    type: String,
    required: true
  },
  toField: {
    type: String,
    required: true
  },
  inKnowledgeGraph: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
};

// Direct Relationships
const directRelationshipSchema = new mongoose.Schema({
  fieldName: {
    type: String,
    required: true
  },
  tableName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true
  },
  mappedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true
  },
  mappedField: {
    type: String,
    required: true
  },
  alternativeNames: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    default: ''
  },
  inKnowledgeGraph: {
    type: Boolean,
    default: false
  }
});

// Inverse Relationships
const inverseRelationshipSchema = new mongoose.Schema({
  ...baseRelationshipSchema,
  type: {
    type: String,
    default: 'inverse',
    immutable: true
  }
});

// Indirect Relationships
const indirectRelationshipSchema = new mongoose.Schema({
  ...baseRelationshipSchema,
  type: {
    type: String,
    default: 'indirect',
    immutable: true
  },
  // Additional fields specific to indirect relationships
  intermediateTable: {
    type: String,
    required: false
  },
  intermediateFromField: {
    type: String,
    required: false
  },
  intermediateToField: {
    type: String,
    required: false
  }
});

// Self Relationships
const selfRelationshipSchema = new mongoose.Schema({
  ...baseRelationshipSchema,
  type: {
    type: String,
    default: 'self',
    immutable: true
  },
  // For self relationships, toTable is the same as fromTable
  toTable: {
    type: String,
    required: false // Not required as it's the same as fromTable
  }
});

// Pre-save middleware to set toTable for self relationships
selfRelationshipSchema.pre('save', function(next) {
  if (this.isModified('fromTable')) {
    this.toTable = this.fromTable;
  }
  next();
});

// Create models
export const DirectRelationship = mongoose.models.DirectRelationship || mongoose.model('DirectRelationship', directRelationshipSchema, 'directrelationships');
export const InverseRelationship = mongoose.models.InverseRelationship || mongoose.model('InverseRelationship', inverseRelationshipSchema, 'inverserelationships');
export const IndirectRelationship = mongoose.models.IndirectRelationship || mongoose.model('IndirectRelationship', indirectRelationshipSchema, 'indirectrelationships');
export const SelfRelationship = mongoose.models.SelfRelationship || mongoose.model('SelfRelationship', selfRelationshipSchema, 'selfrelationships');

// For backward compatibility and type definitions
export type RelationshipType = 'direct' | 'inverse' | 'indirect' | 'self';

export type DirectRelationshipType = mongoose.Document & {
  fieldName: string;
  tableName: mongoose.Types.ObjectId;
  mappedTo: mongoose.Types.ObjectId;
  mappedField: string;
  alternativeNames?: string[];
  description?: string;
  inKnowledgeGraph: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type LegacyRelationshipType = mongoose.Document & {
  name: string;
  type: RelationshipType;
  description?: string;
  alternativeNames?: string[];
  fromTable: string;
  fromField: string;
  toTable: string;
  toField: string;
  inKnowledgeGraph: boolean;
  intermediateTable?: string;
  intermediateFromField?: string;
  intermediateToField?: string;
  createdAt: Date;
  updatedAt: Date;
}; 