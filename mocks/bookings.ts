import { Booking } from '@/types/space';

export const bookings: Booking[] = [
  {
    id: 'b1',
    spaceId: '1',
    userId: 'u1',
    startDate: '2025-06-15T10:00:00Z',
    endDate: '2025-06-15T14:00:00Z',
    totalPrice: 300,
    status: 'confirmed',
    createdAt: '2025-06-02T08:30:00Z',
  },
  {
    id: 'b2',
    spaceId: '3',
    userId: 'u1',
    startDate: '2025-06-20T13:00:00Z',
    endDate: '2025-06-20T15:00:00Z',
    totalPrice: 90,
    status: 'pending',
    createdAt: '2025-06-01T14:45:00Z',
  },
  {
    id: 'b3',
    spaceId: '5',
    userId: 'u1',
    startDate: '2025-05-10T16:00:00Z',
    endDate: '2025-05-10T20:00:00Z',
    totalPrice: 480,
    status: 'completed',
    createdAt: '2025-04-25T11:20:00Z',
  },
];