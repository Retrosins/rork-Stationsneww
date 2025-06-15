import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Pressable, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { Camera, Plus, Trash2 } from 'lucide-react-native';
import { amenities } from '@/mocks/spaces';

export default function CreateSpaceScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [priceUnit, setPriceUnit] = useState<'hour' | 'day'>('hour');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
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
  
  const handleToggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };
  
  const handleCreateSpace = async () => {
    // Validate form
    if (!title || !description || !price || !city || !neighborhood || selectedAmenities.length === 0 || images.length === 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields and add at least one image');
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would be an API call to create the space
      // For demo purposes, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Station Created',
        'Your tattoo station has been successfully created',
        [
          {
            text: 'View Dashboard',
            onPress: () => router.replace('/host/dashboard'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create tattoo station');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Add a New Tattoo Station</Text>
        <Text style={styles.subtitle}>Share your station with other artists</Text>
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
              placeholder="Give your station a descriptive title"
              placeholderTextColor={Colors.gray[600]}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your tattoo station in detail"
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
          <Text style={styles.sectionTitle}>Amenities</Text>
          <Text style={styles.helperText}>Select all that apply</Text>
          <View style={styles.amenitiesContainer}>
            {amenities.map(amenity => {
              const isSelected = selectedAmenities.includes(amenity);
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
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <Text style={styles.helperText}>Add at least one photo of your tattoo station</Text>
          
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
            title="Create Station"
            onPress={handleCreateSpace}
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