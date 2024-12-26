import React, { useState } from 'react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';

const RegisterSuccessPage: NextPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false); // State untuk loading
  const [error, setError] = useState<string>(''); // State untuk error (opsional)

  const handleOk = async () => {
    setIsLoading(true); // Mulai loading
    setError(''); // Reset error jika ada

    try {
      // Simulasikan proses async jika diperlukan
      // Misalnya, jika Anda perlu memverifikasi sesuatu sebelum navigasi
      // await someAsyncFunction();

      // Navigasi ke halaman login
      await router.push('/auth/login');
    } catch (err: any) {
      setError('Terjadi kesalahan saat mengarahkan ke halaman login.');
    } finally {
      setIsLoading(false); // Selesai loading
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center text-black">
        <h2 className="text-2xl font-bold mb-4">Registration Successful</h2>
        <p className="mb-4">Please confirm your email.</p>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <button 
          className={`bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 w-full flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleOk}
          disabled={isLoading} // Disable saat loading
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full" viewBox="0 0 24 24"></svg>
          ) : null}
          {isLoading ? 'Loading...' : 'OK'}
        </button>
      </div>
    </div>
  );
};

export default RegisterSuccessPage;
