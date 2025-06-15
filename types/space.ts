export interface Space {
  id: string;
  title: string;
  description: string;
  price: number;
  priceUnit: 'hour' | 'day';
  location: {
    city: string;
    neighborhood: string;
    address?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  images: string[];
  capacity: number;
  amenities: string[];
  categories: string[];
  host: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  rating: number;
  reviews: number;
  featured: boolean;
  availableDates?: {
    start: string;
    end: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface SpaceFilter {
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  amenities?: string[];
  date?: Date;
  search?: string;
  category?: string;
}

export interface Booking {
  id: string;
  spaceId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
  createdAt: string;
  hostId?: string;
}