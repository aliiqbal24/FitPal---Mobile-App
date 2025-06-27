import React, { useState } from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COMIC_IMAGES } from '../data/comicPages';

export default function ComicScreen({ navigation }) {
  const [page, setPage] = useState(0);

  const handlePress = () => {
    if (page < COMIC_IMAGES.length - 1) {
      setPage(page + 1);
    } else {
      navigation.replace('Tabs', { screen: 'Gym' });
    }
  };

  return (
    <SafeAreaView style={styles.container} onTouchEnd={handlePress}>
      <TouchableOpacity style={styles.container} activeOpacity={1} onPress={handlePress}>
        <Image source={COMIC_IMAGES[page]} style={styles.image} resizeMode="contain" />
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
});
