// src/components/ArticleModal.js
import React from 'react';
import { Modal, View, Text, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';

export default function ArticleModal({ visible, article, onClose }) {
  if (!article) return null;

  const { title, image, summary, url, source, publishedAt } = article;
  const date = publishedAt ? new Date(publishedAt).toLocaleString() : '';

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      {/* Header */}
      <View className="h-14 flex-row items-center justify-between px-3 border-b border-gray-200 bg-white">
        <TouchableOpacity onPress={onClose} className="w-9 items-center justify-center">
          <Text className="text-lg">✕</Text>
        </TouchableOpacity>

        <Text className="text-base font-extrabold">Article</Text>

        {/* spacer to keep title centered */}
        <View className="w-9" />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="p-3 bg-white">
        {image ? (
          <Image source={{ uri: image }} className="w-full h-56 rounded-md mb-3" resizeMode="cover" />
        ) : (
          <View className="w-full h-56 rounded-md mb-3 bg-gray-100 items-center justify-center">
            <Text className="text-gray-600">No image</Text>
          </View>
        )}

        <Text className="text-xl font-extrabold mb-2">{title}</Text>

        <View className="flex-row items-center mb-3">
          <Text className="text-xs text-gray-600">{source ?? 'WorldNews'}</Text>
          <Text className="text-gray-600 mx-1">•</Text>
          <Text className="text-xs text-gray-600">{date}</Text>
        </View>

        <Text className="text-base leading-7 text-gray-900 mb-4">
          {(summary || '').replace(/<[^>]*>/g, '')}
        </Text>

        {url ? (
          <TouchableOpacity
            className="bg-blue-600 py-3 rounded-lg items-center"
            onPress={() => {
              Linking.openURL(url).catch(() => {});
            }}
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold">Read full article</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </Modal>
  );
}
