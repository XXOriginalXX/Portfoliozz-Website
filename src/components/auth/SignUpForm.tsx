import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

// Import Firebase auth and providers
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/firebaseConfig"; // Adjust path if needed

// Zod schema for form validation
const signUpSchema = z
  .object({
    name: z.string().min(1, "Full name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export const SignUpForm: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  // Function to handle email/password sign-up
  const onSubmit = async (data: SignUpFormValues) => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Update user profile with the provided name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: data.name,
        });
      }

      console.log("Sign up successful!", userCredential.user);
      // Redirect to a dashboard or login page after successful sign-up
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Sign up error:", error.message);
      // Display specific error messages based on Firebase error codes
      if (error.code === "auth/email-already-in-use") {
        setError("email", {
          type: "manual",
          message: "This email address is already in use.",
        });
      } else if (error.code === "auth/weak-password") {
        setError("password", {
          type: "manual",
          message: "Password is too weak. Please choose a stronger password.",
        });
      } else {
        // Generic error message for other Firebase errors
        setError("email", {
          type: "manual",
          message: "An error occurred during sign up. Please try again.",
        });
      }
    }
  };

  // Function to handle Google sign-up
  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      console.log("Signed up with Google successfully!");
      // Redirect after successful Google sign-up
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Google sign-up error:", error.message);
      // Handle Google sign-up errors
      setError("email", {
        type: "manual",
        message: "Google sign-up failed. Please try again.",
      });
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h1
          className="text-4xl font-bold tracking-tight mb-2"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          CREATE ACCOUNT
        </h1>
        <p
          className="text-gray-600"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Sign up to get started with your new account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <div className="mb-2 font-medium">Full Name</div>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

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
            placeholder="Create a password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <div className="mb-2 font-medium">Confirm Password</div>
          <input
            type="password"
            placeholder="Confirm your password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="acceptTerms"
              className="w-4 h-4 text-red-500 bg-gray-100 border-gray-300 rounded focus:ring-red-500 mt-1"
              {...register("acceptTerms")}
            />
            <label htmlFor="acceptTerms" className="text-sm cursor-pointer">
              By creating an account, you agree to our{" "}
              <Link to="/terms" className="text-red-500 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-red-500 hover:underline">
                Privacy Policy
              </Link>
              .
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-red-500 text-sm mt-1">{errors.acceptTerms.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white rounded-md h-12 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>

        <button
          type="button"
          className="w-full border border-gray-300 hover:bg-gray-50 text-gray-900 rounded-md h-12 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
          onClick={handleGoogleSignUp}
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
          Sign up with Google
        </button>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-500 hover:underline"
            style={{ fontWeight: 500 }}
          >
            Sign in instead
          </Link>
        </div>
      </form>
    </div>
  );
};