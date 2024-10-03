import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = await AsyncStorage.getItem("accessToken");
  const headers = new Headers(options.headers);
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  headers.append("Content-Type", "application/json");

  return fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });
}

export const login = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/api/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  await AsyncStorage.setItem("accessToken", data.access);
  await AsyncStorage.setItem("refreshToken", data.refresh);
  return data;
};

export const refreshToken = async () => {
  const refreshToken = await AsyncStorage.getItem("refreshToken");
  const response = await fetch(`${API_URL}/api/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  const data = await response.json();
  await AsyncStorage.setItem("accessToken", data.access);
  return data;
};

export const fetchTeamMembers = async () => {
  const response = await fetchWithAuth("/api/team-members/");
  return response.json();
};

export const fetchTeamMember = async (id: string) => {
  const response = await fetchWithAuth(`/api/team-members/${id}/`);
  if (!response.ok) {
    throw new Error("Failed to fetch team member");
  }
  return response.json();
};

export const updateTeamMember = async (id: string, data: any) => {
  const response = await fetchWithAuth(`/api/team-members/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update team member");
  }
  return response.json();
};

export const deleteTeamMember = async (id: string) => {
  const response = await fetchWithAuth(`/api/team-members/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete team member");
  }
};

export const createTeamMember = async (data: any) => {
  const response = await fetchWithAuth("/api/team-members/", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create team member");
  }
  return response.json();
};
