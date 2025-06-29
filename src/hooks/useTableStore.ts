import { create } from 'zustand';
import { Table } from '../types';
import { MongoDBService } from '../services/mongodb.service';
import { ObjectId } from 'mongodb';

interface TableState {
  tables: Table[];
  selectedTables: string[];
  isLoading: boolean;
  error: string | null;
  fetchTables: () => Promise<void>;
  setSelectedTables: (ids: string[]) => void;
  toggleTableSelection: (id: string) => void;
  updateTable: (id: string, updates: Partial<Table>) => void;
}

export const useTableStore = create<TableState>((set) => ({
  tables: [],
  selectedTables: [],
  isLoading: false,
  error: null,
  fetchTables: async () => {
    try {
      set({ isLoading: true, error: null });
      const tables = await MongoDBService.getTables();
      set({ tables, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch tables', isLoading: false });
      console.error('Error fetching tables:', error);
    }
  },
  setSelectedTables: (ids) => set({ selectedTables: ids }),
  toggleTableSelection: (id) => set((state) => ({
    selectedTables: state.selectedTables.includes(id)
      ? state.selectedTables.filter(tableId => tableId !== id)
      : [...state.selectedTables, id]
  })),
  updateTable: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      const updatedTable = await MongoDBService.updateTable(id, updates);
      set((state) => ({
        tables: state.tables.map(table =>
          table._id.toString() === id ? updatedTable : table
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update table', isLoading: false });
      console.error('Error updating table:', error);
    }
  }
}));