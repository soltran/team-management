import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as api from "../services/api";

interface AuthContextData {
  user: any;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  //   signUp: (username: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadStoredData();
  }, []);

  async function loadStoredData() {
    const storedUser = await AsyncStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }

  async function signIn(username: string, password: string) {
    const response = await api.login(username, password);
    console.log("user", response);
    setUser(response);
    await AsyncStorage.setItem("user", JSON.stringify(response));
  }

  async function signOut() {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    setUser(null);
  }

  // TODO: implement sign up
  //   async function signUp(username: string, email: string, password: string) {
  //     await api.register(username, email, password);
  //   }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
