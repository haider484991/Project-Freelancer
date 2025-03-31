'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Client } from '@/components/dashboard/ClientTable';
import { Group } from '@/components/dashboard/GroupsTable';

// Define client type
export interface Client {
  id: string;
  name: string;
  pushEnabled?: boolean;
  dietaryGoal?: string;
  group?: string;
  image?: string;
  goalsMet?: number;
  status?: 'active' | 'inactive';
  compliance?: 'compliant' | 'non-compliant';
}

// Define group type for context
export interface Group {
  id: string;
  name: string;
  members: number;
  dietaryGoal?: string;
  createdAt: string;
  clients?: string[];
  dietary?: string;
  mealPlan?: string;
}

// Mock clients data
export const mockClients: Client[] = [
  { 
    id: '1', 
    name: 'John Doe', 
    pushEnabled: true, 
    dietaryGoal: 'Weight Loss', 
    group: 'Weight Loss',
    image: '/images/profile.jpg',
    goalsMet: 75,
    status: 'active',
    compliance: 'compliant'
  },
  { 
    id: '2', 
    name: 'Jane Smith', 
    pushEnabled: false, 
    dietaryGoal: 'Muscle Gain', 
    group: 'Muscle Gain',
    image: '/images/profile.jpg',
    goalsMet: 90,
    status: 'active',
    compliance: 'non-compliant'
  },
  { 
    id: '3', 
    name: 'Mike Johnson', 
    pushEnabled: true, 
    dietaryGoal: 'Vegan', 
    group: 'Vegan',
    image: '/images/clients/sarah.jpg',
    goalsMet: 60,
    status: 'active',
    compliance: 'compliant'
  },
  { 
    id: '4', 
    name: 'Sarah Williams', 
    pushEnabled: false, 
    dietaryGoal: 'Maintenance', 
    group: 'Maintenance',
    image: '/images/clients/emma.jpg',
    goalsMet: 85,
    status: 'inactive',
    compliance: 'compliant'
  },
  { 
    id: '5', 
    name: 'Chris Evans', 
    pushEnabled: true, 
    dietaryGoal: 'Weight Loss', 
    group: 'Weight Loss',
    image: '/images/clients/mike.jpg',
    goalsMet: 80,
    status: 'active',
    compliance: 'compliant'
  },
];

// Mock groups data
export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Weight Loss',
    members: 2,
    dietaryGoal: 'Low Carb',
    createdAt: '12/02/2023',
    dietary: 'Low Carb',
    mealPlan: '1800 kcal/day',
    clients: ['1', '5']
  },
  {
    id: '2',
    name: 'Muscle Gain',
    members: 1,
    dietaryGoal: 'High Protein',
    createdAt: '05/03/2023',
    dietary: 'High Protein',
    mealPlan: '2500 kcal/day',
    clients: ['2']
  },
  {
    id: '3',
    name: 'Vegan',
    members: 1,
    dietaryGoal: 'Plant Based',
    createdAt: '20/01/2023',
    dietary: 'Plant Based',
    mealPlan: '2000 kcal/day',
    clients: ['3']
  },
  {
    id: '4',
    name: 'Maintenance',
    members: 1,
    dietaryGoal: 'Balanced',
    createdAt: '10/12/2022',
    dietary: 'Balanced',
    mealPlan: '2200 kcal/day',
    clients: ['4']
  },
];

// Define the AppContext type
interface AppContextType {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  addClient: (client: Client) => void;
  updateClient: (clientId: string, updatedClient: Partial<Client>) => void;
  deleteClient: (clientId: string) => void;
  addGroup: (group: Group) => void;
  updateGroup: (groupId: string, updatedGroup: Partial<Group>) => void;
  deleteGroup: (groupId: string) => void;
  togglePushNotification: (clientId: string, enabled: boolean) => Promise<void>;
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  notificationCount: number;
}

// Notification type
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

// Create the AppContext
const AppContext = createContext<AppContextType | undefined>(undefined);

