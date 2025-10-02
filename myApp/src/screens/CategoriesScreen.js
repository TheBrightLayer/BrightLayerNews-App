import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

export default function CategoriesScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <View className="p-4">
        <Text className="text-lg font-semibold">Categories Screen</Text>
        <Text className="text-sm text-gray-500 mt-2">You can list categories and show category-specific content here.</Text>
      </View>
    </SafeAreaView>
  );
}
