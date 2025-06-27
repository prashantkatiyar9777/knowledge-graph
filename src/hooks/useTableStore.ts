import { create } from 'zustand';
import { TableData } from '../types';
import { mockTableData } from '../utils/mockData';

interface TableState {
  tables: TableData[];
  selectedTables: string[];
  setSelectedTables: (ids: string[]) => void;
  toggleTableSelection: (id: string) => void;
  updateTable: (id: string, updates: Partial<TableData>) => void;
}

export const useTableStore = create<TableState>((set) => ({
  tables: mockTableData,
  selectedTables: [],
  setSelectedTables: (ids) => set({ selectedTables: ids }),
  toggleTableSelection: (id) => set((state) => ({
    selectedTables: state.selectedTables.includes(id)
      ? state.selectedTables.filter(tableId => tableId !== id)
      : [...state.selectedTables, id]
  })),
  updateTable: (id, updates) => set((state) => ({
    tables: state.tables.map(table =>
      table.id === id ? { ...table, ...updates } : table
    )
  }))
}));