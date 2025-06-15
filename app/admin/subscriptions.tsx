import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Alert, TextInput, Switch, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useAdminStore } from '@/store/adminStore';
import Colors from '@/constants/colors';
import { ArrowLeft, Plus, Edit, Trash, DollarSign, Clock, Tag, CheckCircle } from 'lucide-react-native';
import Button from '@/components/Button';
import { Subscription } from '@/types/subscription';

export default function AdminSubscriptionsScreen() {
  const router = useRouter();
  const { 
    getSubscriptions, 
    addSubscription, 
    updateSubscription, 
    removeSubscription, 
    toggleSubscriptionStatus,
    loading 
  } = useAdminStore();
  
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState<'artist' | 'host'>('artist');
  const [price, setPrice] = useState('');
  const [setupFee, setSetupFee] = useState('');
  const [billingCycle, setBillingCycle] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [durationWeeks, setDurationWeeks] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [isActive, setIsActive] = useState(true);
  
  // Load subscriptions
  useEffect(() => {
    setSubscriptions(getSubscriptions());
  }, [getSubscriptions]);
  
  // Reset form
  const resetForm = () => {
    setName('');
    setType('artist');
    setPrice('');
    setSetupFee('');
    setBillingCycle('weekly');
    setDurationWeeks('');
    setDescription('');
    setFeatures(['']);
    setIsActive(true);
    setIsAddingNew(false);
    setEditingSubscription(null);
  };
  
  // Set form values when editing
  useEffect(() => {
    if (editingSubscription) {
      setName(editingSubscription.name);
      setType(editingSubscription.type);
      setPrice(editingSubscription.price.toString());
      setSetupFee(editingSubscription.setupFee?.toString() || '');
      setBillingCycle(editingSubscription.billingCycle);
      setDurationWeeks(editingSubscription.durationWeeks.toString());
      setDescription(editingSubscription.description || '');
      setFeatures(editingSubscription.features || ['']);
      setIsActive(editingSubscription.isActive);
    }
  }, [editingSubscription]);
  
  // Handle adding a new subscription
  const handleAddSubscription = async () => {
    if (!validateForm()) return;
    
    try {
      await addSubscription({
        name,
        type,
        price: parseFloat(price),
        setupFee: setupFee ? parseFloat(setupFee) : undefined,
        billingCycle,
        durationWeeks: parseInt(durationWeeks, 10),
        description,
        features: features.filter(f => f.trim() !== ''),
        isActive
      });
      
      setSubscriptions(getSubscriptions());
      resetForm();
      Alert.alert('Success', 'Subscription plan added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add subscription plan');
    }
  };
  
  // Handle updating a subscription
  const handleUpdateSubscription = async () => {
    if (!validateForm() || !editingSubscription) return;
    
    try {
      await updateSubscription(editingSubscription.id, {
        name,
        type,
        price: parseFloat(price),
        setupFee: setupFee ? parseFloat(setupFee) : undefined,
        billingCycle,
        durationWeeks: parseInt(durationWeeks, 10),
        description,
        features: features.filter(f => f.trim() !== ''),
        isActive
      });
      
      setSubscriptions(getSubscriptions());
      resetForm();
      Alert.alert('Success', 'Subscription plan updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update subscription plan');
    }
  };
  
  // Handle removing a subscription
  const handleRemoveSubscription = (subscription: Subscription) => {
    Alert.alert(
      'Remove Subscription',
      `Are you sure you want to remove the "${subscription.name}" subscription plan?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeSubscription(subscription.id);
              setSubscriptions(getSubscriptions());
              Alert.alert('Success', 'Subscription plan removed successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to remove subscription plan');
            }
          },
        },
      ]
    );
  };
  
  // Handle toggling subscription status
  const handleToggleStatus = async (subscription: Subscription) => {
    try {
      await toggleSubscriptionStatus(subscription.id);
      setSubscriptions(getSubscriptions());
    } catch (error) {
      Alert.alert('Error', 'Failed to toggle subscription status');
    }
  };
  
  // Validate form
  const validateForm = () => {
    if (!name) {
      Alert.alert('Error', 'Subscription name is required');
      return false;
    }
    
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return false;
    }
    
    if (setupFee && (isNaN(parseFloat(setupFee)) || parseFloat(setupFee) < 0)) {
      Alert.alert('Error', 'Please enter a valid setup fee');
      return false;
    }
    
    if (!durationWeeks || isNaN(parseInt(durationWeeks, 10)) || parseInt(durationWeeks, 10) <= 0) {
      Alert.alert('Error', 'Please enter a valid duration in weeks');
      return false;
    }
    
    return true;
  };
  
  // Add a new feature field
  const addFeatureField = () => {
    setFeatures([...features, '']);
  };
  
  // Update a feature
  const updateFeature = (index: number, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
  };
  
  // Remove a feature field
  const removeFeatureField = (index: number) => {
    if (features.length > 1) {
      const updatedFeatures = [...features];
      updatedFeatures.splice(index, 1);
      setFeatures(updatedFeatures);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Subscription Plans</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!isAddingNew && !editingSubscription && (
          <View style={styles.actionButtonContainer}>
            <Button
              title="Add New Subscription Plan"
              onPress={() => setIsAddingNew(true)}
              icon={<Plus size={20} color={Colors.white} />}
              fullWidth
            />
          </View>
        )}
        
        {(isAddingNew || editingSubscription) && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
              {isAddingNew ? 'Add New Subscription Plan' : 'Edit Subscription Plan'}
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Plan Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter plan name"
                placeholderTextColor={Colors.gray[600]}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Plan Type</Text>
              <View style={styles.segmentedControl}>
                <Pressable
                  style={[
                    styles.segmentedButton,
                    type === 'artist' && styles.segmentedButtonActive
                  ]}
                  onPress={() => setType('artist')}
                >
                  <Text
                    style={[
                      styles.segmentedButtonText,
                      type === 'artist' && styles.segmentedButtonTextActive
                    ]}
                  >
                    Artist
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.segmentedButton,
                    type === 'host' && styles.segmentedButtonActive
                  ]}
                  onPress={() => setType('host')}
                >
                  <Text
                    style={[
                      styles.segmentedButtonText,
                      type === 'host' && styles.segmentedButtonTextActive
                    ]}
                  >
                    Shop Owner
                  </Text>
                </Pressable>
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Price</Text>
              <View style={styles.priceInputContainer}>
                <DollarSign size={20} color={Colors.gray[600]} style={styles.inputIcon} />
                <TextInput
                  style={styles.priceInput}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0.00"
                  placeholderTextColor={Colors.gray[600]}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Setup Fee (optional)</Text>
              <View style={styles.priceInputContainer}>
                <DollarSign size={20} color={Colors.gray[600]} style={styles.inputIcon} />
                <TextInput
                  style={styles.priceInput}
                  value={setupFee}
                  onChangeText={setSetupFee}
                  placeholder="0.00"
                  placeholderTextColor={Colors.gray[600]}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Billing Cycle</Text>
              <View style={styles.segmentedControl}>
                <Pressable
                  style={[
                    styles.segmentedButton,
                    billingCycle === 'weekly' && styles.segmentedButtonActive
                  ]}
                  onPress={() => setBillingCycle('weekly')}
                >
                  <Text
                    style={[
                      styles.segmentedButtonText,
                      billingCycle === 'weekly' && styles.segmentedButtonTextActive
                    ]}
                  >
                    Weekly
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.segmentedButton,
                    billingCycle === 'monthly' && styles.segmentedButtonActive
                  ]}
                  onPress={() => setBillingCycle('monthly')}
                >
                  <Text
                    style={[
                      styles.segmentedButtonText,
                      billingCycle === 'monthly' && styles.segmentedButtonTextActive
                    ]}
                  >
                    Monthly
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.segmentedButton,
                    billingCycle === 'yearly' && styles.segmentedButtonActive
                  ]}
                  onPress={() => setBillingCycle('yearly')}
                >
                  <Text
                    style={[
                      styles.segmentedButtonText,
                      billingCycle === 'yearly' && styles.segmentedButtonTextActive
                    ]}
                  >
                    Yearly
                  </Text>
                </Pressable>
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Duration (weeks)</Text>
              <View style={styles.priceInputContainer}>
                <Clock size={20} color={Colors.gray[600]} style={styles.inputIcon} />
                <TextInput
                  style={styles.priceInput}
                  value={durationWeeks}
                  onChangeText={setDurationWeeks}
                  placeholder="12"
                  placeholderTextColor={Colors.gray[600]}
                  keyboardType="number-pad"
                />
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter plan description"
                placeholderTextColor={Colors.gray[600]}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Features</Text>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureInputContainer}>
                  <TextInput
                    style={styles.featureInput}
                    value={feature}
                    onChangeText={(value) => updateFeature(index, value)}
                    placeholder="Enter feature"
                    placeholderTextColor={Colors.gray[600]}
                  />
                  <Pressable
                    style={styles.removeFeatureButton}
                    onPress={() => removeFeatureField(index)}
                  >
                    <Trash size={16} color={Colors.error} />
                  </Pressable>
                </View>
              ))}
              <Button
                title="Add Feature"
                variant="outline"
                onPress={addFeatureField}
                style={styles.addFeatureButton}
                icon={<Plus size={16} color={Colors.text} />}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <View style={styles.switchContainer}>
                <Text style={styles.label}>Active</Text>
                <Switch
                  value={isActive}
                  onValueChange={setIsActive}
                  trackColor={{ false: Colors.gray[300], true: Colors.primary }}
                  thumbColor={Colors.white}
                />
              </View>
              <Text style={styles.helperText}>
                {isActive ? 'This plan is available for users to subscribe' : 'This plan is hidden from users'}
              </Text>
            </View>
            
            <View style={styles.formButtonsContainer}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={resetForm}
                style={styles.cancelButton}
              />
              <Button
                title={isAddingNew ? 'Add Plan' : 'Update Plan'}
                onPress={isAddingNew ? handleAddSubscription : handleUpdateSubscription}
                loading={loading}
                style={styles.submitButton}
              />
            </View>
          </View>
        )}
        
        {!isAddingNew && !editingSubscription && (
          <View style={styles.subscriptionsContainer}>
            <Text style={styles.sectionTitle}>Artist Plans</Text>
            {subscriptions.filter(sub => sub.type === 'artist').map((subscription) => (
              <View key={subscription.id} style={styles.subscriptionCard}>
                <View style={styles.subscriptionHeader}>
                  <View style={styles.subscriptionTitleContainer}>
                    <Text style={styles.subscriptionName}>{subscription.name}</Text>
                    {subscription.isActive ? (
                      <View style={styles.activeIndicator}>
                        <Text style={styles.activeIndicatorText}>Active</Text>
                      </View>
                    ) : (
                      <View style={styles.inactiveIndicator}>
                        <Text style={styles.inactiveIndicatorText}>Inactive</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.subscriptionPrice}>
                    ${subscription.price}/{subscription.billingCycle}
                  </Text>
                </View>
                
                {subscription.description && (
                  <Text style={styles.subscriptionDescription}>{subscription.description}</Text>
                )}
                
                {subscription.setupFee && subscription.setupFee > 0 && (
                  <Text style={styles.setupFeeText}>Setup fee: ${subscription.setupFee.toFixed(2)}</Text>
                )}
                
                <Text style={styles.durationText}>Duration: {subscription.durationWeeks} weeks</Text>
                
                {subscription.features && subscription.features.length > 0 && (
                  <View style={styles.featuresContainer}>
                    {subscription.features.map((feature, index) => (
                      <View key={index} style={styles.featureItem}>
                        <CheckCircle size={16} color={Colors.primary} style={styles.featureIcon} />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                )}
                
                <View style={styles.subscriptionActions}>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => setEditingSubscription(subscription)}
                  >
                    <Edit size={20} color={Colors.primary} />
                  </Pressable>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleToggleStatus(subscription)}
                  >
                    <Tag size={20} color={Colors.text} />
                  </Pressable>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleRemoveSubscription(subscription)}
                  >
                    <Trash size={20} color={Colors.error} />
                  </Pressable>
                </View>
              </View>
            ))}
            
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Shop Owner Plans</Text>
            {subscriptions.filter(sub => sub.type === 'host').map((subscription) => (
              <View key={subscription.id} style={styles.subscriptionCard}>
                <View style={styles.subscriptionHeader}>
                  <View style={styles.subscriptionTitleContainer}>
                    <Text style={styles.subscriptionName}>{subscription.name}</Text>
                    {subscription.isActive ? (
                      <View style={styles.activeIndicator}>
                        <Text style={styles.activeIndicatorText}>Active</Text>
                      </View>
                    ) : (
                      <View style={styles.inactiveIndicator}>
                        <Text style={styles.inactiveIndicatorText}>Inactive</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.subscriptionPrice}>
                    ${subscription.price}/{subscription.billingCycle}
                  </Text>
                </View>
                
                {subscription.description && (
                  <Text style={styles.subscriptionDescription}>{subscription.description}</Text>
                )}
                
                {subscription.setupFee && subscription.setupFee > 0 && (
                  <Text style={styles.setupFeeText}>Setup fee: ${subscription.setupFee.toFixed(2)}</Text>
                )}
                
                <Text style={styles.durationText}>Duration: {subscription.durationWeeks} weeks</Text>
                
                {subscription.features && subscription.features.length > 0 && (
                  <View style={styles.featuresContainer}>
                    {subscription.features.map((feature, index) => (
                      <View key={index} style={styles.featureItem}>
                        <CheckCircle size={16} color={Colors.primary} style={styles.featureIcon} />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                )}
                
                <View style={styles.subscriptionActions}>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => setEditingSubscription(subscription)}
                  >
                    <Edit size={20} color={Colors.primary} />
                  </Pressable>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleToggleStatus(subscription)}
                  >
                    <Tag size={20} color={Colors.text} />
                  </Pressable>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleRemoveSubscription(subscription)}
                  >
                    <Trash size={20} color={Colors.error} />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
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
  actionButtonContainer: {
    padding: 16,
    marginBottom: 8,
  },
  formContainer: {
    padding: 16,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.gray[200],
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    overflow: 'hidden',
  },
  segmentedButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: Colors.gray[200],
  },
  segmentedButtonActive: {
    backgroundColor: Colors.primary,
  },
  segmentedButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  segmentedButtonTextActive: {
    color: Colors.white,
  },
  priceInputContainer: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.gray[200],
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: Colors.text,
  },
  featureInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.gray[200],
  },
  removeFeatureButton: {
    marginLeft: 8,
    padding: 8,
  },
  addFeatureButton: {
    marginTop: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helperText: {
    fontSize: 12,
    color: Colors.gray[600],
    marginTop: 4,
  },
  formButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
  },
  subscriptionsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  subscriptionCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.gray[300],
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  subscriptionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subscriptionName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 8,
  },
  activeIndicator: {
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  activeIndicatorText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.white,
  },
  inactiveIndicator: {
    backgroundColor: Colors.gray[400],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  inactiveIndicatorText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.white,
  },
  subscriptionPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  subscriptionDescription: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 12,
  },
  setupFeeText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
  },
  durationText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 12,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureIcon: {
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: Colors.text,
  },
  subscriptionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: Colors.gray[300],
    paddingTop: 12,
  },
  actionButton: {
    padding: 8,
    marginLeft: 16,
  },
});