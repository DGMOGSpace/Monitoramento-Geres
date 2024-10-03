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
import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Toggle } from "@/components/ui/toggle"; // Importe o toggle

interface UserData {
  id: number;
  fullName: string;
  email: string;
  geres: number;
  setor: string;
  active: boolean; // Adicione o campo active
}

const USERS_PER_PAGE = 5;

export function UserManagement() {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchEmail, setSearchEmail] = useState(""); // Estado para pesquisa

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get("/users");
      setUserData(response.data);
    };
    fetchData();
  }, []);

  const filteredUsers = userData.filter((user) =>
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

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
      await api.put(`/removeUsers/${userToDelete.id}`);
      setUserData((prevData) =>
        prevData.filter((user) => user.id !== userToDelete.id)
      );
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <>
      <Card className="shadow-md rounded-lg p-4 mb-6 overflow-y-scroll">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Gerenciamento de Usuários
          </CardTitle>
          <CardDescription className="text-gray-600">
            Administre os usuários do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <Input
              type="text"
              placeholder="Pesquisar por email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="mr-2"
            />
            <Toggle>Ativos</Toggle>
          </div>
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
              {currentUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className={!user.active ? "bg-gray-200" : ""}
                >
                  <TableCell>{user.geres}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Button
                      className="bg-blue-500 hover:bg-blue-700"
                      onClick={() => handleEditUser(user)}
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => {
                        setUserToDelete(user);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="ml-2 bg-red-600 text-white hover:bg-red-500"
                    >
                      Deletar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        <Pagination>
          <PaginationPrevious
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          />
          <PaginationContent>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => setCurrentPage(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
          <PaginationNext
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          />
        </Pagination>
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
                <p>Email: {userToDelete.email}</p>
              </div>
            </>
          )}
          <div className="flex justify-end mt-6">
            <Button
              onClick={handleDeleteUser}
              className="bg-red-600 text-white hover:bg-red-500"
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
