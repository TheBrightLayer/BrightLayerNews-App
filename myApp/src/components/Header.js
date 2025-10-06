// src/components/Header.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function Header({
  title = 'FlipNews',
  onMenuPress = () => {},
  onSearchPress = () => {},
}) {
  return (
    <View className="h-14 px-3 flex-row items-center justify-between border-b border-gray-200 bg-white">
      {/* Menu button */}
      <TouchableOpacity onPress={onMenuPress} className="w-10 h-10 items-center justify-center">
        <Text className="text-xl">☰</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text className="text-lg font-bold text-gray-900">{title}</Text>

      {/* Search button */}
      <TouchableOpacity onPress={onSearchPress} className="w-10 h-10 items-center justify-center">
        <Text className="text-xl">🔍</Text>
      </TouchableOpacity>
    </View>
  );
}
