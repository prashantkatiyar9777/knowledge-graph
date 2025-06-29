import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import useDataStore from '../stores/dataStore.js';

interface AppContextType {
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  retryLoad: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { fetchSources, fetchTables, fetchAuditLogs, fetchSyncJobs, isLoading: storeLoading, error: storeError } = useDataStore();
  const [appError, setAppError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadInitialData = useCallback(async () => {
    console.log(`Loading initial data... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
    try {
      setIsLoading(true);
      await Promise.all([
        fetchSources(),
        fetchTables(),
        fetchAuditLogs(),
        fetchSyncJobs()
      ]);
      
      console.log('All initial data loaded successfully');
      setRetryCount(0);
      setAppError(null);
    } catch (err) {
      console.error('Error loading initial data:', err);
      if (retryCount < MAX_RETRIES - 1) {
        setRetryCount(prev => prev + 1);
        setAppError(`Failed to load data. Retrying in ${RETRY_DELAY/1000} seconds... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
        setTimeout(loadInitialData, RETRY_DELAY);
      } else {
        setAppError(`Failed to load data after ${MAX_RETRIES} attempts. Please check your connection and try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchSources, fetchTables, fetchAuditLogs, fetchSyncJobs, retryCount]);

  useEffect(() => {
    console.log('AppProvider mounted');
    let mounted = true;

    const initializeData = async () => {
      if (!mounted) return;
      try {
        await loadInitialData();
      } catch (error) {
        console.error('Error in initial data load:', error);
      }
    };

    initializeData();

    return () => {
      mounted = false;
    };
  }, [loadInitialData]);

  const clearError = useCallback(() => {
    setAppError(null);
    setRetryCount(0);
  }, []);

  const retryLoad = useCallback(() => {
    clearError();
    loadInitialData();
  }, [clearError, loadInitialData]);

  const error = appError || storeError;
  const loading = isLoading || storeLoading;

  return (
    <AppContext.Provider value={{ isLoading: loading, error, clearError, retryLoad }}>
      {children}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">
          <p className="font-bold">Error</p>
          <p className="mb-2">{error}</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={retryLoad}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={clearError}
              className="px-2 py-1 text-red-600 hover:text-red-800 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}