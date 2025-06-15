import React from "react";
import { Tabs } from "expo-router";
import { Home, Search, Heart, Calendar, User } from "lucide-react-native";
import { getDynamicColors } from "@/constants/colors";
import Logo from "@/components/Logo";
import { Platform } from "react-native";

export default function TabLayout() {
  // Get dynamic colors
  const colors = getDynamicColors();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.tabBarBackground,
          // Add height adjustment for web
          ...(Platform.OS === 'web' ? { height: 60 } : {}),
        },
        headerTintColor: colors.headerText,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          // Add padding for web
          ...(Platform.OS === 'web' ? { paddingBottom: 8 } : {}),
        },
        headerStyle: {
          backgroundColor: colors.headerBackground,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: () => <Logo size="small" />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
          headerTitle: () => <Logo size="small" />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
          headerTitle: () => <Logo size="small" />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
          headerTitle: () => <Logo size="small" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle: () => <Logo size="small" />,
        }}
      />
    </Tabs>
  );
}