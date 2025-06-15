import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSpaceStore } from '@/store/spaceStore';
import { getDynamicColors } from '@/constants/colors';
import SpaceCard from '@/components/SpaceCard';
import SearchBar from '@/components/SearchBar';
import CategoryList from '@/components/CategoryList';

export default function ExploreScreen() {
  const { search, category } = useLocalSearchParams<{ search?: string, category?: string }>();
  const { spaces, fetchSpaces, loading, setFilter, clearFilter, filter, getFilteredSpaces } = useSpaceStore();
  const [refreshing, setRefreshing] = useState(false);
  const colors = getDynamicColors();
  
  useEffect(() => {
    fetchSpaces();
  }, []);
  
  useEffect(() => {
    // Apply filters from URL params
    if (search || category) {
      const newFilter: any = {};
      if (search) newFilter.search = search;
      if (category) newFilter.category = category;
      setFilter(newFilter);
    }
  }, [search, category]);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSpaces();
    setRefreshing(false);
  };
  
  const handleSearch = (query: string) => {
    if (query) {
      setFilter({ search: query });
    } else {
      // If search is cleared, remove search filter
      const { search, ...restFilters } = filter;
      setFilter(restFilters);
    }
  };
  
  const handleCategoryPress = (selectedCategory: string) => {
    // Toggle category filter
    if (filter.category === selectedCategory) {
      const { category, ...restFilters } = filter;
      setFilter(restFilters);
    } else {
      setFilter({ category: selectedCategory });
    }
  };
  
  const filteredSpaces = getFilteredSpaces();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <SearchBar 
          onSearch={handleSearch} 
          initialValue={search as string} 
          placeholder="Find a tattoo station..."
        />
      </View>
      
      <CategoryList 
        onCategoryPress={handleCategoryPress} 
        selectedCategory={filter.category}
      />
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          {filteredSpaces.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No tattoo stations found</Text>
              <Text style={[styles.emptyText, { color: colors.gray[600] }]}>
                Try adjusting your filters or search criteria
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredSpaces}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <SpaceCard space={item} horizontal />}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              ListHeaderComponent={() => (
                <View style={styles.header}>
                  <Text style={[styles.resultsText, { color: colors.gray[600] }]}>
                    {filteredSpaces.length} {filteredSpaces.length === 1 ? 'station' : 'stations'} found
                  </Text>
                </View>
              )}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});