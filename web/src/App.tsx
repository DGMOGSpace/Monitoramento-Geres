// src/App.tsx
import { useState, useEffect } from "react";
import { useAuth } from "./hooks/auth/useAuth";
import AuthForm from "./components/appComp/AuthForm";
import DataForm from "./components/appComp/DataForm";
import Container from "./components/appComp/Container";
import Header from "./components/appComp/Header";
import LoadingScreen from "./components/appComp/LoadingScreen";
import { Footer } from "./components/appComp/Footer";
import PrivacyTermsModal from "./components/appComp/PrivacyTermsModal";

const App = () => {
  const { signed } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(!signed);

  useEffect(() => {
    setIsModalOpen(!signed);
  }, [signed]);

  return (
    <Container>
      {loading ? (
        <LoadingScreen />
      ) : signed ? (
        <div
          className="flex flex-col items-center justify-center w-full"
          style={{ backgroundImage: "url('bg_blue_home.png')" }}
        >
          <Header />
          <DataForm />
          <PrivacyTermsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)} // Fecha o modal
          />
        </div>
      ) : (
        <div
          className="h-full w-full flex flex-col bg-cover bg-center"
          style={{ backgroundImage: "url('bg_blue_home.png')" }}
        >
          <div className="flex flex-col bg-gradient-to-r from-white h-screen">
            <div className="grid md:grid-cols-2 gap-6 flex-grow  ">
              <div className="flex justify-center flex-col items-start md:ml-14">
                <img
                  className="md:block w-96"
                  src="gpr_logo.png"
                  alt="Ilustração relacionada a dados"
                />
                <p className="text-xl md:text-base font-medium text-start text-gray-700 mt-6 md:mt-8">
                  Você terá acesso ao nosso sistema de acompanhamento e gestão
                  de resultados, permitindo inserir os indicadores a serem
                  acompanhados pela Secretaria Estadual de Saúde de Pernambuco.
                </p>
              </div>
              <div className="flex justify-center items-center">
                <AuthForm setLoading={setLoading} />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </Container>
  );
};

export default App;
