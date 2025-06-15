import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import Logo from '@/components/Logo';
import { useAdminStore } from '@/store/adminStore';
import { Lock, User } from 'lucide-react-native';

export default function AdminLoginScreen() {
  const router = useRouter();
  const { login, loading, error } = useAdminStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    try {
      await login(email, password);
      router.replace('/admin/dashboard');
    } catch (error) {
      // Error is handled by the store
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Logo size="large" style={styles.logo} />
        <Text style={styles.title}>Admin Login</Text>
        <Text style={styles.subtitle}>Sign in to access admin controls</Text>
      </View>
      
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.iconInputContainer}>
            <User size={20} color={Colors.gray[600]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter admin email"
              placeholderTextColor={Colors.gray[600]}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.iconInputContainer}>
            <Lock size={20} color={Colors.gray[600]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter admin password"
              placeholderTextColor={Colors.gray[600]}
              secureTextEntry
            />
          </View>
        </View>
        
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        
        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={loading}
          fullWidth
          style={styles.loginButton}
        />
      </View>
      
      <View style={styles.demoInfo}>
        <Text style={styles.demoText}>Admin Credentials:</Text>
        <Text style={styles.demoCredentials}>Email: JAY0820@live.com</Text>
        <Text style={styles.demoCredentials}>Password: Maya0820</Text>
      </View>
      
      <Pressable 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>Back to App</Text>
      </Pressable>
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
  iconInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.gray[100],
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: Colors.text,
  },
  errorText: {
    color: Colors.error,
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
  },
  demoInfo: {
    marginTop: 40,
    padding: 16,
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    alignItems: 'center',
  },
  demoText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  demoCredentials: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  backButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
});