import React from 'react';
import { Bell, CheckCheck, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { formatDistanceToNow } from 'date-fns';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();

  const getIconForType = (type: string) => {
    switch (type) {
      case 'info':
        return <Bell className="text-blue-500" size={16} />;
      case 'success':
        return <Bell className="text-green-500" size={16} />;
      case 'warning':
        return <Bell className="text-yellow-500" size={16} />;
      case 'error':
        return <Bell className="text-red-500" size={16} />;
      default:
        return <Bell className="text-slate-500" size={16} />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-slate-200 z-50 animate-fade-in">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200">
        <h3 className="text-sm font-medium text-slate-900">Notifications</h3>
        <div className="flex items-center gap-2">
          <button 
            className="text-slate-500 hover:text-primary p-1 text-xs flex items-center gap-1"
            onClick={markAllNotificationsAsRead}
          >
            <CheckCheck size={14} />
            <span>Mark all as read</span>
          </button>
          <button 
            className="text-slate-500 hover:text-red-500"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      <div className="max-h-[60vh] overflow-y-auto">
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 hover:bg-slate-50 cursor-pointer flex ${!notification.read ? 'bg-blue-50' : ''}`}
                onClick={() => markNotificationAsRead(notification.id)}
              >
                <div className="mr-3 mt-0.5">
                  {getIconForType(notification.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                  <p className="text-xs text-slate-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-slate-500">
            No notifications
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;