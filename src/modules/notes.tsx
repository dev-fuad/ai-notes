import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import FAB from "@/components/fab";
import NotesItem from "@/components/NotesItem";
import { dimensions } from "@/constants/dimensions";
import { colors } from "@/constants/theme";
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

  const onPressNote = (id: string) =>
    router.push({ pathname: "/note/[id]", params: { id } });

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotesItem note={item} onPress={onPressNote} />}
        ItemSeparatorComponent={<View style={styles.separator} />}
      />
      <FAB />
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
