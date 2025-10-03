// src/components/ArticleModal.js
import React from 'react';
import { Modal, View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';

export default function ArticleModal({ visible, article, onClose }) {
  if (!article) return null;

  const { title, image, summary, url, source, publishedAt } = article;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.close}>
          <Text style={{ fontSize: 18 }}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Article</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {image ? <Image source={{ uri: image }} style={styles.image} resizeMode="cover" /> : <View style={[styles.image, styles.placeholder]}><Text>No image</Text></View>}

        <Text style={styles.title}>{title}</Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>{source ?? 'WorldNews'}</Text>
          <Text style={styles.metaDot}> • </Text>
          <Text style={styles.metaText}>{publishedAt ? new Date(publishedAt).toLocaleString() : ''}</Text>
        </View>

        <Text style={styles.body}>{(summary || '').replace(/<[^>]*>/g, '')}</Text>

        {url ? (
          <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(url)}>
            <Text style={styles.buttonText}>Read full article</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  close: { width: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  container: { padding: 12, paddingBottom: 40, backgroundColor: '#fff' },
  image: { width: '100%', height: 220, borderRadius: 8, marginBottom: 12 },
  placeholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#eceff1' },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  meta: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  metaText: { fontSize: 12, color: '#666' },
  metaDot: { color: '#666', marginHorizontal: 6 },
  body: { fontSize: 16, lineHeight: 24, color: '#222', marginBottom: 18 },
  button: { backgroundColor: '#0f62fe', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
