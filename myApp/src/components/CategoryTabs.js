// src/components/CategoryTabs.js
import React from 'react';
import { View, TouchableOpacity, Text, FlatList } from 'react-native';

export default function CategoryTabs({ categories = [], selected, onSelect }) {
  return (
    <View className="py-2.5 px-3 bg-white">
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(c) => c}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const active = item === selected;
          return (
            <TouchableOpacity
              onPress={() => onSelect(item)}
              className={`px-4 py-2 rounded-full mr-2 border ${
                active
                  ? 'bg-blue-100 border-blue-300'
                  : 'bg-gray-100 border-transparent'
              }`}
              activeOpacity={0.85}
            >
              <Text
                className={`text-sm ${
                  active ? 'text-blue-600 font-semibold' : 'text-gray-800'
                }`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
