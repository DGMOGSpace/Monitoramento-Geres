import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-blue-400">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-white"></div>
        <p className="mt-4 text-white text-lg font-semibold">Carregando...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;