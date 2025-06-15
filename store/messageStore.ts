import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  senderType: 'user' | 'admin';
  receiverType: 'user' | 'admin';
}

interface MessageState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  sendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'read'>) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  getMessagesForUser: (userId: string) => Message[];
}

// Mock messages
const mockMessages: Message[] = [
  {
    id: 'msg1',
    senderId: 'admin1',
    receiverId: 'user1',
    content: 'Welcome to The Stations! How can we help you today?',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    read: true,
    senderType: 'admin',
    receiverType: 'user'
  },
  {
    id: 'msg2',
    senderId: 'user1',
    receiverId: 'admin1',
    content: 'Hi, I have a question about booking a station.',
    timestamp: new Date(Date.now() - 82800000).toISOString(), // 23 hours ago
    read: true,
    senderType: 'user',
    receiverType: 'admin'
  },
  {
    id: 'msg3',
    senderId: 'admin1',
    receiverId: 'user1',
    content: 'Sure, what would you like to know?',
    timestamp: new Date(Date.now() - 79200000).toISOString(), // 22 hours ago
    read: true,
    senderType: 'admin',
    receiverType: 'user'
  },
  {
    id: 'msg4',
    senderId: 'admin2',
    receiverId: 'user1',
    content: 'Hello! This is the support team. We noticed you signed up recently. Do you need any help getting started?',
    timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    read: false,
    senderType: 'admin',
    receiverType: 'user'
  }
];

export const useMessageStore = create<MessageState>()(
  persist(
    (set, get) => ({
      messages: [...mockMessages],
      loading: false,
      error: null,
      
      sendMessage: async (message) => {
        set({ loading: true, error: null });
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newMessage: Message = {
            ...message,
            id: `msg${get().messages.length + 1}`,
            timestamp: new Date().toISOString(),
            read: false
          };
          
          set(state => ({
            messages: [...state.messages, newMessage],
            loading: false
          }));
        } catch (error) {
          console.error('Send message error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to send message',
            loading: false 
          });
        }
      },
      
      markAsRead: async (messageId) => {
        set({ loading: true, error: null });
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            messages: state.messages.map(msg => 
              msg.id === messageId ? { ...msg, read: true } : msg
            ),
            loading: false
          }));
        } catch (error) {
          console.error('Mark as read error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to mark message as read',
            loading: false 
          });
        }
      },
      
      getMessagesForUser: (userId) => {
        return get().messages.filter(
          msg => msg.senderId === userId || msg.receiverId === userId
        );
      }
    }),
    {
      name: 'message-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);