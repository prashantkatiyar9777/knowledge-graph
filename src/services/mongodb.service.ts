import { Source, Table, AuditLog, SyncJob, Relationship, LegacyRelationship, ValueField } from '../types/index.js';

const API_URL = 'http://localhost:3000/api';

export class MongoDBService {
  private static async fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    console.log(`Making API request to ${endpoint}...`);
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API request failed: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`API request failed: ${response.statusText}. ${errorText}`);
      }

      const data = await response.json();
      if (endpoint === '/tables') {
        console.log('Tables API response:', {
          count: Array.isArray(data) ? data.length : 'not an array',
          sampleData: Array.isArray(data) && data.length > 0 ? {
            name: data[0].name,
            source: data[0].source,
            hasSource: !!data[0].source,
            sourceId: data[0].source?._id
          } : null,
          sampleDataRaw: Array.isArray(data) && data.length > 0 ? data[0] : null
        });
      }
      return data as T;
    } catch (error) {
      console.error(`API request to ${endpoint} failed:`, error);
      throw error;
    }
  }

  // Source operations
  static async getSources(): Promise<Source[]> {
    return this.fetchAPI<Source[]>('/sources');
  }

  static async createSource(source: Partial<Source>): Promise<Source> {
    return this.fetchAPI<Source>('/sources', {
      method: 'POST',
      body: JSON.stringify(source)
    });
  }

  // Table operations
  static async getTables(): Promise<Table[]> {
    return this.fetchAPI<Table[]>('/tables');
  }

  static async createTable(table: Partial<Table>): Promise<Table> {
    return this.fetchAPI<Table>('/tables', {
      method: 'POST',
      body: JSON.stringify(table)
    });
  }

  static async updateTable(id: string, updates: Partial<Table>): Promise<Table> {
    return this.fetchAPI<Table>(`/tables/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  // Field operations
  static async getFields(): Promise<ValueField[]> {
    return this.fetchAPI<ValueField[]>('/fields');
  }

  static async getFieldsByTable(tableId: string): Promise<ValueField[]> {
    return this.fetchAPI<ValueField[]>(`/fields/table/${tableId}`);
  }

  static async createField(field: Partial<ValueField>): Promise<ValueField> {
    return this.fetchAPI<ValueField>('/fields', {
      method: 'POST',
      body: JSON.stringify(field)
    });
  }

  static async updateField(id: string, field: Partial<ValueField>): Promise<ValueField> {
    return this.fetchAPI<ValueField>(`/fields/${id}`, {
      method: 'PUT',
      body: JSON.stringify(field)
    });
  }

  static async deleteField(id: string): Promise<void> {
    return this.fetchAPI<void>(`/fields/${id}`, {
      method: 'DELETE'
    });
  }

  // Audit log operations
  static async getAuditLogs(): Promise<AuditLog[]> {
    return this.fetchAPI<AuditLog[]>('/audit-logs');
  }

  // Sync job operations
  static async getSyncJobs(): Promise<SyncJob[]> {
    return this.fetchAPI<SyncJob[]>('/sync-jobs');
  }

  // Relationship operations
  static async getRelationships(): Promise<{ 
    direct: Relationship[]; 
    inverse: LegacyRelationship[]; 
    indirect: LegacyRelationship[]; 
    self: LegacyRelationship[]; 
  }> {
    return this.fetchAPI<{ 
      direct: Relationship[]; 
      inverse: LegacyRelationship[]; 
      indirect: LegacyRelationship[]; 
      self: LegacyRelationship[]; 
    }>('/relationships');
  }

  static async createRelationship(relationship: Partial<Relationship>): Promise<Relationship> {
    return this.fetchAPI<Relationship>('/relationships', {
      method: 'POST',
      body: JSON.stringify(relationship)
    });
  }

  static async updateRelationship(id: string, relationship: Partial<Relationship>): Promise<Relationship> {
    return this.fetchAPI<Relationship>(`/relationships/${id}`, {
      method: 'PUT',
      body: JSON.stringify(relationship)
    });
  }

  static async deleteRelationship(id: string): Promise<void> {
    return this.fetchAPI<void>(`/relationships/${id}`, {
      method: 'DELETE'
    });
  }

  static async createSelfRelationship(relationship: Partial<Relationship>): Promise<Relationship> {
    return this.fetchAPI<Relationship>('/relationships/self', {
      method: 'POST',
      body: JSON.stringify(relationship)
    });
  }

  static async createBulkSelfRelationships(relationships: Partial<Relationship>[]): Promise<Relationship[]> {
    return this.fetchAPI<Relationship[]>('/relationships/self/bulk', {
      method: 'POST',
      body: JSON.stringify(relationships)
    });
  }
} 