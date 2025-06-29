import { create } from 'zustand';
import { MongoDBService } from '../services/mongodb.service';
import { Table, Source, AuditLog, SyncJob, DirectRelationship, LegacyRelationship, ValueField } from '../types';

interface DataStore {
  sources: Source[];
  tables: Table[];
  fields: ValueField[];
  auditLogs: AuditLog[];
  syncJobs: SyncJob[];
  selectedSource: string | null;
  isLoading: boolean;
  error: string | null;
  fetchSources: () => Promise<void>;
  fetchTables: (sourceId?: string) => Promise<void>;
  fetchFields: () => Promise<void>;
  fetchFieldsByTable: (tableId: string) => Promise<void>;
  fetchAuditLogs: () => Promise<void>;
  fetchSyncJobs: () => Promise<void>;
  setSelectedSource: (sourceId: string | null) => void;
  relationships: DirectRelationship[];
  inverseRelationships: LegacyRelationship[];
  indirectRelationships: LegacyRelationship[];
  selfRelationships: LegacyRelationship[];
  users: any[];
  fetchRelationships: () => Promise<void>;
  fetchInverseRelationships: () => Promise<void>;
  fetchIndirectRelationships: () => Promise<void>;
  fetchSelfRelationships: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  createTable: (table: any) => Promise<void>;
  updateTable: (id: string, table: any) => Promise<void>;
  deleteTable: (id: string) => Promise<void>;
  createField: (field: Partial<ValueField>) => Promise<void>;
  updateField: (id: string, field: Partial<ValueField>) => Promise<void>;
  deleteField: (id: string) => Promise<void>;
  createRelationship: (relationship: any) => Promise<void>;
  updateRelationship: (id: string, relationship: any) => Promise<void>;
  deleteRelationship: (id: string) => Promise<void>;
  createSelfRelationship: (relationship: any) => Promise<void>;
  createBulkSelfRelationships: (relationships: any[]) => Promise<void>;
}

const useDataStore = create<DataStore>((set, get) => ({
  sources: [],
  tables: [],
  fields: [],
  auditLogs: [],
  syncJobs: [],
  selectedSource: null,
  isLoading: false,
  error: null,
  relationships: [],
  inverseRelationships: [],
  indirectRelationships: [],
  selfRelationships: [],
  users: [],

  fetchSources: async () => {
    try {
      set({ isLoading: true, error: null });
      const sources = await MongoDBService.getSources();
      set({ sources, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchTables: async (sourceId?: string) => {
    try {
      set({ isLoading: true, error: null });
      const tables = await MongoDBService.getTables();
      console.log('Fetched tables:', {
        tablesCount: tables.length,
        sampleTable: tables[0] ? {
          name: tables[0].name,
          source: tables[0].source
        } : null
      });
      set({ tables, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchFields: async () => {
    try {
      set({ isLoading: true, error: null });
      const fields = await MongoDBService.getFields();
      set({ fields, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchFieldsByTable: async (tableId: string) => {
    try {
      set({ isLoading: true, error: null });
      const fields = await MongoDBService.getFieldsByTable(tableId);
      set({ fields, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchAuditLogs: async () => {
    try {
      set({ isLoading: true, error: null });
      const auditLogs = await MongoDBService.getAuditLogs();
      set({ auditLogs, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchSyncJobs: async () => {
    try {
      set({ isLoading: true, error: null });
      const syncJobs = await MongoDBService.getSyncJobs();
      set({ syncJobs, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  setSelectedSource: (sourceId: string | null) => {
    set({ selectedSource: sourceId });
  },

  fetchRelationships: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await MongoDBService.getRelationships();
      set({ 
        relationships: response.direct,
        inverseRelationships: response.inverse,
        indirectRelationships: response.indirect,
        selfRelationships: response.self,
        isLoading: false 
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchInverseRelationships: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await MongoDBService.getRelationships();
      set({ inverseRelationships: response.inverse, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchIndirectRelationships: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await MongoDBService.getRelationships();
      set({ indirectRelationships: response.indirect, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchSelfRelationships: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await MongoDBService.getRelationships();
      set({ selfRelationships: response.self, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchUsers: async () => {
    // Placeholder for user fetching
    set({ users: [] });
  },

  createTable: async (table) => {
    try {
      set({ isLoading: true, error: null });
      const newTable = await MongoDBService.createTable(table);
      set(state => ({
        tables: [...state.tables, newTable],
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateTable: async (id, table) => {
    try {
      set({ isLoading: true, error: null });
      // Implement table update logic
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteTable: async (id) => {
    try {
      set({ isLoading: true, error: null });
      // Implement table delete logic
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createField: async (field) => {
    try {
      set({ isLoading: true, error: null });
      const newField = await MongoDBService.createField(field);
      set(state => ({
        fields: [...state.fields, newField],
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateField: async (id, field) => {
    try {
      set({ isLoading: true, error: null });
      const updatedField = await MongoDBService.updateField(id, field);
      set(state => ({
        fields: state.fields.map(f => f._id.toString() === id ? updatedField : f),
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteField: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await MongoDBService.deleteField(id);
      set(state => ({
        fields: state.fields.filter(f => f._id.toString() !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createRelationship: async (relationship) => {
    try {
      set({ isLoading: true, error: null });
      const newRelationship = await MongoDBService.createRelationship(relationship);
      set(state => ({
        relationships: [...state.relationships, newRelationship],
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateRelationship: async (id, relationship) => {
    try {
      set({ isLoading: true, error: null });
      const updatedRelationship = await MongoDBService.updateRelationship(id, relationship);
      set(state => ({
        relationships: state.relationships.map(r => r._id.toString() === id ? updatedRelationship : r),
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteRelationship: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await MongoDBService.deleteRelationship(id);
      set(state => ({
        relationships: state.relationships.filter(r => r._id.toString() !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createSelfRelationship: async (relationship) => {
    try {
      set({ isLoading: true, error: null });
      const newRelationship = await MongoDBService.createSelfRelationship(relationship);
      set(state => ({
        selfRelationships: [...state.selfRelationships, newRelationship],
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createBulkSelfRelationships: async (relationships) => {
    try {
      set({ isLoading: true, error: null });
      const newRelationships = await MongoDBService.createBulkSelfRelationships(relationships);
      set(state => ({
        selfRelationships: [...state.selfRelationships, ...newRelationships],
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  }
}));

export default useDataStore;