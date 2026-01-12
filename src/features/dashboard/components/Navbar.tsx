import React, { useEffect, useRef } from 'react';
import { signOutAsync } from '../../auth/authSlice';
import { setActiveContent, toggleSidebar } from '../dashboardSlice';
import { Navigate } from 'react-router';
import { Menu, Logout } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { fetchProfile, profileSelector } from './Profile/profileSlice';
import OrganizationSelector from '../../organization/components/OrganizationSelector';
import { fetchUserOrganizations } from '../../organization/organizationSlice';

function Navbar(): React.JSX.Element {
  const searchRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector(profileSelector);
  const hasFetched = useRef<boolean>(false);

  useEffect(() => {
    if (!hasFetched.current) {
      dispatch(fetchProfile());
      dispatch(fetchUserOrganizations());
      hasFetched.current = true;
    }
  }, [dispatch]);

  const handleLogOut = () => {
    dispatch(signOutAsync());
    hasFetched.current = false;
  };

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  return (
    <>
      {!user && <Navigate to="/login" replace={true} />}
      <div className="max-w-full bg-gray-900 flex flex-row justify-between items-center py-4 px-10 shadow-md">
        <div className="flex items-center gap-4">
          <button onClick={handleSidebarToggle} className="text-white text-4xl mb-2 md:hidden">
            <Menu />
          </button>
          <div className="flex items-center gap-4">
            <div className="hidden md:block size-10 rounded-full bg-contain bg-no-repeat bg-left-bottom" style={{ backgroundImage: "url('reactLogo.webp')" }}></div>
            <div className="text-2xl font-bold text-white">TrackStockz</div>
          </div>
          <div className="ml-8 hidden md:block">
            <OrganizationSelector />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="hidden lg:block text-white font-bold text-xl capitalize">Welcome, {user.username}</div>
            <div
              className="h-12 w-12 rounded-full cursor-pointer border-2 border-gray-800 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
              onClick={() => dispatch(setActiveContent("Profile"))}
            >
              <img
                src={user.avatar || 'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png'}
                alt="User Avatar"
                onError={(e) => e.currentTarget.src = 'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png'}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className='group'>
            <button
              onClick={handleLogOut}
              className="flex cursor-pointer items-center bg-red-600 text-white px-4 py-2 rounded-full font-bold shadow-lg hover:bg-red-700 transition-all duration-300"
            >
              <Logout className="mr-0 transition-all duration-300" />
              <span className="ml-2 opacity-0 w-0 overflow-hidden transition-all duration-300 group-hover:opacity-100 group-hover:w-auto">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
