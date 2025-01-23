import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectSidebarVisibility, setActiveContent } from '../dashboardSlice';

function Sidebar() {
  const isSidebarVisible = useSelector(selectSidebarVisibility);
  const dispatch = useDispatch();
  
  const handleContent = (content) => {
    dispatch(setActiveContent(content)); // Set the active content
  };

  return (
    <>
      <div className={`${isSidebarVisible ? 'block' : 'hidden'} h-screen w-1/6 bg-gradient-to-br from-violet-600 to-violet-900 rounded-tr-3xl border-none flex flex-col items-center text-white text-center gap-4 cursor-pointer`}>
        <div onClick={() => {handleContent("Home")}} className='w-4/5 h-8 border-2 rounded-full mt-8'>Home</div>
        <div onClick={() => {handleContent("Sell")}} className='w-4/5 h-8 border-2 rounded-full'>Sell</div>
        <div onClick={() => {handleContent("Inventory")}} className='w-4/5 h-8 border-2 rounded-full'>Inventory</div>
        <div onClick={() => {handleContent("Orders")}} className='w-4/5 h-8 border-2 rounded-full'>Orders</div> 
        <div onClick={() => {handleContent("Customers")}} className='w-4/5 h-8 border-2 rounded-full'>Customers</div>
        <div onClick={() => {handleContent("Profile")}} className='w-4/5 h-8 border-2 rounded-full'>Profile</div>
      </div>
    </>
  )
}

export default Sidebar