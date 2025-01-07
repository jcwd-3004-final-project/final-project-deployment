// pages/auth/login.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie"; // if needed
import { loginUser } from "@/lib/authApi";
import { useUser } from "@/context/userContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-6 text-black rounded shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        {/* ...Your login form fields... */}
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <div className="mb-4">
          <label>Email</label>
          <input
            type="email"
            required
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label>Password</label>
          <input
            type="password"
            required
            disabled={isLoading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-600 text-white py-2 px-4 rounded w-full hover:bg-green-700"
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
