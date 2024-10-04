import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import { Button } from "../ui/button";
import { FaUserCircle } from "react-icons/fa";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { api } from "@/api/api";

const Header = () => {
  const { user, signOut } = useAuth();
  const [showUserName, setShowUserName] = useState(false);
  const [displayedName, setDisplayedName] = useState("");
  const fullName = user?.fullName || "";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let currentIndex = 0;

    if (showUserName) {
      const intervalId = setInterval(() => {
        if (currentIndex < fullName.length) {
          setDisplayedName((prev) => prev + fullName[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(intervalId);
        }
      }, 50);

      return () => clearInterval(intervalId);
    } else {
      setDisplayedName("");
    }
  }, [showUserName, fullName]);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    try {
      const response = await api.put("/modify_password", {
        email: user?.email,
        currentPassword,
        newPassword,
      });
      console.log(response);

      setSuccessMessage("Senha atualizada com sucesso!");
      setErrorMessage("");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setErrorMessage("Erro ao atualizar a senha. Tente novamente.");
      console.error("Erro ao atualizar a senha:", error);
    }
  };

  return (
    <header className="flex justify-between w-full items-center p-8 bg-white text-blue-400 shadow-lg mb-10 rounded-b-lg">
      <div className="relative">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="flex items-center justify-center bg-transparent hover:bg-transparent shadow-none transition duration-200 ease-in-out  p-2"
              onMouseEnter={() => setShowUserName(true)}
              onMouseLeave={() => setShowUserName(false)}
            >
              <FaUserCircle size={30} className="text-blue-400" />
            </Button>
          </DialogTrigger>
          <DialogContent className="min-w-max p-6 rounded-lg shadow-lg bg-white border border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-blue-600">
                Informações do Usuário
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                Confira os dados do seu perfil abaixo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 w-1/3">
                  Email:
                </span>
                <span className="text-gray-800">{user?.email}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 w-1/3">
                  Nome Completo:
                </span>
                <span className="text-gray-800">{user?.fullName}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 w-1/3">
                  GERES:
                </span>
                <span className="text-gray-800">{user?.geres}</span>
              </div>
            </div>
            <hr className="my-4" />
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="flex flex-col">
                <label
                  htmlFor="currentPassword"
                  className="font-semibold text-gray-700"
                >
                  Senha Atual:
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="border border-gray-300 rounded p-2"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="newPassword"
                  className="font-semibold text-gray-700"
                >
                  Nova Senha:
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border border-gray-300 rounded p-2"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="confirmPassword"
                  className="font-semibold text-gray-700"
                >
                  Confirme a Nova Senha:
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border border-gray-300 rounded p-2"
                  required
                />
              </div>
              {errorMessage && (
                <div className="text-red-500">{errorMessage}</div>
              )}
              {successMessage && (
                <div className="text-green-500">{successMessage}</div>
              )}
              <Button
                type="submit"
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                Atualizar Senha
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        {showUserName && (
          <div className="absolute left-10 top-1/2 transform -translate-y-1/2 p-2 whitespace-nowrap">
            <span className="text-blue-400 font-semibold">{displayedName}</span>
          </div>
        )}
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
