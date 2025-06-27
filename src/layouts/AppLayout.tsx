import React from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useVersionStore } from '../stores/versionStore';

// Components
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

// Pages
import Dashboard from '../pages/Dashboard';
import DashboardBuilder from '../pages/DashboardBuilder';
import GraphViewer from '../pages/GraphViewer';
import Tables from '../pages/Tables';
import Fields from '../pages/Fields';
import TableDetails from '../pages/TableDetails';
import Relationships from '../pages/Relationships';
import FormsResponses from '../pages/FormsResponses';
import DataSync from '../pages/DataSync';
import AuditLog from '../pages/AuditLog';
import Settings from '../pages/Settings';

// Version 2 Pages
import Overview from '../pages/v2/Overview';
import KnowledgeGraph from '../pages/v2/KnowledgeGraph';
import Workflows from '../pages/v2/Workflows';
import AccessControl from '../pages/v2/AccessControl';
import Team from '../pages/v2/Team';
import V2Settings from '../pages/v2/V2Settings';
import PlatformTables from '../pages/PlatformTables';
import TableFields from '../pages/v2/TableFields';

import NotFound from '../pages/NotFound';

const AppLayout: React.FC = () => {
  const { isOnboarded } = useApp();
  const { version } = useVersionStore();
  const location = useLocation();

  const renderRoutes = () => {
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
    } else {
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
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">
          {renderRoutes()}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;