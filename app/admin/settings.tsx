import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAdminStore } from '@/store/adminStore';
import { Settings, Palette, Image, ClipboardList, LogOut, ChevronLeft } from 'lucide-react-native';
import DefaultColors, { getDynamicColors } from '@/constants/colors';
import ColorPicker from '@/components/ColorPicker';
import Button from '@/components/Button';

export default function AdminSettingsScreen() {
  const router = useRouter();
  const adminStore = useAdminStore();
  const colors = getDynamicColors();
  
  const handleLogout = async () => {
    await adminStore.logoutAdmin();
    router.replace('/admin/login');
  };
  
  const handleColorChange = (colorKey: string, color: string) => {
    adminStore.updateColorScheme({ [colorKey]: color });
  };
  
  const handleResetColors = () => {
    adminStore.resetColorScheme();
  };
  
  const navigateToFeatured = () => {
    router.push('/admin/featured');
  };
  
  const navigateToActivityLog = () => {
    router.push('/admin/activity-log');
  };

  const navigateBack = () => {
    router.back();
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { 
        backgroundColor: colors.card,
        borderBottomColor: colors.border
      }]}>
        <TouchableOpacity style={styles.backButton} onPress={navigateBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Admin Settings</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={24} color={colors.error} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Settings size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>App Settings</Text>
        </View>
        
        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <Text style={[styles.settingLabel, { color: colors.gray[500] }]}>App Name</Text>
          <Text style={[styles.settingValue, { color: colors.text }]}>{adminStore.appCustomization.appName}</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Palette size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Color Scheme</Text>
        </View>
        
        <View style={styles.colorGrid}>
          <View style={[styles.colorItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.colorLabel, { color: colors.gray[500] }]}>Primary</Text>
            <ColorPicker
              color={adminStore.appCustomization.colorScheme?.primary || DefaultColors.primary}
              onColorChange={(color) => handleColorChange('primary', color)}
            />
          </View>
          
          <View style={[styles.colorItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.colorLabel, { color: colors.gray[500] }]}>Secondary</Text>
            <ColorPicker
              color={adminStore.appCustomization.colorScheme?.secondary || DefaultColors.secondary}
              onColorChange={(color) => handleColorChange('secondary', color)}
            />
          </View>
          
          <View style={[styles.colorItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.colorLabel, { color: colors.gray[500] }]}>Background</Text>
            <ColorPicker
              color={adminStore.appCustomization.colorScheme?.background || DefaultColors.background}
              onColorChange={(color) => handleColorChange('background', color)}
            />
          </View>
          
          <View style={[styles.colorItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.colorLabel, { color: colors.gray[500] }]}>Card</Text>
            <ColorPicker
              color={adminStore.appCustomization.colorScheme?.card || DefaultColors.card}
              onColorChange={(color) => handleColorChange('card', color)}
            />
          </View>
          
          <View style={[styles.colorItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.colorLabel, { color: colors.gray[500] }]}>Text</Text>
            <ColorPicker
              color={adminStore.appCustomization.colorScheme?.text || DefaultColors.text}
              onColorChange={(color) => handleColorChange('text', color)}
            />
          </View>
          
          <View style={[styles.colorItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.colorLabel, { color: colors.gray[500] }]}>Border</Text>
            <ColorPicker
              color={adminStore.appCustomization.colorScheme?.border || DefaultColors.border}
              onColorChange={(color) => handleColorChange('border', color)}
            />
          </View>
          
          <View style={[styles.colorItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.colorLabel, { color: colors.gray[500] }]}>Header Background</Text>
            <ColorPicker
              color={adminStore.appCustomization.colorScheme?.headerBackground || DefaultColors.headerBackground}
              onColorChange={(color) => handleColorChange('headerBackground', color)}
            />
          </View>
          
          <View style={[styles.colorItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.colorLabel, { color: colors.gray[500] }]}>Header Text</Text>
            <ColorPicker
              color={adminStore.appCustomization.colorScheme?.headerText || DefaultColors.headerText}
              onColorChange={(color) => handleColorChange('headerText', color)}
            />
          </View>
          
          <View style={[styles.colorItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.colorLabel, { color: colors.gray[500] }]}>Input Background</Text>
            <ColorPicker
              color={adminStore.appCustomization.colorScheme?.inputBackground || DefaultColors.inputBackground}
              onColorChange={(color) => handleColorChange('inputBackground', color)}
            />
          </View>
          
          <View style={[styles.colorItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.colorLabel, { color: colors.gray[500] }]}>Input Text</Text>
            <ColorPicker
              color={adminStore.appCustomization.colorScheme?.inputText || DefaultColors.inputText}
              onColorChange={(color) => handleColorChange('inputText', color)}
            />
          </View>
          
          <View style={[styles.colorItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.colorLabel, { color: colors.gray[500] }]}>Tab Bar Active</Text>
            <ColorPicker
              color={adminStore.appCustomization.colorScheme?.tabBarActive || DefaultColors.tabBarActive}
              onColorChange={(color) => handleColorChange('tabBarActive', color)}
            />
          </View>
          
          <View style={[styles.colorItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.colorLabel, { color: colors.gray[500] }]}>Tab Bar Inactive</Text>
            <ColorPicker
              color={adminStore.appCustomization.colorScheme?.tabBarInactive || DefaultColors.tabBarInactive}
              onColorChange={(color) => handleColorChange('tabBarInactive', color)}
            />
          </View>
        </View>
        
        <Button 
          title="Reset to Default Colors"
          onPress={handleResetColors}
          variant="outline"
          style={[styles.resetButton, { borderColor: colors.primary }]}
          textStyle={{ color: colors.primary }}
        />
      </View>
      
      <View style={styles.section}>
        <Button
          title="Manage Featured Spaces"
          onPress={navigateToFeatured}
          icon={<Image size={20} color={colors.buttonText} />}
          style={[styles.navButton, { backgroundColor: colors.card }]}
          textStyle={{ color: colors.text }}
          variant="outline"
          fullWidth
        />
        
        <Button
          title="View Activity Log"
          onPress={navigateToActivityLog}
          icon={<ClipboardList size={20} color={colors.buttonText} />}
          style={[styles.navButton, { backgroundColor: colors.card, marginTop: 12 }]}
          textStyle={{ color: colors.text }}
          variant="outline"
          fullWidth
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  section: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  settingItem: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorItem: {
    width: '48%',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  colorLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  resetButton: {
    borderRadius: 8,
    marginTop: 8,
  },
  navButton: {
    borderRadius: 8,
  },
});