// src/components/SideMenu.js
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';

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
  }, [visible]);

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
    <View style={styles.root} pointerEvents="box-none">
      {/* overlay */}
      {visible ? (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      ) : null}

      <Animated.View style={[styles.menu, { transform: [{ translateX: anim }] }]}>
        <View style={styles.header}>
          <Text style={styles.brand}>FlipNews</Text>
        </View>

        <View style={{ paddingVertical: 8 }}>
          {items.map((it) => (
            <TouchableOpacity
              key={it.id}
              style={styles.item}
              onPress={() => {
                onNavigate && onNavigate(it.id);
                onClose && onClose();
              }}
            >
              <Text style={styles.itemText}>{it.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000066',
  },
  menu: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: MENU_WIDTH,
    backgroundColor: '#fff',
    paddingTop: 36,
    paddingHorizontal: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
  },
  header: {
    paddingBottom: 12,
  },
  brand: {
    fontSize: 20,
    fontWeight: '800',
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 16,
  },
});
