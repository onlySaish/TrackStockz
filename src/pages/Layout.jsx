import React from 'react'
import Navbar from '../features/dashboard/components/Navbar'
// import { Outlet } from 'react-router' 
import Sidebar from '../features/dashboard/components/Sidebar'
import Content from './Content'
import Popup from '../features/Popup'

function Layout() {
  return (
    <>
      <Popup/>
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