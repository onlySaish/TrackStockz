import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleEditProfile, updateProfile, updateAvatar, profileSelector, setProfileActiveContent } from '../profileSlice.js';

const EditProfileCard = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector(profileSelector);
  const user = useSelector(profileSelector);

  const [formData, setFormData] = useState({
    username: user.username || '',
    fullName: user.fullName || '',
    email: user.email || '',
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || '/default-avatar.png');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file)); // Generate a preview URL
      console.log("Selected File:", file); // Debugging: log the selected file
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
  };

  return (
    <div className="relative p-6 rounded-2xl border-2 bg-white shadow-2xl max-w-4xl mx-auto transition-transform duration-300 hover:scale-105 z-10">
      
      <div className="relative bg-white rounded-2xl p-6">
        <div className="flex flex-row justify-between gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <img
              src={avatarPreview}
              alt="Profile Avatar"
              className="w-40 h-40 rounded-full border-4 border-white shadow-lg transition-transform duration-300 hover:scale-110"
            />
            
            <div className='flex flex-col items-center mt-6'>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatarUpload"
              />
              <label
                htmlFor="avatarUpload"
                className="cursor-pointer px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                Choose Image
              </label>
              <button
                onClick={handleAvatarUpload}
                className="mt-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                Upload Avatar
              </button>
            </div>
          </div>

          {/* Form Fields Section */}
          <div className="flex flex-col w-3/4">
            <div className="flex flex-col mb-4">
              <label htmlFor="username" className="text-lg font-semibold text-gray-700 mb-1 ml-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 w-full max-w-lg"
                id="username"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="fullName" className="text-lg font-semibold text-gray-700 mb-1 ml-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 w-full max-w-lg"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="email" className="text-lg font-semibold text-gray-700 mb-1 ml-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="border-2 p-3 rounded-lg bg-gray-100 cursor-not-allowed w-full max-w-lg"
                disabled // Email cannot be edited
              />
            </div>

            {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
            
            {/* Action Buttons */}
            <div className="mt-5 flex gap-8">
              <button
                onClick={handleSave}
                className="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="px-5 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold shadow-md transition-transform duration-300 hover:scale-105 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileCard;
