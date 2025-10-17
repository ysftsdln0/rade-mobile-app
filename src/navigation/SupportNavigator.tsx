import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import billing/support screens
import BillingMainScreen from '../screens/finance/BillingMainScreen';
import SupportMainScreen from '../screens/support/SupportMainScreen';
import TicketListScreen from '../screens/support/TicketListScreen';
import ChatbotScreen from '../screens/support/ChatbotScreen';
import {
  TicketDetailsScreen,
  CreateTicketScreen,
} from '../screens/PlaceholderScreens';

const Stack = createStackNavigator();

const SupportNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="BillingMain"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#795548',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="BillingMain" 
        component={BillingMainScreen}
        options={{ title: 'Billing' }}
      />
      <Stack.Screen 
        name="SupportMain" 
        component={SupportMainScreen}
        options={{ title: 'Destek Merkezi' }}
      />
      <Stack.Screen 
        name="TicketList" 
        component={TicketListScreen}
        options={{ title: 'Destek Biletleri' }}
      />
      <Stack.Screen 
        name="TicketDetails" 
        component={TicketDetailsScreen}
        options={{ title: 'Bilet Detayları' }}
      />
      <Stack.Screen 
        name="CreateTicket" 
        component={CreateTicketScreen}
        options={{ title: 'Yeni Bilet Oluştur' }}
      />
      <Stack.Screen 
        name="Chatbot" 
        component={ChatbotScreen}
        options={{ title: 'Canlı Destek' }}
      />
    </Stack.Navigator>
  );
};

export default SupportNavigator;