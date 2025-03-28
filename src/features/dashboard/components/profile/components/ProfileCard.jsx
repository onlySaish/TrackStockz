import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { profileSelector, setProfileActiveContent } from '../profileSlice.js';

const ProfileCard = () => {
  const dispatch = useDispatch();
  const user = useSelector(profileSelector);
  const { status } = useSelector(profileSelector);
  
  const handleEditClick = () => {
    dispatch(setProfileActiveContent("EditProfile"));
  };
  const handleChangePassClick = () => {
    dispatch(setProfileActiveContent("ChangePassword"));
  };

  return (
    // <div className='relative '>
    // <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-[3px]"></div>
    <div className="flex items-center justify-between px-10 py-8 bg-white shadow-2xl rounded-3xl w-[850px] h-[230px] mx-auto 
      border-4 bg-clip-padding transition-all duration-300 transform hover:scale-105 
      hover:shadow-3xl">
        {status === "loading" ? <p className="text-gray-600">Loading...</p> :(
        <>
      <div className="flex-shrink-0">
        <img
          src={user.avatar || '/default-avatar.png'}
          alt="Profile Avatar"
          className="w-40 h-40 rounded-full border-4 border-white shadow-lg transition-transform duration-300 hover:scale-110"
        />
      </div>

      <div className="flex flex-col ml-8 mb-6 flex-grow">
        <h2 className="text-3xl capitalize font-bold text-gray-900">{user.username || 'Username'}</h2>
        <p className="text-2xl text-gray-600 capitalize font-medium">{user.fullName || 'Full Name'}</p>
        <p className="text-2xl text-gray-500">{user.email || 'Email'}</p>
        {/* <p className="text-2xl text-gray-500">{user.phoneNumber || ''}</p> */}
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={handleEditClick}
          className="px-7 py-4 text-lg rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg 
          transition-transform duration-300 hover:scale-110 hover:shadow-xl"
        >
          Edit Profile
        </button>
        <button
          onClick={handleChangePassClick}
          className="px-7 py-4 text-lg rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold shadow-lg 
          transition-transform duration-300 hover:scale-110 hover:shadow-xl"
        >
          Change Password
        </button>
      </div>
      </>
    )}
    </div>
  // </div>
  );
};

export default ProfileCard;
