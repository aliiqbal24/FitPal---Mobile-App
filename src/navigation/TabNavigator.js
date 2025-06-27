import React, { useState } from 'react';
import { StyleSheet, View, useWindowDimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TabView, SceneMap } from 'react-native-tab-view';

import GymScreen from '../screens/GymScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const routes = [
  { key: 'Profile', icon: 'person' },
  { key: 'Gym', icon: 'barbell' },
  { key: 'History', icon: 'calendar' },
];

export default function TabNavigator() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const renderScene = SceneMap({
    Profile: ProfileScreen,
    Gym: GymScreen,
    History: HistoryScreen,
  });

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
    <SafeAreaView style={{ flex: 1 }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={() => null}
        swipeEnabled
      />
      {renderTabBar()}
    </SafeAreaView>
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
