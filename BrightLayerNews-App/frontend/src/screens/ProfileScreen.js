// src/screens/ProfileScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ navigation }) {
  const { theme, mode, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  // Fetch current logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // assuming token stored in AsyncStorage
        if (!token) {
          navigation.navigate("Login");
          return;
        }

        const res = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data);
          setFormData({ name: data.name, email: data.email });
        } else {
          Alert.alert("Error", data.message || "Failed to fetch user");
        }
      } catch (err) {
        console.error("Fetch user error:", err);
        Alert.alert("Error", "Something went wrong while fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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

  // Handle Update
  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        setEditing(false);
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        Alert.alert("Error", data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Something went wrong while updating.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-gray-700 text-lg">
          No user found. Please log in.
        </Text>
        <TouchableOpacity
          className="bg-blue-600 py-3 px-6 rounded-lg mt-4"
          onPress={() => navigation.navigate("Login")}
        >
          <Text className="text-white font-bold">Go to Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
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

          {editing ? (
            <>
              <View className="mb-3">
                <Text className="text-gray-500 font-semibold">Name</Text>
                <TextInput
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, name: text }))
                  }
                  className="border border-gray-300 rounded-lg p-2 mt-1 text-gray-800"
                />
              </View>

              <View className="mb-3">
                <Text className="text-gray-500 font-semibold">Email</Text>
                <TextInput
                  value={formData.email}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, email: text }))
                  }
                  className="border border-gray-300 rounded-lg p-2 mt-1 text-gray-800"
                  keyboardType="email-address"
                />
              </View>

              <TouchableOpacity
                className="bg-green-600 py-3 rounded-lg mt-4 items-center"
                onPress={handleUpdate}
              >
                <Text className="text-white font-bold">Save Changes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-gray-400 py-3 rounded-lg mt-4 items-center"
                onPress={() => setEditing(false)}
              >
                <Text className="text-white font-bold">Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View className="mb-3">
                <Text className="text-gray-500 font-semibold">Name</Text>
                <Text className="text-gray-800 text-lg">{user.name}</Text>
              </View>

              <View className="mb-3">
                <Text className="text-gray-500 font-semibold">Email</Text>
                <Text className="text-gray-800 text-lg">{user.email}</Text>
              </View>

              <TouchableOpacity
                className="bg-blue-600 py-3 rounded-lg mt-4 items-center"
                onPress={() => setEditing(true)}
              >
                <Text className="text-white font-bold">Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}
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
