import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { LogBox, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './src/navigation/RootNavigator';
import { CharacterProvider } from './src/context/CharacterContext';
import { HistoryProvider } from './src/context/HistoryContext';
import { StatsProvider } from './src/context/StatsContext';
import { BackgroundProvider } from './src/context/BackgroundContext';
import { Asset } from 'expo-asset';
import { StatusBar } from 'react-native';
import { EQUIPMENT_IMAGES } from './src/data/exerciseEquipmentMap';
import { CHARACTER_IMAGES } from './src/data/characters';
import { COMIC_IMAGES } from './src/data/comicPages';
import { BACKGROUND_IMAGES } from './src/data/backgroundImages';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Reanimated 2',
  'ViewPropTypes will be removed',
]);

export default function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    async function loadAssets() {
      try {
        const assets = await Asset.loadAsync([
          ...Object.values(EQUIPMENT_IMAGES),
          ...Object.values(CHARACTER_IMAGES),
          ...COMIC_IMAGES,
          ...Object.values(BACKGROUND_IMAGES),
        ]);
        console.log('Assets loaded:', assets.length);
        setAssetsLoaded(true);
      } catch (e) {
        console.error('Failed to load assets', e);
      }
    }
    loadAssets();
  }, []);

  if (!assetsLoaded) {
    return (
      <GestureHandlerRootView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView edges={['top']} style={{ flex: 0, backgroundColor: 'black' }} />
      <StatusBar barStyle="light-content" backgroundColor="black" translucent />
      <SafeAreaProvider>
        <HistoryProvider>
          <StatsProvider>
            <CharacterProvider>
              <BackgroundProvider>
                <NavigationContainer>
                  <RootNavigator />
                </NavigationContainer>
              </BackgroundProvider>
            </CharacterProvider>
          </StatsProvider>
        </HistoryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
