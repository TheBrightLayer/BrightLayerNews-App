// frontend/src/screens/HomeScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  TextInput,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import CategoryTabs from '../components/CategoryTabs';
import ArticleCard from '../components/ArticleCard';
import SideMenu from '../components/SideMenu';
import ArticleModal from '../components/ArticleModal';
import { fetchWorldNews } from '../api/worldNewsApi';

// <-- NEW: import theme hook
import { useTheme } from '../context/ThemeContext';

const DEFAULT_CATEGORIES = ['All', 'Technology', 'Business', 'Sports', 'Health', 'Entertainment'];

export default function HomeScreen({ navigation }) {
  const { theme, toggleTheme } = useTheme(); // use theme + toggle

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

        const text = cat && cat !== 'All' ? cat.toLowerCase() : (q ? q : '');

        const data = await fetchWorldNews({ text, offset: offs, pageSize: PAGE_SIZE });

        console.log('[HomeScreen] load() returned data count=', Array.isArray(data) ? data.length : 'not-array');

        if (reset) setItems(Array.isArray(data) ? data : []);
        else setItems((prev) => [...prev, ...(Array.isArray(data) ? data : [])]);

        setOffset(offs + (Array.isArray(data) ? data.length : 0));
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

  function onSearchPress() {
    navigation.navigate('Search');
  }

  // UPDATED: handle menu nav events including dark toggle
  function onNavigateFromMenu(id) {
    if (id === 'trending') {
      setCategory('All');
      setQuery('');
      load({ reset: true, q: '', cat: 'All', offs: 0 });
    } else if (id === 'news') {
      setCategory('All');
    } else if (id === 'bookmarks') {
      navigation.navigate('Bookmarks');
    } else if (id === 'dark') {
      // <-- call toggleTheme from ThemeContext
      toggleTheme();
    } else if (id === 'settings') {
      navigation.navigate('Settings');
    } else if (id === 'trending') {
      navigation.navigate('Trending');
    } else if (id === 'profile') {
      navigation.navigate('Profile');
    } else if (id == 'signup') {
      navigation.navigate('SignUp');
    }else {
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
    // UPDATED: use theme background instead of fixed bg-white
    <SafeAreaView className={`${theme.colors.background} flex-1`}>
      <Header onMenuPress={onMenuPress} onSearchPress={onSearchPress} />

      <View className={`${theme.colors.card} px-3 py-2 border-b ${theme.colors.border}`}>
        <TextInput
          placeholder="Search articles, authors, topics..."
          placeholderTextColor={theme.colors.muted ? undefined : undefined}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => load({ reset: true, q: query, offs: 0 })}
          className="h-10 bg-gray-100 rounded-lg px-3"
          returnKeyType="search"
        />
      </View>

      <CategoryTabs categories={DEFAULT_CATEGORIES} selected={category} onSelect={setCategory} />

      {loading && items.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
          <Text className="mt-2">Loading news…</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => String(i.id ?? i.url ?? Math.random())}
          renderItem={({ item }) => <ArticleCard article={item} onPress={() => onCardPress(item)} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.6}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}

      <SideMenu visible={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={onNavigateFromMenu} />

      <ArticleModal visible={!!selectedArticle} article={selectedArticle} onClose={onCloseArticle} />
    </SafeAreaView>
  );
}
