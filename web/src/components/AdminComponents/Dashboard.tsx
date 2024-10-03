import { api } from "@/api/api";
import { useState, useEffect } from "react";

interface GeresData {
  geres: number;
  lastReply: string;
  fullName?: string;
}

export function Dashboard() {
  const [geresData, setGeresData] = useState<GeresData[]>([]);
  
  const totalGerencias = Array.from({ length: 12 }, (_, i) => i + 1); // Cria um array de 1 a 12

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
      return "bg-green-100"; // Ativo
    }

    if (
      lastReplyDate.getFullYear() === currentDate.getFullYear() &&
      lastReplyDate.getMonth() === currentDate.getMonth() - 1
    ) {
      return "bg-red-100"; 
    }

    return "bg-gray-100"; 
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Últimos Envios de Dados por GERES</h1>
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {totalGerencias.map((geres) => {
            const geresInfo = geresData.find((data) => data.geres === geres);
            const lastReply = geresInfo ? geresInfo.lastReply : null;
            const fullName = geresInfo ? geresInfo.fullName : "Não disponível";
            const rowClass = getRowClassName(lastReply || "");

            return (
              <li key={geres} className={`flex justify-between items-center p-4 ${rowClass}`}>
                <div>
                  <h2 className="text-lg font-semibold">GERES {geres}</h2>
                  <p className="text-sm text-gray-600">
                    Última Data de Envio: {lastReply ? new Date(lastReply).toLocaleString() : "Não disponível"}
                  </p>
                  <p className="text-sm text-gray-600">Usuário: {fullName}</p>
                </div>
                {rowClass === "bg-red-100" && (
                  <button
                    onClick={() => handleSendAlert(geres)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
                  >
                    Enviar Alerta
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
