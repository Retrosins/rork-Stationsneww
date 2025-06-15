import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Text, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import DefaultColors from '@/constants/colors';

interface ColorPickerProps {
  color: string;
  onColorChange: (color: string) => void;
}

// Predefined color palette
const colorPalette = [
  // Primary colors
  '#FF6B6B', '#4ECDC4', '#1A535C', '#FF9F1C', '#2EC4B6',
  '#E71D36', '#011627', '#FDFFFC', '#2EC4B6', '#E71D36',
  
  // Dark theme colors
  '#121212', '#1E1E1E', '#2D2D2D', '#333333', '#444444',
  
  // Light theme colors
  '#FFFFFF', '#F5F5F5', '#E0E0E0', '#CCCCCC', '#AAAAAA',
  
  // Additional colors
  '#6200EA', '#3700B3', '#03DAC6', '#018786', '#B00020',
];

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onColorChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  const handleColorSelect = (selectedColor: string) => {
    onColorChange(selectedColor);
    setModalVisible(false);
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.colorPreview, { backgroundColor: color }]}
        onPress={() => setModalVisible(true)}
      />
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Color</Text>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setModalVisible(false)}
              >
                <X size={24} color={DefaultColors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.colorGrid}>
              {colorPalette.map((paletteColor, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorOption,
                    { backgroundColor: paletteColor },
                    color === paletteColor && styles.selectedColor,
                  ]}
                  onPress={() => handleColorSelect(paletteColor)}
                />
              ))}
            </View>
            
            <Text style={styles.colorHex}>{color}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: DefaultColors.border,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: DefaultColors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DefaultColors.text,
  },
  closeButton: {
    padding: 4,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  colorOption: {
    width: 40,
    height: 40,
    margin: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: DefaultColors.border,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: DefaultColors.white,
  },
  colorHex: {
    fontSize: 16,
    color: DefaultColors.text,
    marginTop: 10,
  },
});

export default ColorPicker;