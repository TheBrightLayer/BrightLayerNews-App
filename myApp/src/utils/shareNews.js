// src/utils/shareNews.js
import { Linking, Alert } from 'react-native';

export async function shareToWhatsApp(article) {
  const text = `${article.title}\n\n${article.url ?? ''}`;
  const encoded = encodeURIComponent(text);
  const appUrl = `whatsapp://send?text=${encoded}`;
  const webUrl = `https://api.whatsapp.com/send?text=${encoded}`;

  try {
    const supported = await Linking.canOpenURL(appUrl);
    if (supported) return await Linking.openURL(appUrl);

    const supportedWeb = await Linking.canOpenURL(webUrl);
    if (supportedWeb) return await Linking.openURL(webUrl);

    Alert.alert('WhatsApp not installed', 'Please install WhatsApp to share this article.');
  } catch (err) {
    console.warn('WhatsApp share error', err);
    Alert.alert('Error', 'Unable to share to WhatsApp.');
  }
}

export async function shareToX(article) {
  const text = `${article.title}\n\n${article.url ?? ''}`;
  const encoded = encodeURIComponent(text);
  const appUrl = `twitter://post?message=${encoded}`;
  const webUrl = `https://twitter.com/intent/tweet?text=${encoded}`;

  try {
    const supported = await Linking.canOpenURL(appUrl);
    if (supported) return await Linking.openURL(appUrl);

    const supportedWeb = await Linking.canOpenURL(webUrl);
    if (supportedWeb) return await Linking.openURL(webUrl);

    Alert.alert('X (Twitter) not installed', 'Please install X to share this article.');
  } catch (err) {
    console.warn('X share error', err);
    Alert.alert('Error', 'Unable to share to X.');
  }
}
