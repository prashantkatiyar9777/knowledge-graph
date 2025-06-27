// Common interfaces used across the application
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar: string;
}

export interface TableData {
  id: string;
  name: string;
  alternateNames: string[];
  description?: string;
  source: string;
  fields: number;
  records: number;
  kgStatus: 'mapped' | 'partially_mapped' | 'pending' | 'error';
  lastSync: string;
  kgRecords?: number;
  hasMetadata: boolean;
}

export interface TableField {
  id: string;
  name: string;
  alternateName: string;
  type: string;
  description: string;
  hasValueMapping: boolean;
  valueMapping?: Array<{
    code: string;
    value: string;
  }>;
}

export interface Relationship {
  id: string;
  name: string;
  fromTable: string;
  fromField: string;
  toTable: string;
  toField: string;
  cardinality: string;
  description: string;
}

export interface SyncJob {
  id: string;
  name: string;
  type: string;
  schedule: string;
  lastRun: string;
  nextRun: string;
  status: 'Success' | 'Failed' | 'Running';
  tablesCovered: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  entity: 'Table' | 'Field' | 'Relationship' | 'Integration';
  entityName: string;
  action: 'Created' | 'Updated' | 'Deleted';
  details: string;
}

export interface ConversionProgress {
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
  error?: string;
}