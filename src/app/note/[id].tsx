import { File, Paths } from "expo-file-system";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
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

  const handleAddImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission required',
        'Photo library permission is needed to pick images.',
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      selectionLimit: 1,
      quality: 1,
    });
    if (result.canceled) return;

    try {
      const destUri = await notesService.addImageToNote(id, result.assets[0].uri);
      const newImageUris = [...imageUris, destUri];
      setImageUris(newImageUris);
    } catch (e) {
      console.error('Failed to add image to note', e);
    }
  };

  const handleRemoveImage = (uri: string) => {
    Alert.alert(
      "Remove image?",
      "This will remove the image from this note.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            const filteredImageUris = imageUris.filter(u => u !== uri);
            setImageUris(filteredImageUris);
          }
        },
      ]
    );
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
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainerContent}
            showsHorizontalScrollIndicator={false}>
            {imageUris.map((uri) => (
              <Pressable key={uri} onLongPress={() => handleRemoveImage(uri)}>
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
  imageScrollContainerContent: {
    gap: dimensions.m,
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

