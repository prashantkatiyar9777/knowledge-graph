import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: Date;
}

interface AppContextType {
  user: User | null;
  notifications: Notification[];
  unreadNotifications: number;
  isOnboarded: boolean;
  isOnboarding: boolean;
  isNavOpen: boolean;
  showTableMetadataEditor: boolean;
  showRelationshipEditor: boolean;
  showSyncJobEditor: boolean;
  selectedTableForEdit: any;
  selectedRelationshipForEdit: any;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  setIsOnboarded: (value: boolean) => void;
  setIsOnboarding: (value: boolean) => void;
  toggleNav: () => void;
  setShowTableMetadataEditor: (value: boolean) => void;
  setShowRelationshipEditor: (value: boolean) => void;
  setShowSyncJobEditor: (value: boolean) => void;
  setSelectedTableForEdit: (table: any) => void;
  setSelectedRelationshipForEdit: (relationship: any) => void;
}

const defaultUser: User = {
  id: 'user-1',
  name: 'Prashant Katiyar',
  email: 'prashant.katiyar@innovapptive.com',
  role: 'admin',
  avatar: 'P',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(defaultUser);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [showTableMetadataEditor, setShowTableMetadataEditor] = useState(false);
  const [showRelationshipEditor, setShowRelationshipEditor] = useState(false);
  const [showSyncJobEditor, setShowSyncJobEditor] = useState(false);
  const [selectedTableForEdit, setSelectedTableForEdit] = useState<any>(null);
  const [selectedRelationshipForEdit, setSelectedRelationshipForEdit] = useState<any>(null);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}`,
      read: false,
      timestamp: new Date(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const toggleNav = () => {
    setIsNavOpen(prev => !prev);
  };

  return (
    <AppContext.Provider 
      value={{ 
        user, 
        notifications, 
        unreadNotifications,
        isOnboarded,
        isOnboarding,
        isNavOpen,
        showTableMetadataEditor,
        showRelationshipEditor,
        showSyncJobEditor,
        selectedTableForEdit,
        selectedRelationshipForEdit,
        addNotification, 
        markNotificationAsRead,
        markAllNotificationsAsRead,
        setIsOnboarded,
        setIsOnboarding,
        toggleNav,
        setShowTableMetadataEditor,
        setShowRelationshipEditor,
        setShowSyncJobEditor,
        setSelectedTableForEdit,
        setSelectedRelationshipForEdit
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};