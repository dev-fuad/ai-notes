import { PressableProps as RNPressableProps, Pressable as RNPressable, StyleSheet } from "react-native";

export type PressableProps = RNPressableProps & {
  type?: 'opacity' | 'scale'; // Visual indicator
};

export default function Pressable({ type = "opacity", style, ...props }: PressableProps) {
  return <RNPressable {...props} style={(state) => [
    type === 'opacity' && state.pressed && styles.pressedOpacity,
    type === 'scale' && state.pressed && styles.pressedScale,
    typeof style === 'function' ? style(state) : style,
  ]} />
}

const styles = StyleSheet.create({
  pressedOpacity: { opacity: 0.4 },
  pressedScale: { transform: [{ scale: 0.6 }] },
});

