import { createContext, useState, ReactNode, useEffect } from "react";
import { api } from "@/api/api";
import { saveAuthData, clearAuthData, getAuthData } from "./AuthHelpers";
import UserInterface from "@/interfaces/UserInterface";
import { useToast } from "../use-toast";

interface AuthContextType {
  user: UserInterface | null;
  signed: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  token: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast(); 
  const [user, setUser] = useState<UserInterface | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const { user: savedUser, token: savedToken } = getAuthData();
    if (savedUser && savedToken) {
      setUser(savedUser);
      setToken(savedToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post("/login", { email, password });
      if (response.data.error) {
        toast({
          title: "Falha no Login",
          description: response.data.error,
          variant: "destructive",
        });
      } else {
        setUser(response.data.user);
        setToken(response.data.token);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
        saveAuthData(response.data.user, response.data.token);
        toast({
          title: "Sucesso",
          description: "Login realizado com sucesso!",
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Erro",
        description: "Falha ao tentar realizar o login. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    clearAuthData();
    delete api.defaults.headers.common["Authorization"];
    toast({
      title: "Logout",
      description: "Você foi desconectado.",
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, signed: !!user, signIn, signOut, token }}
    >
      {children}
    </AuthContext.Provider>
  );
};
