import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import RadioButton from "../components/RadioButton";

export default function AddPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("regular");
  const router = useRouter();
  const { styles } = useStyles(stylesheet);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const handleSave = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/team-members/`, {
        method: "POST",
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
        console.error("Error adding team member");
      }
    } catch (error) {
      console.error("Error adding team member:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add a team member</Text>
      <Text style={styles.subtitle}>Set email, location and role.</Text>

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
});
