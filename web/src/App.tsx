import { useState } from "react";
import {  Route, Routes, Navigate } from "react-router-dom";
import Container from "./components/appComp/Container";
import PrivacyTermsModal from "./components/appComp/PrivacyTermsModal";
import Home from "./pages/Home";
import { Admin } from "./pages/Admin";
import DataForm from "./components/appComp/DataForm";
import Header from "./components/appComp/Header";
import User from "./pages/User";
import { useAuth } from './hooks/auth/useAuth';

interface PrivateRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const { signed, user } = useAuth();

  if (!signed) {
    console.warn("Usuário não autenticado. Redirecionando para a Home.");
    return <Navigate to="/" replace />;
  }

  const hasAccess = allowedRoles.some(role => (role === "admin" ? user?.admin : !user?.admin));

  if (!hasAccess) {
    console.warn(`Acesso negado. Usuário sem permissão: ${user?.admin}`);
    return <Navigate to="/" replace />;
  }

  return children;
};

const privateRoutes = [
  { path: "/admin", element: <Admin />, roles: ["admin"] },
  { path: "/adicionar-dados", element: <User />, roles: ["user"] },
];

const App = () => {
  const { signed } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Container>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Rotas privadas */}
        {privateRoutes.map(({ path, element, roles }) => (
          <Route
            key={path}
            path={path}
            element={<PrivateRoute allowedRoles={roles}>{element}</PrivateRoute>}
          />
        ))}
        {/* Dashboard condicionado */}
        <Route
          path="/dashboard"
          element={
            signed ? (
              <div className="flex flex-col items-center justify-center w-full bg-cover bg-no-repeat" style={{ backgroundImage: "url('bg_blue_home.png')" }}>
                <Header />
                <DataForm />
                <PrivacyTermsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        {/* Redirecionamento padrão */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Container>
  );
};

export default App;
