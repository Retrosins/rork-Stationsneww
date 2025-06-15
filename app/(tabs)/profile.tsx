import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { getDynamicColors } from '@/constants/colors';
import { Image } from 'expo-image';
import { 
  Settings, 
  CreditCard, 
  User, 
  MessageSquare, 
  HelpCircle,
  ChevronRight,
  LogOut,
  Shield
} from 'lucide-react-native';
import Button from '@/components/Button';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isLoggedIn, logout, loading } = useUserStore();
  const [loggingOut, setLoggingOut] = useState(false);
  const colors = getDynamicColors();

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      Alert.alert('Success', 'You have been logged out');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out');
    } finally {
      setLoggingOut(false);
    }
  };

  const handleAdminLogin = () => {
    router.push('/admin/login');
  };

  const menuItems = [
    {
      title: 'Account',
      items: [
        {
          icon: <User size={24} color={colors.primary} />,
          label: 'Personal Information',
          onPress: () => router.push('/profile/personal-info'),
        },
        {
          icon: <Settings size={24} color={colors.primary} />,
          label: 'Account Settings',
          onPress: () => router.push('/profile/settings'),
        },
        {
          icon: <CreditCard size={24} color={colors.primary} />,
          label: 'Payment Methods',
          onPress: () => router.push('/profile/payment'),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: <MessageSquare size={24} color={colors.primary} />,
          label: 'Messages',
          onPress: () => router.push('/messages'),
        },
        {
          icon: <HelpCircle size={24} color={colors.primary} />,
          label: 'Help Center',
          onPress: () => router.push('/help'),
        },
      ],
    },
  ];

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.notLoggedInContainer}>
          <Text style={[styles.notLoggedInTitle, { color: colors.text }]}>Not Logged In</Text>
          <Text style={[styles.notLoggedInText, { color: colors.gray[600] }]}>
            Please log in to access your profile and bookings
          </Text>
          <Button
            title="Log In"
            onPress={handleLogin}
            style={styles.loginButton}
          />
          <Pressable onPress={handleAdminLogin} style={styles.adminButton}>
            <Text style={[styles.adminButtonText, { color: colors.gray[600] }]}>Admin Login</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.profileHeader, { borderBottomColor: colors.gray[100] }]}>
        <View style={[styles.avatarContainer, { borderColor: colors.primary }]}>
          <Image
            source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }}
            style={styles.avatar}
            contentFit="cover"
          />
        </View>
        <Text style={[styles.name, { color: colors.text }]}>{user?.name}</Text>
        <Text style={[styles.email, { color: colors.gray[600] }]}>{user?.email}</Text>
        
        {user?.isHost && (
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, styles.hostBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.badgeText}>Host</Text>
            </View>
          </View>
        )}
        
        {user?.isArtist && (
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, styles.artistBadge, { backgroundColor: colors.secondary }]}>
              <Text style={styles.badgeText}>Artist</Text>
            </View>
          </View>
        )}
        
        <Button
          title="Edit Profile"
          onPress={() => router.push('/profile/edit')}
          variant="outline"
          style={styles.editButton}
        />
      </View>
      
      {user?.isHost && (
        <Pressable
          style={[styles.hostDashboardButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/host/dashboard')}
        >
          <Text style={styles.hostDashboardText}>Go to Host Dashboard</Text>
          <ChevronRight size={20} color={colors.black} />
        </Pressable>
      )}
      
      {user?.subscription ? (
        <Pressable
          style={[styles.subscriptionCard, { backgroundColor: colors.card, borderColor: colors.primary }]}
          onPress={() => router.push('/subscription')}
        >
          <View style={styles.subscriptionHeader}>
            <Text style={[styles.subscriptionTitle, { color: colors.text }]}>
              {user.subscription.type === 'artist' ? 'Artist' : 'Host'} Subscription
            </Text>
            <View style={[styles.subscriptionBadge, { backgroundColor: colors.success }]}>
              <Text style={styles.subscriptionBadgeText}>Active</Text>
            </View>
          </View>
          <Text style={[styles.subscriptionPrice, { color: colors.text }]}>
            ${user.subscription.price}/{user.subscription.billingCycle}
          </Text>
          <Text style={[styles.subscriptionExpiry, { color: colors.gray[600] }]}>
            Renews on {new Date(user.subscription.expiresAt).toLocaleDateString()}
          </Text>
          <Text style={[styles.subscriptionAction, { color: colors.primary }]}>Tap to manage subscription</Text>
        </Pressable>
      ) : (
        <Pressable
          style={[styles.subscribeCard, { backgroundColor: colors.card, borderColor: colors.gray[300] }]}
          onPress={() => router.push('/auth/subscribe')}
        >
          <Text style={[styles.subscribeTitle, { color: colors.text }]}>Upgrade Your Experience</Text>
          <Text style={[styles.subscribeText, { color: colors.gray[600] }]}>
            Subscribe to unlock host or artist features
          </Text>
          <Text style={[styles.subscribeAction, { color: colors.primary }]}>Tap to view subscription plans</Text>
        </Pressable>
      )}
      
      {menuItems.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
          
          {section.items.map((item, itemIndex) => (
            <Pressable
              key={itemIndex}
              style={[styles.menuItem, { backgroundColor: colors.card }]}
              onPress={item.onPress}
              android_ripple={{ color: colors.gray[200] }}
            >
              <View style={styles.menuItemIcon}>
                {item.icon}
              </View>
              <View style={styles.menuItemContent}>
                <Text style={[styles.menuItemLabel, { color: colors.text }]}>{item.label}</Text>
              </View>
              <ChevronRight size={20} color={colors.gray[600]} />
            </Pressable>
          ))}
        </View>
      ))}
      
      <Pressable
        style={[styles.logoutButton, { borderColor: colors.error }]}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        <LogOut size={20} color={colors.error} />
        <Text style={[styles.logoutText, { color: colors.error }]}>
          {loggingOut ? 'Logging out...' : 'Log Out'}
        </Text>
      </Pressable>
      
      <Pressable
        style={styles.adminLoginButton}
        onPress={handleAdminLogin}
      >
        <Shield size={20} color={colors.gray[600]} />
        <Text style={[styles.adminLoginText, { color: colors.gray[600] }]}>Admin Login</Text>
      </Pressable>
      
      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notLoggedInTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  notLoggedInText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    width: '100%',
    marginBottom: 16,
  },
  adminButton: {
    padding: 12,
  },
  adminButtonText: {
    fontSize: 14,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 3,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  hostBadge: {
  },
  artistBadge: {
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  editButton: {
    minWidth: 150,
  },
  hostDashboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  hostDashboardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  subscriptionCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  subscriptionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subscriptionBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  subscriptionPrice: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  subscriptionExpiry: {
    fontSize: 14,
    marginBottom: 8,
  },
  subscriptionAction: {
    fontSize: 14,
    fontWeight: '500',
  },
  subscribeCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  subscribeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  subscribeText: {
    fontSize: 14,
    marginBottom: 8,
  },
  subscribeAction: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 1,
  },
  menuItemIcon: {
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemLabel: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  adminLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
  },
  adminLoginText: {
    fontSize: 14,
    marginLeft: 8,
  },
  footer: {
    height: 40,
  },
});