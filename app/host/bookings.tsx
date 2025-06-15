import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { useSpaceStore } from '@/store/spaceStore';
import { useBookingStore } from '@/store/bookingStore';
import Colors from '@/constants/colors';
import { Image } from 'expo-image';
import { Calendar, Clock, MapPin, User, Check, X } from 'lucide-react-native';
import Button from '@/components/Button';

export default function HostBookingsScreen() {
  const router = useRouter();
  const { user, isLoggedIn } = useUserStore();
  const { spaces } = useSpaceStore();
  const { bookings, loading } = useBookingStore();
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'completed' | 'cancelled'>('pending');
  
  useEffect(() => {
    // In a real app, we would fetch bookings for spaces owned by the current user
  }, []);
  
  if (!isLoggedIn || !user?.isHost) {
    return (
      <View style={styles.authContainer}>
        <Calendar size={64} color={Colors.gray[300]} />
        <Text style={styles.authTitle}>Host access required</Text>
        <Text style={styles.authText}>
          You need to be logged in as a host to view booking requests
        </Text>
        <Button
          title="Go to Dashboard"
          onPress={() => router.push('/host/dashboard')}
          style={styles.authButton}
        />
      </View>
    );
  }
  
  // Filter bookings by status
  const filteredBookings = bookings.filter(booking => booking.status === activeTab);
  
  // Get space details for each booking
  const bookingsWithDetails = filteredBookings.map(booking => {
    const space = spaces.find(s => s.id === booking.spaceId);
    return { ...booking, space };
  });
  
  const handleAcceptBooking = (bookingId: string) => {
    Alert.alert(
      'Accept Booking',
      'Are you sure you want to accept this booking?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Accept',
          onPress: () => {
            // In a real app, this would be an API call
            Alert.alert('Success', 'Booking accepted successfully');
          },
        },
      ]
    );
  };
  
  const handleDeclineBooking = (bookingId: string) => {
    Alert.alert(
      'Decline Booking',
      'Are you sure you want to decline this booking?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Decline',
          onPress: () => {
            // In a real app, this would be an API call
            Alert.alert('Success', 'Booking declined successfully');
          },
          style: 'destructive',
        },
      ]
    );
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
  
  const renderBookingItem = ({ item }: { item: any }) => {
    if (!item.space) return null;
    
    return (
      <View style={styles.bookingCard}>
        <View style={styles.bookingHeader}>
          <View style={styles.spaceImageContainer}>
            <Image
              source={{ uri: item.space.images[0] }}
              style={styles.spaceImage}
              contentFit="cover"
            />
          </View>
          <View style={styles.bookingInfo}>
            <Text style={styles.spaceName} numberOfLines={1}>
              {item.space.title}
            </Text>
            <View style={styles.locationRow}>
              <MapPin size={14} color={Colors.gray[600]} />
              <Text style={styles.locationText} numberOfLines={1}>
                {item.space.location.neighborhood}, {item.space.location.city}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <User size={16} color={Colors.gray[600]} />
            <Text style={styles.detailText}>Guest: Alex Johnson</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Calendar size={16} color={Colors.gray[600]} />
            <Text style={styles.detailText}>
              {formatDate(item.startDate)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Clock size={16} color={Colors.gray[600]} />
            <Text style={styles.detailText}>
              {formatTime(item.startDate)} - {formatTime(item.endDate)}
            </Text>
          </View>
        </View>
        
        <View style={styles.bookingFooter}>
          <Text style={styles.priceText}>
            Total: <Text style={styles.priceValue}>${item.totalPrice}</Text>
          </Text>
          
          {item.status === 'pending' && (
            <View style={styles.actionButtons}>
              <Button
                title="Decline"
                variant="outline"
                size="small"
                onPress={() => handleDeclineBooking(item.id)}
                style={styles.declineButton}
              />
              <Button
                title="Accept"
                size="small"
                onPress={() => handleAcceptBooking(item.id)}
                style={styles.acceptButton}
              />
            </View>
          )}
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            Pending
          </Text>
        </Pressable>
        
        <Pressable
          style={[styles.tab, activeTab === 'confirmed' && styles.activeTab]}
          onPress={() => setActiveTab('confirmed')}
        >
          <Text style={[styles.tabText, activeTab === 'confirmed' && styles.activeTabText]}>
            Confirmed
          </Text>
        </Pressable>
        
        <Pressable
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed
          </Text>
        </Pressable>
        
        <Pressable
          style={[styles.tab, activeTab === 'cancelled' && styles.activeTab]}
          onPress={() => setActiveTab('cancelled')}
        >
          <Text style={[styles.tabText, activeTab === 'cancelled' && styles.activeTabText]}>
            Cancelled
          </Text>
        </Pressable>
      </View>
      
      {bookingsWithDetails.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Calendar size={64} color={Colors.gray[300]} />
          <Text style={styles.emptyTitle}>No {activeTab} bookings</Text>
          <Text style={styles.emptyText}>
            {activeTab === 'pending' 
              ? 'You have no pending booking requests' 
              : `You have no ${activeTab} bookings`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookingsWithDetails}
          keyExtractor={(item) => item.id}
          renderItem={renderBookingItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    backgroundColor: Colors.card,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray[600],
  },
  activeTabText: {
    color: Colors.primary,
  },
  listContainer: {
    padding: 16,
  },
  bookingCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  spaceImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  spaceImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.gray[400],
  },
  bookingInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  spaceName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: Colors.gray[600],
    marginLeft: 4,
  },
  bookingDetails: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  priceText: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  priceValue: {
    fontWeight: '600',
    color: Colors.text,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  declineButton: {
    minWidth: 80,
  },
  acceptButton: {
    minWidth: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  authTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  authText: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
    marginBottom: 24,
  },
  authButton: {
    width: 200,
  },
});