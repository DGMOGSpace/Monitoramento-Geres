import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddUserForm } from "@/components/AdminComponents/AddUserForm";
import { Dashboard } from "@/components/AdminComponents/Dashboard";
import { UserManagement } from "@/components/AdminComponents/UserManagement";
import { Logs } from "@/components/AdminComponents/Logs";

export function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Panel</h1>
        <nav className="flex flex-col space-y-4">
          <Button
            className={`flex items-center space-x-2 w-full text-left p-2 rounded-lg hover:bg-blue-200 ${
              activeTab === "dashboard" ? "bg-blue-400 text-white" : ""
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <span>Dashboard</span>
          </Button>
          <Button
            className={`flex items-center space-x-2 w-full text-left p-2 rounded-lg hover:bg-blue-200 ${
              activeTab === "users" ? "bg-blue-400 text-white" : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            <span>Usuários</span>
          </Button>
          <Button
            className={`flex items-center space-x-2 w-full text-left p-2 rounded-lg hover:bg-blue-200 ${
              activeTab === "logs" ? "bg-blue-400 text-white" : ""
            }`}
            onClick={() => setActiveTab("logs")}
          >
            <span>Logs de Envio</span>
          </Button>
        </nav>
      </aside>

      <main className="flex-grow p-8">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          <Button
            onClick={() => setActiveTab("addUser")}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Adicionar Usuário
          </Button>
        </header>

        {activeTab === "addUser" && <AddUserForm />}
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "logs" && <Logs />}
      </main>
    </div>
  );
}
