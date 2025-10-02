import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';

const categories = ['All', 'Politics', 'Technology', 'Sports', 'Business', 'Entertainment'];

export default function CategoryTabs({ onSelect }) {
  const [active, setActive] = useState('All');

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-3 px-4">
      {categories.map(cat => (
        <TouchableOpacity
          key={cat}
          onPress={() => { setActive(cat); onSelect && onSelect(cat); }}
          className={`mr-3 px-3 py-2 rounded-full ${active === cat ? 'bg-black' : 'bg-gray-200'}`}
        >
          <Text className={`${active === cat ? 'text-white' : 'text-black'} text-sm`}>{cat}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
