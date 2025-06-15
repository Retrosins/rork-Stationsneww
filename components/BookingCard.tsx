import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Calendar, Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Booking } from '@/types/space';
import { useSpaceStore } from '@/store/spaceStore';
import Button from './Button';
import { useBookingStore } from '@/store/bookingStore';

interface BookingCardProps {
  booking: Booking;
}

export default function BookingCard({ booking }: BookingCardProps) {
  const router = useRouter();
  const { spaces } = useSpaceStore();
  const { cancelBooking } = useBookingStore();
  
  const space = spaces.find(s => s.id === booking.spaceId);
  
  if (!space) {
    return null;
  }
  
  const handlePress = () => {
    router.push(`/space/${space.id}`);
  };
  
  const handleCancel = async () => {
    await cancelBooking(booking.id);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return Colors.success;
      case 'pending': return Colors.primary;
      case 'cancelled': return Colors.error;
      case 'completed': return Colors.gray[600];
      default: return Colors.gray[600];
    }
  };
  
  return (
    <Pressable
      style={styles.container}
      onPress={handlePress}
      android_ripple={{ color: Colors.gray[200] }}
    >
      <View style={styles.header}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: space.images[0] }}
            style={styles.image}
            contentFit="cover"
          />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.title} numberOfLines={2}>
            {space.title}
          </Text>
          <Text style={styles.location} numberOfLines={1}>
            {space.location.neighborhood}, {space.location.city}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Calendar size={16} color={Colors.gray[600]} />
          <Text style={styles.detailText}>
            {formatDate(booking.startDate)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Clock size={16} color={Colors.gray[600]} />
          <Text style={styles.detailText}>
            {formatTime(booking.startDate)} - {formatTime(booking.endDate)}
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.price}>
          Total: <Text style={styles.priceValue}>${booking.totalPrice}</Text>
        </Text>
        
        {booking.status === 'pending' || booking.status === 'confirmed' ? (
          <Button
            title="Cancel"
            variant="outline"
            size="small"
            onPress={handleCancel}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    padding: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    flex: 1,
    backgroundColor: Colors.gray[400],
  },
  headerContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  details: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.gray[100],
    paddingVertical: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  price: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  priceValue: {
    fontWeight: '600',
    color: Colors.text,
  },
});