import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ArticleScreen from '../screens/ArticleScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import SearchableNewsScreen from '../screens/SearchableNewsScreen'; // ← Add this import

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="Search" component={SearchableNewsScreen} /> {/* ← Add this */}
      <Stack.Screen name="Article" component={ArticleScreen} /> 
    </Stack.Navigator>
  );
}