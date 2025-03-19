import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

// Define the context type
interface AppContextType {
  // Clients
  clients: Client[];
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  toggleClientPush: (id: string, enabled: boolean) => void;
  
  // Groups
  groups: Group[];
  addGroup: (group: Omit<Group, 'id' | 'members' | 'createdAt'>) => void;
  updateGroup: (group: Group) => void;
  deleteGroup: (id: string) => void;
  
  // Available clients for selection
  availableClients: { id: string; name: string }[];
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  // State for clients and groups
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  
  // Derived state for available clients
  const availableClients = clients.map(client => ({
    id: client.id,
    name: client.name
  }));
  
  // Client operations
  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient = {
      ...client,
      id: String(Date.now()),
      pushEnabled: false
    };
    setClients(prevClients => [...prevClients, newClient]);
  };
  
  const updateClient = (client: Client) => {
    setClients(prevClients => 
      prevClients.map(c => c.id === client.id ? client : c)
    );
  };
  
  const deleteClient = (id: string) => {
    setClients(prevClients => prevClients.filter(c => c.id !== id));
  };
  
  const toggleClientPush = (id: string, enabled: boolean) => {
    setClients(prevClients => 
      prevClients.map(c => c.id === id ? { ...c, pushEnabled: enabled } : c)
    );
  };
  
  // Group operations
  const addGroup = (group: Omit<Group, 'id' | 'members' | 'createdAt'>) => {
    const newGroup = {
      ...group,
      id: String(Date.now()),
      members: group.clients?.length || 0,
      createdAt: new Date().toLocaleDateString()
    };
    setGroups(prevGroups => [...prevGroups, newGroup]);
  };
  
  const updateGroup = (group: Group) => {
    // Ensure the members count is updated based on the clients array
    const updatedGroup = {
      ...group,
      members: group.clients?.length || 0
    };
    
    setGroups(prevGroups => 
      prevGroups.map(g => g.id === updatedGroup.id ? updatedGroup : g)
    );
    
    // Update client groups if the group name changed
    const existingGroup = groups.find(g => g.id === group.id);
    if (existingGroup && existingGroup.name !== group.name) {
      setClients(prevClients => 
        prevClients.map(c => 
          c.group === existingGroup.name ? { ...c, group: group.name } : c
        )
      );
    }
  };
  
  const deleteGroup = (id: string) => {
    const groupToDelete = groups.find(g => g.id === id);
    setGroups(prevGroups => prevGroups.filter(g => g.id !== id));
    
    // Update clients that were in this group
    if (groupToDelete) {
      setClients(prevClients => 
        prevClients.map(c => 
          c.group === groupToDelete.name ? { ...c, group: '' } : c
        )
      );
    }
  };
  
  // Calculate members count for each group
  useEffect(() => {
    setGroups(prevGroups => 
      prevGroups.map(group => {
        // Use the clients array in the group to determine member count
        const memberCount = group.clients?.length || 0;
        return { ...group, members: memberCount };
      })
    );
  }, [clients]);
  
  const value = {
    clients,
    addClient,
    updateClient,
    deleteClient,
    toggleClientPush,
    groups,
    addGroup,
    updateGroup,
    deleteGroup,
    availableClients
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
