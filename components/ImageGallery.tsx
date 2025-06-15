import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Dimensions, Platform } from 'react-native';
import { Image } from 'expo-image';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface ImageGalleryProps {
  images: string[];
  onImagePress?: (index: number) => void;
}

const { width } = Dimensions.get('window');

export default function ImageGallery({ images, onImagePress }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setActiveIndex(currentIndex);
  };

  const scrollToImage = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * width,
        animated: true,
      });
    }
  };

  const handlePrevious = () => {
    if (activeIndex > 0) {
      scrollToImage(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < images.length - 1) {
      scrollToImage(activeIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((image, index) => (
          <Pressable
            key={index}
            style={styles.imageContainer}
            onPress={() => onImagePress && onImagePress(index)}
          >
            <Image
              source={{ uri: image }}
              style={styles.image}
              contentFit="cover"
              transition={300}
            />
          </Pressable>
        ))}
      </ScrollView>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <Pressable
            style={[styles.navButton, styles.prevButton]}
            onPress={handlePrevious}
            disabled={activeIndex === 0}
          >
            <ChevronLeft size={24} color={Colors.white} />
          </Pressable>

          <Pressable
            style={[styles.navButton, styles.nextButton]}
            onPress={handleNext}
            disabled={activeIndex === images.length - 1}
          >
            <ChevronRight size={24} color={Colors.white} />
          </Pressable>

          {/* Pagination dots */}
          <View style={styles.pagination}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === activeIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 300,
    width: '100%',
  },
  imageContainer: {
    width,
    height: 300,
  },
  image: {
    flex: 1,
    backgroundColor: Colors.gray[400],
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  prevButton: {
    left: 16,
  },
  nextButton: {
    right: 16,
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: Colors.white,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});