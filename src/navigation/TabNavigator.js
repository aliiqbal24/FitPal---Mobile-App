import React, { useState, useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavBar from '../components/BottomNavBar';
import { TabView } from 'react-native-tab-view';

import { SwipeProvider } from '../context/SwipeContext';

import GymScreen from '../screens/GymScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const routes = [
  { key: 'Profile', icon: 'person' },
  { key: 'Gym', icon: 'barbell' },
  { key: 'History', icon: 'calendar' },
];

export default function TabNavigator({ route }) {
  const layout = useWindowDimensions();
  const initialRoute = route?.params?.screen;
  const initialIndex = initialRoute === 'Gym' ? 1 : initialRoute === 'History' ? 2 : 0;
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    const newRoute = route?.params?.screen;
    if (newRoute === 'Gym') {
      setIndex(1);
    } else if (newRoute === 'History') {
      setIndex(2);
    } else if (newRoute === 'Profile') {
      setIndex(0);
    }
  }, [route?.params?.screen]);

  const [swipeEnabled, setSwipeEnabled] = useState(true);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'Profile':
        return <ProfileScreen />;
      case 'Gym':
        return <GymScreen />;
      case 'History':
        return <HistoryScreen setSwipeEnabled={setSwipeEnabled} />;
      default:
        return null;
    }
  };


  return (
    <SwipeProvider value={{ setSwipeEnabled }}>
      <SafeAreaView edges={["left", "right", "bottom"]} style={{ flex: 1 }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={() => null}
          swipeEnabled={swipeEnabled}
        />
        <View style={styles.bottomNavWrapper}>
          <BottomNavBar
            items={routes}
            activeIndex={index}
            onSelect={setIndex}
          />
        </View>
      </SafeAreaView>
    </SwipeProvider>
  );
}

const styles = StyleSheet.create({
  // styles kept for potential future use
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    overflow: 'visible',
    zIndex: 100,
  },
});
