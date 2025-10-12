import React from 'react';
import { Image } from 'react-native';

export default function Avatar({ size = 36, source }) {
  const src = source ? source : require('../assets/images/avatar.jpg');
  return (
    <Image
      source={src}
      style={{ width: size, height: size, borderRadius: size / 2 }}
    />
  );
}
