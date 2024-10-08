import React, { useEffect, useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  createStyleSheet,
  UnistylesRuntime,
  useInitialTheme,
  useStyles,
} from "react-native-unistyles";
import "../unistyles";
import { useAuth } from "../src/contexts/AuthContext";
import * as api from "../src/services/api";
import { SafeAreaView } from "react-native-safe-area-context";

interface TeamMember {
  id: number;
  first_name: string;
  last_name: string;
  role: string;
  email: string;
  phone_number: string;
}

export default function ListPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useInitialTheme(UnistylesRuntime.colorScheme === "dark" ? "dark" : "light");

  const { styles } = useStyles(stylesheet);
  const { user, signOut, checkAuthStatus } = useAuth();

  const fetchTeamMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.fetchTeamMembers();
      setTeamMembers(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching team members:", error);
      setError("Failed to fetch team members. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const isAuthenticated = await checkAuthStatus();
      if (isAuthenticated) {
        fetchTeamMembers();
      } else {
        router.replace("/login");
      }
    };

    initializeAuth();
  }, [checkAuthStatus, fetchTeamMembers, router]);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  const renderItem = useCallback(
    ({ item }: { item: TeamMember }) => (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          router.push({ pathname: "/edit", params: { id: item.id } })
        }
      >
        <Image
          source={{
            uri: `https://avatar.iran.liara.run/public/boy?username=${item.first_name}`,
          }}
          style={styles.avatar}
        />
        <View style={styles.itemContent}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>
              {item.first_name} {item.last_name}
              {item.role === "admin" && (
                <Text style={styles.admin}> (admin)</Text>
              )}
            </Text>
            {user?.id === item.id.toString() && (
              <View style={styles.ownProfileBadge}>
                <Text style={styles.ownProfileBadgeText}>You</Text>
              </View>
            )}
          </View>
          <Text style={styles.contactInfo}>{item.phone_number}</Text>
          <Text style={styles.contactInfo}>{item.email}</Text>
        </View>
      </TouchableOpacity>
    ),
    [styles, router, user]
  );

  if (isLoading) {
    return <Text style={styles.message}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.message}>{error}</Text>;
  }

  const showAddButton =
    user?.role === "company_admin" || user?.role === "superuser";

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Team members</Text>
      <Text style={styles.subtitle}>
        You have {teamMembers.length} team members.
      </Text>
      <FlatList
        data={teamMembers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />
      {showAddButton && (
        <Link href="/add" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </Link>
      )}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  item: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  admin: {
    fontStyle: "italic",
    color: "#666",
  },
  contactInfo: {
    fontSize: 14,
    color: "#666",
  },
  addButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#007AFF",
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
  signOutButton: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 8,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  signOutText: {
    color: "white",
    fontWeight: "bold",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ownProfileBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  ownProfileBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
