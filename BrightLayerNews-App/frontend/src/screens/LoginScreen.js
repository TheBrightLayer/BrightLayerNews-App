import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../api/authApi';

const USER_KEY = 'logged_in_user';
const TOKEN_KEY = 'token';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      const { token, user } = res;

      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

      console.log('Logged in successfully!');
      navigation.navigate('Home');
    } catch (err) {
      console.error('Login Failed', err);
      Alert.alert('Login Failed', err?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full max-w-sm bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
          <Text className="text-4xl font-extrabold text-blue-600 mb-2 text-center">FlipNews</Text>
          <Text className="text-2xl font-bold mb-8 text-gray-800 text-center">Welcome Back</Text>

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
            className="w-full p-4 mb-2 border border-gray-300 rounded-lg text-base"
          />

          {/* Forgot Password Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            className="self-end mb-6"
          >
            <Text className="text-blue-600 font-semibold text-sm">Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className={`w-full p-4 rounded-lg items-center ${
              loading ? 'bg-blue-300' : 'bg-blue-600'
            } shadow-md`}
          >
            <Text className="text-white text-lg font-semibold">
              {loading ? 'Logging In...' : 'Login'}
            </Text>
          </TouchableOpacity>

          {/* Navigation Link */}
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')} className="mt-8">
            <Text className="text-center text-gray-600 text-base">
              Don't have an account?{' '}
              <Text className="font-bold text-blue-600">Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
