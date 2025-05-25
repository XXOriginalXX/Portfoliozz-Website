import React from "react";
import { Link } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";
import { BackgroundImage } from "../assets/BackgroundImage";

const Login: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-background relative">
      {/* Logo Button */}
      <Link 
        to="/" 
        className="absolute top-4 left-4 z-10 flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        <h1 className="text-xl font-serif font-bold">Portfoliozz</h1>
      </Link>

      {/* Left side - Form */}
      <div
        className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 md:w-1/2 xl:px-24"
        style={{ marginRight: "-2px" }}
      >
        <div className="mx-auto w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Sign in to your Portfoliozz account</p>
          </div>
          <LoginForm />
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:text-primary/80 font-medium">
                Sign up here
              </Link>
            </p>
          </div>
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