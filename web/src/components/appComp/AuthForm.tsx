import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth/useAuth";

const AuthForm = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      console.log(email, password);
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
      <Input
        className="border border-gray-300 rounded-md p-2"
        placeholder="Nome"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        className="border border-gray-300 rounded-md p-2"
        placeholder="Senha"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        onClick={handleLogin}
        className="mt-4 bg-green-700 text-white hover:bg-green-600 transition-colors"
      >
        Entrar
      </Button>
    </div>
  );
};

export default AuthForm;
