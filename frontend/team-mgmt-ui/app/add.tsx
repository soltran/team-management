import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import RadioButton from "../components/RadioButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { createTeamMember } from "../src/services/api";
import { z } from "zod";

const teamMemberSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone_number: z.string().min(10, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["regular", "admin"]),
});

export default function AddPage() {
  const [teamMember, setTeamMember] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    role: "regular" as "regular" | "admin",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const { styles } = useStyles(stylesheet);

  const handleInputChange = (field: keyof typeof teamMember, value: string) => {
    setTeamMember((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSave = async () => {
    try {
      const validatedData = teamMemberSchema.parse(teamMember);
      await createTeamMember(validatedData);
      router.replace("/");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      } else {
        console.error("Error adding team member:", error);
        Alert.alert("Error", "Failed to add team member");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Add a team member</Text>
        <Text style={styles.subtitle}>Set email, location and role.</Text>

        <Text style={styles.sectionTitle}>Info</Text>
        {["first_name", "last_name", "email", "phone_number"].map((field) => (
          <View key={field}>
            <TextInput
              style={styles.input}
              placeholder={field
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
              value={teamMember[field as keyof typeof teamMember]}
              onChangeText={(value) =>
                handleInputChange(field as keyof typeof teamMember, value)
              }
              keyboardType={
                field === "email"
                  ? "email-address"
                  : field === "phone_number"
                  ? "phone-pad"
                  : "default"
              }
            />
            {errors[field] && (
              <Text style={styles.errorText}>{errors[field]}</Text>
            )}
          </View>
        ))}

        <Text style={styles.sectionTitle}>Role</Text>
        <View style={styles.radioGroup}>
          {["regular", "admin"].map((roleOption) => (
            <RadioButton
              key={roleOption}
              label={`${
                roleOption.charAt(0).toUpperCase() + roleOption.slice(1)
              } - ${
                roleOption === "regular"
                  ? "Can't delete members"
                  : "Can delete members"
              }`}
              value={roleOption}
              selectedValue={teamMember.role}
              onSelect={(value) => handleInputChange("role", value)}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const stylesheet = createStyleSheet({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: "white",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
  },
  radioGroup: {
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
