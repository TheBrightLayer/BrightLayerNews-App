// App.js
import './global.css';
import React, { useContext } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SeetingScreen'; // <-- fixed import
import BookmarkScreen from './src/screens/BookmarkScreen';
import TrendingScreen from './src/screens/TrendingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';

import { ThemeProvider, ThemeContext } from './src/context/ThemeContext';

// react navigation imports
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

/*
  ThemedShell reads ThemeContext via useContext(ThemeContext).
  This provides the themed styling for the entire app.
*/
function ThemedShell({ children }) {
  const ctx = useContext(ThemeContext);

  const theme = ctx?.theme;
  const mode = ctx?.mode;

  const containerClass = theme?.colors?.background 
    ? `${theme.colors.background} flex-1` 
    : 'flex-1 bg-white';
  
  const barStyle = theme?.colors?.statusBar || 'dark-content';
  const bgColor = mode === 'dark' ? '#0b1220' : '#fff';

  return (
    <SafeAreaView className={containerClass}>
      <StatusBar barStyle={barStyle} backgroundColor={bgColor} />
      {children}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemedShell>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Bookmarks" component={BookmarkScreen} />
            <Stack.Screen name="Trending" component={TrendingScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignupScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemedShell>
    </ThemeProvider>
  );
}
