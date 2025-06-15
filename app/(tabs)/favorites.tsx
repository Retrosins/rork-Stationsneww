import React, { useEffect } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useSpaceStore } from '@/store/spaceStore';
import Colors from '@/constants/colors';
import SpaceCard from '@/components/SpaceCard';
import { Heart } from 'lucide-react-native';

export default function FavoritesScreen() {
  const { spaces, favorites, fetchSpaces, loading } = useSpaceStore();
  
  useEffect(() => {
    fetchSpaces();
  }, []);
  
  const favoriteSpaces = spaces.filter(space => favorites.includes(space.id));
  
  return (
    <View style={styles.container}>
      {favoriteSpaces.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Heart size={64} color={Colors.gray[300]} />
          <Text style={styles.emptyTitle}>No saved spaces yet</Text>
          <Text style={styles.emptyText}>
            Tap the heart icon on any space to save it for later
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteSpaces}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SpaceCard space={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <View style={styles.header}>
              <Text style={styles.title}>Saved Spaces</Text>
              <Text style={styles.subtitle}>
                {favoriteSpaces.length} {favoriteSpaces.length === 1 ? 'space' : 'spaces'} saved
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
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
    marginBottom: 16,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
  },
});