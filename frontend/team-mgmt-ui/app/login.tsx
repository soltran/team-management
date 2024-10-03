import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../src/contexts/AuthContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Ionicons } from "@expo/vector-icons";
import { z } from "zod";

// Define the Zod schema for login form
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [form, setForm] = useState<LoginForm>({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const { signIn } = useAuth();
  const router = useRouter();
  const { styles } = useStyles(stylesheet);

  const handleChange = (field: keyof LoginForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLogin = async () => {
    try {
      // Validate form using Zod
      loginSchema.parse(form);
      setErrors({});

      setIsLoading(true);
      await signIn(form.username, form.password);
      router.replace("/");
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        const formattedErrors = error.errors.reduce((acc, curr) => {
          const field = curr.path[0] as keyof LoginForm;
          acc[field] = curr.message;
          return acc;
        }, {} as Partial<LoginForm>);
        setErrors(formattedErrors);
      } else {
        // Handle API errors
        console.error("Login failed:", error);
        setErrors({
          password: "Invalid username or password. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={24}
            color={styles.icon.color}
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={styles.placeholderText.color}
            value={form.username}
            onChangeText={handleChange("username")}
            autoCapitalize="none"
          />
        </View>
        {errors.username && (
          <Text style={styles.errorText}>{errors.username}</Text>
        )}
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={24}
            color={styles.icon.color}
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={styles.placeholderText.color}
            value={form.password}
            onChangeText={handleChange("password")}
            secureTextEntry
          />
        </View>
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={styles.buttonText.color} />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.typography,
    marginBottom: 32,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: theme.colors.typography,
    borderWidth: 1,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
  },
  icon: {
    padding: 10,
    color: theme.colors.typography,
  },
  input: {
    flex: 1,
    height: 50,
    color: theme.colors.typography,
    paddingHorizontal: 8,
  },
  placeholderText: {
    color: "gray",
  },
  button: {
    backgroundColor: theme.colors.background,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: {
    color: theme.colors.typography,
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 8,
    fontSize: 12,
  },
}));
