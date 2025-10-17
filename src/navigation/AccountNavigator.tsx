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
        headerStyle: {
          backgroundColor: colors.primary[500],
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile', headerShown: false }}
      />
      <Stack.Screen 
        name="AccountMain" 
        component={AccountMainScreen}
        options={{ title: 'Account Management' }}
      />
      <Stack.Screen 
        name="Security" 
        component={SecurityScreen}
        options={{ title: 'Güvenlik Ayarları' }}
      />
      <Stack.Screen 
        name="NotificationSettings" 
        component={NotificationSettingsScreen}
        options={{ title: 'Bildirim Ayarları' }}
      />
      <Stack.Screen 
        name="Finance" 
        component={FinanceScreen}
        options={{ title: 'Mali İşlemler' }}
      />
      <Stack.Screen 
        name="InvoiceList" 
        component={InvoiceListScreen}
        options={{ title: 'Faturalar' }}
      />
      <Stack.Screen 
        name="PaymentMethods" 
        component={PaymentMethodsScreen}
        options={{ title: 'Ödeme Yöntemleri' }}
      />
    </Stack.Navigator>
  );
};

export default AccountNavigator;