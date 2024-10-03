import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { api } from "@/api/api";

export function AddUserForm() {
  const [newUser, setNewUser] = useState({
    fullName: "",
    geres: 0,
    admin: false,
    email: "",
    cargo: "",
    setor: "",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: type === "checkbox" ? e.target.checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/users", newUser);
      console.log(response);

      // Exibindo uma mensagem de sucesso
      setSuccessMessage(
        `Usuário ${newUser.fullName} foi adicionado com sucesso!`
      );

      // Limpando os campos
      setNewUser({
        fullName: "",
        geres: 0,
        admin: false,
        email: "",
        cargo: "",
        setor: "",
      });
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
    }
  };

  return (
    <Card className="shadow-md rounded-lg p-4 mb-6 ">
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
          <Input
            type="number"
            name="geres"
            min={1}
            max={12}
            placeholder="GERES"
            value={newUser.geres}
            onChange={handleInputChange}
            required
          />
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
          >
            Criar Usuário
          </Button>
        </form>

        {/* Mensagem de sucesso */}
        {successMessage && (
          <div className="mt-4 text-green-500">{successMessage}</div>
        )}
      </CardContent>
    </Card>
  );
}
