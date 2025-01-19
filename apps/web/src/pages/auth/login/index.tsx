// pages/auth/login.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie"; // if needed
import { loginUser } from "@/lib/authApi";
import { useUser } from "@/context/userContext";
import SocialLoginButton from "@/components/socialLoginButton";
import { FiMail, FiLock } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Access UserContext

  // Access UserContext
  const { setUserAndLogin } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await loginUser({ email, password });
      const { user, accessToken, refreshToken } = data;

      if (!user.isVerified) {
        setError("Email belum dikonfirmasi. Silakan cek email Anda.");
        setIsLoading(false);
        return;
      }

      // Store tokens in localStorage (or Cookies)
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      localStorage.setItem("userRole", user.role);

      // <-- Update global user context
      setUserAndLogin(user);

      // Redirect based on role
      if (user.role === "USER") {
        router.push("/");
      } else if (user.role === "STORE_ADMIN") {
        router.push("/storeAdmin");
      } else if (user.role === "SUPER_ADMIN") {
        router.push("/superadmin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "Login gagal.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-500 via-green-100 to-white">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Welcome Back! 🎉
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Login to your account to explore amazing features!
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm text-gray-600">Email Address</label>
            <div className="relative mt-1">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="Enter your email"
                className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm text-gray-600">Password</label>
            <div className="relative mt-1">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Enter your password"
                className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-3 rounded-lg text-white font-bold bg-green-500 ${
              isLoading
                ? "cursor-not-allowed bg-purple-400"
                : "hover:bg-green-600"
            } transition-all duration-200`}
          >
            {isLoading ? (
              <div className="flex justify-center items-center space-x-2">
                <AiOutlineLoading3Quarters className="animate-spin" />
                <span>Logging in...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* OR Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        {/* Social Login */}
        <SocialLoginButton />

        <p className="text-center text-gray-500 mt-6 text-sm">
          Don’t have an account?{" "}
          <a
            href="/auth/register"
            className="text-purple-600 font-medium hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
