import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../styles';

// Import account screens
import { 
  SecurityScreen,
  NotificationSettingsScreen,
  FinanceScreen,
} from '../screens/PlaceholderScreens';
import AccountMainScreen from '../screens/account/AccountMainScreen';
import ProfileScreen from '../screens/account/ProfileScreen';
import InvoiceListScreen from '../screens/finance/InvoiceListScreen';
import PaymentMethodsScreen from '../screens/finance/PaymentMethodsScreen';

const Stack = createStackNavigator();

const AccountNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
      />
      <Stack.Screen 
        name="AccountMain" 
        component={AccountMainScreen}
      />
      <Stack.Screen 
        name="Security" 
        component={SecurityScreen}
      />
      <Stack.Screen 
        name="NotificationSettings" 
        component={NotificationSettingsScreen}
      />
      <Stack.Screen 
        name="Finance" 
        component={FinanceScreen}
      />
      <Stack.Screen 
        name="InvoiceList" 
        component={InvoiceListScreen}
      />
      <Stack.Screen 
        name="PaymentMethods" 
        component={PaymentMethodsScreen}
      />
    </Stack.Navigator>
  );
};

export default AccountNavigator;