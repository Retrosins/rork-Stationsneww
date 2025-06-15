import React from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Heart, Star, MapPin } from 'lucide-react-native';
import { getDynamicColors } from '@/constants/colors';
import { Space } from '@/types/space';
import { useSpaceStore } from '@/store/spaceStore';

interface SpaceCardProps {
  space: Space;
  horizontal?: boolean;
  onPress?: () => void;
  style?: any;
}

export default function SpaceCard({ space, horizontal = false, onPress, style }: SpaceCardProps) {
  const router = useRouter();
  const { favorites, toggleFavorite } = useSpaceStore();
  const isFavorite = favorites.includes(space.id);
  const colors = getDynamicColors();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/space/${space.id}`);
    }
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavorite(space.id);
  };

  return (
    <Pressable
      style={[
        styles.container,
        horizontal ? styles.horizontalContainer : null,
        { backgroundColor: colors.card },
        style,
      ]}
      onPress={handlePress}
      android_ripple={{ color: colors.gray[200] }}
    >
      <View style={[styles.imageContainer, horizontal ? styles.horizontalImageContainer : null]}>
        <Image
          source={{ uri: space.images[0] }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <Pressable
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
          hitSlop={10}
        >
          <Heart
            size={22}
            color={isFavorite ? colors.error : colors.white}
            fill={isFavorite ? colors.error : 'transparent'}
          />
        </Pressable>
      </View>
      
      <View style={[styles.content, horizontal ? styles.horizontalContent : null]}>
        <View style={styles.locationRow}>
          <MapPin size={14} color={colors.gray[600]} />
          <Text style={[styles.location, { color: colors.gray[600] }]} numberOfLines={1}>
            {space.location.neighborhood}, {space.location.city}
          </Text>
        </View>
        
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {space.title}
        </Text>
        
        <View style={styles.detailsRow}>
          <Text style={[styles.price, { color: colors.text }]}>
            ${space.price}
            <Text style={[styles.priceUnit, { color: colors.gray[600] }]}>/{space.priceUnit}</Text>
          </Text>
          
          <View style={styles.ratingContainer}>
            <Star size={14} color={colors.primary} fill={colors.primary} />
            <Text style={[styles.rating, { color: colors.text }]}>{space.rating}</Text>
            <Text style={[styles.reviews, { color: colors.gray[600] }]}>({space.reviews})</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
      },
    }),
  },
  horizontalContainer: {
    flexDirection: 'row',
    height: 120,
  },
  imageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  horizontalImageContainer: {
    height: 120,
    width: 120,
  },
  image: {
    flex: 1,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 12,
  },
  horizontalContent: {
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    marginLeft: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: '400',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    marginLeft: 2,
  },
});