import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Pressable, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { useSpaceStore } from '@/store/spaceStore';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { Camera, Plus, Trash2 } from 'lucide-react-native';
import { categories } from '@/mocks/spaces';

export default function EditSpaceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useUserStore();
  const { spaces } = useSpaceStore();
  
  const [space, setSpace] = useState(spaces.find(s => s.id === id));
  const [title, setTitle] = useState(space?.title || '');
  const [description, setDescription] = useState(space?.description || '');
  const [price, setPrice] = useState(space?.price.toString() || '');
  const [priceUnit, setPriceUnit] = useState<'hour' | 'day'>(space?.priceUnit || 'hour');
  const [city, setCity] = useState(space?.location.city || '');
  const [neighborhood, setNeighborhood] = useState(space?.location.neighborhood || '');
  const [capacity, setCapacity] = useState(space?.capacity.toString() || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(space?.categories || []);
  const [amenities, setAmenities] = useState<string[]>(space?.amenities || []);
  const [images, setImages] = useState<string[]>(space?.images || []);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!space) {
      Alert.alert('Error', 'Space not found');
      router.back();
    }
  }, [space]);
  
  // Common amenities
  const commonAmenities = [
    'WiFi', 'Restroom', 'Kitchen', 'Sound System', 'Parking', 
    'Projector', 'Coffee', 'Furniture', 'Lighting'
  ];
  
  const handleAddImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to grant permission to access your photos');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const handleToggleCategory = (categoryName: string) => {
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== categoryName));
    } else {
      setSelectedCategories([...selectedCategories, categoryName]);
    }
  };
  
  const handleToggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };
  
  const handleUpdateSpace = async () => {
    // Validate form
    if (!title || !description || !price || !city || !neighborhood || !capacity || selectedCategories.length === 0 || images.length === 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields and add at least one image');
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would be an API call to update the space
      // For demo purposes, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Space Updated',
        'Your space has been successfully updated',
        [
          {
            text: 'View Dashboard',
            onPress: () => router.replace('/host/dashboard'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update space');
    } finally {
      setLoading(false);
    }
  };
  
  if (!space) {
    return null;
  }
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit Space</Text>
        <Text style={styles.subtitle}>Update your space details</Text>
      </View>
      
      <View style={styles.form}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Give your space a catchy title"
              placeholderTextColor={Colors.gray[600]}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your space in detail"
              placeholderTextColor={Colors.gray[600]}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, { flex: 2 }]}>
              <Text style={styles.label}>Price *</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="0"
                placeholderTextColor={Colors.gray[600]}
                keyboardType="numeric"
              />
            </View>
            
            <View style={[styles.inputContainer, { flex: 3 }]}>
              <Text style={styles.label}>Per</Text>
              <View style={styles.segmentedControl}>
                <Pressable
                  style={[
                    styles.segmentButton,
                    priceUnit === 'hour' && styles.segmentButtonActive
                  ]}
                  onPress={() => setPriceUnit('hour')}
                >
                  <Text style={[
                    styles.segmentButtonText,
                    priceUnit === 'hour' && styles.segmentButtonTextActive
                  ]}>Hour</Text>
                </Pressable>
                
                <Pressable
                  style={[
                    styles.segmentButton,
                    priceUnit === 'day' && styles.segmentButtonActive
                  ]}
                  onPress={() => setPriceUnit('day')}
                >
                  <Text style={[
                    styles.segmentButtonText,
                    priceUnit === 'day' && styles.segmentButtonTextActive
                  ]}>Day</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>City *</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="City"
              placeholderTextColor={Colors.gray[600]}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Neighborhood *</Text>
            <TextInput
              style={styles.input}
              value={neighborhood}
              onChangeText={setNeighborhood}
              placeholder="Neighborhood"
              placeholderTextColor={Colors.gray[600]}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Capacity (people) *</Text>
            <TextInput
              style={styles.input}
              value={capacity}
              onChangeText={setCapacity}
              placeholder="0"
              placeholderTextColor={Colors.gray[600]}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Categories *</Text>
            <Text style={styles.helperText}>Select all that apply</Text>
            <View style={styles.categoriesContainer}>
              {categories.map(category => {
                const isSelected = selectedCategories.includes(category.name);
                return (
                  <Pressable
                    key={category.id}
                    style={[
                      styles.categoryItem,
                      isSelected && styles.selectedCategoryItem
                    ]}
                    onPress={() => handleToggleCategory(category.name)}
                  >
                    <Text style={[
                      styles.categoryName,
                      isSelected && styles.selectedCategoryName
                    ]}>
                      {category.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amenities</Text>
            <Text style={styles.helperText}>Select all that apply</Text>
            <View style={styles.amenitiesContainer}>
              {commonAmenities.map(amenity => {
                const isSelected = amenities.includes(amenity);
                return (
                  <Pressable
                    key={amenity}
                    style={[
                      styles.amenityItem,
                      isSelected && styles.selectedAmenityItem
                    ]}
                    onPress={() => handleToggleAmenity(amenity)}
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
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <Text style={styles.helperText}>Add at least one photo of your space</Text>
          
          <View style={styles.imagesContainer}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image
                  source={{ uri: image }}
                  style={styles.image}
                  contentFit="cover"
                />
                <Pressable
                  style={styles.removeImageButton}
                  onPress={() => handleRemoveImage(index)}
                >
                  <Trash2 size={16} color={Colors.white} />
                </Pressable>
              </View>
            ))}
            
            <Pressable
              style={styles.addImageButton}
              onPress={handleAddImage}
            >
              <Camera size={24} color={Colors.gray[600]} />
              <Text style={styles.addImageText}>Add Photo</Text>
            </Pressable>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Update Space"
            onPress={handleUpdateSpace}
            loading={loading}
            fullWidth
            size="large"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray[600],
  },
  form: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
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
  helperText: {
    fontSize: 12,
    color: Colors.gray[600],
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
  textArea: {
    height: 120,
    paddingTop: 12,
    paddingBottom: 12,
    ...Platform.select({
      ios: {
        paddingTop: 12,
      },
    }),
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    overflow: 'hidden',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
  },
  segmentButtonActive: {
    backgroundColor: Colors.primary,
  },
  segmentButtonText: {
    fontSize: 16,
    color: Colors.text,
  },
  segmentButtonTextActive: {
    color: Colors.black,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.gray[100],
    marginBottom: 8,
  },
  selectedCategoryItem: {
    backgroundColor: Colors.primary,
  },
  categoryName: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedCategoryName: {
    color: Colors.black,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.gray[100],
    marginBottom: 8,
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
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.gray[400],
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderStyle: 'dashed',
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageText: {
    fontSize: 12,
    color: Colors.gray[600],
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
});