import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import Pressable from "@/src/components/ui/pressable";
import { dimensions } from "@/src/constants/dimensions";
import { colors } from "@/src/constants/theme";
import { Image } from "expo-image";

export default function Note() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUris, setImageUris] = useState<string[]>([]);

  return (
    <>
      <Stack.Screen options={{
        headerRight: () => (
          <Pressable>
            <Text style={styles.saveButton}>Save</Text>
          </Pressable>
        )
      }} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior="padding"
        keyboardVerticalOffset={100}>

        {/* Title Input */}
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor={colors.textSecondary}
          style={styles.titleInput}
        />

        {/* Images */}
        <View>
          <ScrollView horizontal>
            {imageUris.map((uri) => (
              <Pressable key={uri}>
                <Image source={{ uri }} style={styles.imageThumb} />
              </Pressable>
            ))}
            <Pressable key="add-image" style={[styles.imageThumb, styles.addImageButton]}>
              <Text style={styles.addIcon}>＋</Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* Content Input */}
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="write your note..."
          multiline
          style={styles.contentInput}
          placeholderTextColor={colors.textSecondary}
        />
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    fontSize: dimensions.xl,
    marginHorizontal: dimensions.l,
  },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: colors.background,
    padding: dimensions.l,
    gap: dimensions.l,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  imageThumb: {
    height: 80,
    width: 80,
    borderRadius: dimensions.l,
    backgroundColor: colors.surface,
  },
  addImageButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  addIcon: {
    fontSize: 30,
    fontWeight: "bold",
  },
  contentInput: {
    color: colors.textPrimary,
  },
});

