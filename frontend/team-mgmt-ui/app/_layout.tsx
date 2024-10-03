import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "../src/contexts/AuthContext";

export default function Layout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Team Members" }} />
        {/* Add other screens here */}
      </Stack>
    </AuthProvider>
  );
}
