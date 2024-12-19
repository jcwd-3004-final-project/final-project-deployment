import React from 'react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';

const RegisterSuccessPage: NextPage = () => {
  const router = useRouter();

  const handleOk = () => {
    router.push('/auth/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Registration Successful</h2>
        <p className="mb-4">Please confirm your email.</p>
        <button 
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
          onClick={handleOk}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default RegisterSuccessPage;
