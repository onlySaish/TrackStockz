import React from 'react'
import { selectActiveContent } from '../features/dashboard/dashboardSlice';
import {Customers, Home, Inventory, Orders, Profile, Sell} from "../features/dashboard/components/ContentStack"
import { useSelector } from 'react-redux';

function Content() {
  const activeContent = useSelector(selectActiveContent);
  return (
    <>
      <div className="flex-1 bg-white p-6 ">
      {activeContent === 'Home' && <Home/>}
      {activeContent === 'Sell' && <Sell/>}
      {activeContent === 'Inventory' && <Inventory/>}
      {activeContent === 'Orders' && <Orders/>}
      {activeContent === 'Customers' && <Customers/>}
      {activeContent === 'Profile' && <Profile/>}
    </div>
    </>
  )
}

export default Content