import { useState, useEffect } from "react";
import PersonalInfoForm from "@/components/personalInfoForm";
import ChangePasswordForm from "@/components/changePasswordForm";
import { useRouter } from "next/router";
import { isValidEmail, isValidPassword } from "@/utils";
import Navbar from "@/components/navbar";

interface Profile {
  name: string;
  email: string;
  password: string;
  newPassword: string;
  profilePic: string;
  isVerified: boolean;
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
    profilePic: "/images/default-profile.png",
    isVerified: false,
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
      newErrors.email = "Invalid email format.";
    }

    if (profile.newPassword && !isValidPassword(profile.newPassword)) {
      newErrors.newPassword = "Password must be at least 8 characters.";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateProfile(profile);
    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => !error)) {
      setLoading(true);
      try {
        // Simulate an API call to update the profile
        setTimeout(() => {
          alert("Profile updated successfully!");
          router.push("/profile"); // Navigate to profile page after update
        }, 2000);
      } catch (error) {
        console.error("Error updating profile:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className=" max-w-4xl mx-auto p-8 bg-gradient-to-br from-white to-gray-100 shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-6 text-black">Edit Profile</h1>

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

      <div className="text-center mt-6 space-x-4">
        <button
          onClick={handleSubmit}
          disabled={loading || !isChanged} // Disabled if not changed
          className={`px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none transition duration-300 shadow-md ${
            loading || !isChanged ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={() => router.push("/profile")}
          className="px-8 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 focus:ring-2 focus:ring-gray-200 focus:outline-none transition duration-300 shadow-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditProfilePage;
