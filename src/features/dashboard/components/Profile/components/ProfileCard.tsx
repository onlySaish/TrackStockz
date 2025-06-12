import { profileSelector, selectStatus, setProfileActiveContent } from '../profileSlice.js';
import { useAppDispatch, useAppSelector } from '../../../../../hooks.js';

const ProfileCard = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(profileSelector);
  const status = useAppSelector(selectStatus);

  const handleEditClick = () => {
    dispatch(setProfileActiveContent("EditProfile"));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangePassClick = () => {
    dispatch(setProfileActiveContent("ChangePassword"));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative flex flex-col md:flex-row items-center bg-gradient-to-br from-gray-800 to-gray-900 
      backdrop-blur-lg shadow-xl rounded-lg w-full md:w-11/12 lg:w-8/12 xl:w-3/5 mx-auto border border-gray-700 p-6 transition-all 
      duration-300 hover:scale-[1.02] hover:shadow-2xl">

      {status === "loading" ? (
        <p className="text-gray-400 text-lg">Loading...</p>
      ) : (
        <>
          {/* Left Section - Avatar & Buttons */}
          <div className="flex flex-col items-center w-full md:w-1/3 p-4 border-b md:border-b-0 md:border-r border-gray-700">
            <div className="relative">
              <img
                src={user.avatar || 'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png'}
                alt="Profile Avatar"
                onError={(e) => e.currentTarget.src = 'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png'}
                className="w-36 h-36 rounded-2xl border-4 border-gray-700 shadow-md 
                transition-transform duration-300 hover:scale-110"
              />
              {/* <div className="absolute bottom-1 right-1 bg-gray-700 p-2 rounded-full shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9M6 9h12m-6 9v-6m0 6l-2.25-2.25M12 18l2.25-2.25" />
                </svg>
              </div> */}
            </div>

            <div className="mt-6 flex flex-col gap-3 w-full">
              <button
                onClick={handleEditClick}
                className="px-6 py-3 w-full text-lg rounded-lg bg-[#1E3A8A] text-white font-medium shadow-md 
                transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40"
              >
                Edit Profile
              </button>
              <button
                onClick={handleChangePassClick}
                className="px-6 py-3 w-full text-lg rounded-lg bg-[#374151] text-white font-medium shadow-md 
                transition-all duration-300 hover:scale-105 hover:shadow-gray-400/40"
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Right Section - User Info */}
          <div className="flex flex-col justify-center w-full md:w-2/3 p-6">
            <h2 className="text-5xl capitalize font-semibold text-gray-100 tracking-wide">
              {user.username || 'Username'}
            </h2>
            <p className="text-2xl text-gray-400 capitalize font-medium mt-2">
              {user.fullName || 'Full Name'}
            </p>
            <p className="text-2xl text-gray-500 mt-1">{user.email || 'Email'}</p>

            <div className="mt-6">
              <div className="flex items-center bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-md w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" className="w-6 h-6 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25V6a2.25 2.25 0 00-2.25-2.25H9A2.25 2.25 0 006.75 6v2.25m10.5 0h-10.5m10.5 0l1.5 12.75a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25l1.5-12.75" />
                </svg>
                <p className="text-gray-300 text-lg">Professional Member</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileCard;
