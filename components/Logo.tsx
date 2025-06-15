import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Image } from 'expo-image';
import DefaultColors, { getDynamicColors } from '@/constants/colors';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

export default function Logo({ 
  size = 'medium', 
  style
}: LogoProps) {
  // Get dynamic colors
  const colors = getDynamicColors();
  
  // Get app customization from admin store
  let logo: string | undefined;
  let appName: string = 'TattooSpace';
  
  try {
    const adminStore = require('@/store/adminStore').useAdminStore.getState();
    if (adminStore && adminStore.appCustomization) {
      logo = adminStore.appCustomization.logo;
      appName = adminStore.appCustomization.appName || 'TattooSpace';
    }
  } catch (error) {
    console.error('Error getting app customization:', error);
  }

  const getFontSize = () => {
    switch (size) {
      case 'small': return { title: 16, subtitle: 10 };
      case 'medium': return { title: 22, subtitle: 14 };
      case 'large': return { title: 28, subtitle: 18 };
      default: return { title: 22, subtitle: 14 };
    }
  };

  const { title, subtitle } = getFontSize();

  // If admin has uploaded a custom logo, use that
  if (logo) {
    const getLogoSize = () => {
      switch (size) {
        case 'small': return { width: 80, height: 40 };
        case 'medium': return { width: 120, height: 60 };
        case 'large': return { width: 160, height: 80 };
        default: return { width: 120, height: 60 };
      }
    };

    const { width, height } = getLogoSize();

    return (
      <View style={[styles.container, style]}>
        <Image 
          source={{ uri: logo }} 
          style={{ width, height, resizeMode: 'contain' }} 
          contentFit="contain"
          cachePolicy="memory"
        />
      </View>
    );
  }

  // Otherwise use text logo
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, { fontSize: title, color: colors.text }]}>
        {appName}
      </Text>
      <Text style={[styles.subtitle, { fontSize: subtitle, color: `${colors.text}80` }]}>
        for tattoo artists
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    letterSpacing: 1,
  },
  subtitle: {
    fontWeight: '500',
  }
});