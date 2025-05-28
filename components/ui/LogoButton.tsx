import React from "react";
import { useNavigate } from "react-router-dom";

const LogoButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="absolute top-0 left-6 z-10" // More padding from top and left
      aria-label="Go to home"
    >
      <img
        src="/logo.png"
        alt="Logo"
        className="h-20 w-auto" // Bigger size
      />
    </button>
  );
};

export default LogoButton;
