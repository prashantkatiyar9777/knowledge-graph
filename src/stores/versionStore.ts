import { create } from 'zustand';

interface VersionState {
  version: 1 | 2;
  setVersion: (version: 1 | 2) => void;
}

export const useVersionStore = create<VersionState>((set) => ({
  version: 1,
  setVersion: (version) => set({ version })
}));