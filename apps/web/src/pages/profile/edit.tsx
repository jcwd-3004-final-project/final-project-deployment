import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar";
import PersonalInfoForm from "@/components/personalInfoForm";
import ChangePasswordForm from "@/components/changePasswordForm";
import { isValidEmail, isValidPassword } from "@/utils";
import Swal from "sweetalert2";

interface Profile {
  name: string;
  email: string;
  password: string;
  newPassword: string;
}

interface Errors {
  email: string;
  newPassword: string;
}

const EditProfilePage = () => {
  const router = useRouter();

  // Initial profile data (simulating fetched data from API)
  const initialProfile: Profile = {
    name: "John Doe",
    email: "johndoe@example.com",
    password: "",
    newPassword: "",
  };

  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [errors, setErrors] = useState<Errors>({
    email: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  // Check if the profile state has changed compared to the initial profile
  useEffect(() => {
    const hasChanges =
      profile.name !== initialProfile.name ||
      profile.email !== initialProfile.email ||
      profile.password !== "" ||
      profile.newPassword !== "";
    setIsChanged(hasChanges);
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateProfile = (profile: Profile): Errors => {
    const newErrors: Errors = {
      email: "",
      newPassword: "",
    };

    if (!isValidEmail(profile.email)) {
      newErrors.email = "Format email tidak valid.";
    }

    if (profile.newPassword && !isValidPassword(profile.newPassword)) {
      newErrors.newPassword = "Password harus minimal 8 karakter.";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateProfile(profile);
    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => !error)) {
      setLoading(true);
      try {
        // Simulate an API call to update the profile
        await new Promise((resolve) => setTimeout(resolve, 2000));

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Profil Anda telah diperbarui.",
        }).then(() => {
          router.push("/profile"); // Navigate to profile page after update
        });
      } catch (error) {
        console.error("Error updating profile:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Terjadi kesalahan saat memperbarui profil.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
            Edit Profil
          </h1>
          <form onSubmit={handleSubmit}>
            {/* Personal Info Form */}
            <PersonalInfoForm
              profile={profile}
              errors={errors}
              onChange={handleInputChange}
            />
            {/* Password Change Form */}
            <ChangePasswordForm
              profile={profile}
              errors={errors}
              onChange={handleInputChange}
            />

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
              <button
                type="submit"
                disabled={loading || !isChanged}
                className={`w-full sm:w-auto px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none transition duration-300 ${
                  loading || !isChanged
                    ? "opacity-50 cursor-not-allowed"
                    : "transform hover:scale-105"
                }`}
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="w-full sm:w-auto px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-400 focus:ring-2 focus:ring-gray-200 focus:outline-none transition duration-300"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
