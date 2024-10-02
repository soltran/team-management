import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Team Members" }} />
      <Stack.Screen name="add" options={{ title: "Add Team Member" }} />
      <Stack.Screen name="edit" options={{ title: "Edit Team Member" }} />
    </Stack>
  );
}
