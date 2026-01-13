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
      <div className="flex flex-col gap-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center w-full p-4 bg-gray-700/30 rounded-xl border border-gray-700/50">
          <div className="relative group cursor-pointer">
            <img
              src={avatarPreview}
              onError={(e) => e.currentTarget.src = 'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png'}
              alt="Profile Avatar"
              className="size-32 rounded-full border-4 border-gray-600 shadow-md object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <label htmlFor="avatarUpload" className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <i className="fa-solid fa-camera text-white text-2xl"></i>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              id="avatarUpload"
            />
          </div>

          <div className="mt-4 flex gap-3 w-full">
            <button
              onClick={handleAvatarUpload}
              className={`flex-1 py-2 text-sm text-white bg-green-600 rounded-lg font-semibold shadow-md transition-colors hover:bg-green-500 ${status === "loading" ? "cursor-not-allowed opacity-50" : ""}`}
              disabled={status === "loading"}
            >
              {status === "loading" ? "..." : "Upload New"}
            </button>
          </div>
        </div>

        {/* Form Fields Section */}
        <div className="flex flex-col w-full space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="mt-1 px-4 py-2.5 w-full rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="mt-1 px-4 py-2.5 w-full rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="mt-1 px-4 py-2.5 w-full rounded-lg bg-gray-600/50 text-gray-400 border border-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={handleSave}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold shadow-lg transition-colors hover:bg-blue-500"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2.5 bg-gray-700 text-white rounded-lg font-semibold shadow-lg transition-colors hover:bg-gray-600 border border-gray-600"
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