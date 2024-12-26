import React, { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { loginUser } from "@/lib/authApi";

interface FormState {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  isVerified: boolean;
  avatar?: string;
}

const LoginPage: NextPage = () => {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false); // State untuk loading
  
  const router = useRouter(); // gunakan useRouter untuk navigasi

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Mulai loading

    try {
      const data = await loginUser(form);
      // data: { accessToken, refreshToken, user }
      const { user, accessToken, refreshToken } = data;

      // Cek apakah user sudah verifikasi emailnya
      if (!user.isVerified) {
        setError('Email belum dikonfirmasi. Silakan cek email Anda untuk melakukan konfirmasi.');
        setIsLoading(false); // Selesai loading
        return;
      }

      // Simpan token ke localStorage atau cookie (sesuai kebutuhan)
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      }

      // Setelah login berhasil, arahkan ke halaman Home
      router.push("/");
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Login gagal.');
    } finally {
      setIsLoading(false); // Selesai loading
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form 
        className="bg-white p-6 text-black rounded shadow-md w-full max-w-md"

        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <div className="mb-4">
          <label className="block mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="w-full border p-2 rounded"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required 
            disabled={isLoading} // Disable saat loading
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="w-full border p-2 rounded"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required 
            disabled={isLoading} // Disable saat loading
          />
        </div>

        <button 
          className={`bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 w-full flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          type="submit"
          disabled={isLoading} // Disable saat loading
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full" viewBox="0 0 24 24"></svg>
          ) : null}
          {isLoading ? 'Loading...' : 'Login'}
        </button>

        <p className="mt-4 text-sm">
          Belum punya akun? <a className="text-green-600" href="/auth/register">Register</a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
