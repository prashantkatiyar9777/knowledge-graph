import { Source, Table, AuditLog, SyncJob, Relationship, ValueField } from '../types/index.js';

const API_URL = 'http://localhost:3000/api';

export class MongoDBService {
  private static async fetchAPI(endpoint: string, options: RequestInit = {}) {
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
      console.log(`API request to ${endpoint} succeeded:`, data);
      return data;
    } catch (error) {
      console.error(`API request to ${endpoint} failed:`, error);
      throw error;
    }
  }

  // Source operations
  static async getSources(): Promise<Source[]> {
    return this.fetchAPI('/sources');
  }

  static async createSource(source: Partial<Source>): Promise<Source> {
    return this.fetchAPI('/sources', {
      method: 'POST',
      body: JSON.stringify(source)
    });
  }

  // Table operations
  static async getTables(): Promise<Table[]> {
    return this.fetchAPI('/tables');
  }

  static async createTable(table: Partial<Table>): Promise<Table> {
    return this.fetchAPI('/tables', {
      method: 'POST',
      body: JSON.stringify(table)
    });
  }

  // Field operations
  static async getFields(): Promise<ValueField[]> {
    return this.fetchAPI('/fields');
  }

  static async getFieldsByTable(tableId: string): Promise<ValueField[]> {
    return this.fetchAPI(`/fields/table/${tableId}`);
  }

  static async createField(field: Partial<ValueField>): Promise<ValueField> {
    return this.fetchAPI('/fields', {
      method: 'POST',
      body: JSON.stringify(field)
    });
  }

  static async updateField(id: string, field: Partial<ValueField>): Promise<ValueField> {
    return this.fetchAPI(`/fields/${id}`, {
      method: 'PUT',
      body: JSON.stringify(field)
    });
  }

  static async deleteField(id: string): Promise<void> {
    return this.fetchAPI(`/fields/${id}`, {
      method: 'DELETE'
    });
  }

  // Audit log operations
  static async getAuditLogs(): Promise<AuditLog[]> {
    return this.fetchAPI('/audit-logs');
  }

  // Sync job operations
  static async getSyncJobs(): Promise<SyncJob[]> {
    return this.fetchAPI('/sync-jobs');
  }

  // Relationship operations
  static async getRelationships(): Promise<Relationship[]> {
    return this.fetchAPI('/relationships');
  }

  static async getInverseRelationships(): Promise<Relationship[]> {
    return this.fetchAPI('/relationships/inverse');
  }

  static async getIndirectRelationships(): Promise<Relationship[]> {
    return this.fetchAPI('/relationships/indirect');
  }

  static async getSelfRelationships(): Promise<Relationship[]> {
    return this.fetchAPI('/relationships/self');
  }

  static async createRelationship(relationship: Partial<Relationship>): Promise<Relationship> {
    return this.fetchAPI('/relationships', {
      method: 'POST',
      body: JSON.stringify(relationship)
    });
  }

  static async updateRelationship(id: string, relationship: Partial<Relationship>): Promise<Relationship> {
    return this.fetchAPI(`/relationships/${id}`, {
      method: 'PUT',
      body: JSON.stringify(relationship)
    });
  }

  static async deleteRelationship(id: string): Promise<void> {
    return this.fetchAPI(`/relationships/${id}`, {
      method: 'DELETE'
    });
  }

  static async createSelfRelationship(relationship: Partial<Relationship>): Promise<Relationship> {
    return this.fetchAPI('/relationships/self', {
      method: 'POST',
      body: JSON.stringify(relationship)
    });
  }

  static async createBulkSelfRelationships(relationships: Partial<Relationship>[]): Promise<Relationship[]> {
    return this.fetchAPI('/relationships/self/bulk', {
      method: 'POST',
      body: JSON.stringify(relationships)
    });
  }
} 