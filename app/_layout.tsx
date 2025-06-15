import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { Platform, View, Text, StyleSheet } from 'react-native';
import DefaultColors, { getDynamicColors } from '@/constants/colors';
import Logo from '@/components/Logo';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";
import { useUserStore } from "@/store/userStore";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: Platform.OS === 'web' ? 0 : 3, // Disable retries on web to prevent excessive requests
      refetchOnWindowFocus: Platform.OS !== 'web', // Disable refetch on window focus for web
    },
  },
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  const [authInitialized, setAuthInitialized] = useState(false);
  const { refreshUserData } = useUserStore();
  const [trpcError, setTrpcError] = useState<Error | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is already logged in from persistent storage
        await refreshUserData();
      } catch (error) {
        console.error('Error refreshing user data:', error);
      } finally {
        setAuthInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (error) {
      console.error('Font loading error:', error);
    }
  }, [error]);

  useEffect(() => {
    if (loaded && authInitialized) {
      SplashScreen.hideAsync().catch(error => {
        console.warn('Error hiding splash screen:', error);
      });
    }
  }, [loaded, authInitialized]);

  // Handle errors in web environment
  if (Platform.OS === 'web' && trpcError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Connection Error</Text>
        <Text style={styles.errorMessage}>
          Unable to connect to the server. Please check your connection and try again.
        </Text>
        <Text style={styles.errorDetail}>{trpcError.message}</Text>
      </View>
    );
  }

  if (!loaded || !authInitialized) {
    return null;
  }

  return <RootLayoutNav setTrpcError={setTrpcError} />;
}

function RootLayoutNav({ setTrpcError }: { setTrpcError: (error: Error | null) => void }) {
  // Get dynamic colors from admin store
  const colors = getDynamicColors();
  
  return (
    <>
      <StatusBar style="light" />
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.headerBackground,
              },
              headerTintColor: colors.headerText,
              contentStyle: {
                backgroundColor: colors.background,
              },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="space/[id]" 
              options={{ 
                headerTitle: () => <Logo size="small" />,
                headerBackTitle: "Back",
                headerTintColor: colors.headerText,
              }} 
            />
            <Stack.Screen 
              name="filter" 
              options={{ 
                headerTitle: () => <Logo size="small" />,
                presentation: "modal",
                headerTintColor: colors.headerText,
              }} 
            />
            <Stack.Screen 
              name="booking/create" 
              options={{ 
                headerTitle: () => <Logo size="small" />,
                presentation: "modal",
                headerTintColor: colors.headerText,
              }} 
            />
            <Stack.Screen 
              name="auth/login" 
              options={{ 
                headerTitle: () => <Logo size="small" />,
                headerBackVisible: false,
                headerTintColor: colors.headerText,
              }} 
            />
            <Stack.Screen 
              name="auth/register" 
              options={{ 
                headerTitle: () => <Logo size="small" />,
                headerTintColor: colors.headerText,
              }} 
            />
            <Stack.Screen 
              name="auth/forgot-password" 
              options={{ 
                headerTitle: () => <Logo size="small" />,
                headerTintColor: colors.headerText,
              }} 
            />
            <Stack.Screen 
              name="host/dashboard" 
              options={{ 
                headerTitle: () => <Logo size="small" />,
                headerTintColor: colors.headerText,
              }} 
            />
            <Stack.Screen 
              name="host/create-space" 
              options={{ 
                headerTitle: () => <Logo size="small" />,
                headerTintColor: colors.headerText,
              }} 
            />
            <Stack.Screen 
              name="host/edit-space/[id]" 
              options={{ 
                headerTitle: () => <Logo size="small" />,
                headerTintColor: colors.headerText,
              }} 
            />
            <Stack.Screen 
              name="host/bookings" 
              options={{ 
                headerTitle: () => <Logo size="small" />,
                headerTintColor: colors.headerText,
              }} 
            />
            <Stack.Screen 
              name="admin/login" 
              options={{ 
                headerTitle: () => <Logo size="small" />,
                headerTintColor: colors.headerText,
              }} 
            />
            <Stack.Screen 
              name="admin/settings" 
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="admin/subscriptions" 
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="admin/dashboard" 
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="admin/featured" 
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="admin/admins" 
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="admin/messages" 
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="admin/activity-log" 
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="profile/edit" 
              options={{ 
                headerTitle: "Edit Profile",
                headerTintColor: colors.headerText,
              }} 
            />
            <Stack.Screen 
              name="profile/settings" 
              options={{ 
                headerTitle: "Account Settings",
                headerTintColor: colors.headerText,
              }} 
            />
            <Stack.Screen 
              name="profile/payment" 
              options={{ 
                headerTitle: "Payment Methods",
                headerTintColor: colors.headerText,
              }} 
            />
            <Stack.Screen 
              name="profile/personal-info" 
              options={{ 
                headerTitle: "Personal Information",
                headerTintColor: colors.headerText,
              }} 
            />
            <Stack.Screen 
              name="help" 
              options={{ 
                headerTitle: "Help Center",
                headerTintColor: colors.headerText,
              }} 
            />
            <Stack.Screen 
              name="subscription" 
              options={{ 
                headerTitle: "Subscription",
                headerTintColor: colors.headerText,
              }} 
            />
            <Stack.Screen 
              name="messages" 
              options={{ 
                headerTitle: "Messages",
                headerTintColor: colors.headerText,
              }} 
            />
          </Stack>
        </QueryClientProvider>
      </trpc.Provider>
    </>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorDetail: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'center',
  },
});