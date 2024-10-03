import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as api from "../services/api";

interface AuthContextData {
  user: any;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
  //   signUp: (username: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<any>(null);

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        const isValid = await api.verifyToken(token);
        if (isValid) {
          // TODO: fetch user data
          setUser({
            /* user data */
          });
          return true;
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
    setUser(null);
    return false;
  }, []);

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
    <AuthContext.Provider value={{ user, signIn, signOut, checkAuthStatus }}>
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
