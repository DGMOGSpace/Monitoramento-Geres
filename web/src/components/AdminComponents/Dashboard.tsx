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
  geres: number;
  lastReply: string;
  fullName?: string;
}

export function Dashboard() {
  const [geresData, setGeresData] = useState<GeresData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/geres-data");
        setGeresData(response.data);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };
    fetchData();
  }, []);

  const getRowClassName = (lastReply: string) => {
    const lastReplyDate = new Date(lastReply);
    const currentDate = new Date();

    if (
      lastReplyDate.getFullYear() === currentDate.getFullYear() &&
      lastReplyDate.getMonth() === currentDate.getMonth()
    ) {
      return "bg-green-100";
    }

    if (
      lastReplyDate.getFullYear() === currentDate.getFullYear() &&
      lastReplyDate.getMonth() === currentDate.getMonth() - 1
    ) {
      return "bg-red-100";
    }

    return "";
  };

  const handleSendAlert = async (geres: number) => {
    try {
      await api.post("/send-alert", { geres }); // Altere para a rota correta para enviar alertas
      alert(`Alerta enviado para a GERES ${geres}.`);
    } catch (error) {
      console.error("Erro ao enviar alerta:", error);
      alert("Erro ao enviar alerta.");
    }
  };

  return (
    <Card className="shadow-md rounded-lg p-4 mb-6 h-5/6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Últimos Envios de Dados por GERES
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
              <TableHead>Ações</TableHead> {/* Adicionando coluna de ações */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {geresData.map((data, index) => (
              <TableRow key={index} className={getRowClassName(data.lastReply)}>
                <TableCell>{data.geres}</TableCell>
                <TableCell>
                  {new Date(data.lastReply).toLocaleString()}
                </TableCell>
                <TableCell>{data.fullName || "Não disponível"}</TableCell>
                <TableCell>
                  {getRowClassName(data.lastReply) === "bg-red-100" && ( // Condicional para mostrar o botão
                    <button
                      onClick={() => handleSendAlert(data.geres)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Enviar Alerta
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
