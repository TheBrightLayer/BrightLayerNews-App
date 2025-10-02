import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function Header({ onSearchPress, onMenuPress }) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white">
      <Text className="text-2xl font-bold">FlipNews</Text>
      <View className="flex-row items-center space-x-3">
        <TouchableOpacity onPress={onSearchPress} accessibilityLabel="Search">
          <MaterialIcons name="search" size={22} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onMenuPress} accessibilityLabel="Menu">
          <MaterialIcons name="menu" size={22} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
