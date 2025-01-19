interface PersonalInfoFormProps {
  profile: {
    name: string;
    email: string;
  };
  errors: {
    email: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  profile,
  errors,
  onChange,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Personal Info
      </h2>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={profile.name}
            onChange={onChange}
            className="w-full mt-2 p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={onChange}
            className={`w-full mt-2 p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-300 focus:outline-none ${
              errors.email && "border-red-500"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
