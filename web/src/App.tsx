// src/App.jsx
import { useAuth } from "./hooks/auth/useAuth";
import AuthForm from "./components/appComp/AuthForm";
import DataForm from "./components/appComp/DataForm";
import Instructions from "./components/appComp/Instructions";
import Container from "./components/appComp/Container";
import Header from "./components/appComp/Header";

const App = () => {
  const { signed } = useAuth();
  const userName = "João";

  return (
    <Container>
      {signed ? (
        <div className="flex flex-col justify-center w-full items-center">
          <Header name={userName} />
          <DataForm />
        </div>
      ) : (
        <div className="h-full w-full">
          <div className="bg-slate-50 p-5 flex gap-5 w-full text-center">
            <img className="w-40 ms-24" src="gpr_logo.png" alt="" />
            <img className="w-40" src="gpr_logo.png" alt="" />
            <img className="w-40" src="gpr_logo.png" alt="" />
          </div>
          <div className="w-full h-full grid md:grid-cols-2 gap-6 bg-blue-400">
            <div className="flex justify-center items-center ">
              <AuthForm />
            </div>
            <Instructions />
          </div>
        </div>
      )}
    </Container>
  );
};

export default App;
