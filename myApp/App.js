import './global.css';
import { SafeAreaView, StatusBar } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Optional: adjust the status bar style */}
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <HomeScreen />
    </SafeAreaView>
  );
}