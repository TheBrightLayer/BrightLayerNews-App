import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

export default function ResetPasswordScreen({ route, navigation }) {
  const { email } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetPassword = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/otp/reset-password', {
        email,
        newPassword,
        confirmPassword,
      });
      Alert.alert('Success', res.data.message);
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <View className="p-6">
      <Text className="text-xl font-bold mb-4">Reset Password</Text>
      <TextInput
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        className="border p-3 rounded mb-4"
      />
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        className="border p-3 rounded mb-4"
      />
      <TouchableOpacity onPress={resetPassword} className="bg-purple-600 p-3 rounded">
        <Text className="text-white text-center">Change Password</Text>
      </TouchableOpacity>
    </View>
  );
}
