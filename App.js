import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { LogBox, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './src/navigation/RootNavigator';
import { CharacterProvider } from './src/context/CharacterContext';
import { HistoryProvider } from './src/context/HistoryContext';
import { StatsProvider } from './src/context/StatsContext';
import { BackgroundProvider } from './src/context/BackgroundContext';
import { Asset } from 'expo-asset';
import { StatusBar } from 'expo-status-bar';
import { EQUIPMENT_IMAGES } from './src/data/exerciseEquipmentMap';
import { CHARACTER_IMAGES } from './src/data/characters';
import { COMIC_IMAGES } from './src/data/comicPages';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Reanimated 2',
  'ViewPropTypes will be removed',
]);

export default function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    async function loadAssets() {
      await Asset.loadAsync([
        ...Object.values(EQUIPMENT_IMAGES),
        ...Object.values(CHARACTER_IMAGES),
        ...COMIC_IMAGES,
      ]);
      setAssetsLoaded(true);
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
      <StatusBar style="light" backgroundColor="black" />
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
