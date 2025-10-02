import React, { useEffect, useState, useMemo } from 'react';
import { SafeAreaView, FlatList, Text, View } from 'react-native';
import Header from '../components/Header';
import CategoryTabs from '../components/CategoryTabs';
import ArticleCard from '../components/ArticleCard';
import { fetchArticles } from '../services/apis.js';

export default function HomeScreen() {
  const [filter, setFilter] = useState('All');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchArticles().then(data => {
      if (mounted) {
        setArticles(data);
        setLoading(false);
      }
    });
    return () => (mounted = false);
  }, []);

  const data = useMemo(() => {
    if (filter === 'All') return articles;
    return articles.filter(a => a.category === filter);
  }, [articles, filter]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header />
      <CategoryTabs onSelect={setFilter} />

      <View className="px-4 mt-2">
        <Text className="text-sm text-yellow-500 mb-2">
          {data.length} articles in {filter}
        </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        renderItem={({ item }) => <ArticleCard item={item} />}
        ListEmptyComponent={() => !loading && (
          <View className="p-4"><Text>No articles found</Text></View>
        )}
      />
    </SafeAreaView>
  );
}
