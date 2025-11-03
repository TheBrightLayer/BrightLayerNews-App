// frontend/src/screens/SettingsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useTheme } from "../context/ThemeContext";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";

const STORAGE_KEYS = {
  NOTIFICATIONS: "settings_notifications",
  FONT_SIZE: "settings_font_size",
};

export default function SettingsScreen({ navigation }) {
  const { theme, mode, toggleTheme } = useTheme();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [fontSize, setFontSize] = useState("medium"); // small | medium | large
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Load persisted settings
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const n = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
        const f = await AsyncStorage.getItem(STORAGE_KEYS.FONT_SIZE);
        if (!mounted) return;
        if (n !== null) setNotificationsEnabled(n === "true");
        if (f) setFontSize(f);
      } catch (e) {
        console.warn("Failed to load settings", e);
      } finally {
        if (mounted) setLoaded(true);
      }
    })();
    return () => (mounted = false);
  }, []);

  // Persist helper
  const persist = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, String(value));
    } catch (e) {
      console.warn("Failed to save setting", key, e);
    }
  };

  const onToggleNotifications = async (val) => {
    setNotificationsEnabled(val);
    await persist(STORAGE_KEYS.NOTIFICATIONS, val);
  };

  const onChangeFontSize = async (size) => {
    setFontSize(size);
    await persist(STORAGE_KEYS.FONT_SIZE, size);
  };

  const fontSizeClass = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  }[fontSize || "medium"];

  // ✅ Side menu navigation handling
  function onNavigateFromMenu(id) {
    if (id === "dark") {
      toggleTheme();
    } else if (id === "settings") {
      setMenuOpen(false);
    } else if (id === "bookmarks") {
      navigation.navigate("Bookmarks");
    } else if (id === "news") {
      navigation.navigate("Home");
    } else if (id === "trending") {
      navigation.navigate("Trending");
    } else if (id === "profile") {
      navigation.navigate("Profile");
    } else {
      alert(`Menu: ${id}`);
    }
  }

  // ✅ SIGN OUT HANDLER (with toast)
  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("token"); // remove JWT

      // ✅ show toast notification
      Toast.show({
        type: "success",
        text1: "Signed Out",
        text2: "You have been signed out successfully 👋",
        position: "bottom",
        visibilityTime: 2500,
      });

      // Navigate back after a short delay
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }, 2500);
    } catch (error) {
      console.error("Signout error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to sign out. Please try again.",
      });
    }
  };

  return (
    <SafeAreaView className={`${theme.colors.background} flex-1`}>
      <Header onMenuPress={() => setMenuOpen(true)} />

      <ScrollView
        className={`${theme.colors.background} flex-1`}
        contentContainerStyle={{ padding: 16 }}
      >
        <Text className={`${theme.colors.text} text-2xl font-bold`}>
          Settings
        </Text>
        <Text className={`${theme.colors.muted} mt-1 mb-4`}>
          Customize your FlipNews experience
        </Text>

        {/* Dark Mode */}
        <View
          className={`${theme.colors.card} rounded-md p-4 mb-4 border ${theme.colors.border}`}
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text className={`${theme.colors.text} text-base font-semibold`}>
                Dark Mode
              </Text>
              <Text className={`${theme.colors.muted} text-sm mt-1`}>
                Toggle app theme
              </Text>
            </View>
            <Switch
              value={mode === "dark"}
              onValueChange={toggleTheme}
              trackColor={{ false: "#767577", true: "#1da1f2" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Notifications */}
        <View
          className={`${theme.colors.card} rounded-md p-4 mb-4 border ${theme.colors.border}`}
        >
          <View className="flex-row justify-between items-center">
            <View style={{ flex: 1 }}>
              <Text className={`${theme.colors.text} text-base font-semibold`}>
                Notifications
              </Text>
              <Text className={`${theme.colors.muted} text-sm mt-1`}>
                Enable push/alerts for breaking news
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={onToggleNotifications}
              trackColor={{ false: "#767577", true: "#1da1f2" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Font size */}
        <View
          className={`${theme.colors.card} rounded-md p-4 mb-4 border ${theme.colors.border}`}
        >
          <Text className={`${theme.colors.text} text-base font-semibold mb-2`}>
            Font size
          </Text>
          <Text className={`${theme.colors.muted} text-sm mb-3`}>
            Adjust article text size
          </Text>

          <View className="flex-row space-x-3">
            {["small", "medium", "large"].map((s) => {
              const active = s === fontSize;
              return (
                <TouchableOpacity
                  key={s}
                  onPress={() => onChangeFontSize(s)}
                  activeOpacity={0.8}
                  className={`flex-1 py-3 rounded-md items-center justify-center ${
                    active ? "bg-accent" : theme.colors.card
                  }`}
                  style={
                    active
                      ? { shadowColor: "#000", shadowOpacity: 0.12, elevation: 2 }
                      : {}
                  }
                >
                  <Text
                    className={`${
                      active ? "text-white" : theme.colors.text
                    } ${fontSizeClass}`}
                  >
                    {s[0].toUpperCase() + s.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ✅ Sign Out Button */}
        <TouchableOpacity
          onPress={handleSignOut}
          activeOpacity={0.8}
          className="bg-red-500 py-3 rounded-md mt-6 items-center justify-center"
        >
          <Text className="text-white font-bold text-base">Sign Out</Text>
        </TouchableOpacity>

        <View className="h-8" />
        <Text className={`${theme.colors.muted} text-sm`}>
          Changes persist automatically.
        </Text>
      </ScrollView>

      <SideMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={onNavigateFromMenu}
      />

      {/* ✅ Toast component (required for rendering toasts) */}
      <Toast />
    </SafeAreaView>
  );
}
