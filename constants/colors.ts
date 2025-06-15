import { Platform } from 'react-native';

// Default colors - Dark Theme
const DefaultColors = {
  primary: '#FF5A5F',
  secondary: '#00A699',
  tertiary: '#FC642D',
  info: '#4285F4',
  success: '#34A853',
  warning: '#FBBC05',
  error: '#EA4335',
  black: '#000000',
  white: '#FFFFFF',
  text: '#FFFFFF',
  background: '#121212',
  card: '#1E1E1E',
  border: '#333333',
  notification: '#FF3B30',
  headerBackground: '#1E1E1E',
  headerText: '#FFFFFF',
  inputBackground: '#2C2C2C',
  inputText: '#FFFFFF',
  buttonText: '#FFFFFF',
  tabBarActive: '#FF5A5F',
  tabBarInactive: '#888888',
  tabBarBackground: '#1E1E1E',
  gray: {
    100: '#2C2C2C',
    200: '#333333',
    300: '#444444',
    400: '#666666',
    500: '#888888',
    600: '#AAAAAA',
    700: '#CCCCCC',
    800: '#EEEEEE',
    900: '#F5F5F5',
  },
};

// Define the ColorScheme type to match all properties in DefaultColors
export type ColorScheme = typeof DefaultColors;

// Function to get dynamic colors from admin store
export const getDynamicColors = (): ColorScheme => {
  // For web, we need to be careful about how we access the store
  // since it might not be initialized during SSR
  if (Platform.OS === 'web' && typeof window === 'undefined') {
    return DefaultColors;
  }

  try {
    // Avoid circular dependencies by using require
    const adminStore = require('@/store/adminStore').useAdminStore.getState();
    
    // If the store or colorScheme is not available, return default colors
    if (!adminStore || !adminStore.appCustomization || !adminStore.appCustomization.colorScheme) {
      return DefaultColors;
    }
    
    // Return the merged colors
    return {
      ...DefaultColors,
      ...(adminStore.appCustomization.colorScheme || {}),
    };
  } catch (error) {
    console.error('Error getting dynamic colors:', error);
    return DefaultColors;
  }
};

export default DefaultColors;