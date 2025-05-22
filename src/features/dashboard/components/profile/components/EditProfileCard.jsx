import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, updateAvatar, profileSelector, setProfileActiveContent, selectStatus } from '../profileSlice.js';

const EditProfileCard = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectStatus);
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
  };

  // const handleChangeNumber = () => {
  //   dispatch(setProfileActiveContent("ChangeNumber"));
  // }

  return (
    <div className="relative p-10 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg border border-gray-700 max-w-3xl mx-auto transition-all duration-300">
      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Avatar Section */}
        <div className="flex flex-col items-center w-full md:w-1/3 border-r border-gray-700 p-8">
          <img
            src={avatarPreview}
            onError={(e) => e.target.src = 'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png'}
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
              className="cursor-pointer px-5 py-2 text-white bg-indigo-600 rounded-lg font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:bg-indigo-500"
            >
              Select Image
            </label>
            <button
              onClick={handleAvatarUpload}
              className={`mt-4 px-5 py-2 text-white bg-green-600 rounded-lg font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:bg-green-500 ${
                status === "loading" ? "cursor-not-allowed opacity-50" : ""}`}
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
            {/* <button
              onClick={handleChangeNumber}
              className="px-6 py-3 bg-orange-900 text-white rounded-lg font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:bg-orange-800"
            >
              Add Phone Number
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileCard;