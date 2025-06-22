import 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './src/navigation/RootNavigator';
import { CharacterProvider } from './src/context/CharacterContext';
import { HistoryProvider } from './src/context/HistoryContext';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Reanimated 2',
  'ViewPropTypes will be removed',
]);

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <HistoryProvider>
          <CharacterProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </CharacterProvider>
        </HistoryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
