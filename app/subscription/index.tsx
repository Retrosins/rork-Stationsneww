import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import { 
  CreditCard, 
  Check, 
  ArrowLeft,
  ArrowUpRight
} from 'lucide-react-native';
import Logo from '@/components/Logo';

export default function SubscriptionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ upgradeToHost: string }>();
  const { user, upgradeSubscription, cancelSubscription } = useUserStore();
  const [loading, setLoading] = useState(false);
  
  // Default to host subscription if upgradeToHost param is present
  const [selectedPlan, setSelectedPlan] = useState<'artist' | 'host'>(
    params.upgradeToHost === 'true' ? 'host' : (user?.subscription?.type || 'artist')
  );
  
  const handleUpgradeSubscription = async () => {
    setLoading(true);
    try {
      // If user already has this subscription type, just show a message
      if (user?.subscription?.type === selectedPlan) {
        Alert.alert('Info', `You already have an active ${selectedPlan} subscription.`);
        setLoading(false);
        return;
      }
      
      // Otherwise, redirect to payment screen
      router.push({
        pathname: '/auth/subscribe',
        params: { 
          userType: selectedPlan,
          name: user?.name || '',
          email: user?.email || ''
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to process subscription');
      setLoading(false);
    }
  };
  
  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? You will lose access to premium features.',
      [
        {
          text: 'No, Keep It',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await cancelSubscription();
              Alert.alert('Success', 'Your subscription has been canceled.');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel subscription');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleAdminLogin = () => {
    router.push('/admin/login');
  };
  
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Subscription</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Sign in Required</Text>
          <Text style={styles.emptyText}>
            Please sign in to manage your subscription
          </Text>
          <Button
            title="Sign In"
            onPress={() => router.push('/auth/login')}
            style={styles.emptyButton}
          />
          <Pressable onPress={handleAdminLogin} style={styles.adminLoginContainer}>
            <Text style={styles.adminLoginText}>Admin Login</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Subscription</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {user.subscription ? (
          <View style={styles.currentPlan}>
            <Text style={styles.currentPlanTitle}>Current Subscription</Text>
            <View style={styles.planCard}>
              <View style={styles.planHeader}>
                <Text style={styles.planName}>
                  {user.subscription.type === 'artist' ? 'Artist' : 'Shop Owner'} Plan
                </Text>
                <Text style={styles.planPrice}>
                  ${user.subscription.price}/week
                </Text>
              </View>
              
              <View style={styles.planDetails}>
                <Text style={styles.planStatus}>
                  Status: <Text style={styles.activeStatus}>Active</Text>
                </Text>
                <Text style={styles.planExpiry}>
                  Expires on: {new Date(user.subscription.expiresAt).toLocaleDateString()}
                </Text>
                {user.subscription.setupFee && (
                  <Text style={styles.setupFeeText}>
                    One-time setup fee: ${user.subscription.setupFee.toFixed(2)} (paid)
                  </Text>
                )}
              </View>
              
              <Button
                title="Cancel Subscription"
                variant="outline"
                onPress={handleCancelSubscription}
                loading={loading}
                style={styles.cancelButton}
              />
            </View>
          </View>
        ) : null}
        
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Available Plans</Text>
          <Text style={styles.sectionDescription}>
            Choose the plan that works best for you
          </Text>
          
          <Pressable
            style={[
              styles.planOption,
              selectedPlan === 'artist' && styles.selectedPlan
            ]}
            onPress={() => setSelectedPlan('artist')}
          >
            <View style={styles.planOptionContent}>
              <Text style={styles.planOptionTitle}>Artist Plan</Text>
              <View style={styles.planPricing}>
                <Text style={styles.planOptionPrice}>$25/week</Text>
                <Text style={styles.setupFee}>+ $99.99 one-time setup fee</Text>
              </View>
              <View style={styles.planFeatures}>
                <View style={styles.featureItem}>
                  <Check size={16} color={Colors.primary} />
                  <Text style={styles.featureText}>Book tattoo stations</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check size={16} color={Colors.primary} />
                  <Text style={styles.featureText}>Create artist profile</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check size={16} color={Colors.primary} />
                  <Text style={styles.featureText}>Message shop owners</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check size={16} color={Colors.primary} />
                  <Text style={styles.featureText}>12-week subscription</Text>
                </View>
              </View>
            </View>
            <View style={[
              styles.planCheckmark,
              selectedPlan === 'artist' && styles.selectedCheckmark
            ]}>
              {selectedPlan === 'artist' && <Check size={20} color={Colors.white} />}
            </View>
          </Pressable>
          
          <Pressable
            style={[
              styles.planOption,
              selectedPlan === 'host' && styles.selectedPlan
            ]}
            onPress={() => setSelectedPlan('host')}
          >
            <View style={styles.planOptionContent}>
              <Text style={styles.planOptionTitle}>Shop Owner Plan</Text>
              <Text style={styles.planOptionPrice}>$50/week</Text>
              <View style={styles.planFeatures}>
                <View style={styles.featureItem}>
                  <Check size={16} color={Colors.primary} />
                  <Text style={styles.featureText}>List tattoo stations</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check size={16} color={Colors.primary} />
                  <Text style={styles.featureText}>Manage bookings</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check size={16} color={Colors.primary} />
                  <Text style={styles.featureText}>Receive payments</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check size={16} color={Colors.primary} />
                  <Text style={styles.featureText}>Shop owner dashboard</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check size={16} color={Colors.primary} />
                  <Text style={styles.featureText}>12-week subscription</Text>
                </View>
              </View>
            </View>
            <View style={[
              styles.planCheckmark,
              selectedPlan === 'host' && styles.selectedCheckmark
            ]}>
              {selectedPlan === 'host' && <Check size={20} color={Colors.white} />}
            </View>
          </Pressable>
          
          <Button
            title={user.subscription 
              ? `Upgrade to ${selectedPlan === 'artist' ? 'Artist' : 'Shop Owner'} Plan` 
              : `Subscribe to ${selectedPlan === 'artist' ? 'Artist' : 'Shop Owner'} Plan`
            }
            onPress={handleUpgradeSubscription}
            loading={loading}
            style={styles.subscribeButton}
          />
          
          <Text style={styles.subscriptionNote}>
            Subscriptions are billed weekly and last for 12 weeks.
            {selectedPlan === 'artist' && ' Artist plan requires a one-time setup fee of $99.99.'}
            By subscribing, you agree to our Terms of Service.
          </Text>
        </View>
        
        <Pressable onPress={handleAdminLogin} style={styles.adminLoginContainer}>
          <Text style={styles.adminLoginText}>Admin Login</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
    backgroundColor: Colors.card,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  backButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  currentPlan: {
    padding: 16,
  },
  currentPlanTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  planDetails: {
    marginBottom: 16,
  },
  planStatus: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  activeStatus: {
    color: Colors.success,
    fontWeight: '500',
  },
  planExpiry: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 4,
  },
  setupFeeText: {
    fontSize: 14,
    color: Colors.gray[600],
    fontStyle: 'italic',
  },
  cancelButton: {
    marginTop: 8,
  },
  plansSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 16,
  },
  planOption: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.gray[300],
  },
  selectedPlan: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  planOptionContent: {
    flex: 1,
  },
  planOptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  planPricing: {
    marginBottom: 12,
  },
  planOptionPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 2,
  },
  setupFee: {
    fontSize: 14,
    color: Colors.gray[600],
    fontStyle: 'italic',
  },
  planFeatures: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: Colors.text,
  },
  planCheckmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCheckmark: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  subscribeButton: {
    marginTop: 16,
  },
  subscriptionNote: {
    fontSize: 12,
    color: Colors.gray[600],
    textAlign: 'center',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    width: 200,
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