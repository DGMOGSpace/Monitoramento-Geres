import { useAuth } from "./hooks/auth/useAuth";
import AuthForm from "./components/appComp/AuthForm";
import DataForm from "./components/appComp/DataForm";
import Instructions from "./components/appComp/Instructions";
import Container from "./components/appComp/Container";

const App = () => {
  const signed = false;

  return (
    <Container>
      {signed ? (
        <DataForm />
      ) : (
        <div className="container h-full w-ful">
          <div className="p-5 shadow-2xl bg-white w-full text-center">
            <h1 className="text-5xl text-blue-400 font-bold ">
              Monitoramento - Geres
            </h1>
          </div>
          <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-400">
            <div className="flex justify-center items-center p-8">
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
