import { File, Paths } from "expo-file-system";
import { Image } from "expo-image";
import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import Pressable from "@/components/ui/pressable";
import { dimensions } from "@/constants/dimensions";
import { colors } from "@/constants/theme";
import { notesService } from "@/services/notesService";

export default function Note() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUris, setImageUris] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const note = await notesService.getNote(id);
          setTitle(note.title);
          setContent(note.content);
          setImageUris(note.imageUris);
        } catch (error) {
          console.error("Failed to get note: ", error);
        }
      })();
    }, [id],
    )
  );

  const handleSaveButtonPress = async () => {
    try {
      await notesService.updateNote(id, { title, content, imageUris });
    } catch (error) {
      console.error("Failed to save note: ", error);
    }
  };

  const handleAddImages = () => {
    try {
      const file = new File(Paths.cache, "example.txt");
      file.create();
      file.write("Helloe");

      const destUri = notesService.addImageToNote("a-1", file.uri);
      console.log("Image: ", destUri);
    } catch (error) {
      console.error("Image error: ", error);
    }
  };

  return (
    <>
      <Stack.Screen options={{
        headerRight: () => (
          <Pressable onPress={handleSaveButtonPress}>
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
            <Pressable key="add-image" style={[styles.imageThumb, styles.addImageButton]} onPress={handleAddImages}>
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

