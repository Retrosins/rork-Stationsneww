import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import Logo from '@/components/Logo';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would call Firebase's sendPasswordResetEmail
      // For now, just show a success message
      setMessage('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error('Password reset error:', error);
      setMessage(error instanceof Error ? error.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };
  
  const handleBack = () => {
    router.back();
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Logo size="large" style={styles.logo} />
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your email to receive a password reset link</Text>
      </View>
      
      <View style={styles.form}>
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
            editable={!loading}
          />
        </View>
        
        {message ? (
          <Text style={[
            styles.messageText,
            message.includes('sent') ? styles.successText : styles.errorText
          ]}>
            {message}
          </Text>
        ) : null}
        
        <Button
          title="Send Reset Link"
          onPress={handleResetPassword}
          loading={loading}
          fullWidth
          style={styles.resetButton}
        />
        
        <Button
          title="Back to Login"
          onPress={handleBack}
          variant="outline"
          fullWidth
          style={styles.backButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
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
    textAlign: 'center',
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
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.gray[100],
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.gray[100],
  },
  messageText: {
    marginBottom: 16,
    fontSize: 14,
  },
  errorText: {
    color: Colors.error,
  },
  successText: {
    color: '#4CAF50', // Green color for success
  },
  resetButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  backButton: {
    marginTop: 8,
  },
});