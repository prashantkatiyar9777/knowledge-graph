import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, Menu, ChevronDown, 
  Database, LogOut, Settings as SettingsIcon, User,
  Layers
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useVersionStore } from '../../stores/versionStore';
import NotificationDropdown from './NotificationDropdown';

const Navbar: React.FC = () => {
  const { user, unreadNotifications, toggleNav } = useApp();
  const { version, setVersion } = useVersionStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showVersionMenu, setShowVersionMenu] = useState(false);

  const handleVersionChange = (newVersion: 1 | 2) => {
    setVersion(newVersion);
    setShowVersionMenu(false);
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between h-16 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleNav}
          className="p-1.5 text-slate-600 hover:text-primary rounded-md hover:bg-slate-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        
        <div className="flex items-center gap-2">
          <Database className="h-6 w-6 text-primary" />
          <Link to="/" className="text-xl font-semibold text-slate-900">
            Knowledge Graphs
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Version Switcher */}
        <div className="relative">
          <button
            className="p-1.5 text-slate-600 hover:text-primary rounded-md hover:bg-slate-100 transition-colors flex items-center gap-1"
            onClick={() => setShowVersionMenu(!showVersionMenu)}
          >
            <Layers size={20} />
            <span className="text-sm font-medium">v{version}</span>
          </button>

          {showVersionMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-50">
              <button
                className={`w-full px-4 py-2 text-sm text-left hover:bg-slate-50 ${version === 1 ? 'text-primary font-medium' : 'text-slate-700'}`}
                onClick={() => handleVersionChange(1)}
              >
                Version 1
              </button>
              <button
                className={`w-full px-4 py-2 text-sm text-left hover:bg-slate-50 ${version === 2 ? 'text-primary font-medium' : 'text-slate-700'}`}
                onClick={() => handleVersionChange(2)}
              >
                Version 2
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button 
            className="p-1.5 text-slate-600 hover:text-primary rounded-md hover:bg-slate-100 transition-colors relative"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <NotificationDropdown onClose={() => setShowNotifications(false)} />
          )}
        </div>
        
        <div className="relative">
          <button 
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
              {user?.avatar || user?.name.substring(0, 2)}
            </div>
            <span className="hidden md:block text-sm font-medium">{user?.name}</span>
            <ChevronDown size={16} />
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-50">
              <div className="px-4 py-3 border-b border-slate-200">
                <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <Link 
                  to="/profile" 
                  className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 gap-2"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User size={16} />
                  <span>Your Profile</span>
                </Link>
                <Link 
                  to="/settings" 
                  className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 gap-2"
                  onClick={() => setShowUserMenu(false)}
                >
                  <SettingsIcon size={16} />
                  <span>Settings</span>
                </Link>
              </div>
              <div className="py-1 border-t border-slate-200">
                <button 
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-slate-100 gap-2"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;