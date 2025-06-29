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
  serialNumber: number;
  description?: string;
  source: {
    _id: ObjectId;
    name: string;
    description?: string;
    type: string;
  };
  createdAt: Date;
  updatedAt: Date;
  alternativeNames?: string[];
  fields?: Field[];
  fieldsCount?: number;
  recordsCount?: number;
  kgRecordsCount?: number;
  kgStatus?: 'Added to KG' | 'Partially Added' | 'Not Added' | 'Error';
  hasMetadata?: boolean;
  lastSync?: Date;
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

export interface DirectRelationship {
  _id: ObjectId;
  fieldName: string;
  tableName: {
    _id: ObjectId;
    name: string;
    description?: string;
  };
  mappedTo: {
    _id: ObjectId;
    name: string;
    description?: string;
  };
  mappedField: string;
  alternativeNames?: string[];
  description?: string;
  inKnowledgeGraph: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LegacyRelationship {
  _id: ObjectId;
  name: string;
  type: 'inverse' | 'indirect' | 'self';
  description?: string;
  alternativeNames?: string[];
  fromTable: string;
  fromField: string;
  toTable: string;
  toField: string;
  intermediateTable?: string;
  intermediateFromField?: string;
  intermediateToField?: string;
  inKnowledgeGraph: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type Relationship = DirectRelationship | LegacyRelationship;

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
  tableId: ObjectId | Table;  // Can be either ObjectId when unpopulated or Table when populated
  type: string;
  alternativeNames?: string[];
  description?: string;
  kgStatus: 'Added to KG' | 'Not Added';
  createdAt: Date;
  updatedAt: Date;
}