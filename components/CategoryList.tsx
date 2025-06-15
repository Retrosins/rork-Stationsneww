import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useSpaceStore } from '@/store/spaceStore';
import { amenities } from '@/mocks/spaces';
import Colors from '@/constants/colors';
import * as Icons from 'lucide-react-native';

interface CategoryListProps {
  onCategoryPress?: (category: string) => void;
  selectedCategory?: string;
}

export default function CategoryList({ onCategoryPress, selectedCategory }: CategoryListProps) {
  const { filter, setFilter } = useSpaceStore();
  const selectedAmenities = filter.amenities || [];
  const currentCategory = selectedCategory || filter.category;

  const handleAmenityPress = (amenity: string) => {
    if (onCategoryPress) {
      onCategoryPress(amenity);
    }
    
    const newAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
    
    setFilter({ amenities: newAmenities.length > 0 ? newAmenities : undefined });
  };

  // Helper function to get the icon component
  const getIconComponent = (amenity: string) => {
    switch (amenity) {
      case 'Professional Chair':
      case 'Premium Chair':
        return Icons.Armchair;
      case 'Sterilization Equipment':
        return Icons.Droplets;
      case 'Ink Supplies':
      case 'Needles':
      case 'Disposable Tubes':
        return Icons.Palette;
      case 'Tattoo Machine':
      case 'Power Supply':
        return Icons.Zap;
      case 'Arm Rest':
        return Icons.HandMetal;
      case 'Lighting':
        return Icons.Lamp;
      case 'Private Area':
      case 'Private Room':
        return Icons.Lock;
      case 'WiFi':
        return Icons.Wifi;
      case 'Restroom':
        return Icons.Bath;
      case 'Parking':
        return Icons.Car;
      case 'Storage Space':
        return Icons.Package;
      case 'Refreshments':
        return Icons.Coffee;
      case 'Art Supplies':
      case 'Drawing Desk':
        return Icons.PenTool;
      default:
        return Icons.CheckCircle;
    }
  };

  // Select the most common amenities to display
  const commonAmenities = [
    'Professional Chair',
    'Sterilization Equipment',
    'Ink Supplies',
    'Private Room',
    'WiFi',
    'Parking',
    'Lighting',
    'Storage Space'
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {commonAmenities.map(amenity => {
        const isSelected = selectedAmenities.includes(amenity) || currentCategory === amenity;
        const IconComponent = getIconComponent(amenity);
        
        return (
          <Pressable
            key={amenity}
            style={[
              styles.amenityItem,
              isSelected && styles.selectedAmenityItem
            ]}
            onPress={() => handleAmenityPress(amenity)}
          >
            <View style={[
              styles.iconContainer,
              isSelected && styles.selectedIconContainer
            ]}>
              <IconComponent
                size={20}
                color={isSelected ? Colors.black : Colors.primary}
              />
            </View>
            <Text style={[
              styles.amenityName,
              isSelected && styles.selectedAmenityName
            ]}>
              {amenity}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  amenityItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  selectedAmenityItem: {
    backgroundColor: Colors.primary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  selectedIconContainer: {
    backgroundColor: '#ffffff',
  },
  amenityName: {
    fontSize: 12,
    color: Colors.gray[700],
    textAlign: 'center',
  },
  selectedAmenityName: {
    color: Colors.white,
    fontWeight: '500',
  },
});