// src/components/appComp/PrivacyTermsModal.tsx
import React from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "../ui/dialog";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyTermsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Política de Privacidade e Termos de Uso
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            É de extrema importância que todos os dados fornecidos sejam
            verdadeiros e precisos para o monitoramento estratégico. Informações
            incorretas podem prejudicar a tomada de decisões.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Política de Privacidade</h3>
            <p className="text-gray-500">
              Os dados fornecidos serão usados exclusivamente para monitoramento
              estratégico. Garantimos a segurança das informações conforme as
              leis de proteção de dados aplicáveis.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Termos de Uso</h3>
            <p className="text-gray-500">
              Ao utilizar este sistema, você concorda em fornecer informações
              verdadeiras. O uso de dados falsos pode resultar em sanções.
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button className="px-6 py-2" onClick={onClose}>
            Aceitar e Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyTermsModal;
