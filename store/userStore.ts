import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  isHost?: boolean;
  isArtist?: boolean;
  subscription?: {
    id: string;
    type: 'artist' | 'host';
    active: boolean;
    expiresAt: string;
    price: number;
    billingCycle: 'weekly' | 'monthly' | 'yearly';
    setupFee?: number;
  };
  phone?: string;
  website?: string;
  instagram?: string;
  portfolio?: string[];
  password?: string; // Only used internally, never stored in state
}

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<string>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  becomeHost: () => Promise<{ success: boolean; message: string }>;
  becomeArtist: () => Promise<void>;
  subscribeAsArtist: (subscriptionId: string) => Promise<void>;
  subscribeAsHost: (subscriptionId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  upgradeSubscription: (subscriptionId: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

// Mock user data
const mockUsers: User[] = [
  {
    id: 'user1',
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Tattoo enthusiast and collector',
    phone: '555-123-4567',
    website: 'johndoe.com',
    instagram: 'johndoe_ink'
  },
  {
    id: 'user2',
    email: 'artist@example.com',
    password: 'password123',
    name: 'Jane Smith',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Professional tattoo artist specializing in watercolor designs',
    isArtist: true,
    phone: '555-987-6543',
    website: 'janesmith.art',
    instagram: 'janesmith_tattoos',
    portfolio: [
      'https://images.unsplash.com/photo-1590246814883-57764a07b31d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590246814931-c6ec8e9d225d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'user3',
    email: 'host@example.com',
    password: 'password123',
    name: 'Mike Johnson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Owner of Ink Studio, providing space for talented artists',
    isHost: true,
    phone: '555-456-7890',
    website: 'inkstudio.com',
    instagram: 'inkstudio_official'
  }
];

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      loading: false,
      error: null,
      
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Find user with matching email and password
          const user = mockUsers.find(u => u.email === email && u.password === password);
          
          if (user) {
            // Remove password from user object before storing
            const { password: _, ...userWithoutPassword } = user;
            
            set({ 
              user: userWithoutPassword,
              isLoggedIn: true,
              loading: false 
            });
          } else {
            throw new Error('Invalid email or password');
          }
        } catch (error) {
          console.error('Login error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            loading: false 
          });
        }
      },
      
      register: async (email, password, name) => {
        set({ loading: true, error: null });
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if email already exists
          if (mockUsers.some(u => u.email === email)) {
            throw new Error('Email already in use');
          }
          
          // Create new user
          const newUserId = `user${mockUsers.length + 1}`;
          const newUser: User = {
            id: newUserId,
            name,
            email,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            password
          };
          
          // Add to mock users (in a real app, this would persist to a database)
          mockUsers.push(newUser);
          
          // Remove password from user object before storing in state
          const { password: _, ...userWithoutPassword } = newUser;
          
          set({ 
            user: userWithoutPassword,
            isLoggedIn: true,
            loading: false 
          });
          
          return newUserId;
        } catch (error) {
          console.error('Registration error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Registration failed',
            loading: false 
          });
          throw error;
        }
      },
      
      logout: async () => {
        set({ loading: true });
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set({ user: null, isLoggedIn: false, loading: false });
        } catch (error) {
          console.error('Logout error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Logout failed',
            loading: false 
          });
        }
      },
      
      updateProfile: async (userData) => {
        set({ loading: true, error: null });
        try {
          const { user } = get();
          if (!user) throw new Error('User not logged in');
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Update user in mock data
          const userIndex = mockUsers.findIndex(u => u.id === user.id);
          if (userIndex >= 0) {
            mockUsers[userIndex] = { 
              ...mockUsers[userIndex], 
              ...userData 
            };
          }
          
          set(state => ({
            user: state.user ? { ...state.user, ...userData } : null,
            loading: false
          }));
        } catch (error) {
          console.error('Update profile error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update profile',
            loading: false 
          });
        }
      },
      
      becomeHost: async () => {
        set({ loading: true, error: null });
        try {
          const { user } = get();
          if (!user) throw new Error('User not logged in');
          
          // Check if user has the correct subscription type
          if (!user.subscription || user.subscription.type !== 'host') {
            return {
              success: false,
              message: 'You need a host subscription to become a host. Please upgrade your subscription.'
            };
          }
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Update user in mock data
          const userIndex = mockUsers.findIndex(u => u.id === user.id);
          if (userIndex >= 0) {
            mockUsers[userIndex].isHost = true;
          }
          
          set(state => ({
            user: state.user ? { ...state.user, isHost: true } : null,
            loading: false
          }));
          
          return {
            success: true,
            message: 'You are now a host!'
          };
        } catch (error) {
          console.error('Become host error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to become a host',
            loading: false 
          });
          return {
            success: false,
            message: 'An error occurred while becoming a host.'
          };
        }
      },

      becomeArtist: async () => {
        set({ loading: true, error: null });
        try {
          const { user } = get();
          if (!user) throw new Error('User not logged in');
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Update user in mock data
          const userIndex = mockUsers.findIndex(u => u.id === user.id);
          if (userIndex >= 0) {
            mockUsers[userIndex].isArtist = true;
          }
          
          set(state => ({
            user: state.user ? { ...state.user, isArtist: true } : null,
            loading: false
          }));
        } catch (error) {
          console.error('Become artist error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to become an artist',
            loading: false 
          });
        }
      },

      subscribeAsArtist: async (subscriptionId) => {
        set({ loading: true, error: null });
        try {
          const { user } = get();
          if (!user) throw new Error('User not logged in');
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock subscription data
          const subscriptionData = {
            price: 25,
            durationWeeks: 4,
            billingCycle: 'monthly' as const,
            setupFee: 99.99
          };
          
          // Calculate expiration date based on duration
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + (subscriptionData.durationWeeks * 7));
          
          // Create subscription in user document
          const userSubscription = {
            id: subscriptionId,
            type: 'artist' as const,
            active: true,
            expiresAt: expiresAt.toISOString(),
            price: subscriptionData.price,
            billingCycle: subscriptionData.billingCycle,
            setupFee: subscriptionData.setupFee
          };
          
          // Update user in mock data
          const userIndex = mockUsers.findIndex(u => u.id === user.id);
          if (userIndex >= 0) {
            mockUsers[userIndex].isArtist = true;
            mockUsers[userIndex].subscription = userSubscription;
          }
          
          set(state => ({
            user: state.user ? { 
              ...state.user, 
              isArtist: true,
              subscription: userSubscription
            } : null,
            loading: false
          }));
        } catch (error) {
          console.error('Subscribe as artist error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to subscribe as artist',
            loading: false 
          });
        }
      },

      subscribeAsHost: async (subscriptionId) => {
        set({ loading: true, error: null });
        try {
          const { user } = get();
          if (!user) throw new Error('User not logged in');
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock subscription data
          const subscriptionData = {
            price: 50,
            durationWeeks: 4,
            billingCycle: 'monthly' as const
          };
          
          // Calculate expiration date based on duration
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + (subscriptionData.durationWeeks * 7));
          
          // Create subscription in user document
          const userSubscription = {
            id: subscriptionId,
            type: 'host' as const,
            active: true,
            expiresAt: expiresAt.toISOString(),
            price: subscriptionData.price,
            billingCycle: subscriptionData.billingCycle
          };
          
          // Update user in mock data
          const userIndex = mockUsers.findIndex(u => u.id === user.id);
          if (userIndex >= 0) {
            mockUsers[userIndex].isHost = true;
            mockUsers[userIndex].subscription = userSubscription;
          }
          
          set(state => ({
            user: state.user ? { 
              ...state.user, 
              isHost: true,
              subscription: userSubscription
            } : null,
            loading: false
          }));
        } catch (error) {
          console.error('Subscribe as host error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to subscribe as host',
            loading: false 
          });
        }
      },

      upgradeSubscription: async (subscriptionId) => {
        set({ loading: true, error: null });
        try {
          const { user } = get();
          if (!user) throw new Error('User not logged in');
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock subscription data based on ID
          const isArtistSub = subscriptionId.includes('artist');
          const subscriptionData = {
            type: isArtistSub ? 'artist' as const : 'host' as const,
            price: isArtistSub ? 25 : 50,
            durationWeeks: 4,
            billingCycle: 'monthly' as const,
            setupFee: isArtistSub ? 99.99 : undefined
          };
          
          // Calculate expiration date based on duration
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + (subscriptionData.durationWeeks * 7));
          
          // Create subscription in user document
          const userSubscription = {
            id: subscriptionId,
            type: subscriptionData.type,
            active: true,
            expiresAt: expiresAt.toISOString(),
            price: subscriptionData.price,
            billingCycle: subscriptionData.billingCycle,
            setupFee: subscriptionData.setupFee
          };
          
          // Update user in mock data
          const userIndex = mockUsers.findIndex(u => u.id === user.id);
          if (userIndex >= 0) {
            if (subscriptionData.type === 'artist') {
              mockUsers[userIndex].isArtist = true;
            } else if (subscriptionData.type === 'host') {
              mockUsers[userIndex].isHost = true;
            }
            mockUsers[userIndex].subscription = userSubscription;
          }
          
          set(state => ({
            user: state.user ? { 
              ...state.user,
              ...(subscriptionData.type === 'artist' ? { isArtist: true } : {}),
              ...(subscriptionData.type === 'host' ? { isHost: true } : {}),
              subscription: userSubscription
            } : null,
            loading: false
          }));
        } catch (error) {
          console.error('Upgrade subscription error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to upgrade subscription',
            loading: false 
          });
        }
      },

      cancelSubscription: async () => {
        set({ loading: true, error: null });
        try {
          const { user } = get();
          if (!user) throw new Error('User not logged in');
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Update user in mock data
          const userIndex = mockUsers.findIndex(u => u.id === user.id);
          if (userIndex >= 0) {
            mockUsers[userIndex].subscription = undefined;
          }
          
          set(state => ({
            user: state.user ? { 
              ...state.user, 
              subscription: undefined
            } : null,
            loading: false
          }));
        } catch (error) {
          console.error('Cancel subscription error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to cancel subscription',
            loading: false 
          });
        }
      },
      
      refreshUserData: async () => {
        set({ loading: true, error: null });
        try {
          const { user } = get();
          if (!user) {
            set({ loading: false });
            return;
          }
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Find user in mock data
          const foundUser = mockUsers.find(u => u.id === user.id);
          
          if (foundUser) {
            // Remove password from user object before storing
            const { password: _, ...userWithoutPassword } = foundUser;
            
            set({ 
              user: userWithoutPassword,
              isLoggedIn: true,
              loading: false 
            });
          } else {
            set({ user: null, isLoggedIn: false, loading: false });
          }
        } catch (error) {
          console.error('Refresh user data error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to refresh user data',
            loading: false 
          });
        }
      }
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user,
        isLoggedIn: state.isLoggedIn 
      }),
    }
  )
);