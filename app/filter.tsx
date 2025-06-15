import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSpaceStore } from '@/store/spaceStore';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import { X } from 'lucide-react-native';
import { amenities } from '@/mocks/spaces';

export default function FilterScreen() {
  const router = useRouter();
  const { filter, setFilter, clearFilter } = useSpaceStore();
  
  // Local state for filter values
  const [localFilter, setLocalFilter] = useState({
    minPrice: filter.minPrice || 0,
    maxPrice: filter.maxPrice || 500,
    amenities: filter.amenities || [],
  });
  
  const handleAmenityPress = (amenity: string) => {
    setLocalFilter(prev => {
      const amenities = prev.amenities || [];
      return {
        ...prev,
        amenities: amenities.includes(amenity)
          ? amenities.filter(a => a !== amenity)
          : [...amenities, amenity]
      };
    });
  };
  
  const handleApply = () => {
    setFilter({
      minPrice: localFilter.minPrice > 0 ? localFilter.minPrice : undefined,
      maxPrice: localFilter.maxPrice < 500 ? localFilter.maxPrice : undefined,
      amenities: localFilter.amenities.length > 0 ? localFilter.amenities : undefined,
    });
    router.back();
  };
  
  const handleReset = () => {
    setLocalFilter({
      minPrice: 0,
      maxPrice: 500,
      amenities: [],
    });
    clearFilter();
  };

  const handleMinPriceChange = (value: number) => {
    setLocalFilter(prev => ({ ...prev, minPrice: value }));
  };

  const handleMaxPriceChange = (value: number) => {
    setLocalFilter(prev => ({ ...prev, maxPrice: value }));
  };
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Price Range</Text>
            <Text style={styles.priceRangeText}>
              ${localFilter.minPrice} - ${localFilter.maxPrice === 500 ? '500+' : localFilter.maxPrice}
            </Text>
          </View>
          <View style={styles.sliderContainer}>
            {/* Custom price range selector instead of Slider */}
            <View style={styles.priceRangeSelector}>
              <Text style={styles.priceLabel}>Min Price:</Text>
              <View style={styles.priceButtonsRow}>
                {[0, 50, 75, 100, 150].map(price => (
                  <Pressable
                    key={`min-${price}`}
                    style={[
                      styles.priceButton,
                      localFilter.minPrice === price && styles.selectedPriceButton
                    ]}
                    onPress={() => handleMinPriceChange(price)}
                  >
                    <Text style={[
                      styles.priceButtonText,
                      localFilter.minPrice === price && styles.selectedPriceButtonText
                    ]}>
                      ${price}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            
            <View style={styles.priceRangeSelector}>
              <Text style={styles.priceLabel}>Max Price:</Text>
              <View style={styles.priceButtonsRow}>
                {[100, 150, 200, 300, 500].map(price => (
                  <Pressable
                    key={`max-${price}`}
                    style={[
                      styles.priceButton,
                      localFilter.maxPrice === price && styles.selectedPriceButton
                    ]}
                    onPress={() => handleMaxPriceChange(price)}
                  >
                    <Text style={[
                      styles.priceButtonText,
                      localFilter.maxPrice === price && styles.selectedPriceButtonText
                    ]}>
                      ${price}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Amenities</Text>
          </View>
          <View style={styles.amenitiesContainer}>
            {amenities.map(amenity => {
              const isSelected = localFilter.amenities.includes(amenity);
              return (
                <Pressable
                  key={amenity}
                  style={[
                    styles.amenityItem,
                    isSelected && styles.selectedAmenityItem
                  ]}
                  onPress={() => handleAmenityPress(amenity)}
                >
                  <Text style={[
                    styles.amenityName,
                    isSelected && styles.selectedAmenityName
                  ]}>
                    {amenity}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Reset"
          variant="outline"
          onPress={handleReset}
          style={styles.resetButton}
        />
        <Button
          title="Apply Filters"
          onPress={handleApply}
          style={styles.applyButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
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
  priceRangeText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
  },
  sliderContainer: {
    marginBottom: 16,
  },
  priceRangeSelector: {
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 8,
  },
  priceButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.gray[100],
  },
  selectedPriceButton: {
    backgroundColor: Colors.primary,
  },
  priceButtonText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedPriceButtonText: {
    color: Colors.black,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.gray[100],
    marginBottom: 10,
  },
  selectedAmenityItem: {
    backgroundColor: Colors.primary,
  },
  amenityName: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedAmenityName: {
    color: Colors.black,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
    gap: 12,
  },
  resetButton: {
    flex: 1,
  },
  applyButton: {
    flex: 2,
  },
});