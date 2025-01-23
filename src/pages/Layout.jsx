import React from 'react'
import Navbar from '../features/auth/components/Navbar'
// import { Outlet } from 'react-router' 
import Sidebar from '../features/dashboard/components/Sidebar'
import Content from './Content'

function Layout() {
  return (
    <>
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