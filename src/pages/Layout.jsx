import React from 'react'
import Navbar from '../features/dashboard/components/Navbar'
// import { Outlet } from 'react-router' 
import Sidebar from '../features/dashboard/components/Sidebar'
import Content from './Content'
import Popup from '../features/Popup'
import Loader from '../features/Loader'

function Layout() {
  return (
    <>
      <Popup/>
      <Loader/>
      <div className="flex flex-col">
        <Navbar />
      <div className="flex-1 flex flex-row">
        <Sidebar />
        <Content />
      </div>
    </div>
    </>
  )
}

export default Layout