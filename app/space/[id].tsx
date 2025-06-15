import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSpaceStore } from '@/store/spaceStore';
import { useUserStore } from '@/store/userStore';
import { getDynamicColors } from '@/constants/colors';
import ImageGallery from '@/components/ImageGallery';
import Button from '@/components/Button';
import { 
  MapPin, 
  Users, 
  Star, 
  Heart, 
  Share2,
  Calendar,
  Clock,
  Wifi,
  Coffee,
  Zap,
  Droplets,
  Armchair,
  Palette,
  Lock,
} from 'lucide-react-native';
import { Image } from 'expo-image';

// Map of amenity names to icons
const amenityIcons: Record<string, any> = {
  'Professional Chair': Armchair,
  'Premium Chair': Armchair,
  'Sterilization Equipment': Droplets,
  'Ink Supplies': Palette,
  'Needles': Palette,
  'Disposable Tubes': Palette,
  'Tattoo Machine': Zap,
  'Power Supply': Zap,
  'Arm Rest': Users,
  'Lighting': Zap,
  'Private Area': Lock,
  'Private Room': Lock,
  'WiFi': Wifi,
  'Restroom': Users,
  'Parking': Users,
  'Storage Space': Users,
  'Refreshments': Coffee,
  'Art Supplies': Palette,
  'Drawing Desk': Users,
};

export default function SpaceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { spaces, favorites, toggleFavorite } = useSpaceStore();
  const { isLoggedIn } = useUserStore();
  const [space, setSpace] = useState(spaces.find(s => s.id === id));
  const colors = getDynamicColors();
  
  useEffect(() => {
    // Update space if it changes in the store
    const currentSpace = spaces.find(s => s.id === id);
    if (currentSpace) {
      setSpace(currentSpace);
    }
  }, [spaces, id]);
  
  if (!space) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.text, { color: colors.text }]}>Tattoo station not found</Text>
      </View>
    );
  }
  
  const isFavorite = favorites.includes(space.id);
  
  const handleFavoritePress = () => {
    toggleFavorite(space.id);
  };
  
  const handleSharePress = () => {
    if (Platform.OS === 'web') {
      Alert.alert('Share', 'Sharing is not available on web');
      return;
    }
    
    Alert.alert('Share', 'Share this tattoo station with friends');
  };
  
  const handleBookPress = () => {
    if (!isLoggedIn) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to book this tattoo station',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Sign In',
            onPress: () => router.push('/auth/login'),
          },
        ]
      );
      return;
    }
    
    router.push({
      pathname: '/booking/create',
      params: { spaceId: space.id }
    });
  };
  
  // Helper function to render amenity icon
  const renderAmenityIcon = (amenity: string) => {
    const IconComponent = amenityIcons[amenity] || Users;
    return <IconComponent size={18} color={colors.gray[600]} />;
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageGallery images={space.images} />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>{space.title}</Text>
              <View style={styles.locationRow}>
                <MapPin size={16} color={colors.gray[600]} />
                <Text style={[styles.location, { color: colors.gray[600] }]}>
                  {space.location.neighborhood}, {space.location.city}
                </Text>
              </View>
            </View>
            
            <View style={styles.actions}>
              <Pressable
                style={styles.actionButton}
                onPress={handleFavoritePress}
                hitSlop={8}
              >
                <Heart
                  size={24}
                  color={isFavorite ? colors.error : colors.gray[600]}
                  fill={isFavorite ? colors.error : 'transparent'}
                />
              </Pressable>
              
              <Pressable
                style={styles.actionButton}
                onPress={handleSharePress}
                hitSlop={8}
              >
                <Share2 size={24} color={colors.gray[600]} />
              </Pressable>
            </View>
          </View>
          
          <View style={styles.ratingRow}>
            <Star size={18} color={colors.primary} fill={colors.primary} />
            <Text style={[styles.rating, { color: colors.text }]}>{space.rating}</Text>
            <Text style={[styles.reviews, { color: colors.gray[600] }]}>({space.reviews} reviews)</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.text }]}>
              ${space.price}
              <Text style={[styles.priceUnit, { color: colors.gray[600] }]}>/{space.priceUnit}</Text>
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
            <Text style={[styles.description, { color: colors.text }]}>{space.description}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Details</Text>
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Users size={20} color={colors.gray[600]} />
                <Text style={[styles.detailText, { color: colors.text }]}>
                  For {space.capacity} {space.capacity === 1 ? 'artist' : 'artists'}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Calendar size={20} color={colors.gray[600]} />
                <Text style={[styles.detailText, { color: colors.text }]}>
                  Available for booking
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Clock size={20} color={colors.gray[600]} />
                <Text style={[styles.detailText, { color: colors.text }]}>
                  Minimum booking: 1 {space.priceUnit}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              {space.amenities.map((amenity, index) => (
                <View key={index} style={[styles.amenityItem, { backgroundColor: colors.gray[100] }]}>
                  {renderAmenityIcon(amenity)}
                  <Text style={[styles.amenityText, { color: colors.text }]}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Host</Text>
            <View style={[styles.hostContainer, { backgroundColor: colors.gray[100] }]}>
              <View style={styles.hostImageContainer}>
                <Image
                  source={{ uri: space.host.avatar }}
                  style={styles.hostImage}
                  contentFit="cover"
                />
              </View>
              <View style={styles.hostInfo}>
                <Text style={[styles.hostName, { color: colors.text }]}>{space.host.name}</Text>
                <View style={styles.hostRating}>
                  <Star size={14} color={colors.primary} fill={colors.primary} />
                  <Text style={[styles.hostRatingText, { color: colors.text }]}>{space.host.rating}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.gray[100] }]}>
        <View style={styles.footerPrice}>
          <Text style={[styles.footerPriceValue, { color: colors.text }]}>${space.price}</Text>
          <Text style={[styles.footerPriceUnit, { color: colors.gray[600] }]}>/{space.priceUnit}</Text>
        </View>
        
        <Button
          title="Book Now"
          onPress={handleBookPress}
          size="large"
          style={styles.bookButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 16,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 14,
    marginLeft: 4,
  },
  priceRow: {
    marginTop: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
  },
  priceUnit: {
    fontSize: 18,
    fontWeight: '400',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailsContainer: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16,
    marginLeft: 12,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  amenityText: {
    fontSize: 14,
    marginLeft: 8,
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  hostImageContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginRight: 16,
  },
  hostImage: {
    flex: 1,
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  hostRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostRatingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
  },
  footerPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  footerPriceValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  footerPriceUnit: {
    fontSize: 16,
  },
  bookButton: {
    flex: 1,
    marginLeft: 16,
  },
  text: {
    textAlign: 'center',
    marginTop: 20,
  }
});