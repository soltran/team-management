import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";

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
      const response = await fetch(
        `http://your-api-url/api/team-members/${id}/`,
        {
          method: "DELETE",
        }
      );

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
    <View style={styles.container}>
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
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Picker
        selectedValue={role}
        style={styles.picker}
        onValueChange={(itemValue) => setRole(itemValue)}
      >
        <Picker.Item label="Regular" value="regular" />
        <Picker.Item label="Admin" value="admin" />
      </Picker>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const stylesheet = createStyleSheet({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  picker: {
    height: 40,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "blue",
    padding: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
