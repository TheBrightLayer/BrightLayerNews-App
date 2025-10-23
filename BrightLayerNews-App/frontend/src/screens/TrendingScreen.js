// frontend/src/screens/TrendingScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import ArticleCard from "../components/ArticleCard";
import { get } from "../api/apiClient";

export default function TrendingScreen({ navigation }) {
  const { theme } = useTheme();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch trending articles
  const fetchTrending = async () => {
  try {
    setLoading(true);
    const data = await get("/trending", { limit: 20, minViews: 5, days: 7 });
    setArticles(data.data || []); // your backend returns { data: [...] }
  } catch (err) {
    console.warn("Failed to fetch trending articles", err);
    setArticles([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchTrending();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTrending();
    setRefreshing(false);
  };

  // Side menu navigation
  function onNavigateFromMenu(id) {
    if (id === "dark") {
      toggleTheme();
    } else if (id === "trending") {
      setMenuOpen(false); // already here
    } else if (id === "news") {
      navigation.navigate("Home");
    } else if (id === "bookmarks") {
      navigation.navigate("Bookmarks");
    } else if (id === "settings") {
      navigation.navigate("Settings");
    } else {
      alert(`Menu: ${id}`);
    }
  }

  return (
    <SafeAreaView className={`${theme.colors.background} flex-1`}>
      {/* Header */}
      <Header onMenuPress={() => setMenuOpen(true)} />

      <ScrollView
        className={`${theme.colors.background} flex-1`}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text className={`${theme.colors.text} text-2xl font-bold mb-2`}>
          Trending News
        </Text>
        <Text className={`${theme.colors.muted} text-sm mb-4`}>
          Most popular articles based on views
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#1da1f2" />
        ) : articles.length === 0 ? (
          <Text className={`${theme.colors.muted} text-center mt-10`}>
            No trending articles yet.
          </Text>
        ) : (
          articles.map((article, idx) => (
            <ArticleCard
              key={`${article.title}_${idx}`}
              article={article}
              onPress={(a) => navigation.navigate("ArticleDetail", { article: a })}
            />
          ))
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Side menu */}
      <SideMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={onNavigateFromMenu}
      />
    </SafeAreaView>
  );
}
