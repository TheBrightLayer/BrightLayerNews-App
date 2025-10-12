// src/components/TestTailwind.js
import React from 'react';
import { View, Text } from 'react-native';

export default function TestTailwind() {
  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-xl font-bold">NativeWind is working ✅</Text>
    </View>
  );
}
