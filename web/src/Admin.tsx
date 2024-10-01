import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddUserForm } from "@/components/AdminComponents/AddUserForm";
import { Dashboard } from "@/components/AdminComponents/Dashboard";
import { UserManagement } from "@/components/AdminComponents/UserManagement";
import { Logs } from "@/components/AdminComponents/Logs";
import { useAuth } from "@/hooks/auth/useAuth";

export function Admin() {
  const { signOut } = useAuth(); // Importando o signOut do useAuth
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = () => {
    signOut();
    window.location.reload(); // Faz um refresh na página após o logout
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="flex flex-col w-64 bg-white shadow-lg p-6">
        <img src="gpr_logo.png" alt="Logo GPR" className="p-5" />
        <nav className="flex-grow flex flex-col mt-5 space-y-4">
          <Button
            className={`flex items-center space-x-2 w-full text-left font-bold p-2 rounded-lg hover:bg-blue-400 ${
              activeTab === "addUser" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => setActiveTab("addUser")}
          >
            <span>Adicionar Usuário</span>
          </Button>
          <Button
            className={`flex items-center space-x-2 w-full font-bold text-left p-2 rounded-lg  hover:bg-blue-400 ${
              activeTab === "dashboard" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <span>Dashboard</span>
          </Button>
          <Button
            className={`flex items-center space-x-2 w-full font-bold text-left p-2 rounded-lg  hover:bg-blue-400 ${
              activeTab === "users" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            <span>Usuários</span>
          </Button>
          <Button
            className={`flex items-center space-x-2 w-full text-left font-bold p-2 rounded-lg  hover:bg-blue-400 ${
              activeTab === "logs" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => setActiveTab("logs")}
          >
            <span>Logs de Envio</span>
          </Button>
        </nav>
        <div className="mt-auto">
          <Button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white hover:bg-red-700"
          >
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-grow p-8 ">
        {activeTab === "addUser" && <AddUserForm />}
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "logs" && <Logs />}
      </main>
    </div>
  );
}
