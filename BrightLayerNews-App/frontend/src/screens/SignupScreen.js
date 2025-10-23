import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const USER_KEY = 'logged_in_user';
const TOKEN_KEY = 'token';

// ✅ Change this depending on your setup:
// For Android emulator → 'http://10.0.2.2:5000'
// For iOS simulator → 'http://localhost:5000'
// For real device → replace with your PC’s local IP, e.g. 'http://192.168.1.100:5000'
const BASE_URL = 'http://localhost:5000';

export default function SignupScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      // ✅ Direct call to your backend
      const res = await axios.post(`${BASE_URL}/api/auth/signup`, {
        name,
        email,
        password,
      });

      // Response from backend
      // { message: "Signup successful", user: { id, name, email } }
      const user = res.data.user;
      const token = res.data.token || null; // in case you later return token

      // Save to AsyncStorage
      if (user) await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      if (token) await AsyncStorage.setItem(TOKEN_KEY, token);

      Alert.alert('Success', 'Account created successfully!');
      console.log('✅ User created:', user);

      // Navigate to Home
      navigation.navigate('Home');
    } catch (err) {
      console.error('Signup Failed:', err.response?.data || err.message);
      Alert.alert('Signup Failed', err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full max-w-sm bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
          <Text className="text-4xl font-extrabold text-blue-600 mb-2 text-center">FlipNews</Text>
          <Text className="text-2xl font-bold mb-8 text-gray-800 text-center">Create Account</Text>

          {/* Name Input */}
          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            className="w-full p-4 mb-4 border border-gray-300 rounded-lg text-base"
          />

          {/* Email Input */}
          <TextInput
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            className="w-full p-4 mb-4 border border-gray-300 rounded-lg text-base"
          />

          {/* Password Input */}
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="w-full p-4 mb-6 border border-gray-300 rounded-lg text-base"
          />

          {/* Signup Button */}
          <TouchableOpacity
            onPress={handleSignup}
            disabled={loading}
            className={`w-full p-4 rounded-lg items-center ${loading ? 'bg-blue-300' : 'bg-blue-600'} shadow-md`}
          >
            <Text className="text-white text-lg font-semibold">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          {/* Navigation Link */}
          <TouchableOpacity onPress={() => navigation.navigate('Login')} className="mt-8">
            <Text className="text-center text-gray-600 text-base">
              Already have an account? <Text className="font-bold text-blue-600">Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
