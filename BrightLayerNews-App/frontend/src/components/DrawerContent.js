// frontend/src/components/DrawerContent.js
import React from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { styled } from "nativewind"; // optional: for typed components

export default function DrawerContent({ navigation }) {
  const { theme, mode, toggleTheme } = useTheme();

  // helper to combine tailwind classes with dynamic theme classes
  const rowBase = `${theme.colors.card} px-4 py-3 border-b ${theme.colors.border}`;

  const Item = ({ icon, label, to }) => (
    <TouchableOpacity
      onPress={() => navigation?.navigate?.(to)}
      className={rowBase}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {icon}
        <Text className={`${theme.colors.text} ml-4 text-base`}>{label}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className={`flex-1 ${theme.colors.background}`}>
      <View className="pt-14">
        <Item
          to="Home"
          label="Home"
          icon={<MaterialIcons name="home" size={20} color={mode === "dark" ? "#e6eef8" : "#0f172a"} />}
        />
        <Item
          to="Explore"
          label="Explore"
          icon={<Ionicons name="search" size={20} color={mode === "dark" ? "#e6eef8" : "#0f172a"} />}
        />
        <Item
          to="Notifications"
          label="Notifications"
          icon={<Ionicons name="notifications-outline" size={20} color={mode === "dark" ? "#e6eef8" : "#0f172a"} />}
        />
        <Item
          to="Messages"
          label="Messages"
          icon={<MaterialIcons name="mail-outline" size={20} color={mode === "dark" ? "#e6eef8" : "#0f172a"} />}
        />
        <Item
          to="Communities"
          label="Communities"
          icon={<FontAwesome5 name="users" size={18} color={mode === "dark" ? "#e6eef8" : "#0f172a"} />}
        />
        <Item
          to="Premium"
          label="Premium"
          icon={<FontAwesome5 name="star" size={16} color={mode === "dark" ? "#e6eef8" : "#0f172a"} />}
        />

        {/* Dark Mode row */}
        <View className={`${theme.colors.card} px-4 py-3 border-b ${theme.colors.border}`}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="moon-outline" size={20} color={mode === "dark" ? "#e6eef8" : "#0f172a"} />
              <Text className={`${theme.colors.text} ml-4 text-base`}>Dark Mode</Text>
            </View>
            <Switch
              value={mode === "dark"}
              onValueChange={toggleTheme}
              trackColor={{ false: "#767577", true: "#1da1f2" }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </View>

      {/* Post button at bottom */}
      <View className="p-4">
        <TouchableOpacity
          onPress={() => navigation?.navigate?.("CreatePost")}
          className="py-3 rounded-full items-center"
          style={{ backgroundColor: mode === "dark" ? "#1da1f2" : "#1da1f2" }}
        >
          <Text className="text-white font-bold">Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
