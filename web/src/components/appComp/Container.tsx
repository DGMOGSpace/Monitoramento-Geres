import React from "react";

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div
      className="container relative pb-10 flex justify-center items-center bg-blue-400"
      style={{ blockSize: "100vh" }}
    >
      {children}
    </div>
  );
};

export default Container;
