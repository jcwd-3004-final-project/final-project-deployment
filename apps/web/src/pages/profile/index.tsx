import { useState } from "react";
import { useRouter } from "next/router";
import { isValidImageFile, confirmImageChange } from "@/utils/validateProfile";
import Navbar from "@/components/navbar";
import Swal from "sweetalert2";

interface Profile {
  name: string;
  email: string;
  profilePic: string;
  isVerified: boolean;
}

const ProfilePage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({
    name: "John Doe",
    email: "johndoe@example.com",
    profilePic: "/images/default-profile.png",
    isVerified: false,
  });

  const handlePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newImageUrl = await validateAndConfirmImage(file);
    if (newImageUrl) {
      setProfile((prev) => ({ ...prev, profilePic: newImageUrl }));
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Kamu akan keluar dari akun.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, keluar",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        // Lakukan proses logout di sini, misalnya menghapus token dari localStorage
        localStorage.removeItem("authToken");
        Swal.fire("Keluar!", "Kamu telah berhasil keluar.", "success").then(
          () => {
            router.push("/"); // Redirect ke homepage
          }
        );
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white shadow-xl rounded-3xl p-8 md:p-12 lg:p-16 relative">
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
              <img
                src={profile.profilePic}
                alt="Profile Picture"
                className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover"
              />
              <label
                htmlFor="profilePicInput"
                className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full shadow-md cursor-pointer hover:bg-blue-600 transition"
                title="Change Picture"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                >
                  <path d="M12 4a2 2 0 0 0-2 2H6.414L5 7.414v10.172l1.414 1.414h11.172L19 17.586V7.414L17.586 6H14a2 2 0 0 0-2-2zm0-2a4 4 0 0 1 4 4h2.586L20 7.414v10.172l-1.414 1.414H5.414L4 17.586V7.414L5.414 6H8a4 4 0 0 1 4-4zM8 12h8v2H8v-2z" />
                </svg>
              </label>
              <input
                id="profilePicInput"
                type="file"
                accept="image/*"
                onChange={handlePictureChange}
                className="hidden"
              />
            </div>
          </div>
          <div className="pt-24 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {profile.name}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mt-2">
              {profile.email}
            </p>
            <div className="mt-4">
              {profile.isVerified ? (
                <span className="inline-block px-3 py-1 text-sm sm:text-base text-green-600 bg-green-100 rounded-full">
                  Verified Account
                </span>
              ) : (
                <span className="inline-block px-3 py-1 text-sm sm:text-base text-red-600 bg-red-100 rounded-full">
                  Unverified Account
                </span>
              )}
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => router.push("/profile/edit")}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-full shadow-md hover:from-blue-600 hover:to-indigo-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487a2.25 2.25 0 0 1 3.182 3.183L9.26 18.455a4.5 4.5 0 0 1-1.697 1.09l-3.04 1.012a.375.375 0 0 1-.482-.482l1.011-3.04a4.5 4.5 0 0 1 1.09-1.697L16.862 4.487z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 7.5l-2.25-2.25"
                />
              </svg>
              Edit Profile
            </button>
            {/* Tombol Logout */}
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white font-semibold rounded-full shadow-md hover:bg-red-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300 transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h5a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

// Helper untuk validasi dan konfirmasi gambar
const validateAndConfirmImage = async (file: File): Promise<string | null> => {
  if (!isValidImageFile(file)) {
    Swal.fire({
      icon: "error",
      title: "File Tidak Valid",
      text: "Silakan unggah file gambar yang valid (JPEG, JPG, PNG).",
    });
    return null;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const imageUrl = reader.result as string;
      const isConfirmed = await confirmImageChange(imageUrl);
      resolve(isConfirmed ? imageUrl : null);
    };
    reader.readAsDataURL(file);
  });
};
