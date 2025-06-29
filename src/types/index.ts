import { ObjectId } from 'mongodb';

// Common interfaces used across the application
export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Source {
  _id: ObjectId;
  name: string;
  description?: string;
  type: string;
  connectionDetails: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Table {
  _id: ObjectId;
  name: string;
  alternativeNames?: string[];
  sourceId: ObjectId;
  description?: string;
  fields: Field[];
  fieldsCount: number;
  recordsCount: number;
  kgRecordsCount: number;
  kgStatus: 'Added to KG' | 'Partially Added' | 'Not Added' | 'Error';
  hasMetadata: boolean;
  lastSync: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Field {
  _id: ObjectId;
  name: string;
  alternativeNames?: string[];
  description?: string;
  type: string;
  isRequired: boolean;
  kgStatus: 'Added to KG' | 'Not Added';
  tableId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Relationship {
  _id: ObjectId;
  name: string;
  alternativeNames?: string[];
  description?: string;
  type: 'direct' | 'inverse' | 'indirect' | 'self';
  sourceTable: {
    _id: ObjectId;
    name: string;
  };
  targetTable: {
    _id: ObjectId;
    name: string;
  };
  sourceField: {
    _id: ObjectId;
    name: string;
  };
  targetField: {
    _id: ObjectId;
    name: string;
  };
  tablePath?: string[];
  primaryTable?: string;
  referenceTable?: string;
  inKnowledgeGraph?: boolean;
  kgStatus: 'Added to KG' | 'Not Added';
  createdAt: Date;
  updatedAt: Date;
}

export interface SyncJob {
  _id: ObjectId;
  name: string;
  type: 'full' | 'incremental';
  schedule: string;
  lastRun: Date | null;
  nextRun: Date | null;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  _id: ObjectId;
  timestamp: Date;
  user: string;
  entity: string;
  entityName: string;
  action: string;
  details: string;
}

export interface ConversionProgress {
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
  error?: string;
}

export interface ValueField {
  _id: ObjectId;
  name: string;
  tableId: ObjectId;
  type: string;
  alternativeNames?: string[];
  description?: string;
  kgStatus: 'Added to KG' | 'Not Added';
  createdAt: Date;
  updatedAt: Date;
}