// src/components/appComp/Header.jsx
import { useAuth } from "../../hooks/auth/useAuth";
import { Button } from "../ui/button";

interface HeaderProps {
  name?: string;
}

const Header = ({ name }: HeaderProps) => {
  const { signOut } = useAuth();

  return (
    <header className="flex justify-between w-full items-center p-8 bg-white text-blue-400 shadow-lg mb-10 rounded-b-lg">
      <div className="flex items-center space-x-3">
        <h1 className="text-2xl font-semibold tracking-wide">
          Olá, <span className="font-bold">{name}</span>
        </h1>
      </div>
      <Button
        onClick={signOut}
        className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 transition duration-200 ease-in-out rounded-lg shadow-md p-2"
      >
        <span>Sair</span>
      </Button>
    </header>
  );
};

export default Header;
