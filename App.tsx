import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View, Text } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/constants/theme';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <AppNavigator />
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
