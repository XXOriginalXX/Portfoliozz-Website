import React from "react";
import { Link } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";
import { BackgroundImage } from "../assets/BackgroundImage";
import LogoButton from "@/components/ui/LogoButton";

const Login: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-background relative">
      <LogoButton />

      {/* Left side - Form */}
      <div
        className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 md:w-1/2 xl:px-24"
        style={{ marginRight: "-2px" }}
      >
        <div className="mx-auto w-full max-w-md">
          <LoginForm />
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden bg-muted md:flex md:w-1/2 md:flex-col md:items-center md:justify-center p-0">
        <div className="relative h-full w-full">
          <BackgroundImage />
        </div>
      </div>
    </div>
  );
};

export default Login;