// AppProvider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState<number>(0);

  // Load notifications from localStorage on initial load
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        const parsedNotifications = JSON.parse(savedNotifications);
        // Convert string dates back to Date objects
        const processedNotifications = parsedNotifications.map((notif: any) => ({
          ...notif,
          timestamp: new Date(notif.timestamp)
        }));
        setNotifications(processedNotifications);
        
        // Count unread notifications
        const unreadCount = processedNotifications.filter((n: Notification) => !n.read).length;
        setNotificationCount(unreadCount);
      }
    } catch (error) {
      console.error('Error loading notifications from localStorage:', error);
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications));
      
      // Update notification count
      const unreadCount = notifications.filter(n => !n.read).length;
      setNotificationCount(unreadCount);
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error);
    }
  }, [notifications]);

  // Add a client
  const addClient = (client: Client) => {
    setClients(prevClients => [...prevClients, client]);
    // Add notification when client is added
    addNotification({
      id: Date.now().toString(),
      title: 'New Client Added',
      message: `${client.name} has been added successfully.`,
      type: 'success',
      timestamp: new Date(),
      read: false
    });
  };

  // Update a client
  const updateClient = (clientId: string, updatedClient: Partial<Client>) => {
    setClients(prevClients => 
      prevClients.map(client => 
        client.id === clientId ? { ...client, ...updatedClient } : client
      )
    );
    // Add notification when client is updated
    addNotification({
      id: Date.now().toString(),
      title: 'Client Updated',
      message: `Client information has been updated successfully.`,
      type: 'info',
      timestamp: new Date(),
      read: false
    });
  };

  // Delete a client
  const deleteClient = (clientId: string) => {
    const clientToDelete = clients.find(client => client.id === clientId);
    setClients(prevClients => prevClients.filter(client => client.id !== clientId));
    
    // Add notification when client is deleted
    if (clientToDelete) {
      addNotification({
        id: Date.now().toString(),
        title: 'Client Deleted',
        message: `${clientToDelete.name} has been deleted.`,
        type: 'warning',
        timestamp: new Date(),
        read: false
      });
    }
  };

  // Add a group
  const addGroup = (group: Group) => {
    setGroups(prevGroups => [...prevGroups, group]);
    // Add notification when group is added
    addNotification({
      id: Date.now().toString(),
      title: 'New Group Created',
      message: `Group "${group.name}" has been created successfully.`,
      type: 'success',
      timestamp: new Date(),
      read: false
    });
  };

  // Update a group
  const updateGroup = (groupId: string, updatedGroup: Partial<Group>) => {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId ? { ...group, ...updatedGroup } : group
      )
    );
    // Add notification when group is updated
    addNotification({
      id: Date.now().toString(),
      title: 'Group Updated',
      message: `Group information has been updated successfully.`,
      type: 'info',
      timestamp: new Date(),
      read: false
    });
  };

  // Delete a group
  const deleteGroup = (groupId: string) => {
    const groupToDelete = groups.find(group => group.id === groupId);
    setGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
    
    // Add notification when group is deleted
    if (groupToDelete) {
      addNotification({
        id: Date.now().toString(),
        title: 'Group Deleted',
        message: `Group "${groupToDelete.name}" has been deleted.`,
        type: 'warning',
        timestamp: new Date(),
        read: false
      });
    }
  };

  // Toggle push notification for a client
  const togglePushNotification = async (clientId: string, enabled: boolean) => {
    try {
      // Update client in state
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === clientId ? { ...client, pushEnabled: enabled } : client
        )
      );
      
      // Get the client that was updated
      const client = clients.find(c => c.id === clientId);
      
      // Add notification
      addNotification({
        id: Date.now().toString(),
        title: 'Notification Settings Updated',
        message: `Push notifications ${enabled ? 'enabled' : 'disabled'} for ${client?.name || 'client'}.`,
        type: 'info',
        timestamp: new Date(),
        read: false
      });
      
      // Here you would typically make an API call to update the server
      // For now we'll just resolve the promise after a short delay
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 500);
      });
    } catch (error) {
      console.error('Error toggling push notification:', error);
      throw error;
    }
  };

  // Add a notification
  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    
    // Show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo.png'
      });
    }
    
    // Play notification sound if available
    try {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(e => console.log('Audio play failed:', e));
    } catch (e) {
      console.log('Audio not supported:', e);
    }
  };

  // Mark a notification as read
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider
      value={{
        clients,
        setClients,
        groups,
        setGroups,
        addClient,
        updateClient,
        deleteClient,
        addGroup,
        updateGroup,
        deleteGroup,
        togglePushNotification,
        notifications,
        addNotification,
        markNotificationAsRead,
        clearNotifications,
        notificationCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
