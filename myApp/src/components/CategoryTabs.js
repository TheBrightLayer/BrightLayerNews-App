// src/components/CategoryTabs.js
import React from 'react';
import { View, TouchableOpacity, Text, FlatList, StyleSheet } from 'react-native';

export default function CategoryTabs({ categories = [], selected, onSelect }) {
  return (
    <View style={styles.wrap}>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(c) => c}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const active = item === selected;
          return (
            <TouchableOpacity onPress={() => onSelect(item)} style={[styles.tab, active && styles.tabActive]}>
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{item}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#f4f4f6',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabActive: {
    backgroundColor: '#0f62fe22',
    borderColor: '#0f62fe50',
  },
  tabText: {
    fontSize: 14,
    color: '#222',
  },
  tabTextActive: {
    color: '#0f62fe',
    fontWeight: '600',
  },
});
