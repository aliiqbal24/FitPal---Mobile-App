import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TEST_MODE } from "../utils/config";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import SettingsScreen from "../screens/SettingsScreen";
import ActivityScreen from "../screens/ActivityScreen";
import FriendsScreen from "../screens/FriendsScreen";
import ComicScreen from "../screens/ComicScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    if (TEST_MODE) {
      setInitialRoute("Comic");
    } else {
      AsyncStorage.getItem("hasSeenComic").then((value) => {
        setInitialRoute(value ? "Tabs" : "Comic");
      });
    }
  }, []);

  if (!initialRoute) {
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="Comic" component={ComicScreen} />
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Activity" component={ActivityScreen} />
      <Stack.Screen name="Friends" component={FriendsScreen} />
    </Stack.Navigator>
  );
}
