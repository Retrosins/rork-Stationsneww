import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Pressable, Text } from 'react-native';
import { Search, X, Filter } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import DefaultColors, { getDynamicColors } from '@/constants/colors';
import { useSpaceStore } from '@/store/spaceStore';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search by city or neighborhood", initialValue = '' }: SearchBarProps) {
  const router = useRouter();
  const { filter, setFilter } = useSpaceStore();
  const [searchText, setSearchText] = useState(initialValue || filter.location || '');
  
  // Get dynamic colors
  const colors = getDynamicColors();

  // Update searchText when initialValue changes
  useEffect(() => {
    if (initialValue !== undefined) {
      setSearchText(initialValue);
    }
  }, [initialValue]);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchText.trim());
    }
    setFilter({ location: searchText.trim() || undefined });
  };

  const handleClear = () => {
    setSearchText('');
    setFilter({ location: undefined });
    if (onSearch) {
      onSearch('');
    }
  };

  const handleFilterPress = () => {
    router.push('/filter');
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.searchContainer, 
        { backgroundColor: colors.inputBackground }
      ]}>
        <Search size={20} color={colors.inputText} style={styles.searchIcon} />
        <TextInput
          style={[
            styles.input,
            { color: colors.inputText }
          ]}
          placeholder={placeholder}
          placeholderTextColor={`${colors.inputText}80`}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {searchText.length > 0 && (
          <Pressable onPress={handleClear} style={styles.clearButton}>
            <X size={18} color={colors.inputText} />
          </Pressable>
        )}
      </View>
      
      <Pressable 
        style={[
          styles.filterButton,
          { backgroundColor: colors.inputBackground }
        ]}
        onPress={handleFilterPress}
      >
        <Filter size={20} color={colors.inputText} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});