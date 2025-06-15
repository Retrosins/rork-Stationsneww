import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Alert, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAdminStore } from '@/store/adminStore';
import DefaultColors, { getDynamicColors } from '@/constants/colors';
import { Settings, Image as ImageIcon, Users, MessageSquare, LogOut, ClipboardList } from 'lucide-react-native';
import Button from '@/components/Button';
import Logo from '@/components/Logo';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { appCustomization, logout, activityLog, currentAdmin, admins } = useAdminStore();
  const colors = getDynamicColors();
  
  // Safely access featuredSpaceIds with a fallback to empty array
  const featuredSpaceIds = appCustomization?.featuredSpaceIds || [];
  
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              logout();
              router.replace('/admin/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };
  
  // Safely access activityLog with a fallback to empty array
  const safeActivityLog = activityLog || [];
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <Logo size="medium" />
          <Text style={[styles.headerTitle, { color: colors.text }]}>Admin Dashboard</Text>
        </View>
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <LogOut size={24} color={colors.error} />
        </Pressable>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.welcomeSection, { backgroundColor: colors.primary }]}>
          <Text style={styles.welcomeTitle}>Welcome to Admin Panel</Text>
          <Text style={styles.welcomeSubtitle}>
            Manage your tattoo station app settings, users, and content
          </Text>
        </View>
        
        <View style={styles.statsSection}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {featuredSpaceIds.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.gray[600] }]}>Featured Stations</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {safeActivityLog.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.gray[600] }]}>Activity Logs</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {admins?.length || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.gray[600] }]}>Admins</Text>
          </View>
        </View>
        
        <View style={styles.menuSection}>
          <Text style={[styles.menuTitle, { color: colors.text }]}>Admin Menu</Text>
          
          <View style={styles.menuGrid}>
            <Pressable 
              style={[styles.menuItem, { backgroundColor: colors.card }]} 
              onPress={() => router.push('/admin/settings')}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: colors.primary }]}>
                <Settings size={24} color={colors.white} />
              </View>
              <Text style={[styles.menuItemText, { color: colors.text }]}>App Settings</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.menuItem, { backgroundColor: colors.card }]} 
              onPress={() => router.push('/admin/featured')}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: colors.secondary }]}>
                <ImageIcon size={24} color={colors.white} />
              </View>
              <Text style={[styles.menuItemText, { color: colors.text }]}>Featured Stations</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.menuItem, { backgroundColor: colors.card }]} 
              onPress={() => router.push('/admin/admins')}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: '#4CAF50' }]}>
                <Users size={24} color={colors.white} />
              </View>
              <Text style={[styles.menuItemText, { color: colors.text }]}>Manage Admins</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.menuItem, { backgroundColor: colors.card }]} 
              onPress={() => router.push('/admin/messages')}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: '#2196F3' }]}>
                <MessageSquare size={24} color={colors.white} />
              </View>
              <Text style={[styles.menuItemText, { color: colors.text }]}>Messages</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.menuItem, { backgroundColor: colors.card }]} 
              onPress={() => router.push('/admin/activity-log')}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: '#9C27B0' }]}>
                <ClipboardList size={24} color={colors.white} />
              </View>
              <Text style={[styles.menuItemText, { color: colors.text }]}>Activity Logs</Text>
            </Pressable>
          </View>
        </View>
        
        <View style={styles.recentActivitySection}>
          <Text style={[styles.recentActivityTitle, { color: colors.text }]}>Recent Activity</Text>
          
          {safeActivityLog.slice(0, 3).map((log, index) => (
            <View key={index} style={[styles.activityItem, { backgroundColor: colors.card, borderLeftColor: colors.primary }]}>
              <Text style={[styles.activityAction, { color: colors.text }]}>{log.action}</Text>
              <Text style={[styles.activityTimestamp, { color: colors.gray[600] }]}>
                {new Date(log.timestamp).toLocaleString()}
              </Text>
            </View>
          ))}
          
          {safeActivityLog.length === 0 && (
            <View style={[styles.emptyActivityState, { backgroundColor: colors.card }]}>
              <Text style={[styles.emptyActivityText, { color: colors.gray[600] }]}>No recent activity</Text>
            </View>
          )}
          
          {safeActivityLog.length > 0 && (
            <Button
              title="View All Activity"
              variant="outline"
              onPress={() => router.push('/admin/activity-log')}
              style={styles.viewAllButton}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsSection: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  menuSection: {
    padding: 16,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  recentActivitySection: {
    padding: 16,
    marginBottom: 16,
  },
  recentActivityTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  activityItem: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  activityTimestamp: {
    fontSize: 12,
  },
  emptyActivityState: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyActivityText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  viewAllButton: {
    marginTop: 8,
  },
});