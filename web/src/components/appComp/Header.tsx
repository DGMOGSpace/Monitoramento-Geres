// src/components/appComp/Header.jsx
import { useAuth } from "../../hooks/auth/useAuth";
import { Button } from "../ui/button";

interface HeaderProps {
  name: string;
}

const Header = ({ name }: HeaderProps) => {
  const { signOut } = useAuth();
  return (
    <div className="flex justify-between items-center p-4 bg-blue-500 text-white">
      <h1 className="text-xl">Olá, {name}</h1>
      <Button onClick={signOut} className="bg-red-500 hover:bg-red-600">
        Sair
      </Button>
    </div>
  );
};

export default Header;
