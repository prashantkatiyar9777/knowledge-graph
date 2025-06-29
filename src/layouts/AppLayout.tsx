import React, { useMemo } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useVersionStore } from '../stores/versionStore';

// Components
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

// Pages
import Dashboard from '../pages/v1/Dashboard';
import DashboardBuilder from '../pages/v1/DashboardBuilder';
import GraphViewer from '../pages/v1/GraphViewer';
import Tables from '../pages/v1/Tables';
import Fields from '../pages/v1/Fields';
import TableDetails from '../pages/v1/TableDetails';
import Relationships from '../pages/v1/Relationships';
import FormsResponses from '../pages/v1/FormsResponses';
import DataSync from '../pages/v1/DataSync';
import AuditLog from '../pages/v1/AuditLog';
import Settings from '../pages/v1/Settings';

// Version 2 Pages
import Overview from '../pages/v2/Overview';
import KnowledgeGraph from '../pages/v2/KnowledgeGraph';
import Workflows from '../pages/v2/Workflows';
import AccessControl from '../pages/v2/AccessControl';
import Team from '../pages/v2/Team';
import V2Settings from '../pages/v2/V2Settings';
import PlatformTables from '../pages/v1/PlatformTables';
import TableFields from '../pages/v2/TableFields';

import NotFound from '../pages/v1/NotFound';

const AppLayout: React.FC = () => {
  const { error } = useApp();
  const { version } = useVersionStore();
  const location = useLocation();

  const routes = useMemo(() => {
    console.log('AppLayout rendering with version:', version);
    
    if (version === 1) {
      return (
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard-builder" element={<DashboardBuilder />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/fields" element={<Fields />} />
          <Route path="/tables/:tableId" element={<TableDetails />} />
          <Route path="/relationships" element={<Relationships />} />
          <Route path="/forms" element={<FormsResponses />} />
          <Route path="/graph" element={<GraphViewer />} />
          <Route path="/sync" element={<DataSync />} />
          <Route path="/audit" element={<AuditLog />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    }
    
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/dashboard-builder" element={<DashboardBuilder />} />
        <Route path="/platform-tables" element={<PlatformTables />} />
        <Route path="/fields" element={<TableFields />} />
        <Route path="/graph" element={<KnowledgeGraph />} />
        <Route path="/workflows" element={<Workflows />} />
        <Route path="/access-control" element={<AccessControl />} />
        <Route path="/team" element={<Team />} />
        <Route path="/settings" element={<V2Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }, [version]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">
          {routes}
        </main>
      </div>
    </div>
  );
};

export default React.memo(AppLayout);