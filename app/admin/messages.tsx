import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAdminStore } from '@/store/adminStore';
import { useMessageStore } from '@/store/messageStore';
import Colors from '@/constants/colors';
import { Image } from 'expo-image';
import { ArrowLeft, Send, User } from 'lucide-react-native';

export default function AdminMessagesScreen() {
  const router = useRouter();
  const { admin, isLoggedIn } = useAdminStore();
  const { messages, sendMessage, markAsRead, getMessagesForAdmin } = useMessageStore();
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  
  // Mock user data for demo
  const mockUsers = [
    { id: 'u1', name: 'Alex Johnson', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 'u2', name: 'Sarah Williams', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80' },
    { id: 'u3', name: 'Michael Chen', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80' },
  ];
  
  useEffect(() => {
    if (!isLoggedIn || !admin) {
      router.replace('/admin/login');
    }
  }, [isLoggedIn, admin]);
  
  if (!admin) return null;
  
  const adminMessages = getMessagesForAdmin(admin.id);
  
  // Get unique user IDs from messages
  const userIdsWithMessages = [...new Set(
    adminMessages.map(msg => 
      msg.senderType === 'user' ? msg.senderId : msg.receiverId
    )
  )];
  
  // Filter users who have messages with the admin
  const usersWithMessages = mockUsers.filter(user => 
    userIdsWithMessages.includes(user.id)
  );
  
  // Get messages for selected user
  const selectedUserMessages = selectedUserId 
    ? adminMessages.filter(msg => 
        (msg.senderId === selectedUserId && msg.receiverId === admin.id) || 
        (msg.senderId === admin.id && msg.receiverId === selectedUserId)
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId) return;
    
    await sendMessage({
      senderId: admin.id,
      receiverId: selectedUserId,
      content: newMessage.trim(),
      senderType: 'admin',
      receiverType: 'user',
    });
    
    setNewMessage('');
  };
  
  const renderUserItem = ({ item }: { item: typeof mockUsers[0] }) => {
    // Get last message with this user
    const lastMessage = adminMessages
      .filter(msg => 
        (msg.senderId === item.id && msg.receiverId === admin.id) || 
        (msg.senderId === admin.id && msg.receiverId === item.id)
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    
    // Count unread messages from this user
    const unreadCount = adminMessages.filter(
      msg => msg.senderId === item.id && msg.receiverId === admin.id && !msg.read
    ).length;
    
    return (
      <Pressable
        style={[
          styles.userItem,
          selectedUserId === item.id && styles.selectedUserItem
        ]}
        onPress={() => setSelectedUserId(item.id)}
      >
        <View style={styles.userAvatar}>
          {item.avatar ? (
            <Image
              source={{ uri: item.avatar }}
              style={styles.avatarImage}
              contentFit="cover"
            />
          ) : (
            <User size={24} color={Colors.gray[600]} />
          )}
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          {lastMessage && (
            <Text style={styles.lastMessage} numberOfLines={1}>
              {lastMessage.content}
            </Text>
          )}
        </View>
        
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{unreadCount}</Text>
          </View>
        )}
      </Pressable>
    );
  };
  
  const renderMessageItem = ({ item }: { item: typeof adminMessages[0] }) => {
    const isFromAdmin = item.senderId === admin.id;
    
    return (
      <View style={[
        styles.messageContainer,
        isFromAdmin ? styles.adminMessage : styles.userMessage
      ]}>
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.messageTime}>
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>User Messages</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.usersList}>
          <Text style={styles.usersListTitle}>Conversations</Text>
          
          {usersWithMessages.length > 0 ? (
            <FlatList
              data={usersWithMessages}
              keyExtractor={(item) => item.id}
              renderItem={renderUserItem}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyUsers}>
              <Text style={styles.emptyText}>No conversations yet</Text>
            </View>
          )}
        </View>
        
        <View style={styles.messagesContainer}>
          {selectedUserId ? (
            <>
              <View style={styles.messagesHeader}>
                <Text style={styles.messagesHeaderTitle}>
                  {mockUsers.find(u => u.id === selectedUserId)?.name || 'User'}
                </Text>
              </View>
              
              <FlatList
                data={selectedUserMessages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessageItem}
                style={styles.messagesList}
                contentContainerStyle={styles.messagesListContent}
                inverted={false}
              />
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={newMessage}
                  onChangeText={setNewMessage}
                  placeholder="Type a message..."
                  placeholderTextColor={Colors.gray[600]}
                  multiline
                />
                <Pressable 
                  style={styles.sendButton}
                  onPress={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send size={20} color={newMessage.trim() ? Colors.primary : Colors.gray[600]} />
                </Pressable>
              </View>
            </>
          ) : (
            <View style={styles.noSelection}>
              <Text style={styles.noSelectionText}>Select a conversation to view messages</Text>
            </View>
          )}
        </View>
      </View>
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
    flexDirection: 'row',
  },
  usersList: {
    width: '30%',
    borderRightWidth: 1,
    borderRightColor: Colors.gray[100],
    backgroundColor: Colors.card,
  },
  usersListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  userItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
    alignItems: 'center',
  },
  selectedUserItem: {
    backgroundColor: Colors.gray[100],
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 12,
    color: Colors.gray[600],
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.black,
  },
  emptyUsers: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.gray[600],
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  messagesHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
    backgroundColor: Colors.card,
  },
  messagesHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  messagesList: {
    flex: 1,
  },
  messagesListContent: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  adminMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary + '20',
    borderBottomRightRadius: 4,
  },
  userMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.gray[100],
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    color: Colors.text,
  },
  messageTime: {
    fontSize: 10,
    color: Colors.gray[600],
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
    backgroundColor: Colors.card,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.gray[100],
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  noSelection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  noSelectionText: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
  },
});