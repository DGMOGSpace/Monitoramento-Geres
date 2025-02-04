import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddUserForm } from "@/components/AdminComponents/AddUserForm";
import { Dashboard } from "@/components/AdminComponents/Dashboard";
import { UserManagement } from "@/components/AdminComponents/UserManagement";
import { Logs } from "@/components/AdminComponents/Logs";
import { useAuth } from "@/hooks/auth/useAuth";
import { api } from "../api/api";
import { Navigate } from 'react-router-dom';

enum ActiveTab {
  Dashboard = "dashboard",
  AddUser = "addUser",
  Users = "users",
  Logs = "logs",
}

export function Admin() {
  const { signed, user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.Dashboard);

  if (!signed) {
    return <Navigate to="/" replace />;
  }

  if (!user?.admin) {
    return <Navigate to="/adicionar-dados" replace />;
  }

  const handleDownload = async () => {
    try {
      const response = await api.get("/download_excel", {
        responseType: "blob",
      });

      if (response.status !== 200) {
        throw new Error("Failed to download Excel file");
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "logs.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error downloading Excel file", error);
    }
  };

  const handleLogout = () => {
    signOut();
  };

  const renderTabButton = (tab: ActiveTab, label: string) => (
    <Button
      className={`flex items-center space-x-2 w-full text-left font-bold p-2 rounded-lg hover:bg-blue-400 ${
        activeTab === tab ? "bg-blue-600 text-white" : ""
      }`}
      onClick={() => setActiveTab(tab)}
    >
      <span>{label}</span>
    </Button>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-blue-300">
      <aside className="flex flex-col w-64 bg-white shadow-lg p-6">
        <img src="gpr_logo.png" alt="Logo GPR" className="p-5" />
        <nav className="flex-grow flex flex-col mt-5 space-y-4">
          {renderTabButton(ActiveTab.AddUser, "Adicionar Usuário")}
          {renderTabButton(ActiveTab.Dashboard, "Dashboard")}
          {renderTabButton(ActiveTab.Users, "Usuários")}
          {renderTabButton(ActiveTab.Logs, "Logs de Envio")}
        </nav>
        <div className="mt-auto">
          <Button
            className="w-full mb-2 bg-green-600 text-white hover:bg-green-700"
            onClick={handleDownload}
          >
            Baixar Logs Excel
          </Button>
          <Button
            onClick={() => window.location.reload()}
            className="w-full mb-2 bg-yellow-600 text-white hover:bg-yellow-700"
          >
            Atualizar Página
          </Button>
          <Button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white hover:bg-red-700"
          >
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-grow p-8 h-screen">
        {activeTab === ActiveTab.AddUser && <AddUserForm />}
        {activeTab === ActiveTab.Dashboard && <Dashboard />}
        {activeTab === ActiveTab.Users && <UserManagement />}
        {activeTab === ActiveTab.Logs && <Logs />}
      </main>
    </div>
  );
}
