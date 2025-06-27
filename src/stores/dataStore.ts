import { create } from 'zustand';
import { mockTableData, mockFields } from '../utils/mockData';

interface Table {
  id: string;
  name: string;
}

interface RelationshipField {
  id: string;
  table_id: string;
  name: string;
}

interface SelfRelationship {
  id: string;
  table_id: string;
  field_id: string;
  name: string;
  alternative_names: string[];
  description: string | null;
  kg_status: 'Added to KG' | 'Partially Added' | 'Not Added' | 'Error';
  created_at: string;
  updated_at: string;
}

interface DataState {
  selfRelationships: SelfRelationship[];
  tables: Table[];
  relationshipFields: RelationshipField[];
  fetchTables: () => Promise<void>;
  fetchRelationshipFields: () => Promise<void>;
  fetchSelfRelationships: () => Promise<void>;
  createSelfRelationship: (relationship: Omit<SelfRelationship, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  createBulkSelfRelationships: (relationships: Omit<SelfRelationship, 'id' | 'created_at' | 'updated_at'>[]) => Promise<void>;
  updateSelfRelationship: (id: string, updates: Partial<SelfRelationship>) => Promise<void>;
  deleteSelfRelationship: (id: string) => Promise<void>;
}

// Mock data
const mockSelfRelationships: SelfRelationship[] = [
  {
    id: '1',
    table_id: 'sap-equi',
    field_id: 'hequi',
    name: 'SAME_LOCATION',
    alternative_names: ['Located Together', 'Co-located'],
    description: 'Equipment located at the same functional location',
    kg_status: 'Added to KG',
    created_at: '2025-02-15T10:00:00Z',
    updated_at: '2025-02-15T10:00:00Z'
  }
];

const mockTables: Table[] = [
  { id: 'sap-equi', name: 'SAP Equipment' },
  { id: 'sap-func-loc', name: 'SAP Functional Location' }
];

const mockRelFields: RelationshipField[] = [
  { id: 'hequi', table_id: 'sap-equi', name: 'Higher Equipment' },
  { id: 'location', table_id: 'sap-equi', name: 'Location' }
];

export const useDataStore = create<DataState>((set, get) => ({
  selfRelationships: mockSelfRelationships,
  tables: [],
  relationshipFields: [],

  fetchTables: async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ tables: mockTables });
  },

  fetchRelationshipFields: async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ relationshipFields: mockRelFields });
  },

  fetchSelfRelationships: async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ selfRelationships: mockSelfRelationships });
  },

  createSelfRelationship: async (relationship) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const newRelationship = {
      ...relationship,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    set(state => ({
      selfRelationships: [...state.selfRelationships, newRelationship]
    }));
  },

  createBulkSelfRelationships: async (relationships) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const newRelationships = relationships.map(rel => ({
      ...rel,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    set(state => ({
      selfRelationships: [...state.selfRelationships, ...newRelationships]
    }));
  },

  updateSelfRelationship: async (id, updates) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    set(state => ({
      selfRelationships: state.selfRelationships.map(rel =>
        rel.id === id ? { ...rel, ...updates, updated_at: new Date().toISOString() } : rel
      )
    }));
  },

  deleteSelfRelationship: async (id) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    set(state => ({
      selfRelationships: state.selfRelationships.filter(rel => rel.id !== id)
    }));
  }
}));