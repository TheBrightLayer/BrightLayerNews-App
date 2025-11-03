import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const sendOtp = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/otp/send-otp', { email });
      Alert.alert('Success', res.data.message);
      navigation.navigate('VerifyOtp', { email });
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP');
    }
  };

  return (
    <View className="p-6">
      <Text className="text-xl font-bold mb-4">Forgot Password</Text>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        className="border p-3 rounded mb-4"
      />
      <TouchableOpacity onPress={sendOtp} className="bg-blue-600 p-3 rounded">
        <Text className="text-white text-center">Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
}
