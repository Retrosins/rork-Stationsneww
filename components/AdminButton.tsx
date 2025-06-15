import React from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';

interface AdminButtonProps {
  style?: any;
}

export default function AdminButton({ style }: AdminButtonProps) {
  const router = useRouter();
  
  const handleAdminLogin = () => {
    router.push('/admin/login');
  };
  
  return (
    <Pressable 
      onPress={handleAdminLogin} 
      style={[styles.adminLoginContainer, style]}
    >
      <Text style={styles.adminLoginText}>Admin Login</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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