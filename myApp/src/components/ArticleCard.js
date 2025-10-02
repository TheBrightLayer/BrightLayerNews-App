import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ReadBadge from './ReadBadge';

export default function ArticleCard({ item }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Article', { article: item })}
      className="mb-4"
    >
      <View className="rounded-lg overflow-hidden bg-white shadow">
        <Image source={item.image} style={{ width: '100%', height: 180 }} resizeMode="cover" />
        <View className="p-4">
          <View className="absolute top-3 left-3 bg-purple-600 px-2 py-1 rounded-full">
            <Text className="text-white text-xs">{item.category}</Text>
          </View>

          <View className="flex-row justify-between items-center mb-2 mt-16">
            <Text className="text-lg font-semibold flex-1">{item.title}</Text>
            <ReadBadge text={item.readTime} />
          </View>

          <Text className="text-gray-500 text-sm mb-3">{item.excerpt}</Text>

          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-600">{item.author} • {item.date}</Text>
            <Text className="text-sm text-gray-500">{item.views.toLocaleString()} views</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
