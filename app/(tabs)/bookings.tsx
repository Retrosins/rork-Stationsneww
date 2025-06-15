import React, { useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { useBookingStore } from '@/store/bookingStore';
import { useSpaceStore } from '@/store/spaceStore';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import BookingCard from '@/components/BookingCard';
import { Calendar } from 'lucide-react-native';
import Button from '@/components/Button';

export default function BookingsScreen() {
  const router = useRouter();
  const { bookings, fetchBookings, loading } = useBookingStore();
  const { fetchSpaces } = useSpaceStore();
  const { isLoggedIn } = useUserStore();
  
  useEffect(() => {
    if (isLoggedIn) {
      fetchBookings();
      fetchSpaces();
    }
  }, [isLoggedIn]);
  
  const handleLogin = () => {
    router.push('/auth/login');
  };
  
  if (!isLoggedIn) {
    return (
      <View style={styles.authContainer}>
        <Calendar size={64} color={Colors.gray[300]} />
        <Text style={styles.authTitle}>Sign in to view your bookings</Text>
        <Text style={styles.authText}>
          Track your upcoming and past bookings in one place
        </Text>
        <Button
          title="Sign In"
          onPress={handleLogin}
          style={styles.authButton}
        />
      </View>
    );
  }
  
  // Group bookings by status
  const upcomingBookings = bookings.filter(
    booking => booking.status === 'confirmed' || booking.status === 'pending'
  );
  
  const pastBookings = bookings.filter(
    booking => booking.status === 'completed' || booking.status === 'cancelled'
  );
  
  return (
    <View style={styles.container}>
      {bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Calendar size={64} color={Colors.gray[300]} />
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptyText}>
            Your upcoming and past bookings will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={[
            { title: 'Upcoming Bookings', data: upcomingBookings, id: 'upcoming' },
            { title: 'Past Bookings', data: pastBookings, id: 'past' },
          ]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{item.title}</Text>
              {item.data.length === 0 ? (
                <Text style={styles.noBookingsText}>No {item.id} bookings</Text>
              ) : (
                item.data.map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              )}
            </View>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <View style={styles.header}>
              <Text style={styles.title}>Your Bookings</Text>
            </View>
          )}
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  list: {
    paddingBottom: 16,
  },
  noBookingsText: {
    fontSize: 14,
    color: Colors.gray[500],
    paddingHorizontal: 16,
    fontStyle: 'italic',
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