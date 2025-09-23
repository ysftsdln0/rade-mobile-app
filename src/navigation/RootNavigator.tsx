import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

// Import screens (we'll create these next)
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthNavigator from './AuthNavigator';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import ServicesNavigator from './ServicesNavigator';
import SupportNavigator from './SupportNavigator';
import AccountNavigator from './AccountNavigator';

// Navigation types
import { RootStackParamList, MainTabParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const Drawer = createDrawerNavigator();

// Main Tab Navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Services') {
            iconName = focused ? 'server' : 'server-outline';
          } else if (route.name === 'Support') {
            iconName = focused ? 'headset' : 'headset-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ 
          title: 'Ana Sayfa',
          tabBarLabel: 'Ana Sayfa'
        }} 
      />
      <Tab.Screen 
        name="Services" 
        component={ServicesNavigator} 
        options={{ 
          title: 'Hizmetler',
          tabBarLabel: 'Hizmetler'
        }} 
      />
      <Tab.Screen 
        name="Support" 
        component={SupportNavigator} 
        options={{ 
          title: 'Destek',
          tabBarLabel: 'Destek'
        }} 
      />
      <Tab.Screen 
        name="Account" 
        component={AccountNavigator} 
        options={{ 
          title: 'Hesap',
          tabBarLabel: 'Hesap'
        }} 
      />
    </Tab.Navigator>
  );
};

// Root Navigator
const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;