import React from 'react'
import { selectActiveContent } from '../features/dashboard/dashboardSlice';
import {Customer, Home, Inventory, Order, Profile, Sell} from "../features/dashboard/components/ContentStack"
import { useSelector } from 'react-redux';


function Content(): React.JSX.Element {
  const activeContent = useSelector(selectActiveContent);
  return (
    <>
      <div className="flex-1 justify-center items-center bg-gray-900 h-full overflow-auto">
        {activeContent === 'Home' && <Home/>}
        {activeContent === 'Sell' && <Sell/>}
        {activeContent === 'Inventory' && <Inventory/>}
        {activeContent === 'Order' && <Order/>}
        {activeContent === 'Customers' && <Customer/>}
        {activeContent === 'Profile' && <Profile/>}
      </div>
    </>
  )
}

export default Content