import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, FlatList, View, StyleSheet } from "react-native";
import FAB from "@/components/fab";
import NotesItem from "@/components/NotesItem";
import { dimensions } from "@/constants/dimensions";
import { colors } from "@/constants/theme";
import { notesService } from "@/services/notesService";
import { Note } from "@/types/note";

const DummyNote: Note = {
  id: 'a-1',
  title: 'First Note',
  content: 'Lorem ipsum dolor sit amet.',
  imageUris: [],
  updatedAt: new Date("2025-11-11 16:18:00").getTime(),
};

export default function Notes() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([DummyNote]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const storageNotes = await notesService.getNotes();
          setNotes(storageNotes);
        } catch (e) {
          console.error('Failed to list notes', e);
        }
      })();
    }, [])
  );

  const handleAddNote = async () => {
    try {
      const note = await notesService.createNote('', '', []);
      router.push({ pathname: '/note/[id]', params: { id: note.id } });
    } catch (e) {
      console.error('Failed to add note', e);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    Alert.alert(
      "Delete note?",
      "This operation cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await notesService.deleteNote(noteId);
            } catch (e) {
              console.error('Failed to delete note', e);
            }
            setNotes(prev => prev ? prev.filter(n => n.id !== noteId) : prev);
          },
        },
      ]
    );
  };

  const onPressNote = (id: string) =>
    router.push({ pathname: "/note/[id]", params: { id } });

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={
          ({ item }) =>
            <NotesItem note={item} onPress={onPressNote} onLongPress={handleDeleteNote} />
        }
        ItemSeparatorComponent={<View style={styles.separator} />}
      />
      <FAB onPress={handleAddNote} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    margin: dimensions.m,
  },
  separator: {
    height: dimensions.s,
  },
});
