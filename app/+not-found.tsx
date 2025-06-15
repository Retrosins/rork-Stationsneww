import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View, Platform } from "react-native";
import DefaultColors from "@/constants/colors";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Page Not Found" }} />
      <View style={styles.container}>
        <Text style={styles.emoji}>😕</Text>
        <Text style={styles.title}>This page doesn't exist</Text>
        <Text style={styles.subtitle}>
          The page you're looking for couldn't be found or has been moved.
        </Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: DefaultColors.background,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: DefaultColors.text,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: DefaultColors.gray[600],
    textAlign: "center",
    marginBottom: 30,
    maxWidth: 300,
  },
  link: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: DefaultColors.primary,
    borderRadius: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  linkText: {
    fontSize: 16,
    fontWeight: "500",
    color: DefaultColors.white,
  },
});