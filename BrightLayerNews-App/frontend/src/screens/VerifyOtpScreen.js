import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

export default function VerifyOtpScreen({ route, navigation }) {
  const { email } = route.params;
  const [otp, setOtp] = useState('');

  const verifyOtp = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/otp/verify-otp', { email, otp });
      Alert.alert('Success', res.data.message);
      navigation.navigate('ResetPassword', { email });
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Invalid OTP');
    }
  };

  return (
    <View className="p-6">
      <Text className="text-xl font-bold mb-4">Verify OTP</Text>
      <TextInput
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        className="border p-3 rounded mb-4"
      />
      <TouchableOpacity onPress={verifyOtp} className="bg-green-600 p-3 rounded">
        <Text className="text-white text-center">Verify</Text>
      </TouchableOpacity>
    </View>
  );
}
