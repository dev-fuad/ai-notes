import { View, Text, StyleSheet } from "react-native";
import { Note } from "../types/note";
import Pressable from "./ui/pressable";
import { dimensions } from "../constants/dimensions";
import { colors } from "../constants/theme";
import { Image } from "expo-image";

type NotesItemProp = {
  note: Note;
  onPress: (id: string) => void;
  onLongPress?: (id: string) => void;
};

export default function NotesItem({ note, onPress }: NotesItemProp) {
  return (
    <Pressable style={styles.card} onPress={() => onPress(note.id)}>
      {/* title */}
      <Text style={styles.cardTitle}>Note {note.title}</Text>

      {/* Images */}
      {note.imageUris.length > 0 && (
        <View style={styles.cardImageRow}>
          {note.imageUris.map((uri) => (
            <View key={uri} style={styles.cardImageWrapper}>
              <Image source={{ uri }} style={styles.cardImageThumb} />
            </View>
          ))}
        </View>
      )}

      {/* Content Preview */}
      <Text numberOfLines={1} style={styles.cardContent}>{note.content}</Text>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <Text style={styles.cardTimestamp}>
          {new Date(note.updatedAt).toLocaleString()}
        </Text>

        {note.similarity && (
          <Text style={styles.cardSimilarity}>
            {note.similarity.toFixed(2)}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: dimensions.l,
    borderRadius: dimensions.l,
    gap: dimensions.m,

    backgroundColor: colors.surface,
  },
  cardTitle: {
    fontSize: dimensions.xl,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  cardContent: {
    color: colors.textSecondary,
  },
  cardImageRow: {
    flexDirection: "row",
    gap: dimensions.s,
  },
  cardImageWrapper: {
    height: 60,
    width: 60,
    borderRadius: dimensions.m,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  cardImageThumb: {
    width: "100%",
    height: "100%",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTimestamp: {
    color: colors.textSecondary,
    fontSize: dimensions.l,
  },
  cardSimilarity: {
    fontSize: dimensions.l,
    fontWeight: "600",
  },
});

