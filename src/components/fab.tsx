import { StyleSheet, Text } from "react-native";
import Pressable, { PressableProps } from "./ui/pressable";
import { dimensions } from "../constants/dimensions";
import { colors } from "../constants/theme";
import React from "react";

export type FABProps = PressableProps & {
  icon?: React.ReactNode;
};

export default function FAB({ icon = "＋", ...props }: FABProps) {
  return (
    <Pressable {...props} style={styles.fab}>
      {typeof icon === 'string' ? (
        <Text style={styles.fabIcon}>{icon}</Text>
      ) : (
        icon
      )}
    </Pressable>
  );
}

const FAB_SIZE = 70;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: dimensions.xxl,
    bottom: dimensions.xxxl,
    height: FAB_SIZE,
    width: FAB_SIZE,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: FAB_SIZE / 2,
    backgroundColor: colors.fabBackground,
  },
  fabIcon: {
    color: colors.fabIcon,
    fontSize: FAB_SIZE / 2,
    fontWeight: "bold",
  },
});

