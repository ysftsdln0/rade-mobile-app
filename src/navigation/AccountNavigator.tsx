import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import account screens
import { 
  ProfileScreen,
  SecurityScreen,
  NotificationSettingsScreen,
  FinanceScreen,
  InvoiceListScreen,
  PaymentMethodsScreen,
} from '../screens/PlaceholderScreens';
import AccountMainScreen from '../screens/account/AccountMainScreen';

const Stack = createStackNavigator();

const AccountNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="AccountMain"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#009688',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="AccountMain" 
        component={AccountMainScreen}
        options={{ title: 'Hesap Yönetimi' }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profil Bilgileri' }}
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