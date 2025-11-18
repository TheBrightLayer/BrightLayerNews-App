import React from 'react';
import { View, Text } from 'react-native';

export default function ReadBadge({ text }) {
  return (
    <View className="bg-white px-2 py-1 rounded-full shadow">
      <Text className="text-xs text-gray-700">{text}</Text>
    </View>
  );
}
