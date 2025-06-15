import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { useSpaceStore } from '@/store/spaceStore';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import { 
  Plus, 
  Home, 
  Calendar, 
  DollarSign, 
  ChevronRight,
  Settings,
  Star,
  ArrowUpRight
} from 'lucide-react-native';
import SpaceCard from '@/components/SpaceCard';
import Logo from '@/components/Logo';

export default function HostDashboardScreen() {
  const router = useRouter();
  const { user, isLoggedIn, becomeHost } = useUserStore();
  const { spaces, fetchSpaces } = useSpaceStore();
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchSpaces();
  }, []);
  
  // Filter spaces to only show those belonging to the current user
  const userSpaces = spaces.filter(space => space.host.id === user?.id);
  
  const handleBecomeHost = async () => {
    setLoading(true);
    try {
      // Check if user has the correct subscription
      const result = await becomeHost();
      
      if (result.success) {
        Alert.alert('Success', 'You are now a tattoo shop host!');
      } else {
        // If subscription is not correct, redirect to subscription page
        Alert.alert(
          'Subscription Required',
          'You need a host subscription to become a host.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Upgrade Subscription',
              onPress: () => router.push({
                pathname: '/subscription',
                params: { upgradeToHost: 'true' }
              }),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to become a host');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateSpace = () => {
    router.push('/host/create-space');
  };
  
  const handleEditSpace = (spaceId: string) => {
    router.push(`/host/edit-space/${spaceId}`);
  };
  
  const handleViewBookings = () => {
    router.push('/host/bookings');
  };

  const handleAdminLogin = () => {
    router.push('/admin/login');
  };
  
  if (!isLoggedIn) {
    return (
      <View style={styles.authContainer}>
        <Logo size="large" style={styles.logo} />
        <Home size={64} color={Colors.gray[300]} style={styles.icon} />
        <Text style={styles.authTitle}>Sign in to access host features</Text>
        <Text style={styles.authText}>
          Create and manage your tattoo stations as a host
        </Text>
        <Button
          title="Sign In"
          onPress={() => router.push('/auth/login')}
          style={styles.authButton}
        />
        <Pressable onPress={handleAdminLogin} style={styles.adminLoginContainer}>
          <Text style={styles.adminLoginText}>Admin Login</Text>
        </Pressable>
      </View>
    );
  }
  
  if (!user?.isHost) {
    return (
      <View style={styles.becomeHostContainer}>
        <Logo size="large" style={styles.logo} />
        <Home size={64} color={Colors.gray[300]} style={styles.icon} />
        <Text style={styles.becomeHostTitle}>Become a Host</Text>
        <Text style={styles.becomeHostText}>
          Share your tattoo shop space and earn money by hosting on The Stations
        </Text>
        
        {user?.subscription?.type === 'host' ? (
          <Button
            title="Become a Host"
            onPress={handleBecomeHost}
            loading={loading}
            style={styles.becomeHostButton}
          />
        ) : (
          <View style={styles.subscriptionRequired}>
            <Text style={styles.subscriptionRequiredText}>
              Host subscription required ($50/month)
            </Text>
            <Button
              title="Upgrade to Host Subscription"
              onPress={() => router.push({
                pathname: '/subscription',
                params: { upgradeToHost: 'true' }
              })}
              style={styles.upgradeButton}
            />
          </View>
        )}
        <Pressable onPress={handleAdminLogin} style={styles.adminLoginContainer}>
          <Text style={styles.adminLoginText}>Admin Login</Text>
        </Pressable>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Logo size="medium" style={styles.headerLogo} />
        <Text style={styles.greeting}>Hello, {user.name}</Text>
        <Text style={styles.subtitle}>Manage your tattoo stations and bookings</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Home size={24} color={Colors.primary} />
          <Text style={styles.statValue}>{userSpaces.length}</Text>
          <Text style={styles.statLabel}>Stations</Text>
        </View>
        
        <View style={styles.statCard}>
          <Calendar size={24} color={Colors.primary} />
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Bookings</Text>
        </View>
        
        <View style={styles.statCard}>
          <DollarSign size={24} color={Colors.primary} />
          <Text style={styles.statValue}>$0</Text>
          <Text style={styles.statLabel}>Earnings</Text>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <Pressable
          style={styles.actionButton}
          onPress={handleCreateSpace}
        >
          <Plus size={20} color={Colors.text} />
          <Text style={styles.actionButtonText}>Add New Station</Text>
        </Pressable>
        
        <Pressable
          style={styles.actionButton}
          onPress={handleViewBookings}
        >
          <Calendar size={20} color={Colors.text} />
          <Text style={styles.actionButtonText}>View Bookings</Text>
        </Pressable>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Tattoo Stations</Text>
        
        {userSpaces.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              You haven't added any tattoo stations yet
            </Text>
            <Button
              title="Add Your First Station"
              onPress={handleCreateSpace}
              style={styles.emptyButton}
            />
          </View>
        ) : (
          userSpaces.map(space => (
            <View key={space.id} style={styles.spaceContainer}>
              <SpaceCard space={space} horizontal />
              <View style={styles.spaceActions}>
                <Button
                  title="Edit"
                  variant="outline"
                  size="small"
                  onPress={() => handleEditSpace(space.id)}
                  style={styles.spaceActionButton}
                />
                <Button
                  title="View Bookings"
                  size="small"
                  onPress={handleViewBookings}
                  style={styles.spaceActionButton}
                />
              </View>
            </View>
          ))
        )}
      </View>
      
      <Pressable onPress={handleAdminLogin} style={styles.adminLoginContainer}>
        <Text style={styles.adminLoginText}>Admin Login</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  headerLogo: {
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray[600],
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.gray[600],
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  emptyContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray[600],
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyButton: {
    width: '100%',
  },
  spaceContainer: {
    marginBottom: 16,
  },
  spaceActions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  spaceActionButton: {
    flex: 1,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: Colors.background,
  },
  logo: {
    marginBottom: 24,
  },
  icon: {
    marginBottom: 16,
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
  becomeHostContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: Colors.background,
  },
  becomeHostTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  becomeHostText: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
    marginBottom: 24,
  },
  becomeHostButton: {
    width: 200,
  },
  subscriptionRequired: {
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    width: '100%',
  },
  subscriptionRequiredText: {
    fontSize: 16,
    color: Colors.gray[600],
    marginBottom: 16,
    textAlign: 'center',
  },
  upgradeButton: {
    width: '100%',
  },
  adminLoginContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  adminLoginText: {
    fontSize: 12,
    color: Colors.gray[500],
    textDecorationLine: 'underline',
  },
});