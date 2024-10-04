import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { api } from "@/api/api";

export function AddUserForm() {
  const [newUser, setNewUser] = useState({
    fullName: "",
    geres: "",
    admin: false,
    email: "",
    cargo: "",
    setor: "",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Estado para controle de carregamento

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: type === "checkbox" ? e.target.checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true); // Inicia o carregamento

    try {
      const response = await api.post("/users", newUser);

      setSuccessMessage(
        `Usuário ${newUser.fullName} foi adicionado com sucesso!`
      );
      setNewUser({
        fullName: "",
        geres: "",
        admin: false,
        email: "",
        cargo: "",
        setor: "",
      });
    } catch (error: unknown) { 
      console.error("Erro ao adicionar usuário:", error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Erro ao adicionar usuário. Tente novamente.");
      }
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <Card className="shadow-md rounded-lg p-4 mb-6 h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Adicionar Novo Usuário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="fullName"
            placeholder="Nome Completo"
            value={newUser.fullName}
            onChange={handleInputChange}
            required
          />
          <Input
            type="text"
            name="cargo"
            placeholder="Cargo"
            value={newUser.cargo}
            onChange={handleInputChange}
            required
          />
          <Input
            type="text"
            name="setor"
            placeholder="Setor"
            value={newUser.setor}
            onChange={handleInputChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleInputChange}
            required
          />

          <Select
            value={newUser.geres}
            onValueChange={(value) => setNewUser({ ...newUser, geres: value })}
            required
          >
            <SelectTrigger className="w-80">
              <SelectValue placeholder="Selecione a GERES" />
            </SelectTrigger>
            <SelectContent className="absolute z-10 mt-1 w-80 h-48">
              <SelectItem value="1" className="py-2">
                I - Região Metropolitana do Recife
              </SelectItem>
              <SelectItem value="2" className="py-2">
                II - Agreste Setentrional
              </SelectItem>
              <SelectItem value="3" className="py-2">
                III - Agreste Meridional
              </SelectItem>
              <SelectItem value="4" className="py-2">
                IV - Zona da Mata
              </SelectItem>
              <SelectItem value="5" className="py-2">
                V - Sertão do Moxotó
              </SelectItem>
              <SelectItem value="6" className="py-2">
                VI - Sertão do Pajeú
              </SelectItem>
              <SelectItem value="7" className="py-2">
                VII - Sertão do Araripe
              </SelectItem>
              <SelectItem value="8" className="py-2">
                VIII - Vale do São Francisco
              </SelectItem>
              <SelectItem value="9" className="py-2">
                IX - Região do Agreste Central
              </SelectItem>
              <SelectItem value="10" className="py-2">
                X - Região da Mata Norte
              </SelectItem>
              <SelectItem value="11" className="py-2">
                XI - Região da Mata Sul
              </SelectItem>
              <SelectItem value="12" className="py-2">
                XII - Região do Sertão do São Francisco
              </SelectItem>
            </SelectContent>
          </Select>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="admin"
              checked={newUser.admin}
              onChange={handleInputChange}
            />
            <span className="ml-2">Administrador</span>
          </label>
          <Button
            type="submit"
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={loading} // Desabilita o botão enquanto carrega
          >
            {loading ? "Carregando..." : "Criar Usuário"}
          </Button>
        </form>

        {successMessage && !errorMessage && (
          <div className="mt-4 text-green-500">{successMessage}</div>
        )}
        {errorMessage && !successMessage && (
          <div className="mt-4 text-red-500">{errorMessage}</div>
        )}
      </CardContent>
    </Card>
  );
}
