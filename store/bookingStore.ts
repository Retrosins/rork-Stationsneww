import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking } from '@/types/space';
import { bookings as mockBookingsData } from '@/mocks/bookings';

interface BookingState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  fetchBookings: () => Promise<void>;
  fetchBookingsByUser: (userId: string) => Promise<void>;
  fetchBookingsBySpace: (spaceId: string) => Promise<void>;
  fetchBookingsByHost: (hostId: string) => Promise<void>;
  getBookingById: (id: string) => Promise<Booking | null>;
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<string>;
  cancelBooking: (bookingId: string) => Promise<void>;
  approveBooking: (bookingId: string) => Promise<void>;
  rejectBooking: (bookingId: string) => Promise<void>;
}

// Create a copy of mock bookings to work with
let mockBookings = [...mockBookingsData];

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],
      loading: false,
      error: null,
      
      fetchBookings: async () => {
        set({ loading: true, error: null });
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Get current user ID from user store (if available)
          const userId = 'user1'; // Default to user1 for mock data
          
          // Filter bookings by user ID
          const userBookings = mockBookings.filter(booking => booking.userId === userId);
          
          set({ bookings: userBookings, loading: false });
        } catch (error) {
          console.error('Fetch bookings error:', error);
          set({ 
            bookings: mockBookings, 
            error: error instanceof Error ? error.message : 'Failed to fetch bookings',
            loading: false 
          });
        }
      },
      
      fetchBookingsByUser: async (userId) => {
        set({ loading: true, error: null });
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Filter bookings by user ID
          const userBookings = mockBookings.filter(booking => booking.userId === userId);
          
          set({ bookings: userBookings, loading: false });
        } catch (error) {
          console.error('Fetch bookings by user error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch bookings',
            loading: false 
          });
        }
      },
      
      fetchBookingsBySpace: async (spaceId) => {
        set({ loading: true, error: null });
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Filter bookings by space ID
          const spaceBookings = mockBookings.filter(booking => booking.spaceId === spaceId);
          
          set({ bookings: spaceBookings, loading: false });
        } catch (error) {
          console.error('Fetch bookings by space error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch bookings',
            loading: false 
          });
        }
      },
      
      fetchBookingsByHost: async (hostId) => {
        set({ loading: true, error: null });
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Filter bookings by host ID
          const hostBookings = mockBookings.filter(booking => booking.hostId === hostId);
          
          set({ bookings: hostBookings, loading: false });
        } catch (error) {
          console.error('Fetch bookings by host error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch bookings',
            loading: false 
          });
        }
      },
      
      getBookingById: async (id) => {
        try {
          // Find booking by ID
          const booking = mockBookings.find(booking => booking.id === id);
          return booking || null;
        } catch (error) {
          console.error('Get booking by ID error:', error);
          // Fallback to local state if needed
          return get().bookings.find(booking => booking.id === id) || null;
        }
      },
      
      createBooking: async (bookingData) => {
        set({ loading: true, error: null });
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Generate a unique ID
          const id = `booking-${Date.now()}`;
          
          const newBooking: Booking = {
            ...bookingData,
            id,
            createdAt: new Date().toISOString()
          };
          
          // Add to mock bookings
          mockBookings = [newBooking, ...mockBookings];
          
          set(state => ({
            bookings: [newBooking, ...state.bookings],
            loading: false
          }));
          
          return id;
        } catch (error) {
          console.error('Create booking error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create booking',
            loading: false 
          });
          throw error;
        }
      },
      
      cancelBooking: async (bookingId) => {
        set({ loading: true, error: null });
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Update booking in mock data
          mockBookings = mockBookings.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status: 'cancelled' as const } 
              : booking
          );
          
          set(state => ({
            bookings: state.bookings.map(booking => 
              booking.id === bookingId 
                ? { ...booking, status: 'cancelled' as const } 
                : booking
            ),
            loading: false
          }));
        } catch (error) {
          console.error('Cancel booking error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to cancel booking',
            loading: false 
          });
          throw error;
        }
      },
      
      approveBooking: async (bookingId) => {
        set({ loading: true, error: null });
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Update booking in mock data
          mockBookings = mockBookings.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status: 'confirmed' as const } 
              : booking
          );
          
          set(state => ({
            bookings: state.bookings.map(booking => 
              booking.id === bookingId 
                ? { ...booking, status: 'confirmed' as const } 
                : booking
            ),
            loading: false
          }));
        } catch (error) {
          console.error('Approve booking error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to approve booking',
            loading: false 
          });
          throw error;
        }
      },
      
      rejectBooking: async (bookingId) => {
        set({ loading: true, error: null });
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Update booking in mock data
          mockBookings = mockBookings.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status: 'rejected' as const } 
              : booking
          );
          
          set(state => ({
            bookings: state.bookings.map(booking => 
              booking.id === bookingId 
                ? { ...booking, status: 'rejected' as const } 
                : booking
            ),
            loading: false
          }));
        } catch (error) {
          console.error('Reject booking error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to reject booking',
            loading: false 
          });
          throw error;
        }
      }
    }),
    {
      name: 'booking-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);