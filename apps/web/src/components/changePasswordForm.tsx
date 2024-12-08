interface ChangePasswordFormProps {
  profile: {
    password: string;
    newPassword: string;
  };
  errors: {
    newPassword: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  profile,
  errors,
  onChange,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Change Password
      </h2>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="password" className="block text-sm text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={profile.password}
            onChange={onChange}
            className="w-full mt-2 p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm text-gray-700">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={profile.newPassword}
            onChange={onChange}
            className={`w-full mt-2 p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-300 focus:outline-none ${
              errors.newPassword && "border-red-500"
            }`}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
