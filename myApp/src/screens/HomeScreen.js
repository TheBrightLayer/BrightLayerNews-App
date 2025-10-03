// src/screens/HomeScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, TextInput, SafeAreaView, FlatList, ActivityIndicator, StyleSheet, Text, Linking } from 'react-native';
import Header from '../components/Header';
import CategoryTabs from '../components/CategoryTabs';
import ArticleCard from '../components/ArticleCard';
import SideMenu from '../components/SideMenu';
import ArticleModal from '../components/ArticleModal';
import { fetchWorldNews } from '../api/worldNewsApi';

const DEFAULT_CATEGORIES = ['All', 'Technology', 'Business', 'Sports', 'Health', 'Entertainment'];

export default function HomeScreen() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const PAGE_SIZE = 20;

  const load = useCallback(async ({ reset = true, q = query, cat = category, offs = 0 } = {}) => {
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
  }, [category, query]);

  useEffect(() => {
    load({ reset: true, offs: 0 });
  }, []);

  useEffect(() => {
    // when category changes, refetch
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
  function onNavigateFromMenu(id) {
    // handle menu option taps
    if (id === 'trending') {
      // example: set category to 'All' and sort by recency by refetching query
      setCategory('All');
      setQuery('');
      load({ reset: true, q: '', cat: 'All', offs: 0 });
    } else if (id === 'news') {
      setCategory('All');
    } else if (id === 'bookmarks') {
      // placeholder
      alert('Bookmarks tapped (implement your bookmarks screen)');
    } else if (id === 'dark') {
      alert('Toggle dark mode - implement as needed');
    } else {
      // generic feedback
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
    <SafeAreaView style={{ flex: 1 }}>
      <Header onMenuPress={onMenuPress} />

      <View style={styles.searchWrap}>
        <TextInput
          placeholder="Search articles, authors, topics..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => load({ reset: true, q: query, offs: 0 })}
          style={styles.search}
          returnKeyType="search"
        />
      </View>

      <CategoryTabs categories={DEFAULT_CATEGORIES} selected={category} onSelect={setCategory} />

      {loading && items.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8 }}>Loading news…</Text>
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

const styles = StyleSheet.create({
  searchWrap: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  search: {
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
