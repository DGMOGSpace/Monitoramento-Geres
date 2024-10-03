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
    <div className="flex flex-col items-center justify-center py-6 rounded bg-white ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3  max-w-5xl">
        {totalGerencias.map((geres) => {
          const geresInfo = geresData.find((data) => data.geres === geres);
          const lastReply = geresInfo ? geresInfo.lastReply : null;
          const fullName = geresInfo ? geresInfo.fullName : "Não disponível";
          const cardClass = getCardClassName(lastReply || "");

          return (
            <div key={geres} className={`p-4 rounded-lg shadow-md transition-transform transform ${cardClass}`}>
              <h2 className="text-xl font-semibold text-gray-800">GERES {geres}</h2>
              <p className="text-md text-gray-600">
                Última Data de Envio: {lastReply ? new Date(lastReply).toLocaleString() : "Não disponível"}
              </p>
              <p className="text-sm text-gray-500">Usuário: {fullName}</p>
              {cardClass === "bg-red-100" && (
                <button
                  onClick={() => handleSendAlert(geres)}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200"
                >
                  Enviar Alerta
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
