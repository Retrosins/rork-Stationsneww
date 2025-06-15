import { Space, SpaceFilter } from '@/types/space';

// Mock data for tattoo spaces
export const spaces: Space[] = [
  {
    id: '1',
    title: 'Modern Tattoo Station',
    description: 'A clean, modern tattoo station with all the equipment you need for your art. Located in the heart of downtown, this space offers a professional environment with great lighting and comfortable seating for your clients.',
    price: 75,
    priceUnit: 'hour',
    location: {
      city: 'New York',
      neighborhood: 'SoHo',
      address: '123 Broadway St',
      coordinates: {
        latitude: 40.7128,
        longitude: -74.0060
      }
    },
    images: [
      'https://images.unsplash.com/photo-1581695653556-e80424cb5162?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1559599076-9c61d8e1b77c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1585070824302-5f5a4e5f1c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ],
    capacity: 1,
    amenities: [
      'Professional Chair',
      'Sterilization Equipment',
      'Ink Supplies',
      'Tattoo Machine',
      'Power Supply',
      'Arm Rest',
      'Lighting',
      'Private Room',
      'WiFi'
    ],
    categories: ['Traditional', 'Modern', 'Private'],
    host: {
      id: 'host1',
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      rating: 4.8
    },
    rating: 4.9,
    reviews: 124,
    featured: true,
    availableDates: [
      {
        start: '2025-06-15T09:00:00Z',
        end: '2025-06-15T17:00:00Z'
      },
      {
        start: '2025-06-16T09:00:00Z',
        end: '2025-06-16T17:00:00Z'
      },
      {
        start: '2025-06-17T09:00:00Z',
        end: '2025-06-17T17:00:00Z'
      }
    ],
    createdAt: '2025-01-15T12:00:00Z',
    updatedAt: '2025-06-01T14:30:00Z'
  },
  {
    id: '2',
    title: 'Vintage Tattoo Parlor Space',
    description: 'Step back in time with this vintage-inspired tattoo space. Perfect for artists who appreciate classic tattoo culture. This space comes with traditional equipment and a unique atmosphere that clients will love.',
    price: 60,
    priceUnit: 'hour',
    location: {
      city: 'Los Angeles',
      neighborhood: 'Silver Lake',
      address: '456 Sunset Blvd',
      coordinates: {
        latitude: 34.0522,
        longitude: -118.2437
      }
    },
    images: [
      'https://images.unsplash.com/photo-1542727365-19732a80dcfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1516914589923-f105f1535f88?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ],
    capacity: 2,
    amenities: [
      'Premium Chair',
      'Sterilization Equipment',
      'Ink Supplies',
      'Tattoo Machine',
      'Power Supply',
      'Arm Rest',
      'Lighting',
      'WiFi',
      'Parking'
    ],
    categories: ['Traditional', 'Vintage', 'Shared'],
    host: {
      id: 'host2',
      name: 'Sam Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      rating: 4.7
    },
    rating: 4.6,
    reviews: 98,
    featured: false,
    availableDates: [
      {
        start: '2025-06-18T10:00:00Z',
        end: '2025-06-18T18:00:00Z'
      },
      {
        start: '2025-06-19T10:00:00Z',
        end: '2025-06-19T18:00:00Z'
      }
    ],
    createdAt: '2025-02-10T15:20:00Z',
    updatedAt: '2025-05-28T11:45:00Z'
  },
  {
    id: '3',
    title: 'Minimalist Studio Space',
    description: 'A clean, minimalist studio space perfect for detailed work. This bright, airy space offers a distraction-free environment where you can focus on your art. Equipped with high-quality tools and excellent natural lighting.',
    price: 90,
    priceUnit: 'hour',
    location: {
      city: 'Chicago',
      neighborhood: 'Wicker Park',
      address: '789 Milwaukee Ave',
      coordinates: {
        latitude: 41.8781,
        longitude: -87.6298
      }
    },
    images: [
      'https://images.unsplash.com/photo-1621618953781-4ff3d8fb1f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7dfd1b97809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ],
    capacity: 1,
    amenities: [
      'Professional Chair',
      'Sterilization Equipment',
      'Ink Supplies',
      'Needles',
      'Disposable Tubes',
      'Lighting',
      'Private Room',
      'WiFi',
      'Restroom',
      'Storage Space'
    ],
    categories: ['Modern', 'Minimalist', 'Private'],
    host: {
      id: 'host3',
      name: 'Jamie Lee',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      rating: 4.9
    },
    rating: 4.8,
    reviews: 156,
    featured: true,
    availableDates: [
      {
        start: '2025-06-15T08:00:00Z',
        end: '2025-06-15T20:00:00Z'
      },
      {
        start: '2025-06-16T08:00:00Z',
        end: '2025-06-16T20:00:00Z'
      },
      {
        start: '2025-06-17T08:00:00Z',
        end: '2025-06-17T20:00:00Z'
      },
      {
        start: '2025-06-18T08:00:00Z',
        end: '2025-06-18T20:00:00Z'
      }
    ],
    createdAt: '2025-03-05T09:15:00Z',
    updatedAt: '2025-06-10T16:20:00Z'
  },
  {
    id: '4',
    title: 'Artist Collective Station',
    description: 'Join our artist collective and rent this fully-equipped tattoo station. Work alongside other talented artists in a collaborative environment. Great for networking and building your client base.',
    price: 50,
    priceUnit: 'hour',
    location: {
      city: 'Austin',
      neighborhood: 'East Austin',
      address: '321 E 6th St',
      coordinates: {
        latitude: 30.2672,
        longitude: -97.7431
      }
    },
    images: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1556760544-74068565f05c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1556760544-b790f7373a7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ],
    capacity: 3,
    amenities: [
      'Professional Chair',
      'Sterilization Equipment',
      'Ink Supplies',
      'Tattoo Machine',
      'Power Supply',
      'Lighting',
      'WiFi',
      'Parking',
      'Refreshments',
      'Storage Space'
    ],
    categories: ['Modern', 'Collaborative', 'Shared'],
    host: {
      id: 'host4',
      name: 'Taylor Smith',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      rating: 4.6
    },
    rating: 4.5,
    reviews: 87,
    featured: false,
    availableDates: [
      {
        start: '2025-06-20T11:00:00Z',
        end: '2025-06-20T23:00:00Z'
      },
      {
        start: '2025-06-21T11:00:00Z',
        end: '2025-06-21T23:00:00Z'
      },
      {
        start: '2025-06-22T11:00:00Z',
        end: '2025-06-22T23:00:00Z'
      }
    ],
    createdAt: '2025-04-12T14:30:00Z',
    updatedAt: '2025-06-05T10:10:00Z'
  },
  {
    id: '5',
    title: 'Luxury Private Studio',
    description: 'Experience the ultimate in luxury with this private tattoo studio. Designed for artists who want to provide their clients with a premium experience. Includes high-end equipment and amenities.',
    price: 120,
    priceUnit: 'hour',
    location: {
      city: 'Miami',
      neighborhood: 'Wynwood',
      address: '555 NW 24th St',
      coordinates: {
        latitude: 25.7617,
        longitude: -80.1918
      }
    },
    images: [
      'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1600607688066-890987f18a86?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ],
    capacity: 1,
    amenities: [
      'Premium Chair',
      'Sterilization Equipment',
      'Ink Supplies',
      'Tattoo Machine',
      'Power Supply',
      'Arm Rest',
      'Lighting',
      'Private Room',
      'WiFi',
      'Parking',
      'Refreshments',
      'Storage Space'
    ],
    categories: ['Luxury', 'Private', 'Modern'],
    host: {
      id: 'host5',
      name: 'Jordan Rivera',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      rating: 4.9
    },
    rating: 5.0,
    reviews: 203,
    featured: true,
    availableDates: [
      {
        start: '2025-06-25T09:00:00Z',
        end: '2025-06-25T21:00:00Z'
      },
      {
        start: '2025-06-26T09:00:00Z',
        end: '2025-06-26T21:00:00Z'
      },
      {
        start: '2025-06-27T09:00:00Z',
        end: '2025-06-27T21:00:00Z'
      },
      {
        start: '2025-06-28T09:00:00Z',
        end: '2025-06-28T21:00:00Z'
      }
    ],
    createdAt: '2025-01-30T11:45:00Z',
    updatedAt: '2025-06-12T13:25:00Z'
  }
];

// List of common amenities for tattoo spaces
export const amenities = [
  'Professional Chair',
  'Premium Chair',
  'Sterilization Equipment',
  'Ink Supplies',
  'Tattoo Machine',
  'Power Supply',
  'Arm Rest',
  'Lighting',
  'Private Room',
  'WiFi',
  'Restroom',
  'Parking',
  'Storage Space',
  'Refreshments',
  'Needles',
  'Disposable Tubes',
  'Art Supplies',
  'Drawing Desk'
];

// List of categories for tattoo spaces
export const categories = [
  'Traditional',
  'Modern',
  'Vintage',
  'Minimalist',
  'Luxury',
  'Private',
  'Shared',
  'Collaborative'
];

// Function to get all spaces
export const getSpaces = (): Space[] => {
  return spaces;
};

// Function to get a space by ID
export const getSpaceById = (id: string): Space | undefined => {
  return spaces.find(space => space.id === id);
};

// Function to filter spaces based on criteria
export const filterSpaces = (spaces: Space[], filter: SpaceFilter): Space[] => {
  return spaces.filter(space => {
    // Filter by price range
    if (filter.minPrice !== undefined && space.price < filter.minPrice) {
      return false;
    }
    if (filter.maxPrice !== undefined && space.price > filter.maxPrice) {
      return false;
    }
    
    // Filter by location (city or neighborhood)
    if (filter.location && 
        !space.location.city.toLowerCase().includes(filter.location.toLowerCase()) && 
        !space.location.neighborhood.toLowerCase().includes(filter.location.toLowerCase())) {
      return false;
    }
    
    // Filter by search term (in title, description, city, or neighborhood)
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const matchesSearch = 
        space.title.toLowerCase().includes(searchLower) ||
        space.description.toLowerCase().includes(searchLower) ||
        space.location.city.toLowerCase().includes(searchLower) ||
        space.location.neighborhood.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) {
        return false;
      }
    }
    
    // Filter by category
    if (filter.category && !space.categories.includes(filter.category)) {
      return false;
    }
    
    // Filter by amenities (must have all specified amenities)
    if (filter.amenities && filter.amenities.length > 0) {
      const hasAllAmenities = filter.amenities.every(amenity => 
        space.amenities.includes(amenity)
      );
      if (!hasAllAmenities) {
        return false;
      }
    }
    
    // Filter by date availability
    if (filter.date) {
      const filterDate = filter.date.toISOString().split('T')[0];
      
      // Check if the space has available dates that include the filter date
      if (space.availableDates) {
        const isAvailable = space.availableDates.some(dateRange => {
          const startDate = new Date(dateRange.start).toISOString().split('T')[0];
          const endDate = new Date(dateRange.end).toISOString().split('T')[0];
          return filterDate >= startDate && filterDate <= endDate;
        });
        
        if (!isAvailable) {
          return false;
        }
      }
    }
    
    return true;
  });
};