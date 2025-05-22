import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signOutAsync } from '../../auth/authSlice';
import { selectSidebarVisibility, setActiveContent, toggleSidebar } from '../dashboardSlice';
import { fetchProfile, profileSelector } from './profile/profileSlice';
import { Navigate } from 'react-router';
import { Menu, Search, Logout } from '@mui/icons-material';

function Navbar() {
  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector(profileSelector);
  const hasFetched = useRef(false);
  const isSidebarVisible = useSelector(selectSidebarVisibility);

  useEffect(() => {
    if (!hasFetched.current) {
      dispatch(fetchProfile());
      hasFetched.current = true;
    }
  }, [dispatch]);

  const handleLogOut = () => {
    dispatch(signOutAsync());
    hasFetched.current = false;
  };

  const searchBtn = () => {
    searchRef.current.select();
  };

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  useEffect(() => {
    console.log(user.avatar);
  },[user])

  return (
    <>
      {!user && <Navigate to="/login" replace={true} />}
      <div className="w-full bg-gray-900 flex flex-row justify-between items-center py-4 px-10 shadow-md">
        <button onClick={handleSidebarToggle} className="text-white text-4xl mb-2">
          <Menu />
        </button>
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-full bg-contain bg-no-repeat bg-left-bottom" style={{ backgroundImage: "url('reactLogo.webp')" }}></div>
          <div className="text-2xl font-bold text-white">TrackStockz</div>
        </div>
        <div className="flex items-center bg-gray-800 text-white rounded-full px-4 py-2 shadow-inner w-1/3">
          <Search className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search here..." 
            ref={searchRef} 
            className="w-full bg-transparent pl-3 text-white border-none h-full outline-none" />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-white font-bold text-xl capitalize">Welcome, {user.username}</div>
          <div
            className="h-12 w-12 rounded-full cursor-pointer border-2 border-gray-800 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            onClick={() => dispatch(setActiveContent("Profile"))}
          >
            <img
              src={user.avatar || 'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png'}
              alt="User Avatar"
              onError={(e) => e.target.src = 'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png'}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className='group'>
          <button 
            onClick={handleLogOut} 
            className="flex items-center bg-red-600 text-white px-4 py-2 rounded-full font-bold shadow-lg hover:bg-red-700 transition-all duration-300"
          >
            <Logout className="mr-0 transition-all duration-300" />
            <span className="ml-2 opacity-0 w-0 overflow-hidden transition-all duration-300 group-hover:opacity-100 group-hover:w-auto">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
