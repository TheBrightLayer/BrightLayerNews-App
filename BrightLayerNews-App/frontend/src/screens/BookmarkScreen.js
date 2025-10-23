// frontend/src/screens/BookmarkScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import ArticleCard from "../components/ArticleCard";

const BOOKMARK_KEY = "bookmarked_articles";

export default function BookmarkScreen({ navigation }) {
  const { theme } = useTheme();

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // Load bookmarks from AsyncStorage
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const saved = await AsyncStorage.getItem(BOOKMARK_KEY);
        const list = saved ? JSON.parse(saved) : [];
        setBookmarks(list);
      } catch (err) {
        console.warn("Failed to load bookmarks:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, []);

  // Side menu navigation
  const onNavigateFromMenu = (id) => {
    if (id === "bookmarks") {
      setMenuOpen(false);
    } else if (id === "settings") {
      navigation.navigate("Settings");
    } else if (id === "news") {
      navigation.navigate("Home");
    } else if (id === "trending") {
      navigation.navigate("Home", { category: "All" });
    } else if (id === "dark") {
      toggleTheme();
    } else if (id === 'trending') {
        navigation.navigate('Trending');
    } else if (id === 'profile') {
      navigation.navigate('Profile');
    } else {
      alert(`Menu: ${id}`);
    }
  };

  return (
    <SafeAreaView className={`${theme.colors.background} flex-1`}>
      {/* Header */}
      <Header onMenuPress={() => setMenuOpen(true)} />

      <ScrollView
        className={`${theme.colors.background} flex-1`}
        contentContainerStyle={{ padding: 16 }}
      >
        <Text className={`${theme.colors.text} text-2xl font-bold mb-2`}>
          Bookmarks
        </Text>
        <Text className={`${theme.colors.muted} mb-4`}>
          All your saved articles
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#1da1f2" />
        ) : bookmarks.length === 0 ? (
          <View className="items-center justify-center mt-20">
            <Text className={`${theme.colors.muted} text-lg`}>
              No bookmarks yet.
            </Text>
          </View>
        ) : (
          bookmarks.map((article, idx) => (
            <ArticleCard
              key={idx}
              article={article}
              onPress={() =>
                navigation.navigate("ArticleDetail", { article })
              }
            />
          ))
        )}
        <View className="h-8" />
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
