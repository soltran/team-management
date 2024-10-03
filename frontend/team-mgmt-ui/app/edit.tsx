import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import RadioButton from "../components/RadioButton";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  fetchTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../src/services/api";
import { z } from "zod";

const teamMemberSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone_number: z.string().min(10, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["regular", "admin"]),
});

export default function EditPage() {
  const [teamMember, setTeamMember] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    role: "regular" as "regular" | "admin",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { styles } = useStyles(stylesheet);

  useEffect(() => {
    fetchTeamMemberData();
  }, []);

  const fetchTeamMemberData = useCallback(async () => {
    try {
      const data = await fetchTeamMember(id as string);
      setTeamMember(data);
    } catch (error) {
      console.error("Error fetching team member:", error);
      Alert.alert("Error", "Failed to fetch team member data");
    }
  }, [id]);

  const handleInputChange = (field: keyof typeof teamMember, value: string) => {
    setTeamMember((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSave = async () => {
    try {
      const validatedData = teamMemberSchema.parse(teamMember);
      await updateTeamMember(id as string, validatedData);
      router.replace("/");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      } else {
        console.error("Error updating team member:", error);
        Alert.alert("Error", "Failed to update team member");
      }
    }
  };

  const handleDelete = () => {
    if (Platform.OS === "web") {
      setIsDeleteModalVisible(true);
    } else {
      Alert.alert(
        "Delete Team Member",
        "Are you sure you want to delete this team member?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: confirmDelete },
        ]
      );
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteTeamMember(id as string);
      router.replace("/");
    } catch (error) {
      console.error("Error deleting team member:", error);
      if (Platform.OS === "web") {
        alert("Failed to delete team member");
      } else {
        Alert.alert("Error", "Failed to delete team member");
      }
    } finally {
      setIsDeleteModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Edit team member</Text>
        <Text style={styles.subtitle}>
          Edit contact info, location and role.
        </Text>

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

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>

        {Platform.OS === "web" && (
          <Modal
            visible={isDeleteModalVisible}
            transparent={true}
            animationType="fade"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  Are you sure you want to delete this team member?
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setIsDeleteModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.deleteButton]}
                    onPress={confirmDelete}
                  >
                    <Text style={styles.modalButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
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
  deleteButton: {
    backgroundColor: "red",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    color: "#666",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    marginTop: 16,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
