// src/screens/ProfileScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import { useTheme } from "../context/ThemeContext";

export default function ProfileScreen({ navigation, route }) {
  const { theme, mode, toggleTheme } = useTheme();
  const user = route.params?.user || { name: "Guest", email: "guest@example.com" };

  const [menuOpen, setMenuOpen] = useState(false);

  // SideMenu navigation handling
  function onNavigateFromMenu(id) {
    if (id === "dark") {
      toggleTheme();
    } else if (id === "profile") {
      setMenuOpen(false); // already on profile
    } else if (id === "settings") {
      navigation.navigate("Settings");
    } else if (id === "bookmarks") {
      navigation.navigate("Bookmarks");
    } else if (id === "news") {
      navigation.navigate("Home");
    } else if (id === "trending") {
      navigation.navigate("Trending");
    } else if (id === "login") {
      navigation.navigate("Login");
    } else if (id === "signup") {
      navigation.navigate("SignUp");
    } else {
      alert(`Menu: ${id}`);
    }
    setMenuOpen(false);
  }

  return (
    <SafeAreaView className={`${theme.colors.background} flex-1`}>
      {/* Header with menu button */}
      <Header onMenuPress={() => setMenuOpen(true)} />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Profile Banner */}
        <View className="bg-blue-600 rounded-xl p-6 items-center mb-6">
          <Image
            source={{
              uri: "https://i.pravatar.cc/150?img=12",
            }}
            className="w-24 h-24 rounded-full mb-4"
          />
          <Text className="text-white text-2xl font-bold">{user.name}</Text>
          <Text className="text-white text-base">{user.email}</Text>
        </View>

        {/* Profile Details */}
        <View className="bg-white rounded-xl p-6 shadow-md">
          <Text className="text-xl font-semibold mb-4">Profile Details</Text>

          <View className="mb-3">
            <Text className="text-gray-500 font-semibold">Name</Text>
            <Text className="text-gray-800 text-lg">{user.name}</Text>
          </View>

          <View className="mb-3">
            <Text className="text-gray-500 font-semibold">Email</Text>
            <Text className="text-gray-800 text-lg">{user.email}</Text>
          </View>

          {/* Example Buttons */}
          <TouchableOpacity
            className="bg-blue-600 py-3 rounded-lg mt-4 items-center"
            onPress={() => alert("Edit profile clicked")}
          >
            <Text className="text-white font-bold">Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-500 py-3 rounded-lg mt-4 items-center"
            onPress={() => navigation.navigate("Login")}
          >
            <Text className="text-white font-bold">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Side Menu */}
      <SideMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={onNavigateFromMenu}
        user={user}
      />
    </SafeAreaView>
  );
}
