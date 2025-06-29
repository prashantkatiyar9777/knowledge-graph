import React, { createContext, useContext, useEffect, useState } from 'react';
import useDataStore from '../stores/dataStore';

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
  const { fetchSources, fetchTables, fetchAuditLogs, fetchSyncJobs, isLoading, error } = useDataStore();
  const [appError, setAppError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadInitialData = async () => {
    console.log(`Loading initial data... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
    try {
      const results = await Promise.allSettled([
        fetchSources().then(() => console.log('Sources loaded')),
        fetchTables().then(() => console.log('Tables loaded')),
        fetchAuditLogs().then(() => console.log('Audit logs loaded')),
        fetchSyncJobs().then(() => console.log('Sync jobs loaded'))
      ]);

      const errors = results
        .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
        .map(result => result.reason);

      if (errors.length > 0) {
        console.error('Some data failed to load:', errors);
        throw new Error('Failed to load some data. Check console for details.');
      }

      console.log('All initial data loaded successfully');
      setRetryCount(0); // Reset retry count on success
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
    }
  };

  useEffect(() => {
    console.log('AppProvider mounted');
    loadInitialData();
  }, [fetchSources, fetchTables, fetchAuditLogs, fetchSyncJobs]);

  const clearError = () => {
    setAppError(null);
    setRetryCount(0);
  };

  const retryLoad = () => {
    clearError();
    loadInitialData();
  };

  console.log('AppProvider rendering with:', { isLoading, error: appError || error, retryCount });

  return (
    <AppContext.Provider value={{ isLoading, error: appError || error, clearError, retryLoad }}>
      {children}
      {(appError || error) && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">
          <p className="font-bold">Error</p>
          <p className="mb-2">{appError || error}</p>
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
      {isLoading && (
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