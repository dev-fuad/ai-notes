import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

export default function Note() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Text>Note Editor {id}</Text>
  );
}
