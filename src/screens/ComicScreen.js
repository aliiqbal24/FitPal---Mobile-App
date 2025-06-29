import React, { useState } from 'react';
import { TouchableOpacity, Image, StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COMIC_IMAGES } from '../data/comicPages';

export default function ComicScreen({ navigation }) {
  const [page, setPage] = useState(0);
  const [loadError, setLoadError] = useState(false);

  const handlePress = () => {
    if (page < COMIC_IMAGES.length - 1) {
      setPage(page + 1);
    } else {
      navigation.replace('Tabs', { screen: 'Gym' });
    }
  };

  const imageSource = COMIC_IMAGES[page];

  return (
    <SafeAreaView style={styles.container} onTouchEnd={handlePress}>
      <TouchableOpacity style={styles.container} activeOpacity={1} onPress={handlePress}>
        {!loadError ? (
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="contain"
            onError={() => setLoadError(true)}
          />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={styles.placeholderText}>Image failed to load</Text>
            {/* Hardcoded render for debugging */}
            <Image
              source={require('../../assets/Comic/Page1Door.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  placeholderText: {
    color: '#fff',
  },
});
