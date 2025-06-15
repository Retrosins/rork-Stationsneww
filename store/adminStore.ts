import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorScheme } from '@/constants/colors';
import DefaultColors from '@/constants/colors';

// Define types for admin store
export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'super' | 'admin' | 'moderator';
  avatar?: string;
}

export interface AppCustomization {
  appName?: string;
  logo?: string;
  colorScheme?: Partial<ColorScheme>;
  featuredSpaceIds: string[]; // IDs of featured spaces - ensure it's always initialized
}

export interface ActivityLogEntry {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  details?: string;
  timestamp: number;
}

interface AdminState {
  isAuthenticated: boolean;
  currentAdmin: Admin | null;
  admins: Admin[];
  appCustomization: AppCustomization;
  activityLog: ActivityLogEntry[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  logoutAdmin: () => void; // Alias for logout for backward compatibility
  addAdmin: (admin: Omit<Admin, 'id'>) => void;
  removeAdmin: (id: string) => void;
  updateAppCustomization: (customization: Partial<AppCustomization>) => void;
  updateColorScheme: (colorScheme: Partial<ColorScheme>) => void;
  resetColorScheme: () => void; // Added reset function
  addActivityLog: (entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => void;
  logActivity: (action: string, details?: string) => void; // Alias for addActivityLog
  addFeaturedSpace: (spaceId: string) => void;
  removeFeaturedSpace: (spaceId: string) => void;
  getFeaturedSpaceIds: () => string[]; // Added getter function
}

// Default app customization with initialized arrays
const defaultAppCustomization: AppCustomization = {
  appName: 'TattooSpace',
  logo: '',
  colorScheme: {
    // Dark theme by default
    primary: '#FF5A5F',
    secondary: '#00A699',
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    headerBackground: '#1E1E1E',
    headerText: '#FFFFFF',
    inputBackground: '#2C2C2C',
    inputText: '#FFFFFF',
    buttonText: '#FFFFFF',
    tabBarActive: '#FF5A5F',
    tabBarInactive: '#888888',
    tabBarBackground: '#1E1E1E',
    border: '#333333',
  },
  featuredSpaceIds: [], // Always initialize as empty array
};

// Create admin store with persistence
export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      currentAdmin: null,
      admins: [
        {
          id: '1',
          name: 'Super Admin',
          email: 'admin@example.com',
          role: 'super',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
      ],
      appCustomization: defaultAppCustomization,
      activityLog: [],
      
      login: async (email: string, password: string) => {
        // Mock login - in a real app, this would call an API
        const admin = get().admins.find(a => a.email === email);
        if (admin && password === 'admin') { // Simple mock password check
          set({ isAuthenticated: true, currentAdmin: admin });
          
          // Add login to activity log
          get().addActivityLog({
            adminId: admin.id,
            adminName: admin.name,
            action: 'Logged in',
          });
          
          return true;
        }
        return false;
      },
      
      logout: () => {
        const admin = get().currentAdmin;
        if (admin) {
          // Add logout to activity log
          get().addActivityLog({
            adminId: admin.id,
            adminName: admin.name,
            action: 'Logged out',
          });
        }
        
        set({ isAuthenticated: false, currentAdmin: null });
      },
      
      // Alias for logout for backward compatibility
      logoutAdmin: function() {
        return this.logout();
      },
      
      addAdmin: (admin) => {
        const newAdmin = {
          ...admin,
          id: Date.now().toString(),
        };
        
        set(state => ({
          admins: [...state.admins, newAdmin],
        }));
        
        // Add to activity log
        const currentAdmin = get().currentAdmin;
        if (currentAdmin) {
          get().addActivityLog({
            adminId: currentAdmin.id,
            adminName: currentAdmin.name,
            action: 'Added new admin',
            details: `Added ${newAdmin.name} (${newAdmin.email}) as ${newAdmin.role}`,
          });
        }
      },
      
      removeAdmin: (id) => {
        const adminToRemove = get().admins.find(a => a.id === id);
        
        set(state => ({
          admins: state.admins.filter(a => a.id !== id),
        }));
        
        // Add to activity log
        const currentAdmin = get().currentAdmin;
        if (currentAdmin && adminToRemove) {
          get().addActivityLog({
            adminId: currentAdmin.id,
            adminName: currentAdmin.name,
            action: 'Removed admin',
            details: `Removed ${adminToRemove.name} (${adminToRemove.email})`,
          });
        }
      },
      
      updateAppCustomization: (customization) => {
        set(state => {
          // Ensure we have a valid appCustomization object
          const currentCustomization = state.appCustomization || defaultAppCustomization;
          
          return {
            appCustomization: {
              ...currentCustomization,
              ...customization,
              // Ensure featuredSpaceIds is always an array
              featuredSpaceIds: customization.featuredSpaceIds || currentCustomization.featuredSpaceIds || [],
            },
          };
        });
        
        // Add to activity log
        const currentAdmin = get().currentAdmin;
        if (currentAdmin) {
          get().addActivityLog({
            adminId: currentAdmin.id,
            adminName: currentAdmin.name,
            action: 'Updated app customization',
            details: `Updated: ${Object.keys(customization).join(', ')}`,
          });
        }
      },
      
      updateColorScheme: (colorScheme) => {
        set(state => {
          // Ensure we have a valid appCustomization object
          const currentCustomization = state.appCustomization || defaultAppCustomization;
          
          return {
            appCustomization: {
              ...currentCustomization,
              colorScheme: {
                ...(currentCustomization.colorScheme || {}),
                ...colorScheme,
              },
            },
          };
        });
        
        // Add to activity log
        const currentAdmin = get().currentAdmin;
        if (currentAdmin) {
          get().addActivityLog({
            adminId: currentAdmin.id,
            adminName: currentAdmin.name,
            action: 'Updated color scheme',
            details: `Updated colors: ${Object.keys(colorScheme).join(', ')}`,
          });
        }
      },
      
      // Add reset color scheme function
      resetColorScheme: () => {
        set(state => {
          // Ensure we have a valid appCustomization object
          const currentCustomization = state.appCustomization || defaultAppCustomization;
          
          return {
            appCustomization: {
              ...currentCustomization,
              colorScheme: {
                // Reset to default dark theme
                primary: '#FF5A5F',
                secondary: '#00A699',
                background: '#121212',
                card: '#1E1E1E',
                text: '#FFFFFF',
                headerBackground: '#1E1E1E',
                headerText: '#FFFFFF',
                inputBackground: '#2C2C2C',
                inputText: '#FFFFFF',
                buttonText: '#FFFFFF',
                tabBarActive: '#FF5A5F',
                tabBarInactive: '#888888',
                tabBarBackground: '#1E1E1E',
                border: '#333333',
              },
            },
          };
        });
        
        // Add to activity log
        const currentAdmin = get().currentAdmin;
        if (currentAdmin) {
          get().addActivityLog({
            adminId: currentAdmin.id,
            adminName: currentAdmin.name,
            action: 'Reset color scheme',
            details: 'Reset to default dark theme',
          });
        }
      },
      
      addActivityLog: (entry) => {
        const newEntry = {
          ...entry,
          id: Date.now().toString(),
          timestamp: Date.now(),
        };
        
        set(state => ({
          activityLog: [newEntry, ...(state.activityLog || [])],
        }));
      },
      
      // Alias for addActivityLog with simpler parameters
      logActivity: function(action, details) {
        const currentAdmin = get().currentAdmin;
        if (currentAdmin) {
          this.addActivityLog({
            adminId: currentAdmin.id,
            adminName: currentAdmin.name,
            action,
            details,
          });
        }
      },
      
      // Add a space to featured spaces
      addFeaturedSpace: (spaceId) => {
        set(state => {
          // Ensure we have a valid appCustomization object
          const currentCustomization = state.appCustomization || defaultAppCustomization;
          
          // Get current featured space IDs or initialize empty array
          const currentFeaturedIds = currentCustomization.featuredSpaceIds || [];
          
          // Only add if not already in the list
          if (!currentFeaturedIds.includes(spaceId)) {
            return {
              appCustomization: {
                ...currentCustomization,
                featuredSpaceIds: [...currentFeaturedIds, spaceId],
              },
            };
          }
          return state;
        });
        
        // Add to activity log
        const currentAdmin = get().currentAdmin;
        if (currentAdmin) {
          get().addActivityLog({
            adminId: currentAdmin.id,
            adminName: currentAdmin.name,
            action: 'Added featured station',
            details: `Added station ID ${spaceId} to featured list`,
          });
        }
      },
      
      // Remove a space from featured spaces
      removeFeaturedSpace: (spaceId) => {
        set(state => {
          // Ensure we have a valid appCustomization object
          const currentCustomization = state.appCustomization || defaultAppCustomization;
          
          // Get current featured space IDs or initialize empty array
          const currentFeaturedIds = currentCustomization.featuredSpaceIds || [];
          
          return {
            appCustomization: {
              ...currentCustomization,
              featuredSpaceIds: currentFeaturedIds.filter(id => id !== spaceId),
            },
          };
        });
        
        // Add to activity log
        const currentAdmin = get().currentAdmin;
        if (currentAdmin) {
          get().addActivityLog({
            adminId: currentAdmin.id,
            adminName: currentAdmin.name,
            action: 'Removed featured station',
            details: `Removed station ID ${spaceId} from featured list`,
          });
        }
      },
      
      // Getter for featured space IDs
      getFeaturedSpaceIds: () => {
        const state = get();
        return (state.appCustomization && state.appCustomization.featuredSpaceIds) || [];
      },
    }),
    {
      name: 'admin-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);