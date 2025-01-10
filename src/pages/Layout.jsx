import React from 'react'
import Navbar from '../features/navbar'
import { Outlet } from 'react-router'

function Layout() {
  return (
    <>
      <Navbar/>
      <Outlet/>
    </>

  )
}

export default Layout