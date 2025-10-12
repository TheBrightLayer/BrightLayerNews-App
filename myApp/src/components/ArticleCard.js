// src/components/ArticleCard.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { shareToWhatsApp, shareToX } from '../utils/shareNews';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons'; // expo icons

const SCREEN_WIDTH = Dimensions.get('window').width;
const HORIZONTAL_PADDING = 24; // should match HomeScreen card padding
const CARD_MAX_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING;
const DEFAULT_IMG_HEIGHT = 180;
const MAX_IMG_HEIGHT = 360;

export default function ArticleCard({ article, onPress }) {
  const { title, summary, image, source, publishedAt, category } = article || {};
  const [imgHeight, setImgHeight] = useState(DEFAULT_IMG_HEIGHT);
  const [hasImage, setHasImage] = useState(Boolean(image));

  useEffect(() => {
    let mounted = true;
    if (image) {
      Image.getSize(
        image,
        (w, h) => {
          if (!mounted) return;
          const width = Math.min(CARD_MAX_WIDTH, SCREEN_WIDTH);
          const height = Math.round((h / w) * width);
          setImgHeight(Math.min(height, MAX_IMG_HEIGHT));
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
    return () => {
      mounted = false;
    };
  }, [image]);

  const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : '';

  return (
    <TouchableOpacity
      onPress={() => onPress && onPress(article)}
      activeOpacity={0.85}
      className="self-center w-full mx-3 mb-3 bg-white rounded-xl overflow-hidden shadow"
      style={{ maxWidth: CARD_MAX_WIDTH }}
    >
      {/* Image section */}
      {hasImage ? (
        <Image
          source={{ uri: image }}
          className="w-full bg-gray-100"
          style={{ height: imgHeight, width: '100%' }}
          resizeMode="cover"
          onError={() => setHasImage(false)}
        />
      ) : (
        <View
          className="w-full bg-gray-100 items-center justify-center"
          style={{ height: imgHeight }}
        >
          <Text className="text-gray-500">No image available</Text>
        </View>
      )}

      {/* Category badge */}
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
          <Text
            className="text-gray-700 text-[14px] leading-5 mb-2"
            numberOfLines={3}
          >
            {summary.replace(/<[^>]*>/g, '')}
          </Text>
        ) : null}

        {/* Footer row */}
        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center">
            <Text className="text-xs text-gray-600">{source ?? 'WorldNews'}</Text>
            <Text className="text-gray-600 mx-1">{'•'}</Text>
            <Text className="text-xs text-gray-600">{date}</Text>
          </View>

          {/* Share buttons */}
          <View className="flex-row items-center space-x-3">
            <TouchableOpacity
              onPress={() => shareToWhatsApp(article)}
              activeOpacity={0.8}
              className="p-1.5 rounded-md bg-green-600 active:bg-green-700"
            >
              <FontAwesome6 name="whatsapp" size={16} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => shareToX(article)}
              activeOpacity={0.8}
              className="p-1.5 rounded-md bg-black active:bg-gray-800"
            >
              <FontAwesome6 name="x-twitter" size={14} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
