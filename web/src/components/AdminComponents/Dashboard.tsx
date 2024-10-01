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

interface GeresData {
  geres: string;
  date: string;
  user: string;
}

export function Dashboard() {
  const [geresData, setGeresData] = useState<GeresData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get("/geres-data");
      setGeresData(response.data);
    };
    fetchData();
  }, []);

  return (
    <Card className="shadow-md rounded-lg p-4 mb-6 h-5/6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Últimos Envio de Dados por GERES
        </CardTitle>
        <CardDescription className="text-gray-600">
          Veja as últimas atualizações de dados para cada GERES.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>GERES</TableHead>
              <TableHead>Última Data de Envio</TableHead>
              <TableHead>Usuário</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {geresData.map((data, index) => (
              <TableRow key={index}>
                <TableCell>{data.geres}</TableCell>
                <TableCell>{data.date}</TableCell>
                <TableCell>{data.user}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
