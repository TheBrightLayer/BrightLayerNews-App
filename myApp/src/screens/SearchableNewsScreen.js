// src/screens/SearchableNewsScreen.js
import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import SearchBar from '../components/SearchBar';
import ArticleCard from '../components/ArticleCard';
import { fetchWorldNews } from '../api/worldNewsApi';

const DEBOUNCE_MS = 480;
const MIN_QUERY_LENGTH = 2;

export default function SearchableNewsScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      requestIdRef.current += 1;
    };
  }, []);

  async function fetchArticles(q) {
    const thisRequestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const results = await fetchWorldNews({ text: q });
      if (thisRequestId !== requestIdRef.current) return;
      setArticles(results);
    } catch (err) {
      if (thisRequestId !== requestIdRef.current) return;
      setError(err.message ?? String(err));
    } finally {
      if (thisRequestId !== requestIdRef.current) return;
      setLoading(false);
    }
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const q = query.trim();
      if (q === '') {
        setArticles([]);
        setError(null);
        setLoading(false);
        setHasSearched(false);
        return;
      }
      if (q.length < MIN_QUERY_LENGTH) {
        setArticles([]);
        setError(null);
        setLoading(false);
        return;
      }
      fetchArticles(q);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleClear = () => {
    setArticles([]);
    setError(null);
    setHasSearched(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-3 pb-2 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="mr-3 p-2"
        >
          <Text className="text-xl">←</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold">Search News</Text>
      </View>

      <View className="flex-1 px-4 pt-4">
        <SearchBar 
          value={query} 
          onChangeText={setQuery}
          onClear={handleClear}
          placeholder="Search articles, topics..."
        />

        {loading && (
          <View className="py-8 items-center">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-gray-500 mt-3">Searching...</Text>
          </View>
        )}

        {error && (
          <View className="py-8 items-center px-6">
            <Text className="text-6xl mb-3">⚠️</Text>
            <Text className="text-red-500 text-center font-semibold mb-2">Search Error</Text>
            <Text className="text-gray-600 text-center">{error}</Text>
          </View>
        )}

        {!loading && !error && !hasSearched && (
          <View className="py-16 items-center px-6">
            <Text className="text-6xl mb-4">🔍</Text>
            <Text className="text-xl font-semibold text-gray-800 mb-2">Search for News</Text>
            <Text className="text-gray-500 text-center">
              Enter keywords to find articles from around the world
            </Text>
          </View>
        )}

        {!loading && !error && hasSearched && articles.length === 0 && (
          <View className="py-16 items-center px-6">
            <Text className="text-6xl mb-4">📭</Text>
            <Text className="text-xl font-semibold text-gray-800 mb-2">No Results</Text>
            <Text className="text-gray-500 text-center">
              No articles found for "{query}". Try different keywords.
            </Text>
          </View>
        )}

        {articles.length > 0 && (
          <>
            <Text className="text-gray-600 mb-3 text-sm">
              Found {articles.length} article{articles.length !== 1 ? 's' : ''}
            </Text>
            <FlatList
              data={articles}
              keyExtractor={(item, idx) => item.id ?? item.url ?? String(idx)}
              renderItem={({ item }) => <ArticleCard article={item} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24 }}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}