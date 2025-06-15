import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAdminStore } from '@/store/adminStore';
import Colors from '@/constants/colors';
import { Image } from 'expo-image';
import { ArrowLeft, Plus, Trash2, User } from 'lucide-react-native';
import Button from '@/components/Button';

export default function AdminsManagementScreen() {
  const router = useRouter();
  const { admins, admin: currentAdmin, addAdmin, removeAdmin, loading } = useAdminStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  
  const handleAddAdmin = async () => {
    if (!newAdminName || !newAdminEmail) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    try {
      await addAdmin({
        name: newAdminName,
        email: newAdminEmail,
        role: 'standard'
      });
      setNewAdminName('');
      setNewAdminEmail('');
      setShowAddForm(false);
      Alert.alert('Success', 'Admin added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add admin');
    }
  };
  
  const handleRemoveAdmin = async (adminId: string) => {
    Alert.alert(
      'Remove Admin',
      'Are you sure you want to remove this admin?',
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
              await removeAdmin(adminId);
              Alert.alert('Success', 'Admin removed successfully');
            } catch (error) {
              Alert.alert('Error', error instanceof Error ? error.message : 'Failed to remove admin');
            }
          },
        },
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Manage Admins</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Admin Accounts</Text>
            <Pressable 
              style={styles.addButton}
              onPress={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? (
                <Text style={styles.addButtonText}>Cancel</Text>
              ) : (
                <>
                  <Plus size={16} color={Colors.primary} />
                  <Text style={styles.addButtonText}>Add Admin</Text>
                </>
              )}
            </Pressable>
          </View>
          
          {showAddForm && (
            <View style={styles.addForm}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={newAdminName}
                  onChangeText={setNewAdminName}
                  placeholder="Enter admin name"
                  placeholderTextColor={Colors.gray[600]}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={newAdminEmail}
                  onChangeText={setNewAdminEmail}
                  placeholder="Enter admin email"
                  placeholderTextColor={Colors.gray[600]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <Button
                title="Add Admin"
                onPress={handleAddAdmin}
                loading={loading}
                fullWidth
              />
            </View>
          )}
          
          <View style={styles.adminsList}>
            {admins.map((admin) => (
              <View key={admin.id} style={styles.adminItem}>
                <View style={styles.adminAvatar}>
                  {admin.avatar ? (
                    <Image
                      source={{ uri: admin.avatar }}
                      style={styles.avatarImage}
                      contentFit="cover"
                    />
                  ) : (
                    <User size={24} color={Colors.gray[600]} />
                  )}
                </View>
                
                <View style={styles.adminInfo}>
                  <Text style={styles.adminName}>{admin.name}</Text>
                  <Text style={styles.adminEmail}>{admin.email}</Text>
                  <View style={styles.adminRoleBadge}>
                    <Text style={styles.adminRoleText}>
                      {admin.role === 'super' ? 'Super Admin' : 'Admin'}
                    </Text>
                  </View>
                </View>
                
                {admin.id !== currentAdmin?.id && admin.role !== 'super' && (
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => handleRemoveAdmin(admin.id)}
                  >
                    <Trash2 size={20} color={Colors.error} />
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        </View>
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
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 4,
  },
  addForm: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 16,
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
    backgroundColor: Colors.gray[100],
  },
  adminsList: {
    gap: 12,
  },
  adminItem: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  adminAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  adminInfo: {
    flex: 1,
  },
  adminName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  adminEmail: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 8,
  },
  adminRoleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  adminRoleText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  removeButton: {
    padding: 8,
  },
});