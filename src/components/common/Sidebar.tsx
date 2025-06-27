import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  cross,
  Network, 
  Database,
  Table2,
  GitBranch, 
  Clock, 
  FileText,
  ClipboardList,
  Settings,
  LayoutGrid,
  BarChart2,
  Users,
  Shield,
  Workflow
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useVersionStore } from '../../stores/versionStore';

const Sidebar: React.FC = () => {
  const { isNavOpen } = useApp();
  const { version } = useVersionStore();
  
  const v1NavItems = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/dashboard',
    },
    {
      name: 'Tables',
      icon: <Database size={20} />,
      path: '/tables',
    },
    {
      name: 'Fields',
      icon: <Table2 size={20} />,
      path: '/fields',
    },
    {
      name: 'Relationships',
      icon: <GitBranch size={20} />,
      path: '/relationships',
    },
    {
      name: 'Forms Responses',
      icon: <ClipboardList size={20} />,
      path: '/forms',
    },
    {
      name: 'Preview Knowledge Graph',
      icon: <Network size={20} />,
      path: '/graph',
    },
    {
      name: 'Data Synchronization',
      icon: <Clock size={20} />,
      path: '/sync',
    },
    {
      name: 'Audit Log',
      icon: <FileText size={20} />,
      path: '/audit',
    },
  ];

  const v2NavItems = [
    {
      name: 'Overview',
      icon: <BarChart2 size={20} />,
      path: '/overview',
    },
    {
      name: 'Platforms',
      icon: <Database size={20} />,
      path: '/dashboard-builder',
    },
    {
      name: 'Forms',
      icon: <ClipboardList size={20} />,
      path: '/workflows',
    },
    {
      name: 'Relationships',
      icon: <GitBranch size={20} />,
      path: '/access-control',
    },
    {
      name: 'Preview Knowledge Graph',
      icon: <Network size={20} />,
      path: '/graph',
    },
    {
      name: 'Data Synchronization',
      icon: <Clock size={20} />,
      path: '/team',
    },
    {
      name: 'Audit Log',
      icon: <FileText size={20} />,
      path: '/auditlogs',
    },
  ];

  const navItems = version === 1 ? v1NavItems : v2NavItems;

  return (
    <aside className={`bg-white border-r border-slate-200 h-[calc(100vh-4rem)] flex-shrink-0 transition-all duration-300 ${isNavOpen ? 'w-64' : 'w-16'}`}>
      <div className="py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {isNavOpen && <span className="ml-3">{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;