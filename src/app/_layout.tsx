import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Notes' }} />
          <Stack.Screen name="note/[id]" options={{ title: 'Note Editor' }} />
        </Stack>
      </KeyboardProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
