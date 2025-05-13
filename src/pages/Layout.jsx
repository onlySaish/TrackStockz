import React from 'react';
import Navbar from '../features/dashboard/components/Navbar';
import Sidebar from '../features/dashboard/components/Sidebar';
import Content from './Content';
import Popup from '../features/Popup';
import Loader from '../features/Loader';
import { useSelector } from 'react-redux';
import { selectSidebarVisibility } from '../features/dashboard/dashboardSlice';

function Layout() {
  const isSidebarVisible = useSelector(selectSidebarVisibility);

  return (
    <>
      <Popup />
      <Loader />
      <div className="flex md:min-h-screen lg:max-h-screen">
        {/* Sidebar - Always taking full screen height */}
        <div
          className={`${
            !isSidebarVisible ? 'hidden' : 'block'
          } w-52 min-h-screen bg-white shadow-md`}
        >
          <Sidebar />
        </div>

        {/* Main Section (Navbar + Content) */}
        <div className="flex flex-col flex-grow">
          {/* Navbar at the top inside main section */}
          <div className="w-full bg-white shadow-md flex items-center">
            <Navbar />
          </div>

          {/* Content below Navbar */}
          <div className="flex-grow overflow-y-auto">
            <Content />
          </div>
        </div>
      </div>
    </>
  );
}

export default Layout;
