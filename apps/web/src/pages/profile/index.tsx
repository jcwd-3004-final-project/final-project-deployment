import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Navbar from "@/components/navbar/navbar";

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  isVerified?: boolean;
  avatar?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Fetch user profile on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      // Not logged in
      router.push("/auth/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8000/v1/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const result = await response.json();
        setProfile(result.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Kamu akan keluar dari akun.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, keluar",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("accessToken");
        Swal.fire("Keluar!", "Kamu telah berhasil keluar.", "success").then(() => {
          router.push("/");
        });
      }
    });
  };

  const goToEditPage = () => router.push("/profile/edit");

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="bg-white shadow-xl rounded-3xl p-8 md:p-12 lg:p-16 relative">
          {/* Profile Header */}
          <div className="text-center">
            <img
              src={profile.avatar || "/images/default-profile.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-800">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-gray-600">{profile.email}</p>
            {profile.isVerified ? (
              <span className="mt-2 inline-block px-3 py-1 text-sm text-green-600 bg-green-100 rounded-full">
                Verified Account
              </span>
            ) : (
              <span className="mt-2 inline-block px-3 py-1 text-sm text-red-600 bg-red-100 rounded-full">
                Unverified Account
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={goToEditPage}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-full shadow-md hover:from-blue-600 hover:to-indigo-600 focus:outline-none transition transform hover:scale-105"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white font-semibold rounded-full shadow-md hover:bg-red-600 focus:outline-none transition transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
