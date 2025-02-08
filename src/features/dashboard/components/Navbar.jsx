import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { signOutAsync } from '../../auth/authSlice';
import { selectSidebarVisibility, setActiveContent, toggleSidebar } from '../dashboardSlice';
import { fetchProfile, profileSelector } from './profile/profileSlice';
import { Navigate } from 'react-router';

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
  }

  const searchBtn = () => {
    searchRef.current.select()
  }

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  return (
    <>
      {!user && <Navigate to="/login" replace={true}></Navigate>}
      <div className='w-full bg-gradient-to-r from-violet-600 to-violet-950 flex flex-row justify-evenly items-center py-4'>
        <div>
          <button onClick={handleSidebarToggle} className={`${(isSidebarVisible) ? "fa-regular fa-compass text-4xl" : "fa-solid fa-bars text-2xl"} text-white`}></button>
        </div>
        <div className='flex flex-row gap-4'>
          <div className='h-8 w-8 rounded-full' style={{backgroundImage : "url('vite.svg')"}} ></div>
          <div className='text-2xl font-bold text-white'>Maverick</div>
        </div>
        <div className='w-1/4 flex flex-row justify-center items-center h-8 gap-1'>
          <div className='h-full w-8 flex justify-center items-center'>
            <button
            onClick={searchBtn} 
            className='fa-solid fa-magnifying-glass text-white text-xl p-2 rounded-3xl'></button>
          </div>
          <input type="text" placeholder='Search here...' ref={searchRef} className='w-full bg-transparent pl-3 text-white border-none h-full rounded-2xl'/>
        </div>
        <div className='flex flex-row gap-3 justify-center items-center'>
          <div className='text-white font-bold text-2xl capitalize'>Welcome, {user.username}</div>
          <div className='h-9 w-9 text-white bg-cover bg-center rounded-full text-3xl text-center cursor-pointer'
          style={{backgroundImage: `url(${user.avatar})`}}
          onClick={() => dispatch(setActiveContent("Profile"))}></div>
        </div>
        <div>
          <button   
          onClick={handleLogOut}
          className='text-white bg-red-700 p-2 rounded-3xl font-bold'>Logout</button>
        </div>
      </div>
    </>
  )
}

export default Navbar