import React, { useState } from 'react'
import { forgotPasswordAsync } from '../authSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router';

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    const handleSubmit = (e) => {
          e.preventDefault();
          dispatch(forgotPasswordAsync(email));
    };
  return (
    <>
    <div className='h-2/4 w-3/4 bg-black/75 flex flex-col justify-center items-center rounded-3xl lg:w-1/3'>
        <form 
            onSubmit={handleSubmit}
            className='h-full w-full flex flex-col justify-evenly items-center'>
                <div className='text-white text-3xl font-bold md:text-4xl'>FORGOT PASSWORD</div>
                <div className='w-11/12 px-4 py-2 font-medium'>
                <div className='text-white text-lg px-3 md:text-2xl'>Enter Registered Email</div>
                  <input 
                  className='w-full mt-6 h-9 text-lg pl-3 py-4 rounded-3xl text-black/80 md:h-12 md:text-2xl'
                  onChange={(e) => setEmail(e.target.value)}
                  type='email' 
                  placeholder='Enter Here'/>
                </div>

                <button className='h-auto text-white w-2/4 text-2xl font-bold bg-orange-500 px-4 py-2 rounded-3xl md:text-4xl lg:text-2xl lg:w-2/3'>
                  Reset Password
                </button>
        </form>
        <div className='flex flex-row justify-center gap-2 text-white h-auto w-full text-md md:text-2xl lg:text-xl pb-2'>
          <Link to={"/login"} className='text-blue-500 hover:cursor-pointer'>Return to Login?</Link>
        </div>

    </div>
    </>
  )
}

export default ForgotPassword