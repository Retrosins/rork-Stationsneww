import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { getDynamicColors } from '@/constants/colors';
import CategoryList from '@/components/CategoryList';
import SearchBar from '@/components/SearchBar';
import SpaceCard from '@/components/SpaceCard';
import { useSpaceStore } from '@/store/spaceStore';
import Button from '@/components/Button';

export default function HomeScreen() {
  const router = useRouter();
  const { spaces, fetchSpaces } = useSpaceStore();
  const colors = getDynamicColors();
  
  // Get featured space IDs from admin store
  let featuredSpaceIds: string[] = [];
  try {
    const adminStore = require('@/store/adminStore').useAdminStore.getState();
    featuredSpaceIds = adminStore.appCustomization?.featuredSpaceIds || [];
  } catch (error) {
    console.error('Error getting featured space IDs:', error);
  }
  
  useEffect(() => {
    // Fetch spaces when component mounts
    fetchSpaces();
  }, []);
  
  // Filter featured spaces using admin's featuredSpaceIds
  const featuredSpaces = spaces.filter(space => featuredSpaceIds.includes(space.id));
  
  // Filter popular spaces (those with high ratings)
  const popularSpaces = [...spaces]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);
  
  // Filter new spaces (most recently added)
  const newSpaces = [...spaces]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  const handleSpacePress = (id: string) => {
    router.push(`/space/${id}`);
  };
  
  const handleSearch = (query: string) => {
    // Navigate to explore page with search query
    router.push({
      pathname: '/explore',
      params: { search: query }
    });
  };
  
  const handleCategoryPress = (category: string) => {
    // Navigate to explore page with category filter
    router.push({
      pathname: '/explore',
      params: { category }
    });
  };

  const handleExploreAll = () => {
    router.push('/explore');
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      contentContainerStyle={styles.contentContainer}
    >
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <SearchBar onSearch={handleSearch} placeholder="Find a tattoo station..." />
      </View>
      
      <CategoryList onCategoryPress={handleCategoryPress} />
      
      {featuredSpaces.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Stations</Text>
            <Button 
              title="See All" 
              onPress={handleExploreAll} 
              variant="outline" 
              size="small" 
              style={styles.seeAllButton}
            />
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {featuredSpaces.map(space => (
              <SpaceCard 
                key={space.id} 
                space={space} 
                onPress={() => handleSpacePress(space.id)} 
                style={styles.card}
              />
            ))}
          </ScrollView>
        </View>
      )}
      
      {popularSpaces.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Stations</Text>
            <Button 
              title="See All" 
              onPress={handleExploreAll} 
              variant="outline" 
              size="small" 
              style={styles.seeAllButton}
            />
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {popularSpaces.map(space => (
              <SpaceCard 
                key={space.id} 
                space={space} 
                onPress={() => handleSpacePress(space.id)} 
                style={styles.card}
              />
            ))}
          </ScrollView>
        </View>
      )}
      
      {newSpaces.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>New Stations</Text>
            <Button 
              title="See All" 
              onPress={handleExploreAll} 
              variant="outline" 
              size="small" 
              style={styles.seeAllButton}
            />
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {newSpaces.map(space => (
              <SpaceCard 
                key={space.id} 
                space={space} 
                onPress={() => handleSpacePress(space.id)} 
                style={styles.card}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  horizontalList: {
    paddingRight: 16,
  },
  card: {
    marginRight: 16,
    width: 280,
    ...Platform.select({
      web: {
        // Add web-specific styles for better rendering
        minHeight: 250,
      },
    }),
  },
});