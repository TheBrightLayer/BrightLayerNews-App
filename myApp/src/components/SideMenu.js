// src/components/SideMenu.js
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const MENU_WIDTH = Math.round(width * 0.78);
const ANIM_DURATION = 260;

export default function SideMenu({ visible, onClose, onNavigate }) {
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -MENU_WIDTH,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    }
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

  if (!visible && fadeAnim._value === 0) {
    return null;
  }

  return (
    <View 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      {/* Dark background overlay */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#000',
          opacity: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.5],
          }),
        }}
      >
        <Pressable
          onPress={onClose}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </Animated.View>

      {/* Animated sidebar */}
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: MENU_WIDTH,
          backgroundColor: '#fff',
          transform: [{ translateX: slideAnim }],
          shadowColor: '#000',
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 16,
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {/* Add StatusBar height padding for Android */}
          <View style={{ 
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
          }}>
            {/* Header */}
            <View style={{
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#e5e7eb',
            }}>
              <Text style={{
                fontSize: 24,
                fontWeight: '800',
                color: '#000',
              }}>
                FlipNews
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#6b7280',
                marginTop: 4,
              }}>
                Your daily headlines
              </Text>
            </View>

            {/* Menu items */}
            <View style={{ marginTop: 8 }}>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f3f4f6',
                  }}
                  activeOpacity={0.7}
                  onPress={() => {
                    onNavigate && onNavigate(item.id);
                    onClose && onClose();
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    color: '#000',
                    fontWeight: '500',
                  }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}