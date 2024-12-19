import React, { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { registerUser } from '@/lib/authApi';

interface FormState {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

const RegisterPage: NextPage = () => {
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });
  const [error, setError] = useState<string>('');

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await registerUser(form);
      // Jika berhasil, arahkan ke halaman register-success
      router.push('/auth/register-success');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Registration failed.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form 
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <div className="mb-4">
          <label className="block mb-2" htmlFor="firstName">First Name</label>
          <input 
            className="w-full border p-2 rounded"
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2" htmlFor="lastName">Last Name</label>
          <input 
            className="w-full border p-2 rounded"
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2" htmlFor="phoneNumber">Phone Number</label>
          <input 
            className="w-full border p-2 rounded"
            type="tel"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            required 
          />
        </div>

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
          Register
        </button>

        <p className="mt-4 text-sm">
          Already have an account? <a className="text-blue-600" href="/auth/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
