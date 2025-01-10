import React, { useRef } from 'react'

function Navbar() {
  const searchRef = useRef(null)

  const searchBtn = () => {
    searchRef.current.select()
  }

  return (
    <>
      <div className='w-full bg-gradient-to-r from-violet-600 to-violet-950 flex flex-row justify-evenly items-center py-4'>
        <div className='flex flex-row gap-4'>
          <div className='h-8 w-8 rounded-full' style={{backgroundImage : "url('vite.svg')"}} ></div>
          <div className='text-2xl font-bold text-white'>Company Name</div>
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
          <div className='text-white font-bold text-2xl'>Welcome, UserName</div>
          <div className='h-8 w-8 text-white fa-solid fa-circle-user text-3xl text-center'></div>
        </div>
        <div>
          <button className='text-white bg-red-700 p-2 rounded-3xl font-bold'>Logout</button>
        </div>
      </div>
    </>
  )
}

export default Navbar