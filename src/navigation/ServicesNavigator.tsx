import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ServicesStackParamList } from '../types';

// Import service screens
import ServicesListScreen from '../screens/services/ServicesListScreen';
import HostingListScreen from '../screens/hosting/HostingListScreen';
import HostingDetailsScreen from '../screens/hosting/HostingDetailsScreen';
import {
  FileManagerScreen,
  DatabaseManagerScreen,
  DomainListScreen,
  DomainDetailsScreen,
  ServerListScreen,
  ServerDetailsScreen,
} from '../screens/PlaceholderScreens';

const Stack = createStackNavigator<ServicesStackParamList>();

const ServicesNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="ServicesList" 
        component={ServicesListScreen}
      />
      <Stack.Screen 
        name="HostingList" 
        component={HostingListScreen}
      />
      <Stack.Screen 
        name="HostingDetails" 
        component={HostingDetailsScreen}
      />
      <Stack.Screen 
        name="FileManager" 
        component={FileManagerScreen}
      />
      <Stack.Screen 
        name="DatabaseManager" 
        component={DatabaseManagerScreen}
      />
      <Stack.Screen 
        name="DomainList" 
        component={DomainListScreen}
      />
      <Stack.Screen 
        name="DomainDetails" 
        component={DomainDetailsScreen}
      />
      <Stack.Screen 
        name="ServerList" 
        component={ServerListScreen}
      />
      <Stack.Screen 
        name="ServerDetails" 
        component={ServerDetailsScreen}
      />
    </Stack.Navigator>
  );
};

export default ServicesNavigator;