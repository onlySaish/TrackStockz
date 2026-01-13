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
    <div className="relative bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700 w-full group">
      {status === 'loading' ? (
        <div className="p-8 text-center text-gray-400">Loading profile...</div>
      ) : (
        <>
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 w-full relative">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
          </div>

          {/* Profile Content */}
          <div className="px-6 pb-8">
            {/* Avatar - Negative Margin to pull it up */}
            <div className="relative -mt-16 mb-4 flex justify-center">
              <div className="relative">
                <img
                  src={user.avatar || 'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png'}
                  alt="Profile"
                  onError={(e) => e.currentTarget.src = 'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png'}
                  className="w-32 h-32 rounded-full border-4 border-gray-800 shadow-2xl object-cover bg-gray-700"
                />
                <button
                  onClick={handleEditClick}
                  className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110 border-2 border-gray-800"
                  title="Edit Avatar"
                >
                  <i className="fa-solid fa-camera text-sm"></i>
                </button>
              </div>
            </div>

            {/* User Details */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white tracking-wide">{user.fullName || 'User Name'}</h2>
              <p className="text-gray-400 text-sm mt-1 font-medium">@{user.username || 'username'}</p>

              <div className="mt-4 flex justify-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium">
                  <i className="fa-solid fa-shield-halved text-[10px]"></i>
                  Professional Member
                </span>
              </div>
            </div>

            {/* Info List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-700/30 border border-gray-700/50 hover:bg-gray-700/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 border border-gray-700 shrink-0">
                  <i className="fa-regular fa-envelope"></i>
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email Address</p>
                  <p className="text-sm text-gray-200 truncate" title={user.email}>{user.email || 'No email provided'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-700/30 border border-gray-700/50 hover:bg-gray-700/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 border border-gray-700 shrink-0">
                  <i className="fa-regular fa-id-badge"></i>
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">User ID</p>
                  <p className="text-sm text-gray-200 truncate font-mono">{user._id || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleEditClick}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-all shadow-lg hover:shadow-xl border border-gray-600"
              >
                <i className="fa-regular fa-pen-to-square"></i>
                Edit
              </button>
              <button
                onClick={handleChangePassClick}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-all shadow-lg hover:shadow-xl border border-gray-600"
              >
                <i className="fa-solid fa-lock"></i>
                Security
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileCard;
