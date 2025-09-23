import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ServicesStackParamList } from '../types';

// Import service screens
import ServicesListScreen from '../screens/services/ServicesListScreen';
import {
  HostingListScreen,
  HostingDetailsScreen,
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
      initialRouteName="ServicesList"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="ServicesList" 
        component={ServicesListScreen}
        options={{ title: 'Hizmetler' }}
      />
      <Stack.Screen 
        name="HostingList" 
        component={HostingListScreen}
        options={{ title: 'Hosting Paketleri' }}
      />
      <Stack.Screen 
        name="HostingDetails" 
        component={HostingDetailsScreen}
        options={{ title: 'Hosting Detayları' }}
      />
      <Stack.Screen 
        name="FileManager" 
        component={FileManagerScreen}
        options={{ title: 'Dosya Yöneticisi' }}
      />
      <Stack.Screen 
        name="DatabaseManager" 
        component={DatabaseManagerScreen}
        options={{ title: 'Veritabanı Yöneticisi' }}
      />
      <Stack.Screen 
        name="DomainList" 
        component={DomainListScreen}
        options={{ title: 'Domain Adları' }}
      />
      <Stack.Screen 
        name="DomainDetails" 
        component={DomainDetailsScreen}
        options={{ title: 'Domain Detayları' }}
      />
      <Stack.Screen 
        name="ServerList" 
        component={ServerListScreen}
        options={{ title: 'Sunucular' }}
      />
      <Stack.Screen 
        name="ServerDetails" 
        component={ServerDetailsScreen}
        options={{ title: 'Sunucu Detayları' }}
      />
    </Stack.Navigator>
  );
};

export default ServicesNavigator;