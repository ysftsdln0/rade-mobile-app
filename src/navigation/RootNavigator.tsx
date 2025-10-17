import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

// Import screens (we'll create these next)
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthNavigator from './AuthNavigator';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import ServicesNavigator from './ServicesNavigator';
import SupportNavigator from './SupportNavigator';
import AccountNavigator from './AccountNavigator';
import ChatbotScreen from '../screens/support/ChatbotScreen';

// Navigation types
import { RootStackParamList, MainTabParamList } from '../types';
import { colors } from '../styles';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const Drawer = createDrawerNavigator();

// Main Tab Navigator
const MainTabNavigator = () => {
  const insets = useSafeAreaInsets();
  
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
          } else if (route.name === 'Chatbot') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.neutral[500],
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.95)' : '#FFFFFF',
          borderTopWidth: 0,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
          height: Math.max(70 + insets.bottom, 80),
          paddingHorizontal: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -2,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ 
          title: 'Dashboard',
          tabBarLabel: 'Home'
        }} 
      />
      <Tab.Screen 
        name="Services" 
        component={ServicesNavigator} 
        options={{ 
          title: 'Servers',
          tabBarLabel: 'Servers'
        }} 
      />
      <Tab.Screen 
        name="Support" 
        component={SupportNavigator} 
        options={{ 
          title: 'Billing',
          tabBarLabel: 'Billing'
        }} 
      />
      <Tab.Screen 
        name="Chatbot" 
        component={ChatbotScreen} 
        options={{ 
          title: 'Support',
          tabBarLabel: 'Support'
        }} 
      />
      <Tab.Screen 
        name="Account" 
        component={AccountNavigator} 
        options={{ 
          title: 'Profile',
          tabBarLabel: 'Profile'
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