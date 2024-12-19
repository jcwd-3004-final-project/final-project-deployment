import React, { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { loginUser } from '@/lib/authApi';

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
    email: '',
    password: ''
  });

  const [error, setError] = useState<string>('');
  
  const router = useRouter(); // gunakan useRouter untuk navigasi

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginUser(form);
      // data: { accessToken, refreshToken, user }
      const { user, accessToken, refreshToken } = data;

      // Cek apakah user sudah verifikasi emailnya
      if (!user.isVerified) {
        setError('Email belum dikonfirmasi. Silakan cek email Anda untuk melakukan konfirmasi.');
        return;
      }

      // Simpan token ke localStorage atau cookie (sesuai kebutuhan)
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      }

      // Setelah login berhasil, arahkan ke halaman Home
      router.push('/');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Login failed.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form 
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <div className="mb-4">
          <label className="block mb-2" htmlFor="email">Email</label>
          <input 
            className="w-full border p-2 rounded"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2" htmlFor="password">Password</label>
          <input 
            className="w-full border p-2 rounded"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required 
          />
        </div>

        <button 
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
          type="submit"
        >
          Login
        </button>

        <p className="mt-4 text-sm">
          Don't have an account? <a className="text-blue-600" href="/register">Register</a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
