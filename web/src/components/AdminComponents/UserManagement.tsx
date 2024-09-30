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
interface UserData {
  fullName: string;
  email: string;
  geres: number;
}

export function UserManagement() {
  const [userData, setUserData] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get("/users");
      setUserData(response.data);
    };
    fetchData();
  }, []);

  return (
    <Card className="shadow-md rounded-lg p-4 mb-6">
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {userData.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.geres}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
