import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import Logo from '@/components/Logo';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loading, error } = useUserStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await login(email, password);
      router.replace('/');
    } catch (error) {
      // Error is handled by the store
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRegister = () => {
    router.push('/auth/register');
  };

  const handleAdminLogin = () => {
    router.push('/admin/login');
  };

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Logo size="large" style={styles.logo} />
        <Text style={styles.title}>Welcome to The Stations</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
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
            editable={!isSubmitting}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor={Colors.gray[600]}
            secureTextEntry
            editable={!isSubmitting}
          />
        </View>
        
        <Pressable style={styles.forgotPassword} onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </Pressable>
        
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        
        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={loading || isSubmitting}
          fullWidth
          style={styles.loginButton}
        />
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <Pressable onPress={handleRegister}>
          <Text style={styles.registerText}>Sign Up</Text>
        </Pressable>
      </View>
      
      <View style={styles.demoInfo}>
        <Text style={styles.demoText}>Demo Credentials</Text>
        <Text style={styles.demoCredentials}>Email: user@example.com</Text>
        <Text style={styles.demoCredentials}>Password: password123</Text>
      </View>

      <Pressable onPress={handleAdminLogin} style={styles.adminLoginContainer}>
        <Text style={styles.adminLoginText}>Admin Login</Text>
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.primary,
  },
  errorText: {
    color: Colors.error,
    marginBottom: 16,
  },
  loginButton: {
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
  registerText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 4,
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