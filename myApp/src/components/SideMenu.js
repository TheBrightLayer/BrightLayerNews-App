// src/components/SideMenu.js
import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const MENU_WIDTH = Math.round(width * 0.78);

export default function SideMenu({ visible, onClose, onNavigate }) {
  const anim = useRef(new Animated.Value(visible ? 0 : -MENU_WIDTH)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 0 : -MENU_WIDTH,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [visible, anim]);

  const items = [
    { id: 'news', label: 'News Feed' },
    { id: 'trending', label: 'Trending' },
    { id: 'bookmarks', label: 'Bookmarks' },
    { id: 'profile', label: 'Profile' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'rss', label: 'RSS Feeds' },
    { id: 'discover', label: 'Discover' },
    { id: 'dark', label: 'Dark Mode' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <View className="absolute inset-0 z-50" pointerEvents="box-none">
      {/* overlay */}
      {visible ? (
        <TouchableOpacity
          className="absolute inset-0 bg-black/40"
          activeOpacity={1}
          onPress={onClose}
        />
      ) : null}

      <Animated.View
        style={[
          {
            width: MENU_WIDTH,
            transform: [{ translateX: anim }],
          },
        ]}
        className="absolute left-0 top-0 bottom-0 bg-white pt-9 px-4 shadow-lg z-50"
      >
        <View className="pb-3">
          <Text className="text-xl font-extrabold">FlipNews</Text>
        </View>

        <View className="py-2">
          {items.map((it) => (
            <TouchableOpacity
              key={it.id}
              className="py-3 border-b border-gray-200"
              onPress={() => {
                onNavigate && onNavigate(it.id);
                onClose && onClose();
              }}
              activeOpacity={0.75}
            >
              <Text className="text-base">{it.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}
