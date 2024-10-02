import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";

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
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
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
  button: {
    backgroundColor: "blue",
    padding: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
