import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import PrivacyTermsModal from "./PrivacyTermsModal";
import { Link } from "react-router-dom";

export function Footer() {
  const { signed } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(!signed);

  useEffect(() => {
    setIsModalOpen(!signed);
  }, [signed]);

  return (
    <footer
      className={cn(
        "flex flex-col items-center gap-8 p-8",
        "bg-gradient-to-b from-slate-100 to-slate-50 shadow-lg border-t border-slate-300",
        "md:px-16 md:py-12 text-gray-700"
      )}
    >
      <div className="w-full border-t border-gray-300"></div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-8 items-center">
          <img
            className="w-28 md:w-40 transform hover:scale-105 transition-transform duration-300"
            src="logo_dgmog.png"
            alt="Logo da DGMOG"
          />
          <img
            className="w-28 md:w-40 transform hover:scale-105 transition-transform duration-300"
            src="logo_gov.png"
            alt="Logo do Governo"
          />
        </div>
        <p className="text-lg md:text-xl font-semibold text-gray-600 mt-4">
          Secretaria de Saúde do Estado de Pernambuco
        </p>
      </div>

      <div className="text-center text-sm md:text-base">
        <p>Diretoria Geral de Monitoramento e Gestão Estratégica</p>
        <p>© {new Date().getFullYear()} Governo de Pernambuco</p>
      </div>

      <div className="flex gap-6 mt-4">
        <p className="text-slate-500 hover:text-slate-700 transition-colors duration-200">
          Política de Privacidade e Termos de Uso
        </p>
        <PrivacyTermsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)} // Fecha o modal
        />
        <Link className="text-slate-500 hover:text-slate-700 transition-colors duration-200" to="/Admin">Área Administrador</Link>
      </div>
    </footer>
  );
}
