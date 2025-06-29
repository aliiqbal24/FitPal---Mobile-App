import React, { useState, useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {routes.map((route, i) => {
        const focused = index === i;
        const iconName = focused ? route.icon : `${route.icon}-outline`;
        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            onPress={() => setIndex(i)}
          >
            <Ionicons
              name={iconName}
              size={24}
              color={focused ? '#007AFF' : 'gray'}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );

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
      </SafeAreaView>
      {renderTabBar()}
    </SwipeProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
});
