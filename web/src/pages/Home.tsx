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
      <div className="flex flex-col bg-gradient-to-r from-white py-52">
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
        <div className="flex flex-col items-center mt-12">
          <h1 className="text-3xl font-semibold text-blue-400 bg-gray-50 px-5 py-1 rounded-lg mb-4">
            Apresentação
          </h1>
          <div className="w-full md:w-3/4 lg:w-1/2 rounded-lg shadow-lg overflow-hidden">
            <iframe
              className="w-full h-64 md:h-80 rounded-lg"
              src="https://www.youtube.com/embed/SEU_VIDEO_ID"
              title="Apresentação do Sistema"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

