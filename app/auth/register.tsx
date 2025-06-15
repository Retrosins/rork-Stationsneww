import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import Logo from '@/components/Logo';
import { Check } from 'lucide-react-native';
import { useUserStore } from '@/store/userStore';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, loading, error } = useUserStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'artist' | 'host' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!userType) {
      Alert.alert('Error', 'Please select account type');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Register user
      const userId = await register(email, password, name);
      
      // Navigate to subscription screen
      router.push({
        pathname: '/auth/subscribe',
        params: { 
          userType,
          userId
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Registration Error', error instanceof Error ? error.message : 'Failed to register');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLogin = () => {
    router.replace('/auth/login');
  };

  const handleAdminLogin = () => {
    router.push('/admin/login');
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Logo size="large" style={styles.logo} />
        <Text style={styles.title}>Join The Stations</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>
      </View>
      
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            placeholderTextColor={Colors.gray[600]}
            editable={!isSubmitting}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={Colors.gray[600]}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isSubmitting}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            placeholderTextColor={Colors.gray[600]}
            secureTextEntry
            editable={!isSubmitting}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            placeholderTextColor={Colors.gray[600]}
            secureTextEntry
            editable={!isSubmitting}
          />
        </View>
        
        <View style={styles.accountTypeContainer}>
          <Text style={styles.label}>Account Type</Text>
          <Text style={styles.helperText}>Select the type of account you want to create</Text>
          
          <View style={styles.accountTypeOptions}>
            <Pressable 
              style={[
                styles.accountTypeOption,
                userType === 'artist' && styles.selectedAccountType
              ]}
              onPress={() => !isSubmitting && setUserType('artist')}
              disabled={isSubmitting}
            >
              <View style={styles.accountTypeHeader}>
                <Text style={[
                  styles.accountTypeTitle,
                  userType === 'artist' && styles.selectedAccountTypeText
                ]}>
                  Artist
                </Text>
                {userType === 'artist' && (
                  <Check size={20} color={Colors.primary} />
                )}
              </View>
              <Text style={[
                styles.accountTypeDescription,
                userType === 'artist' && styles.selectedAccountTypeText
              ]}>
                Find and book tattoo stations
              </Text>
              <Text style={[
                styles.accountTypePrice,
                userType === 'artist' && styles.selectedAccountTypeText
              ]}>
                $25/week
              </Text>
            </Pressable>
            
            <Pressable 
              style={[
                styles.accountTypeOption,
                userType === 'host' && styles.selectedAccountType
              ]}
              onPress={() => !isSubmitting && setUserType('host')}
              disabled={isSubmitting}
            >
              <View style={styles.accountTypeHeader}>
                <Text style={[
                  styles.accountTypeTitle,
                  userType === 'host' && styles.selectedAccountTypeText
                ]}>
                  Shop Owner
                </Text>
                {userType === 'host' && (
                  <Check size={20} color={Colors.primary} />
                )}
              </View>
              <Text style={[
                styles.accountTypeDescription,
                userType === 'host' && styles.selectedAccountTypeText
              ]}>
                Rent out your tattoo stations
              </Text>
              <Text style={[
                styles.accountTypePrice,
                userType === 'host' && styles.selectedAccountTypeText
              ]}>
                $50/week
              </Text>
            </Pressable>
          </View>
        </View>
        
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        
        <Text style={styles.termsText}>
          By signing up, you agree to our Terms of Service and Privacy Policy
        </Text>
        
        <Button
          title="Continue to Payment"
          onPress={handleRegister}
          loading={loading || isSubmitting}
          fullWidth
          style={styles.registerButton}
        />
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <Pressable onPress={handleLogin} disabled={isSubmitting}>
          <Text style={styles.loginText}>Sign In</Text>
        </Pressable>
      </View>

      <Pressable onPress={handleAdminLogin} style={styles.adminLoginContainer} disabled={isSubmitting}>
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
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray[600],
  },
  form: {
    marginBottom: 24,
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
  helperText: {
    fontSize: 12,
    color: Colors.gray[600],
    marginBottom: 12,
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
  accountTypeContainer: {
    marginBottom: 24,
  },
  accountTypeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  accountTypeOption: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    backgroundColor: Colors.gray[100],
  },
  selectedAccountType: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '20', // 20% opacity
  },
  accountTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  accountTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  accountTypeDescription: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 12,
  },
  accountTypePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  selectedAccountTypeText: {
    color: Colors.text,
  },
  errorText: {
    color: Colors.error,
    marginBottom: 16,
  },
  termsText: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 24,
    textAlign: 'center',
  },
  registerButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  loginText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 4,
  },
  adminLoginContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  adminLoginText: {
    fontSize: 12,
    color: Colors.gray[500],
    textDecorationLine: 'underline',
  },
});