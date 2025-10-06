// src/components/ArticleCard.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const HORIZONTAL_PADDING = 24; // should match HomeScreen card padding
const CARD_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING;

export default function ArticleCard({ article, onPress }) {
  const { title, summary, image, source, publishedAt, category } = article || {};
  const [imgHeight, setImgHeight] = useState(180); // default height
  const [hasImage, setHasImage] = useState(Boolean(image));

  useEffect(() => {
    let mounted = true;
    if (image) {
      Image.getSize(
        image,
        (w, h) => {
          if (!mounted) return;
          const width = CARD_WIDTH;
          const height = Math.round((h / w) * width);
          const max = 360;
          setImgHeight(Math.min(height, max));
          setHasImage(true);
        },
        () => {
          if (!mounted) return;
          setHasImage(false);
        }
      );
    } else {
      setHasImage(false);
    }
    return () => (mounted = false);
  }, [image]);

  const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : '';

  return (
    <TouchableOpacity
      onPress={() => onPress && onPress(article)}
      className="mx-3 mb-3 bg-white rounded-xl overflow-hidden shadow"
      style={{ width: CARD_WIDTH }}
      activeOpacity={0.85}
    >
      {/* Image / Placeholder */}
      {hasImage ? (
        <Image
          source={{ uri: image }}
          className="w-full bg-gray-100"
          style={{height: imgHeight }}
          resizeMode="cover"
        />
      ) : (
        <View
          className="items-center justify-center bg-gray-100"
          style={{ width: CARD_WIDTH, height: imgHeight }}
        >
          <Text className="text-gray-500">No image available</Text>
        </View>
      )}

      {/* Category badge (absolute) */}
      {category ? (
        <View className="absolute left-3 top-3 bg-blue-600 px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-semibold">{category}</Text>
        </View>
      ) : null}

      {/* Content */}
      <View className="p-3">
        <Text className="text-[16px] font-extrabold text-black mb-2" numberOfLines={2}>
          {title}
        </Text>

        {summary ? (
          <Text className="text-gray-700 text-[14px] leading-5 mb-2" numberOfLines={3}>
            {summary.replace(/<[^>]*>/g, '')}
          </Text>
        ) : null}

        <View className="flex-row items-center">
          <Text className="text-xs text-gray-600">{source ?? 'WorldNews'}</Text>
          <Text className="text-gray-600 mx-1">{'•'}</Text>
          <Text className="text-xs text-gray-600">{date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
