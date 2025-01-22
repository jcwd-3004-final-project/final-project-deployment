// components/SocialLoginButton.tsx
import React from "react";
import { FaGoogle } from "react-icons/fa";

const GOOGLE_LOGIN_URL =
  "https://d29jci2p0msjlf.cloudfront.net/v1/api/auth/google";

const SocialLoginButton: React.FC = () => {
  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_LOGIN_URL;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition duration-200 w-full"
    >
      <FaGoogle className="mr-2" />
      Continue with Google
    </button>
  );
};

export default SocialLoginButton;
