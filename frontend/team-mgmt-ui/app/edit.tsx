import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import RadioButton from "../components/RadioButton";

export default function EditPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("regular");
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { styles } = useStyles(stylesheet);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    fetchTeamMember();
  }, []);

  const fetchTeamMember = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/team-members/${id}/`);
      const data = await response.json();
      setFirstName(data.first_name);
      setLastName(data.last_name);
      setPhoneNumber(data.phone_number);
      setEmail(data.email);
      setRole(data.role);
    } catch (error) {
      console.error("Error fetching team member:", error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/team-members/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          email,
          role,
        }),
      });

      if (response.ok) {
        router.replace("/");
      } else {
        console.error("Error updating team member");
      }
    } catch (error) {
      console.error("Error updating team member:", error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Team Member",
      "Are you sure you want to delete this team member?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: confirmDelete },
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/team-members/${id}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.replace("/");
      } else {
        console.error("Error deleting team member");
      }
    } catch (error) {
      console.error("Error deleting team member:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit team member</Text>
      <Text style={styles.subtitle}>Edit contact info, location and role.</Text>

      <Text style={styles.sectionTitle}>Info</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <Text style={styles.sectionTitle}>Role</Text>
      <View style={styles.radioGroup}>
        <RadioButton
          label="Regular - Can't delete members"
          value="regular"
          selectedValue={role}
          onSelect={setRole}
        />
        <RadioButton
          label="Admin - Can delete members"
          value="admin"
          selectedValue={role}
          onSelect={setRole}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const stylesheet = createStyleSheet({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
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
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  deleteButtonText: {
    color: "#FF3B30",
    fontSize: 18,
    fontWeight: "bold",
  },
});
