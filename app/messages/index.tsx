import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { useMessageStore } from '@/store/messageStore';
import Colors from '@/constants/colors';
import { Image } from 'expo-image';
import { ArrowLeft, Send, User } from 'lucide-react-native';

export default function MessagesScreen() {
  const router = useRouter();
  const { user, isLoggedIn } = useUserStore();
  const { messages, sendMessage, markAsRead, getMessagesForUser } = useMessageStore();
  
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  
  // Mock admin data for demo
  const mockAdmins = [
    { id: 'admin1', name: 'Jay Admin', avatar: undefined },
    { id: 'admin2', name: 'Support Team', avatar: undefined },
  ];
  
  useEffect(() => {
    if (!isLoggedIn || !user) {
      router.replace('/auth/login');
    }
  }, [isLoggedIn, user]);
  
  if (!user) return null;
  
  const userMessages = getMessagesForUser(user.id);
  
  // Get unique admin IDs from messages
  const adminIdsWithMessages = [...new Set(
    userMessages.map(msg => 
      msg.senderType === 'admin' ? msg.senderId : msg.receiverId
    )
  )];
  
  // Filter admins who have messages with the user
  const adminsWithMessages = mockAdmins.filter(admin => 
    adminIdsWithMessages.includes(admin.id)
  );
  
  // If no admins with messages, default to first admin
  if (adminsWithMessages.length === 0 && !selectedAdminId && mockAdmins.length > 0) {
    setSelectedAdminId(mockAdmins[0].id);
  }
  
  // Get messages for selected admin
  const selectedAdminMessages = selectedAdminId 
    ? userMessages.filter(msg => 
        (msg.senderId === selectedAdminId && msg.receiverId === user.id) || 
        (msg.senderId === user.id && msg.receiverId === selectedAdminId)
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedAdminId) return;
    
    await sendMessage({
      senderId: user.id,
      receiverId: selectedAdminId,
      content: newMessage.trim(),
      senderType: 'user',
      receiverType: 'admin',
    });
    
    setNewMessage('');
  };
  
  const renderAdminItem = ({ item }: { item: typeof mockAdmins[0] }) => {
    // Get last message with this admin
    const lastMessage = userMessages
      .filter(msg => 
        (msg.senderId === item.id && msg.receiverId === user.id) || 
        (msg.senderId === user.id && msg.receiverId === item.id)
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    
    // Count unread messages from this admin
    const unreadCount = userMessages.filter(
      msg => msg.senderId === item.id && msg.receiverId === user.id && !msg.read
    ).length;
    
    return (
      <Pressable
        style={[
          styles.adminItem,
          selectedAdminId === item.id && styles.selectedAdminItem
        ]}
        onPress={() => setSelectedAdminId(item.id)}
      >
        <View style={styles.adminAvatar}>
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
        
        <View style={styles.adminInfo}>
          <Text style={styles.adminName}>{item.name}</Text>
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
  
  const renderMessageItem = ({ item }: { item: typeof userMessages[0] }) => {
    const isFromUser = item.senderId === user.id;
    
    return (
      <View style={[
        styles.messageContainer,
        isFromUser ? styles.userMessage : styles.adminMessage
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
        <Text style={styles.headerTitle}>Contact Admin</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.adminsList}>
          <Text style={styles.adminsListTitle}>Admins</Text>
          
          <FlatList
            data={mockAdmins}
            keyExtractor={(item) => item.id}
            renderItem={renderAdminItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
        
        <View style={styles.messagesContainer}>
          {selectedAdminId ? (
            <>
              <View style={styles.messagesHeader}>
                <Text style={styles.messagesHeaderTitle}>
                  {mockAdmins.find(a => a.id === selectedAdminId)?.name || 'Admin'}
                </Text>
              </View>
              
              <FlatList
                data={selectedAdminMessages}
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
              <Text style={styles.noSelectionText}>Select an admin to start messaging</Text>
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
  adminsList: {
    width: '30%',
    borderRightWidth: 1,
    borderRightColor: Colors.gray[100],
    backgroundColor: Colors.card,
  },
  adminsListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  adminItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
    alignItems: 'center',
  },
  selectedAdminItem: {
    backgroundColor: Colors.gray[100],
  },
  adminAvatar: {
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
  adminInfo: {
    flex: 1,
  },
  adminName: {
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
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary + '20',
    borderBottomRightRadius: 4,
  },
  adminMessage: {
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