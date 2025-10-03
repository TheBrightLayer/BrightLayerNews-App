// src/components/ArticleCard.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

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
          // compute height to preserve aspect ratio
          const width = CARD_WIDTH;
          const height = Math.round((h / w) * width);
          // limit height to reasonable max so cards don't get huge
          const max = 360;
          setImgHeight(Math.min(height, max));
          setHasImage(true);
        },
        (err) => {
          // couldn't get size -> fallback to placeholder
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
    <TouchableOpacity onPress={() => onPress && onPress(article)} style={styles.card}>
      {hasImage ? (
        <Image source={{ uri: image }} style={[styles.image, { height: imgHeight }]} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>No image available</Text>
        </View>
      )}

      {category ? (
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
      ) : null}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {summary ? (
          <Text style={styles.summary} numberOfLines={3}>
            {summary.replace(/<[^>]*>/g, '')}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          <Text style={styles.source}>{source ?? 'WorldNews'}</Text>
          <Text style={styles.dot}> • </Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: HORIZONTAL_PADDING / 2,
    marginBottom: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  image: {
    width: CARD_WIDTH,
    height: 180,
    backgroundColor: '#eceff1',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#777',
  },
  categoryBadge: {
    position: 'absolute',
    left: 14,
    top: 12,
    backgroundColor: '#0f62fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111',
  },
  summary: {
    color: '#444',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  source: {
    fontSize: 12,
    color: '#666',
  },
  dot: {
    color: '#666',
    marginHorizontal: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
});
