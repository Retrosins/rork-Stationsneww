import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import { Check, CreditCard, Calendar, Lock } from 'lucide-react-native';
import { useUserStore } from '@/store/userStore';
import { Subscription } from '@/types/subscription';

// Mock subscription data
const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-artist-basic',
    name: 'Artist Basic',
    type: 'artist',
    price: 25,
    setupFee: 99.99,
    billingCycle: 'monthly',
    durationWeeks: 4,
    description: 'Perfect for tattoo artists looking to book stations',
    features: [
      'Book any available station',
      'Cancel up to 24 hours before',
      'Artist profile page',
      'Portfolio showcase'
    ]
  },
  {
    id: 'sub-artist-pro',
    name: 'Artist Pro',
    type: 'artist',
    price: 49.99,
    setupFee: 49.99,
    billingCycle: 'monthly',
    durationWeeks: 4,
    description: 'For professional artists who need more flexibility',
    features: [
      'All Basic features',
      'Priority booking',
      'Cancel up to 2 hours before',
      'Featured artist profile',
      'Unlimited portfolio items'
    ]
  },
  {
    id: 'sub-host-basic',
    name: 'Shop Owner Basic',
    type: 'host',
    price: 50,
    billingCycle: 'monthly',
    durationWeeks: 4,
    description: 'For shop owners who want to rent out their stations',
    features: [
      'List unlimited stations',
      'Manage bookings',
      'Shop profile page',
      'Analytics dashboard'
    ]
  },
  {
    id: 'sub-host-pro',
    name: 'Shop Owner Pro',
    type: 'host',
    price: 99.99,
    billingCycle: 'monthly',
    durationWeeks: 4,
    description: 'For established shops with multiple stations',
    features: [
      'All Basic features',
      'Featured in search results',
      'Advanced analytics',
      'Custom shop branding',
      'Priority support'
    ]
  }
];

