import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar/navbar";
import Swal from "sweetalert2";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  newPassword: string; // For updating password
}

export default function EditProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    email: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8000/v1/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        const { firstName, lastName, email } = data.data;
        setFormData((prev) => ({ ...prev, firstName, lastName, email }));
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, [router]);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      const response = await fetch("http://localhost:8000/v1/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to update profile");
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Profil Anda telah diperbarui.",
      }).then(() => {
        router.push("/profile");
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.message || "Terjadi kesalahan saat memperbarui profil.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete Account
  const handleDeleteAccount = () => {
    Swal.fire({
      title: "Hapus Akun?",
      text: "Akun Anda akan dihapus secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("accessToken");
          if (!token) throw new Error("No token found");

          const response = await fetch("http://localhost:8000/v1/api/user/profile", {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Failed to delete account");
          }

          Swal.fire("Terhapus!", "Akun Anda telah dihapus.", "success").then(() => {
            localStorage.removeItem("accessToken");
            router.push("/");
          });
        } catch (error: any) {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: error.message || "Terjadi kesalahan saat menghapus akun.",
          });
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
            Edit Profil
          </h1>
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                className="w-full border p-2 rounded"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                className="w-full border p-2 rounded"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full border p-2 rounded"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* New Password */}
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">
                New Password (optional)
              </label>
              <input
                type="password"
                name="newPassword"
                className="w-full border p-2 rounded"
                placeholder="Leave blank if not changing"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full sm:w-auto px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="w-full sm:w-auto px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition"
              >
                Batal
              </button>
            </div>
          </form>

          <hr className="my-8" />
          {/* Delete Account */}
          <div className="text-right">
            <button
              onClick={handleDeleteAccount}
              className="text-red-600 hover:text-red-800 transition underline"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
