import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import { fetchArticleById } from '../services/apis.js';

export default function ArticleScreen({ route }) {
  const { article } = route.params || {};
  const [full, setFull] = useState(article);

  useEffect(() => {
    // If only an id was passed, fetch full article. Here article object is passed from list.
    // Example fetch by id if needed:
    // fetchArticleById(article.id).then(a => setFull(a));
  }, []);

  if (!full) return <Text>Loading...</Text>;

  return (
    <ScrollView className="flex-1 bg-white">
      <Image source={full.image} style={{ width: '100%', height: 260 }} resizeMode="cover" />
      <View className="p-4">
        <Text className="text-xs text-gray-500">{full.category}</Text>
        <Text className="text-2xl font-bold mt-2">{full.title}</Text>
        <Text className="mt-3 text-gray-700">{full.excerpt}</Text>

        <View className="mt-4">
          <Text className="text-sm text-gray-600">By {full.author} • {full.date} • {full.readTime}</Text>
        </View>

        <View className="mt-4">
          <Text>
            {/* placeholder for full article body */}
            {full.excerpt} {"\n\n"}
            (Full article content would go here — replace with the actual article body you fetch from an API.)
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
