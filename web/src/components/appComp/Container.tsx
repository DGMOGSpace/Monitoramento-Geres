import React from "react";

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-blue-400">
      {children}
    </div>
  );
};

export default Container;
