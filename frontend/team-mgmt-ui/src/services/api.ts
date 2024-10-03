import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface TokenResponse {
  access: string;
  refresh: string;
}

async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await AsyncStorage.getItem("accessToken");
  const headers = new Headers(options.headers);
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  headers.append("Content-Type", "application/json");

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token might be expired, try to refresh
    const newToken = await refreshToken();
    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`);
      return fetch(`${API_URL}${url}`, {
        ...options,
        headers,
      });
    }
  }

  return response;
}

export const login = async (
  username: string,
  password: string
): Promise<TokenResponse> => {
  const response = await fetch(`${API_URL}/api/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error("Login failed");
  }
  const data: TokenResponse = await response.json();
  await AsyncStorage.setItem("accessToken", data.access);
  await AsyncStorage.setItem("refreshToken", data.refresh);
  return data;
};

export const refreshToken = async (): Promise<string | null> => {
  const refreshToken = await AsyncStorage.getItem("refreshToken");
  if (!refreshToken) {
    return null;
  }
  try {
    const response = await fetch(`${API_URL}/api/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!response.ok) {
      throw new Error("Token refresh failed");
    }
    const data: TokenResponse = await response.json();
    await AsyncStorage.setItem("accessToken", data.access);
    return data.access;
  } catch (error) {
    console.error("Error refreshing token:", error);
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    return null;
  }
};

export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api/token/verify/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    return response.ok;
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
};

export const fetchTeamMembers = async () => {
  const response = await fetchWithAuth("/api/team-members/");
  if (!response.ok) {
    throw new Error("Failed to fetch team members");
  }
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
