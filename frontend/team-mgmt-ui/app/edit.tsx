import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import RadioButton from "../components/RadioButton";
import Toast from "../components/Toast";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  fetchTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../src/services/api";
import { z } from "zod";
import { useAuth } from "../src/contexts/AuthContext";

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
  const { user } = useAuth();
  const isOwnProfile = user?.id === id;
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    fetchTeamMemberData();
  }, []);

  const fetchTeamMemberData = useCallback(async () => {
    try {
      const data = await fetchTeamMember(id as string);
      setTeamMember(data);
    } catch (error) {
      console.error("Error fetching team member:", error);
      showToast("Failed to fetch team member data");
    }
  }, [id, user]);

  const handleInputChange = (field: keyof typeof teamMember, value: string) => {
    if (canEdit) {
      setTeamMember((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  }, []);

  const hideToast = useCallback(() => {
    setToastVisible(false);
  }, []);

  const handleSave = async () => {
    try {
      const validatedData = teamMemberSchema.parse(teamMember);
      await updateTeamMember(id as string, validatedData);
      showToast("Team member updated successfully");
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
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        showToast(`Failed to update team member: ${errorMessage}`);
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

  const canEdit =
    user?.role === "company_admin" ||
    user?.role === "superuser" ||
    isOwnProfile;
  const canDelete =
    user?.role === "company_admin" || user?.role === "superuser";
  const canToggleRole =
    user?.role === "company_admin" || user?.role === "superuser";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Edit team member</Text>
          {isOwnProfile && (
            <View style={styles.ownProfileBadge}>
              <Text style={styles.ownProfileBadgeText}>Your Profile</Text>
            </View>
          )}
        </View>
        <Text style={styles.subtitle}>
          Edit contact info, location and role.
        </Text>

        <Text style={styles.sectionTitle}>Info</Text>
        {["first_name", "last_name", "email", "phone_number"].map((field) => (
          <View key={field}>
            <TextInput
              style={[
                styles.input(!!errors[field]),
                !canEdit && styles.disabledInput,
              ]}
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
              editable={canEdit}
            />
            {errors[field] && (
              <Text style={styles.fieldErrorText}>{errors[field]}</Text>
            )}
          </View>
        ))}

        {canToggleRole && (
          <>
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
          </>
        )}

        {canEdit && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        )}

        {canDelete && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        )}

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
      <Toast
        message={toastMessage}
        isVisible={toastVisible}
        onHide={hideToast}
      />
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 10,
  },
  ownProfileBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ownProfileBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
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
  input: (hasError: boolean) => ({
    height: 40,
    borderWidth: 1,
    borderColor: hasError ? "#B71C1C" : "#cccccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "white",
  }),
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#999",
  },
  fieldErrorText: {
    color: "#B71C1C",
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
  serverErrorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  errorContainer: {
    backgroundColor: "#FFEBEE",
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
});
