// src/pages/register.tsx

import React, { useState, useEffect } from 'react'; 
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { registerUser } from '@/lib/authApi';
import { toast } from 'react-toastify'; // Pastikan Anda telah menginstal react-toastify
import 'react-toastify/dist/ReactToastify.css';

interface FormState {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  referralCode?: string;
}

const RegisterPage: NextPage = () => {
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    referralCode: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false); // State untuk loading

  const router = useRouter();

  useEffect(() => {
    // Jika halaman diakses dengan query parameter ?ref=CODE, prefill referralCode
    const { ref } = router.query;
    if (ref && typeof ref === 'string') {
      setForm(prev => ({ ...prev, referralCode: ref }));
    }
  }, [router.query]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Mulai loading
    try {
      await registerUser(form);
      // Jika berhasil, arahkan ke halaman register-success
      router.push('/auth/register-success');
      toast.success('Registrasi berhasil! Silakan periksa email Anda untuk konfirmasi.'); // Notifikasi sukses
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Registrasi gagal.');
      toast.error(err?.response?.data?.error || 'Registrasi gagal.'); // Notifikasi error
    } finally {
      setIsLoading(false); // Selesai loading
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Tambahkan ToastContainer untuk notifikasi */}
      <ToastContainer />
      <form 
        className="bg-white p-6 text-black rounded shadow-md w-full max-w-md"
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
            disabled={isLoading} // Disable saat loading
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
            disabled={isLoading} // Disable saat loading
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
            disabled={isLoading} // Disable saat loading
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
            disabled={isLoading} // Disable saat loading
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
            disabled={isLoading} // Disable saat loading
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2" htmlFor="referralCode">Referral Code (Optional)</label>
          <input 
            className="w-full border p-2 rounded"
            type="text"
            name="referralCode"
            value={form.referralCode}
            onChange={handleChange}
            placeholder="Masukkan referral code jika ada"
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
          {isLoading ? 'Loading...' : 'Register'}
        </button>

        <p className="mt-4 text-sm">
          Sudah punya akun? <a className="text-green-600" href="/auth/login">Login</a>
        </p>
      </form>
    </div>
  );
};

// Pastikan Anda telah mengimpor ToastContainer di bagian atas
import { ToastContainer } from 'react-toastify';

export default RegisterPage;
