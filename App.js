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
import { NotificationProvider } from './src/context/NotificationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TEST_MODE } from './src/utils/config';
import { Asset } from 'expo-asset';
import { StatusBar } from 'expo-status-bar';
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
  const [resetDone, setResetDone] = useState(!TEST_MODE);

  useEffect(() => {
    if (TEST_MODE) {
      AsyncStorage.clear().finally(() => setResetDone(true));
    }
  }, []);

  useEffect(() => {
    async function loadAssets() {
      await Asset.loadAsync([
        ...Object.values(EQUIPMENT_IMAGES),
        ...Object.values(CHARACTER_IMAGES),
        ...COMIC_IMAGES,
        ...Object.values(BACKGROUND_IMAGES),
      ]);
      setAssetsLoaded(true);
    }
    if (resetDone) {
      loadAssets();
    }
  }, [resetDone]);

  if (!resetDone || !assetsLoaded) {
    return (
      <GestureHandlerRootView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView edges={['top']} style={{ flex: 0, backgroundColor: 'black' }} />
        <StatusBar style="light" backgroundColor="black" />
        <HistoryProvider>
          <StatsProvider>
            <CharacterProvider>
              <NotificationProvider>
                <BackgroundProvider>
                  <NavigationContainer>
                    <RootNavigator />
                  </NavigationContainer>
                </BackgroundProvider>
              </NotificationProvider>
            </CharacterProvider>
          </StatsProvider>
        </HistoryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
