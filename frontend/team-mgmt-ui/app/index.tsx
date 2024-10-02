import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface TeamMember {
  id: number;
  first_name: string;
  last_name: string;
  role: string;
}

export default function ListPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { styles } = useStyles(stylesheet);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/api/team-members/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTeamMembers(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching team members:", error);
      setError("Failed to fetch team members. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: TeamMember }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        router.push({ pathname: "/edit", params: { id: item.id } })
      }
    >
      <Text style={styles.name}>
        {item.first_name} {item.last_name}
        {item.role === "admin" && <Text style={styles.admin}> (Admin)</Text>}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <Text style={styles.message}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.message}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Total Team Members: {teamMembers.length}
      </Text>
      <FlatList
        data={teamMembers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Link href="/add" asChild>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const stylesheet = createStyleSheet({
  container: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  name: {
    fontSize: 16,
  },
  admin: {
    fontStyle: "italic",
    color: "#666",
  },
  addButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "blue",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
});
