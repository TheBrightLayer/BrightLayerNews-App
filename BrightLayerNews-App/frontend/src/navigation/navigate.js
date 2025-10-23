// frontend/src/navigation/navigate.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native"; 
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screens/HomeScreen";
// create placeholder components for screens you don't have yet
import ExploreScreen from "../screens/HomeScreen"; // swap with real Explore when you have it
import NotificationsScreen from "../screens/HomeScreen";
import MessagesScreen from "../screens/HomeScreen";
import CommunitiesScreen from "../screens/HomeScreen";
import PremiumScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SeetingScreen";
import DrawerContent from "../components/DrawerContent";
import { useTheme } from "../context/ThemeContext";

const Drawer = createDrawerNavigator();

export default function RootNavigator() {
  const { theme } = useTheme();

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: theme.mode === "dark" ? "#07101a" : "#ffffff" },
        headerTintColor: theme.mode === "dark" ? "#e6eef8" : "#0f172a",
        drawerStyle: { backgroundColor: theme.mode === "dark" ? "#0b1220" : "#ffffff" },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Explore" component={ExploreScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="Messages" component={MessagesScreen} />
      <Drawer.Screen name="Communities" component={CommunitiesScreen} />
      <Drawer.Screen name="Premium" component={PremiumScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}
