// src/App.tsx
import { useState } from "react";
import { useAuth } from "./hooks/auth/useAuth";
import AuthForm from "./components/appComp/AuthForm";
import DataForm from "./components/appComp/DataForm";
import Container from "./components/appComp/Container";
import Header from "./components/appComp/Header";
import LoadingScreen from "./components/appComp/LoadingScreen";

const App = () => {
  const { signed } = useAuth();
  const userName = "João";
  const [loading, setLoading] = useState(false);

  return (
    <Container>
      {loading ? (
        <LoadingScreen />
      ) : signed ? (
        <div className="flex flex-col items-center justify-center w-full">
          <Header name={userName} />
          <DataForm />
        </div>
      ) : (
        <div
          className="h-full w-full flex flex-col bg-blue-400 bg-cover bg-center"
          style={{ backgroundImage: "url('bg_blue_home.png')" }}
        >
          

          <div className="grid md:grid-cols-2 gap-6 flex-grow bg-gradient-to-r from-white">
          <div className="flex justify-center items-center">
              <img
                className="md:block w-96"
                src="gpr_logo.png"
                alt="Ilustração relacionada a dados"
              />
            </div>
            <div className="flex justify-center items-center">
              <AuthForm setLoading={setLoading} />
            </div>
            
          </div>

          <footer className="flex justify-center items-center gap-5 bg-slate-50 p-4">
            <img
              className="w-28"
              src="logo_dgmog.png"
              alt="Logo da DGMOG"
            />
            <img
              className="w-28"
              src="logo_gov.png"
              alt="Logo do Governo"
            />
          </footer>
        </div>
      )}
    </Container>
  );
};

export default App;
