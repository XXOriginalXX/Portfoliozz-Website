import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

// Import Firebase auth and providers
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebaseconfig"; // Adjust path if needed

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // Sign in with email and password
      await signInWithEmailAndPassword(auth, data.email, data.password);
      console.log("Login successful!");
      // Redirect or perform other actions after successful login
      // For example, navigate to a dashboard: history.push('/dashboard');
    } catch (error: any) {
      console.error("Login error:", error.message);
      // Display error message to the user
      setError("email", {
        type: "manual",
        message:
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password"
            ? "Invalid email or password"
            : error.message,
      });
      setError("password", {
        type: "manual",
        message: "", // Clear password error if email is the main issue
      });
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      console.log("Signed in with Google successfully!");
      // Redirect or perform other actions after successful Google login
    } catch (error: any) {
      console.error("Google sign-in error:", error.message);
      // Handle Google sign-in errors
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h1
          className="text-4xl font-bold tracking-tight mb-2"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          WELCOME BACK
        </h1>
        <p
          className="text-gray-600"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Welcome back! Please enter your details.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <div className="mb-2 font-medium">Email</div>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="mb-2 font-medium">Password</div>
          <input
            type="password"
            placeholder="••••••••••"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              className="w-4 h-4 text-red-500 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
              {...register("rememberMe")}
            />
            <label
              htmlFor="rememberMe"
              className="text-sm cursor-pointer"
            >
              Remember me
            </label>
          </div>

          <Link
            to="/forgot-password"
            className="text-sm text-red-500 hover:underline"
          >
            Forgot password
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white rounded-md h-12 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>

        <button
          type="button"
          className="w-full border border-gray-300 hover:bg-gray-50 text-gray-900 rounded-md h-12 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 186.69 190.5"
            className="mr-2"
          >
            <g transform="translate(1184.583 765.171)">
              <path
                d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z"
                fill="#4285f4"
              />
              <path
                d="M-1142.714-651.791l-6.972 5.337-24.679 19.223h0c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z"
                fill="#34a853"
              />
              <path
                d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.695-24.592 31.695-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z"
                fill="#fbbc05"
              />
              <path
                d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.692 24.592c7.533-22.514 28.575-39.226 53.34-39.226z"
                fill="#ea4335"
              />
            </g>
          </svg>
          Sign in with Google
        </button>

        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-red-500 hover:underline"
            style={{ fontWeight: 500 }}
          >
            Sign up for free!
          </Link>
        </div>
      </form>
    </div>
  );
};