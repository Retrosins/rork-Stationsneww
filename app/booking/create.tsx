import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSpaceStore } from '@/store/spaceStore';
import { useBookingStore } from '@/store/bookingStore';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import { Calendar, Clock, CreditCard, DollarSign } from 'lucide-react-native';
import Logo from '@/components/Logo';

export default function CreateBookingScreen() {
  const { spaceId } = useLocalSearchParams<{ spaceId: string }>();
  const router = useRouter();
  const { spaces } = useSpaceStore();
  const { createBooking, loading } = useBookingStore();
  const { user } = useUserStore();
  
  const space = spaces.find(s => s.id === spaceId);
  
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [hours, setHours] = useState(2);
  const [totalPrice, setTotalPrice] = useState(0);
  
  useEffect(() => {
    if (space) {
      // Calculate hours between start and end time
      const start = startTime.split(':').map(Number);
      const end = endTime.split(':').map(Number);
      
      let hoursDiff = end[0] - start[0];
      const minDiff = end[1] - start[1];
      
      hoursDiff += minDiff / 60;
      
      if (hoursDiff < 0) {
        hoursDiff += 24; // Handle overnight bookings
      }
      
      setHours(hoursDiff);
      setTotalPrice(space.price * hoursDiff);
    }
  }, [space, startTime, endTime]);
  
  if (!space || !user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Station not found or user not logged in</Text>
      </View>
    );
  }
  
  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };
  
  const handleBook = async () => {
    try {
      // Format date and times for booking
      const startDate = new Date(date);
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      startDate.setHours(startHours, startMinutes, 0);
      
      const endDate = new Date(date);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      endDate.setHours(endHours, endMinutes, 0);
      
      // If end time is earlier than start time, assume it's the next day
      if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
      }
      
      await createBooking({
        spaceId: space.id,
        userId: user.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice,
        status: 'pending',
      });
      
      Alert.alert(
        'Booking Successful',
        'Your booking request has been submitted.',
        [
          {
            text: 'View Bookings',
            onPress: () => router.push('/bookings'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create booking. Please try again.');
    }
  };
  
  // Simple date picker for demo purposes
  const renderDatePicker = () => {
    const today = new Date();
    const dates = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.datePickerContainer}
      >
        {dates.map((d, index) => {
          const isSelected = d.toDateString() === date.toDateString();
          const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNumber = d.getDate();
          
          return (
            <Pressable
              key={index}
              style={[
                styles.dateItem,
                isSelected && styles.selectedDateItem
              ]}
              onPress={() => handleDateChange(d)}
            >
              <Text style={[
                styles.dateDay,
                isSelected && styles.selectedDateText
              ]}>
                {dayName}
              </Text>
              <Text style={[
                styles.dateNumber,
                isSelected && styles.selectedDateText
              ]}>
                {dayNumber}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerLogo}>
        <Logo size="small" />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.spaceInfo}>
          <Text style={styles.spaceTitle}>{space.title}</Text>
          <Text style={styles.spaceLocation}>
            {space.location.neighborhood}, {space.location.city}
          </Text>
          <Text style={styles.spacePrice}>
            ${space.price}/{space.priceUnit}
          </Text>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color={Colors.gray[600]} />
            <Text style={styles.sectionTitle}>Select Date</Text>
          </View>
          {renderDatePicker()}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color={Colors.gray[600]} />
            <Text style={styles.sectionTitle}>Select Time</Text>
          </View>
          
          <View style={styles.timeContainer}>
            <View style={styles.timeInputContainer}>
              <Text style={styles.timeLabel}>Start Time</Text>
              <TextInput
                style={styles.timeInput}
                value={startTime}
                onChangeText={setStartTime}
                placeholder="HH:MM"
                keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
                placeholderTextColor={Colors.gray[600]}
              />
            </View>
            
            <View style={styles.timeInputContainer}>
              <Text style={styles.timeLabel}>End Time</Text>
              <TextInput
                style={styles.timeInput}
                value={endTime}
                onChangeText={setEndTime}
                placeholder="HH:MM"
                keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
                placeholderTextColor={Colors.gray[600]}
              />
            </View>
          </View>
          
          <Text style={styles.durationText}>
            Duration: {hours.toFixed(1)} hours
          </Text>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CreditCard size={20} color={Colors.gray[600]} />
            <Text style={styles.sectionTitle}>Payment Details</Text>
          </View>
          
          <View style={styles.paymentMethod}>
            <View style={styles.paymentOption}>
              <View style={styles.radioButton}>
                <View style={styles.radioButtonInner} />
              </View>
              <Text style={styles.paymentOptionText}>Credit Card</Text>
            </View>
            
            <Text style={styles.paymentCardText}>
              •••• •••• •••• 4242
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <DollarSign size={20} color={Colors.gray[600]} />
            <Text style={styles.sectionTitle}>Price Details</Text>
          </View>
          
          <View style={styles.priceDetails}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                ${space.price} x {hours.toFixed(1)} hours
              </Text>
              <Text style={styles.priceValue}>
                ${totalPrice.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Service fee</Text>
              <Text style={styles.priceValue}>$0.00</Text>
            </View>
            
            <View style={styles.priceDivider} />
            
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ${totalPrice.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Book Station"
          onPress={handleBook}
          loading={loading}
          fullWidth
          size="large"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerLogo: {
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  content: {
    flex: 1,
  },
  spaceInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  spaceTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  spaceLocation: {
    fontSize: 16,
    color: Colors.gray[600],
    marginBottom: 8,
  },
  spacePrice: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  datePickerContainer: {
    paddingBottom: 8,
  },
  dateItem: {
    width: 70,
    height: 80,
    borderRadius: 12,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedDateItem: {
    backgroundColor: Colors.primary,
  },
  dateDay: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  selectedDateText: {
    color: Colors.black,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeInputContainer: {
    flex: 1,
    marginRight: 12,
  },
  timeLabel: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 8,
  },
  timeInput: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.gray[100],
  },
  durationText: {
    fontSize: 16,
    color: Colors.gray[600],
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    padding: 16,
    borderRadius: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  paymentOptionText: {
    fontSize: 16,
    color: Colors.text,
  },
  paymentCardText: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  priceDetails: {
    backgroundColor: Colors.gray[100],
    padding: 16,
    borderRadius: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  priceValue: {
    fontSize: 16,
    color: Colors.text,
  },
  priceDivider: {
    height: 1,
    backgroundColor: Colors.gray[300],
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  errorText: {
    color: Colors.text,
    textAlign: 'center',
    marginTop: 20,
  }
});