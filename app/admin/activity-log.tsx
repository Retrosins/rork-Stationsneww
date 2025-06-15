import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Search, Filter, Calendar, User, Settings, Star, Clock, AlertTriangle } from 'lucide-react-native';
import DefaultColors from '@/constants/colors';

// Mock activity log data
const activityLogData = [
  {
    id: '1',
    action: 'User Login',
    user: 'admin@example.com',
    timestamp: '2023-08-25T14:30:00Z',
    details: 'Admin login from IP 192.168.1.1',
    type: 'auth'
  },
  {
    id: '2',
    action: 'Space Featured',
    user: 'admin@example.com',
    timestamp: '2023-08-25T13:45:00Z',
    details: 'Space "Modern Tattoo Studio in Downtown" marked as featured',
    type: 'content'
  },
  {
    id: '3',
    action: 'User Banned',
    user: 'admin@example.com',
    timestamp: '2023-08-24T16:20:00Z',
    details: 'User john@example.com banned for policy violation',
    type: 'moderation'
  },
  {
    id: '4',
    action: 'Settings Updated',
    user: 'admin@example.com',
    timestamp: '2023-08-24T11:10:00Z',
    details: 'App theme colors updated',
    type: 'settings'
  },
  {
    id: '5',
    action: 'Space Approved',
    user: 'moderator@example.com',
    timestamp: '2023-08-23T15:30:00Z',
    details: 'Space "Cozy Piercing Studio with Natural Light" approved',
    type: 'content'
  },
  {
    id: '6',
    action: 'New Admin Added',
    user: 'admin@example.com',
    timestamp: '2023-08-23T10:15:00Z',
    details: 'Added new admin user: moderator@example.com',
    type: 'admin'
  },
  {
    id: '7',
    action: 'Booking Cancelled',
    user: 'system',
    timestamp: '2023-08-22T18:45:00Z',
    details: 'Booking #12345 cancelled due to payment failure',
    type: 'booking'
  },
  {
    id: '8',
    action: 'Subscription Plan Added',
    user: 'admin@example.com',
    timestamp: '2023-08-22T14:20:00Z',
    details: 'Added new subscription plan: "Premium Host"',
    type: 'subscription'
  },
  {
    id: '9',
    action: 'System Maintenance',
    user: 'system',
    timestamp: '2023-08-21T02:00:00Z',
    details: 'Scheduled database maintenance completed',
    type: 'system'
  },
  {
    id: '10',
    action: 'User Reported',
    user: 'moderator@example.com',
    timestamp: '2023-08-20T19:30:00Z',
    details: 'User report processed for user: guest123',
    type: 'moderation'
  },
];

export default function ActivityLogScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  
  // Filter activity logs based on selected filter
  const filteredLogs = filter === 'all' 
    ? activityLogData 
    : activityLogData.filter(log => log.type === filter);
  
  // Function to get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'auth':
        return <User size={20} color={DefaultColors.primary} />;
      case 'content':
        return <Star size={20} color={DefaultColors.secondary} />;
      case 'moderation':
        return <AlertTriangle size={20} color={DefaultColors.warning} />;
      case 'settings':
        return <Settings size={20} color={DefaultColors.gray[700]} />;
      case 'admin':
        return <User size={20} color={DefaultColors.info} />;
      case 'booking':
        return <Calendar size={20} color={DefaultColors.tertiary} />;
      case 'subscription':
        return <Star size={20} color={DefaultColors.success} />;
      case 'system':
        return <Settings size={20} color={DefaultColors.gray[600]} />;
      default:
        return <Clock size={20} color={DefaultColors.gray[500]} />;
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleBack = () => {
    router.back();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color={DefaultColors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Activity Log</Text>
      </View>
      
      <View style={styles.filterContainer}>
        <ScrollableFilter 
          options={[
            { value: 'all', label: 'All' },
            { value: 'auth', label: 'Authentication' },
            { value: 'content', label: 'Content' },
            { value: 'moderation', label: 'Moderation' },
            { value: 'settings', label: 'Settings' },
            { value: 'admin', label: 'Admin' },
            { value: 'booking', label: 'Bookings' },
            { value: 'subscription', label: 'Subscriptions' },
            { value: 'system', label: 'System' },
          ]}
          selectedValue={filter}
          onSelect={setFilter}
        />
      </View>
      
      <FlatList
        data={filteredLogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.logItem}>
            <View style={styles.logIconContainer}>
              {getActivityIcon(item.type)}
            </View>
            <View style={styles.logContent}>
              <Text style={styles.logAction}>{item.action}</Text>
              <Text style={styles.logDetails}>{item.details}</Text>
              <View style={styles.logMeta}>
                <Text style={styles.logUser}>{item.user}</Text>
                <Text style={styles.logTime}>{formatDate(item.timestamp)}</Text>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

// Scrollable filter component
function ScrollableFilter({ 
  options, 
  selectedValue, 
  onSelect 
}: { 
  options: Array<{value: string, label: string}>,
  selectedValue: string,
  onSelect: (value: string) => void
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterOptions}
    >
      {options.map(option => (
        <Pressable
          key={option.value}
          style={[
            styles.filterOption,
            selectedValue === option.value && styles.filterOptionSelected
          ]}
          onPress={() => onSelect(option.value)}
        >
          <Text 
            style={[
              styles.filterOptionText,
              selectedValue === option.value && styles.filterOptionTextSelected
            ]}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DefaultColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: DefaultColors.border,
    backgroundColor: DefaultColors.card,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DefaultColors.text,
  },
  filterContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: DefaultColors.border,
    backgroundColor: DefaultColors.card,
  },
  filterOptions: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: DefaultColors.gray[100],
    marginRight: 8,
  },
  filterOptionSelected: {
    backgroundColor: DefaultColors.primary,
  },
  filterOptionText: {
    fontSize: 14,
    color: DefaultColors.gray[700],
  },
  filterOptionTextSelected: {
    color: DefaultColors.white,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
  },
  logItem: {
    flexDirection: 'row',
    backgroundColor: DefaultColors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: DefaultColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DefaultColors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logContent: {
    flex: 1,
  },
  logAction: {
    fontSize: 16,
    fontWeight: '600',
    color: DefaultColors.text,
    marginBottom: 4,
  },
  logDetails: {
    fontSize: 14,
    color: DefaultColors.gray[700],
    marginBottom: 8,
  },
  logMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logUser: {
    fontSize: 12,
    color: DefaultColors.gray[600],
  },
  logTime: {
    fontSize: 12,
    color: DefaultColors.gray[600],
  },
});