import Image from "next/image";
import { confirmImageChange, isValidImageFile } from "@/utils/validateProfile";

interface ProfileHeaderProps {
  profile: {
    name: string;
    email: string;
    profilePic: string;
  };
  setProfile: React.Dispatch<React.SetStateAction<any>>;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  setProfile,
}) => {
  const handleProfilePicChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!isValidImageFile(file)) {
        alert("Only JPG, JPEG, and PNG formats are allowed.");
        return;
      }

      const imageURL = URL.createObjectURL(file);
      const isConfirmed = await confirmImageChange(imageURL);

      if (isConfirmed) {
        setProfile((prev: any) => ({ ...prev, profilePic: imageURL }));
      }
    }
  };

  return (
    <div className="text-center mb-8">
      <Image
        src={profile.profilePic}
        alt="Profile Picture"
        className="w-28 h-28 rounded-full mx-auto border-4 border-blue-500 object-cover shadow-md"
        width={112}
        height={112}
      />
      <label className="block mt-4 text-sm">
        <input
          type="file"
          accept="image/*"
          onChange={handleProfilePicChange}
          className="hidden"
        />
        <span className="cursor-pointer text-blue-500 font-medium hover:underline">
          Change Picture
        </span>
      </label>
      <h1 className="mt-4 text-3xl font-bold text-gray-800">{profile.name}</h1>
      <p className="text-sm text-gray-600">{profile.email}</p>
    </div>
  );
};

export default ProfileHeader;
