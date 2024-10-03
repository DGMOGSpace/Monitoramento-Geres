import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth/useAuth";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const AuthForm = ({
  setLoading,
}: {
  setLoading: (loading: boolean) => void;
}) => {
  const dadosRenan = {
    email: "renan@gmail.com",
    ramal: "84567",
  };
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Sucesso

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      setSuccessMessage("Usuário cadastrado e senha registrada.");
    } catch (error) {
      setError("Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-black text-blue-500 text-center">LOGIN</h2>
        <Input
          className="border border-gray-300 rounded-md p-2"
          placeholder="Email"
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
          className="mt-4 bg-blue-400 text-white hover:bg-blue-600 transition-colors"
        >
          Entrar
        </Button>
        {error && <span className="text-red-500">{error}</span>}
        {successMessage && (
          <span className="text-green-500">{successMessage}</span>
        )}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <span className="mt-4 text-blue-500 cursor-pointer">
            Solicitar acesso
          </span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar Acesso</DialogTitle>
            <DialogDescription>
              Entre em contato com Renan para se identificar e solicitar acesso:
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col space-y-3">
            <div className="flex items-center">
              <span className="font-semibold text-gray-700">Email:</span>
              <a
                href={`mailto:${dadosRenan.email}`}
                className="ml-2 text-blue-600 font-bold hover:underline"
              >
                {dadosRenan.email}
              </a>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-gray-700">Ramal:</span>
              <span className="ml-2 text-gray-800">{dadosRenan.ramal}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuthForm;
