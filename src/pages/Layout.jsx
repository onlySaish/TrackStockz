import React from 'react'
import Navbar from '../features/dashboard/components/Navbar'
// import { Outlet } from 'react-router' 
import Sidebar from '../features/dashboard/components/Sidebar'
import Content from './Content'
import Popup from '../features/Popup'
import Loader from '../features/Loader'
import { useSelector } from 'react-redux'
import { selectSidebarVisibility } from '../features/dashboard/dashboardSlice'

function Layout() {
  const isSidebarVisible = useSelector(selectSidebarVisibility)
  return (
    <>
      <Popup/>
      <Loader/>
      <div className="flex flex-col h-screen">
      {/* Navbar - Fixed at the top */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-40 h-16">
        <Navbar />
      </div>

      {/* Main Section (Sidebar + Content) */}
      <div className="flex flex-row flex-grow pt-16">
        {/* Sidebar - Fixed on the left, starting after Navbar */}
        <div className={` ${!isSidebarVisible ? "-z-50" : ""} fixed top-16 left-0 w-52 h-[calc(100vh-4rem)] bg-white text-white`}>
          <Sidebar />
        </div>

        {/* Content Section */}
        <div className={`${(isSidebarVisible) ? "ml-52" : ""} flex-grow p-6 overflow-y-auto h-[calc(100vh-4rem)]`}>
          <Content />
        </div>
      </div>
    </div>
    </>
  )
}

export default Layout