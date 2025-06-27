import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import { AppProvider } from './contexts/AppContext';
import TableMetadataEditor from './components/modals/TableMetadataEditor';
import RelationshipEditor from './components/modals/RelationshipEditor';
import SyncJobEditor from './components/modals/SyncJobEditor';

function App() {
  return (
    <AppProvider>
      <Router>
        <AppLayout />
        <TableMetadataEditor />
        <RelationshipEditor />
        <SyncJobEditor />
      </Router>
    </AppProvider>
  );
}

export default App;