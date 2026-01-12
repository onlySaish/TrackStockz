import { useState, type ChangeEvent } from 'react';
import { updateProfile, updateAvatar, profileSelector, setProfileActiveContent, selectStatus } from '../profileSlice.js';
import { useAppDispatch, useAppSelector } from '../../../../../hooks.js';

interface FormState {
  username: string;
  fullName: string;
  email: string;
}

const EditProfileCard = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const user = useAppSelector(profileSelector);

  const [formData, setFormData] = useState<FormState>({
    username: user.username || '',
    fullName: user.fullName || '',
    email: user.email || '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || '/default-avatar.png');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    dispatch(updateProfile(formData));
  };

  const handleAvatarUpload = () => {
    if (avatarFile) {
      dispatch(updateAvatar(avatarFile));
    }
  };

  const handleCancel = () => {
    dispatch(setProfileActiveContent("Profile"));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative p-4 md:p-6 lg:p-8 rounded-lg bg-gray-800 shadow-lg border border-gray-700 w-full transition-all duration-300">
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wide">Edit Profile</h2>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Avatar Section */}
        <div className="flex flex-col items-center w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-700 p-4 md:p-8">
          <img
            src={avatarPreview}
            onError={(e) => e.currentTarget.src = 'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png'}
            alt="Profile Avatar"
            className="size-40 mb-4 -mt-4 rounded-2xl border-4 border-gray-600 shadow-md transition-transform duration-300 hover:scale-105"
          />
          <div className="mt-4 flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              id="avatarUpload"
            />
            <label
              htmlFor="avatarUpload"
              className="cursor-pointer text-xl md:text-base px-10 py-2 md:px-5 text-white bg-indigo-600 rounded-lg font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:bg-indigo-500"
            >
              Select Image
            </label>
            <button
              onClick={handleAvatarUpload}
              className={`mt-4 text-xl md:text-base px-10 py-2 md:px-5 text-white bg-green-600 rounded-lg font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:bg-green-500 ${status === "loading" ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {(status === "loading") ? "Uploading" : "Upload Photo"}
            </button>
          </div>
        </div>

        {/* Form Fields Section */}
        <div className="flex flex-col w-full md:w-2/3">
          <div className="flex flex-col space-y-5">
            <div>
              <label className="text-lg font-medium text-gray-200">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="mt-1 px-4 py-2 w-full rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-lg font-medium text-gray-200">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="mt-1 px-4 py-2 w-full rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-lg font-medium text-gray-200">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="mt-1 px-4 py-2 w-full rounded-lg bg-gray-600 text-gray-400 border border-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-6">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:bg-indigo-500"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileCard;