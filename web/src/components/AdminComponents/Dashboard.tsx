import { api } from "@/api/api";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GeresData {
  geres: number;
  lastReply: string;
  fullName?: string;
}

export function Dashboard() {
  const [geresData, setGeresData] = useState<GeresData[]>([]);

  const totalGerencias = Array.from({ length: 12 }, (_, i) => i + 1);

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

  const getCardClassName = (lastReply: string) => {
    const lastReplyDate = new Date(lastReply);
    const currentDate = new Date();

    if (
      lastReplyDate.getFullYear() === currentDate.getFullYear() &&
      lastReplyDate.getMonth() === currentDate.getMonth()
    ) {
      return "bg-green-100"; // Ativo
    }

    if (
      lastReplyDate.getFullYear() === currentDate.getFullYear() &&
      lastReplyDate.getMonth() === currentDate.getMonth() - 1
    ) {
      return "bg-red-100"; // Inativo
    }

    return "bg-gray-100"; // Não disponível
  };

  const handleSendAlert = async (geres: number) => {
    try {
      await api.post("/send-alert", { geres });
      alert(`Alerta enviado para a GERES ${geres}.`);
    } catch (error) {
      console.error("Erro ao enviar alerta:", error);
      alert("Erro ao enviar alerta.");
    }
  };

  return (
    <Card className="shadow-md rounded-lg p-4 mb-6 h-full">
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-full">
        {totalGerencias.map((geres) => {
          const geresInfo = geresData.find((data) => data.geres === geres);
          const lastReply = geresInfo ? geresInfo.lastReply : null;
          const fullName = geresInfo ? geresInfo.fullName : "Não disponível";
          const cardClass = getCardClassName(lastReply || "");

          return (
            <div key={geres} className="flex h-full">
              <Card className={`box-border flex-1 shadow-md ${cardClass}`}>
                <CardHeader className="p-2">
                  <CardTitle className="text-md font-semibold text-gray-800">
                    GERES {geres}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Última Data de Envio:{" "}
                    {lastReply
                      ? new Date(lastReply).toLocaleString()
                      : "Não disponível"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 h-3/6 flex flex-col justify-end">
                  <p className="text-xs text-gray-500">Usuário: {fullName}</p>
                  <Button
                    onClick={() => handleSendAlert(geres)}
                    className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-lg shadow hover:bg-blue-700 transition duration-200"
                  >
                    Enviar Alerta
                  </Button>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