export default function SubscribeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userType } = params;
  
  const { subscribeAsArtist, subscribeAsHost, loading } = useUserStore();
  
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(true);
  
  // Payment form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch subscriptions
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Filter subscriptions by user type
        const filteredSubscriptions = mockSubscriptions.filter(
          sub => sub.type === userType
        );
        
        setSubscriptions(filteredSubscriptions);
        if (filteredSubscriptions.length > 0) {
          setSelectedSubscription(filteredSubscriptions[0].id);
        }
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        Alert.alert('Error', 'Failed to load subscription options');
      } finally {
        setLoadingSubscriptions(false);
      }
    };
    
    fetchSubscriptions();
  }, [userType]);
  
  const handleSubscribe = async () => {
    if (!selectedSubscription) {
      Alert.alert('Error', 'Please select a subscription plan');
      return;
    }
    
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      Alert.alert('Error', 'Please fill in all payment details');
      return;
    }
    
    // Simple validation
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert('Error', 'Please enter a valid card number');
      return;
    }
    
    if (expiryDate.length !== 5 || !expiryDate.includes('/')) {
      Alert.alert('Error', 'Please enter a valid expiry date (MM/YY)');
      return;
    }
    
    if (cvv.length !== 3) {
      Alert.alert('Error', 'Please enter a valid CVV');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Process subscription based on user type
      if (userType === 'artist') {
        await subscribeAsArtist(selectedSubscription);
      } else if (userType === 'host') {
        await subscribeAsHost(selectedSubscription);
      }
      
      // Show success message
      Alert.alert(
        'Subscription Successful',
        'Your subscription has been activated!',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/')
          }
        ]
      );
    } catch (error) {
      console.error('Subscription error:', error);
      Alert.alert('Error', 'Failed to process subscription');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatCardNumber = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    
    // Format with spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };
  
  const formatExpiryDate = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    
    // Format as MM/YY
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    
    return cleaned;
  };
  
  const getSelectedSubscriptionDetails = () => {
    return subscriptions.find(sub => sub.id === selectedSubscription);
  };
  
  const calculateTotalPrice = () => {
    const subscription = getSelectedSubscriptionDetails();
    if (!subscription) return 0;
    
    let total = subscription.price;
    
    // Add setup fee if applicable
    if (subscription.setupFee) {
      total += subscription.setupFee;
    }
    
    return total;
  };
  
  if (loadingSubscriptions) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading subscription options...</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Subscription</Text>
        <Text style={styles.subtitle}>
          {userType === 'artist' 
            ? 'Select a plan to start booking tattoo stations' 
            : 'Select a plan to start listing your tattoo stations'}
        </Text>
      </View>
      
      <View style={styles.subscriptionContainer}>
        {subscriptions.map((subscription) => (
          <Pressable 
            key={subscription.id}
            style={[
              styles.subscriptionOption,
              selectedSubscription === subscription.id && styles.selectedSubscription
            ]}
            onPress={() => setSelectedSubscription(subscription.id)}
            disabled={isSubmitting || loading}
          >
            <View style={styles.subscriptionHeader}>
              <Text style={[
                styles.subscriptionTitle,
                selectedSubscription === subscription.id && styles.selectedSubscriptionText
              ]}>
                {subscription.name}
              </Text>
              {selectedSubscription === subscription.id && (
                <Check size={20} color={Colors.primary} />
              )}
            </View>
            
            <Text style={[
              styles.subscriptionDescription,
              selectedSubscription === subscription.id && styles.selectedSubscriptionText
            ]}>
              {subscription.description || ''}
            </Text>
            
            <View style={styles.priceContainer}>
              <Text style={[
                styles.price,
                selectedSubscription === subscription.id && styles.selectedSubscriptionText
              ]}>
                ${subscription.price}
              </Text>
              <Text style={[
                styles.billingCycle,
                selectedSubscription === subscription.id && styles.selectedSubscriptionText
              ]}>
                /{subscription.billingCycle || 'monthly'}
              </Text>
            </View>
            
            {subscription.setupFee !== undefined && subscription.setupFee > 0 && (
              <Text style={[
                styles.setupFee,
                selectedSubscription === subscription.id && styles.selectedSubscriptionText
              ]}>
                + ${subscription.setupFee.toFixed(2)} one-time setup fee
              </Text>
            )}
            
            <Text style={[
              styles.duration,
              selectedSubscription === subscription.id && styles.selectedSubscriptionText
            ]}>
              {subscription.durationWeeks || 4}-week subscription
            </Text>
            
            <View style={styles.featuresContainer}>
              {subscription.features?.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Check size={16} color={selectedSubscription === subscription.id ? Colors.primary : Colors.gray[600]} />
                  <Text style={[
                    styles.featureText,
                    selectedSubscription === subscription.id && styles.selectedSubscriptionText
                  ]}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </Pressable>
        ))}
      </View>
      
      <View style={styles.paymentContainer}>
        <Text style={styles.paymentTitle}>Payment Details</Text>
        
        <View style={styles.inputContainer}>
          <View style={styles.inputLabel}>
            <CreditCard size={16} color={Colors.gray[600]} />
            <Text style={styles.label}>Card Number</Text>
          </View>
          <TextInput
            style={styles.input}
            value={cardNumber}
            onChangeText={(text) => setCardNumber(formatCardNumber(text))}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor={Colors.gray[600]}
            keyboardType="number-pad"
            maxLength={19}
            editable={!isSubmitting && !loading}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <View style={styles.inputLabel}>
            <Text style={styles.label}>Cardholder Name</Text>
          </View>
          <TextInput
            style={styles.input}
            value={cardName}
            onChangeText={setCardName}
            placeholder="John Doe"
            placeholderTextColor={Colors.gray[600]}
            editable={!isSubmitting && !loading}
          />
        </View>
        
        <View style={styles.rowInputs}>
          <View style={[styles.inputContainer, styles.halfInput]}>
            <View style={styles.inputLabel}>
              <Calendar size={16} color={Colors.gray[600]} />
              <Text style={styles.label}>Expiry Date</Text>
            </View>
            <TextInput
              style={styles.input}
              value={expiryDate}
              onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
              placeholder="MM/YY"
              placeholderTextColor={Colors.gray[600]}
              keyboardType="number-pad"
              maxLength={5}
              editable={!isSubmitting && !loading}
            />
          </View>
          
          <View style={[styles.inputContainer, styles.halfInput]}>
            <View style={styles.inputLabel}>
              <Lock size={16} color={Colors.gray[600]} />
              <Text style={styles.label}>CVV</Text>
            </View>
            <TextInput
              style={styles.input}
              value={cvv}
              onChangeText={(text) => setCvv(text.replace(/\D/g, ''))}
              placeholder="123"
              placeholderTextColor={Colors.gray[600]}
              keyboardType="number-pad"
              maxLength={3}
              secureTextEntry
              editable={!isSubmitting && !loading}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subscription</Text>
          <Text style={styles.summaryValue}>
            {getSelectedSubscriptionDetails()?.name || 'No plan selected'}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Billing Cycle</Text>
          <Text style={styles.summaryValue}>
            {getSelectedSubscriptionDetails()?.billingCycle || 'monthly'}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Duration</Text>
          <Text style={styles.summaryValue}>
            {getSelectedSubscriptionDetails()?.durationWeeks || 4} weeks
          </Text>
        </View>
        
        {getSelectedSubscriptionDetails()?.setupFee && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Setup Fee</Text>
            <Text style={styles.summaryValue}>
              ${getSelectedSubscriptionDetails()?.setupFee?.toFixed(2)}
            </Text>
          </View>
        )}
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subscription Fee</Text>
          <Text style={styles.summaryValue}>
            ${getSelectedSubscriptionDetails()?.price.toFixed(2)}
          </Text>
        </View>
        
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Due Today</Text>
          <Text style={styles.totalValue}>
            ${calculateTotalPrice().toFixed(2)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.termsText}>
        By subscribing, you agree to our Terms of Service and Privacy Policy. Your subscription will automatically renew until canceled.
      </Text>
      
      <Button
        title="Subscribe Now"
        onPress={handleSubscribe}
        loading={isSubmitting || loading}
        fullWidth
        style={styles.subscribeButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.gray[600],
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray[600],
  },
  subscriptionContainer: {
    marginBottom: 24,
  },
  subscriptionOption: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    backgroundColor: Colors.gray[100],
    marginBottom: 16,
  },
  selectedSubscription: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '20', // 20% opacity
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
    color: Colors.text,
  },
  subscriptionDescription: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  billingCycle: {
    fontSize: 14,
    color: Colors.gray[600],
    marginLeft: 2,
  },
  setupFee: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 12,
  },
  featuresContainer: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: Colors.gray[600],
    marginLeft: 8,
  },
  selectedSubscriptionText: {
    color: Colors.text,
  },
  paymentContainer: {
    marginBottom: 24,
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginLeft: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.gray[100],
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  summaryContainer: {
    marginBottom: 24,
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  termsText: {
    fontSize: 12,
    color: Colors.gray[600],
    marginBottom: 24,
    textAlign: 'center',
  },
  subscribeButton: {
    marginTop: 8,
  },
});