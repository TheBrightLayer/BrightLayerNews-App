import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export default function Tag({ children, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} className="px-2 py-1 bg-gray-200 rounded-full mr-2 mb-2">
      <Text className="text-xs text-gray-800">{children}</Text>
    </TouchableOpacity>
  );
}
