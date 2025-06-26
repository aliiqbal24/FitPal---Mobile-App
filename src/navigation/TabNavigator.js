import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import GymScreen from '../screens/GymScreen';
import HistoryScreen from '../screens/HistoryScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Onboarding1Screen from '../screens/Onboarding1Screen';
import Onboarding2Screen from '../screens/Onboarding2Screen';
import Onboarding3Screen from '../screens/Onboarding3Screen';
import Onboarding4Screen from '../screens/Onboarding4Screen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Gym') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Login') {
            iconName = focused ? 'log-in' : 'log-in-outline';
          } else if (
            route.name === 'Onboarding1' ||
            route.name === 'Onboarding2' ||
            route.name === 'Onboarding3' ||
            route.name === 'Onboarding4'
          ) {
            iconName = focused ? 'ellipse' : 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Gym" component={GymScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Login" component={LoginScreen} />
      <Tab.Screen name="Onboarding1" component={Onboarding1Screen} />
      <Tab.Screen name="Onboarding2" component={Onboarding2Screen} />
      <Tab.Screen name="Onboarding3" component={Onboarding3Screen} />
      <Tab.Screen name="Onboarding4" component={Onboarding4Screen} />
    </Tab.Navigator>
  );
}
