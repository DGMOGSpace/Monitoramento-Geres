import { api } from "@/api/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";

interface UserData {
  id: number; // Adicione o ID do usuário
  fullName: string;
  email: string;
  geres: number;
  setor: string; // Adicionando o campo "setor"
}

export function UserManagement() {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get("/users");
      setUserData(response.data);
    };
    fetchData();
  }, []);

  const handleEditUser = (user: UserData) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (editingUser) {
      await api.put(`/users/${editingUser.id}`, editingUser);
      setUserData((prevData) =>
        prevData.map((user) =>
          user.id === editingUser.id ? editingUser : user
        )
      );
      setIsDialogOpen(false);
      setEditingUser(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingUser) {
      const { name, value } = e.target;
      setEditingUser({ ...editingUser, [name]: value });
    }
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      await api.delete(`/users/${userToDelete.id}`);
      setUserData((prevData) =>
        prevData.filter((user) => user.id !== userToDelete.id)
      );
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <>
      <Card className="shadow-md rounded-lg p-4 mb-6 h-5/6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Gerenciamento de Usuários
          </CardTitle>
          <CardDescription className="text-gray-600">
            Administre os usuários do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Geres</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.geres}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditUser(user)}>Editar</Button>
                    <Button
                      onClick={() => {
                        setUserToDelete(user);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="ml-2 bg-red-600 text-white hover:bg-red-700"
                    >
                      Deletar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para editar o usuário.
          </DialogDescription>

          {editingUser && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome:
                </label>
                <Input
                  type="text"
                  name="fullName"
                  value={editingUser.fullName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <Input
                  type="email"
                  name="email"
                  value={editingUser.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  GERES:
                </label>
                <Input
                  type="number"
                  name="geres"
                  value={editingUser.geres}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={handleSaveUser}>Salvar</Button>
                <Button onClick={() => setIsDialogOpen(false)} className="ml-2">
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>Deletar Usuário</DialogTitle>
          {userToDelete && (
            <>
              <DialogDescription>
                Tem certeza de que deseja deletar este usuário?
              </DialogDescription>
              <div className="mt-4">
                <p className="font-semibold">Nome: {userToDelete.fullName}</p>
                <p>Geres: {userToDelete.geres}</p>
                <p>Setor: {userToDelete.setor}</p>
              </div>
            </>
          )}
          <div className="flex justify-end mt-6">
            <Button
              onClick={handleDeleteUser}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Deletar
            </Button>
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              className="ml-2"
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
