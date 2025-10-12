// src/components/SearchBar.js
import React from 'react';
import { TextInput, View, TouchableOpacity, Text } from 'react-native';

export default function SearchBar({ 
  value, 
  onChangeText, 
  placeholder = 'Search news...', 
  onClear 
}) {
  const handleClear = () => {
    onChangeText('');
    onClear && onClear();
  };

  return (
    <View className="mb-3">
      <View className="relative">
        {/* Search Icon */}
        <View className="absolute left-3 top-3 z-10">
          <Text className="text-gray-400 text-lg">🔍</Text>
        </View>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          returnKeyType="search"
          className="bg-gray-100 rounded-lg pl-10 pr-10 py-3 text-base text-black"
          autoCorrect={false}
          autoCapitalize="none"
        />

        {/* Clear Button */}
        {value.length > 0 && (
          <TouchableOpacity 
            onPress={handleClear}
            className="absolute right-3 top-3 z-10 bg-gray-300 rounded-full w-6 h-6 items-center justify-center"
          >
            <Text className="text-gray-600 text-sm font-bold">✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}