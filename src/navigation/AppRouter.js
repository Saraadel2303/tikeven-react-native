 import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from '../screens/Login';
import Splash from '../screens/Splash';
import Events from '../screens/Events';
import QRScanner from '../screens/QRScanner';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator initialRouteName="Events" screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Events" component={Events} />
      <Tab.Screen
        name="Scan (QR)"
        component={QRScanner}
        options={{ headerTitle: 'Scan (QR)', tabBarLabel: 'Scan (QR)' }}
      />
    </Tab.Navigator>
  );
}

export default function AppRouter() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}
