import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import { AppProvider } from './contexts/AppContext';
import TableMetadataEditor from './components/modals/TableMetadataEditor';
import RelationshipEditor from './components/modals/RelationshipEditor';
import SyncJobEditor from './components/modals/SyncJobEditor';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <AppLayout />
          <TableMetadataEditor 
            isOpen={false} 
            onClose={() => {}} 
            table={null} 
            onSave={() => {}} 
          />
          <RelationshipEditor 
            isOpen={false} 
            onClose={() => {}} 
            mode="add" 
          />
          <SyncJobEditor 
            isOpen={false} 
            onClose={() => {}} 
          />
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;