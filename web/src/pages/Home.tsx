import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from "../components/appComp/AuthForm";
import { Footer } from '../components/appComp/Footer';
import LoadingScreen from '../components/appComp/LoadingScreen';
import { useAuth } from '../hooks/auth/useAuth';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const { signed, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (signed) {
      if (user?.admin) {
        navigate('/admin');
      } else {
        navigate('/adicionar-dados');
      }
    }
  }, [signed, user, navigate]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div
      className="h-full w-full flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('bg_blue_home.png')" }}
    >
      <div className="flex h-full flex-col bg-gradient-to-r from-white py-72">
        <div className="grid md:grid-cols-2 gap-6 flex-grow mb-32">
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
  );
}

