import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, SafeAreaView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Search, Plus, Star, X } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useAdminStore } from '@/store/adminStore';
import { useSpaceStore } from '@/store/spaceStore';
import { getDynamicColors } from '@/constants/colors';
import Button from '@/components/Button';

export default function FeaturedSpacesScreen() {
  const router = useRouter();
  const adminStore = useAdminStore();
  const { spaces } = useSpaceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingSpace, setIsAddingSpace] = useState(false);
  const colors = getDynamicColors();

  // Get featured spaces
  const featuredSpaceIds = adminStore.appCustomization?.featuredSpaceIds || [];
  const featuredSpaces = spaces.filter(space => featuredSpaceIds.includes(space.id));
  
  // Filter spaces for the add modal
  const filteredSpaces = spaces.filter(space => 
    !featuredSpaceIds.includes(space.id) && 
    (space.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     space.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
     space.location.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddSpace = (spaceId: string) => {
    adminStore.addFeaturedSpace(spaceId);
    adminStore.logActivity('Add Featured Space', `Added space ID ${spaceId} to featured list`);
    setIsAddingSpace(false);
    setSearchQuery('');
  };

  const handleRemoveSpace = (spaceId: string) => {
    adminStore.removeFeaturedSpace(spaceId);
    adminStore.logActivity('Remove Featured Space', `Removed space ID ${spaceId} from featured list`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Featured Spaces</Text>
        <Pressable 
          onPress={() => setIsAddingSpace(true)}
          style={styles.addButton}
        >
          <Plus size={24} color={colors.primary} />
        </Pressable>
      </View>

      {isAddingSpace ? (
        <View style={styles.addSpaceContainer}>
          <View style={[styles.addSpaceHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.addSpaceTitle, { color: colors.text }]}>Add Featured Space</Text>
            <Pressable onPress={() => {
              setIsAddingSpace(false);
              setSearchQuery('');
            }}>
              <X size={24} color={colors.text} />
            </Pressable>
          </View>
          
          <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground }]}>
            <Search size={20} color={colors.inputText} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.inputText }]}
              placeholder="Search spaces..."
              placeholderTextColor={colors.gray[500]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <FlatList
            data={filteredSpaces}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.gray[700] }]}>No spaces found</Text>
                <Text style={[styles.emptySubtext, { color: colors.gray[500] }]}>
                  {searchQuery ? "Try a different search term" : "All spaces are already featured"}
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <Pressable 
                style={[styles.spaceItem, { backgroundColor: colors.card }]}
                onPress={() => handleAddSpace(item.id)}
              >
                <Image
                  source={{ uri: item.images[0] }}
                  style={styles.spaceImage}
                  contentFit="cover"
                />
                <View style={styles.spaceInfo}>
                  <Text style={[styles.spaceTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                  <Text style={[styles.spaceLocation, { color: colors.gray[600] }]} numberOfLines={1}>
                    {item.location.neighborhood}, {item.location.city}
                  </Text>
                  <View style={styles.spaceRating}>
                    <Star size={14} color={colors.primary} fill={colors.primary} />
                    <Text style={[styles.ratingText, { color: colors.text }]}>{item.rating}</Text>
                    <Text style={[styles.reviewsText, { color: colors.gray[600] }]}>({item.reviews} reviews)</Text>
                  </View>
                </View>
                <Button
                  title="Add"
                  onPress={() => handleAddSpace(item.id)}
                  variant="primary"
                  size="small"
                  style={styles.addSpaceButton}
                />
              </Pressable>
            )}
          />
        </View>
      ) : (
        <>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Currently Featured</Text>
          
          {featuredSpaces.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.gray[700] }]}>No featured spaces</Text>
              <Text style={[styles.emptySubtext, { color: colors.gray[500] }]}>
                Tap the + button to add spaces to the featured section
              </Text>
            </View>
          ) : (
            <FlatList
              data={featuredSpaces}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <View style={[styles.featuredItem, { backgroundColor: colors.card }]}>
                  <Image
                    source={{ uri: item.images[0] }}
                    style={styles.featuredImage}
                    contentFit="cover"
                  />
                  <View style={styles.featuredInfo}>
                    <Text style={[styles.featuredTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
                    <Text style={[styles.featuredLocation, { color: colors.gray[600] }]} numberOfLines={1}>
                      {item.location.neighborhood}, {item.location.city}
                    </Text>
                    <View style={styles.featuredRating}>
                      <Star size={14} color={colors.primary} fill={colors.primary} />
                      <Text style={[styles.ratingText, { color: colors.text }]}>{item.rating}</Text>
                      <Text style={[styles.reviewsText, { color: colors.gray[600] }]}>({item.reviews} reviews)</Text>
                    </View>
                  </View>
                  <Button
                    title="Remove"
                    onPress={() => handleRemoveSpace(item.id)}
                    variant="primary"
                    size="small"
                    style={styles.removeButton}
                  />
                </View>
              )}
            />
          )}
        </>
      )}
    </SafeAreaView>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    margin: 16,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  featuredItem: {
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  featuredImage: {
    width: 100,
    height: 100,
  },
  featuredInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featuredLocation: {
    fontSize: 14,
    marginBottom: 4,
  },
  featuredRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 12,
    marginLeft: 2,
  },
  removeButton: {
    backgroundColor: '#EA4335',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  addSpaceContainer: {
    flex: 1,
  },
  addSpaceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  addSpaceTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  spaceItem: {
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  spaceImage: {
    width: 80,
    height: 80,
  },
  spaceInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  spaceTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  spaceLocation: {
    fontSize: 14,
  },
  spaceRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addSpaceButton: {
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});