import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ServicesStackParamList } from "../types";
import { screenTransitions } from "./transitions";

// Import service screens
import ServicesListScreen from "../screens/services/ServicesListScreen";
import HostingListScreen from "../screens/hosting/HostingListScreen";
import HostingDetailsScreen from "../screens/hosting/HostingDetailsScreen";
import {
  FileManagerScreen,
  DatabaseManagerScreen,
  DomainListScreen,
  DomainDetailsScreen,
  ServerListScreen,
  ServerDetailsScreen,
} from "../screens/PlaceholderScreens";

const Stack = createStackNavigator<ServicesStackParamList>();

const ServicesNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ServicesList" component={ServicesListScreen} />
      <Stack.Screen
        name="HostingList"
        component={HostingListScreen}
        options={screenTransitions.slideFromRight}
      />
      <Stack.Screen
        name="HostingDetails"
        component={HostingDetailsScreen}
        options={screenTransitions.slideAndFade}
      />
      <Stack.Screen
        name="FileManager"
        component={FileManagerScreen}
        options={screenTransitions.slideFromRight}
      />
      <Stack.Screen
        name="DatabaseManager"
        component={DatabaseManagerScreen}
        options={screenTransitions.slideFromRight}
      />
      <Stack.Screen
        name="DomainList"
        component={DomainListScreen}
        options={screenTransitions.slideFromRight}
      />
      <Stack.Screen
        name="DomainDetails"
        component={DomainDetailsScreen}
        options={screenTransitions.slideAndFade}
      />
      <Stack.Screen
        name="ServerList"
        component={ServerListScreen}
        options={screenTransitions.slideFromRight}
      />
      <Stack.Screen
        name="ServerDetails"
        component={ServerDetailsScreen}
        options={screenTransitions.slideAndFade}
      />
    </Stack.Navigator>
  );
};

export default ServicesNavigator;
