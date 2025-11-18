// src/screens/HomeScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  TextInput,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';
import Header from '../components/Header';
import CategoryTabs from '../components/CategoryTabs';
import ArticleCard from '../components/ArticleCard';
import SideMenu from '../components/SideMenu';
import ArticleModal from '../components/ArticleModal';
import { fetchWorldNews } from '../api/worldNewsApi';

const DEFAULT_CATEGORIES = ['All', 'Technology', 'Business', 'Sports', 'Health', 'Entertainment'];

export default function HomeScreen({ navigation }) { // ← Add navigation prop
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const PAGE_SIZE = 20;

  const load = useCallback(
    async ({ reset = true, q = query, cat = category, offs = 0 } = {}) => {
      try {
        if (reset) setLoading(true);
        const text = cat && cat !== 'All' ? cat.toLowerCase() : q || 'technology';
        const data = await fetchWorldNews({ text, offset: offs, pageSize: PAGE_SIZE });
        if (reset) setItems(data);
        else setItems((prev) => [...prev, ...data]);
        setOffset(offs + (data?.length || 0));
      } catch (e) {
        console.warn('Load error', e);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [category, query]
  );

  useEffect(() => {
    load({ reset: true, offs: 0 });
  }, []);

  useEffect(() => {
    load({ reset: true, offs: 0 });
  }, [category]);

  async function onRefresh() {
    setRefreshing(true);
    await load({ reset: true, offs: 0 });
  }

  async function loadMore() {
    if (loading) return;
    await load({ reset: false, offs: offset });
  }

  function onMenuPress() {
    setMenuOpen(true);
  }

  // ← NEW: Add search handler
  function onSearchPress() {
    navigation.navigate('Search');
  }

  function onNavigateFromMenu(id) {
    if (id === 'trending') {
      setCategory('All');
      setQuery('');
      load({ reset: true, q: '', cat: 'All', offs: 0 });
    } else if (id === 'news') {
      setCategory('All');
    } else if (id === 'bookmarks') {
      alert('Bookmarks tapped (implement your bookmarks screen)');
    } else if (id === 'dark') {
      alert('Toggle dark mode - implement as needed');
    } else {
      alert(`Menu: ${id}`);
    }
  }

  function onCardPress(article) {
    setSelectedArticle(article);
  }

  function onCloseArticle() {
    setSelectedArticle(null);
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header 
        onMenuPress={onMenuPress} 
        onSearchPress={onSearchPress} // ← Pass the handler
      />

      {/* Search */}
      <View className="px-3 py-2 bg-white border-b border-gray-200">
        <TextInput
          placeholder="Search articles, authors, topics..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => load({ reset: true, q: query, offs: 0 })}
          className="h-10 bg-gray-100 rounded-lg px-3"
          returnKeyType="search"
        />
      </View>

      {/* Categories */}
      <CategoryTabs categories={DEFAULT_CATEGORIES} selected={category} onSelect={setCategory} />

      {/* Loading state when no items */}
      {loading && items.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
          <Text className="mt-2">Loading news…</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => String(i.id ?? i.url ?? Math.random())}
          renderItem={({ item }) => <ArticleCard article={item} onPress={onCardPress} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.6}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}

      {/* Side menu */}
      <SideMenu visible={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={onNavigateFromMenu} />

      {/* Article modal */}
      <ArticleModal visible={!!selectedArticle} article={selectedArticle} onClose={onCloseArticle} />
    </SafeAreaView>
  );
}