// src/components/appComp/Header.jsx
import React from 'react';
import { useAuth } from '../../hooks/auth/useAuth';
import { Button } from '../ui/button'; // Certifique-se de ter um componente Button

const Header = ({ name }) => {
  const { signOut } = useAuth(); // Supondo que useAuth tenha um método signOut

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
