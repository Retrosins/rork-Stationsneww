import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Space, SpaceFilter } from '@/types/space';
import { getSpaces, filterSpaces } from '@/mocks/spaces';

interface SpaceState {
  spaces: Space[];
  filteredSpaces: Space[];
  filter: SpaceFilter;
  favorites: string[];
  loading: boolean;
  fetchSpaces: () => Promise<void>;
  setFilter: (filter: Partial<SpaceFilter>) => void;
  clearFilter: () => void;
  toggleFavorite: (spaceId: string) => void;
  addSpace: (space: Space) => void;
  updateSpace: (space: Space) => void;
  deleteSpace: (spaceId: string) => void;
  getFilteredSpaces: () => Space[];
}

export const useSpaceStore = create<SpaceState>()(
  persist(
    (set, get) => ({
      spaces: [],
      filteredSpaces: [],
      filter: {},
      favorites: [],
      loading: false,
      
      fetchSpaces: async () => {
        set({ loading: true });
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const spaces = getSpaces();
          set({ spaces, filteredSpaces: spaces, loading: false });
        } catch (error) {
          console.error('Error fetching spaces:', error);
          set({ loading: false });
        }
      },
      
      setFilter: (newFilter) => {
        const currentFilter = get().filter;
        const updatedFilter = { ...currentFilter, ...newFilter };
        const filteredSpaces = filterSpaces(get().spaces, updatedFilter);
        set({ filter: updatedFilter, filteredSpaces });
      },
      
      clearFilter: () => {
        const spaces = get().spaces;
        set({ filter: {}, filteredSpaces: spaces });
      },
      
      toggleFavorite: (spaceId) => {
        const favorites = [...get().favorites];
        const index = favorites.indexOf(spaceId);
        
        if (index === -1) {
          favorites.push(spaceId);
        } else {
          favorites.splice(index, 1);
        }
        
        set({ favorites });
      },
      
      addSpace: (space) => {
        const spaces = [...get().spaces, space];
        set({ 
          spaces, 
          filteredSpaces: filterSpaces(spaces, get().filter)
        });
      },
      
      updateSpace: (updatedSpace) => {
        const spaces = get().spaces.map(space => 
          space.id === updatedSpace.id ? updatedSpace : space
        );
        set({ 
          spaces, 
          filteredSpaces: filterSpaces(spaces, get().filter)
        });
      },
      
      deleteSpace: (spaceId) => {
        const spaces = get().spaces.filter(space => space.id !== spaceId);
        set({ 
          spaces, 
          filteredSpaces: filterSpaces(spaces, get().filter)
        });
      },
      
      getFilteredSpaces: () => {
        return get().filteredSpaces;
      },
    }),
    {
      name: 'space-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        favorites: state.favorites,
        filter: state.filter,
      }),
    }
  )
);