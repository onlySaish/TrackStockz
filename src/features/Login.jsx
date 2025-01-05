import React, { useRef, useState } from 'react'
import { Link } from 'react-router';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const passref = useRef(null);
  const tooglePassVisibility = (eyeIcon) => {
    if (passref.current.type === "password"){
      eyeIcon.classList.remove("fa-eye-slash")
      eyeIcon.classList.add("fa-eye")
      passref.current.type = "text"
    } else {
      passref.current.type = "password"
      eyeIcon.classList.remove("fa-eye")
      eyeIcon.classList.add("fa-eye-slash")
    }
  }

  return (
    <>
        {/* <div className="h-screen w-full bg-center bg-cover bg-no-repeat flex flex-row justify-center items-center" style={{backgroundImage : `url(https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)`}}> */}
            <div className='h-3/4 w-3/4 bg-black/75 flex flex-col justify-center items-center rounded-3xl lg:w-2/5'>
            <form action="#" className='h-full w-full flex flex-col justify-evenly items-center'>
                <div className='text-white text-3xl font-bold md:text-5xl'>LOGIN</div>
                <div className='w-11/12 px-4 py-2 font-medium'>
                <div className='text-white text-lg px-3 md:text-2xl'>Enter Email or Username</div>
                  <input 
                  className='w-full mt-2 h-9 text-lg pl-3 py-4 rounded-3xl text-black/80 md:h-12 md:text-2xl'
                  onChange={(e) => setUsername(e.target.value)}
                  type='text' 
                  placeholder='Enter Here'/>
                </div>
                
                <div className='w-11/12 px-4 py-2 font-medium '>
                  <div className='text-white text-lg px-3 md:text-2xl'>Enter Password</div> 
                  <div className='w-full h-9 relative'>
                    <input 
                    className='w-full mt-2 h-9 text-lg pl-3 py-4 rounded-3xl text-black/80 md:h-12 md:text-2xl'
                    onChange={(e) => setPassword(e.target.value)}
                    id='pass'
                    type="password"
                    placeholder='Password'
                    ref={passref}/>
                    <div 
                    onClick={(e) => tooglePassVisibility(e.target)}
                    id='eye-icon' 
                    className="hover:cursor-pointer fa-solid fa-eye-slash inline-block absolute right-3 top-3 md:top-4 text-2xl md:text-3xl text-black/80"></div>
                  </div>
                </div>

                <button className='h-auto text-white w-2/4 text-2xl font-bold bg-orange-500 px-4 py-2 rounded-3xl md:text-4xl md:mt-3 lg:text-2xl lg:w-1/3'>
                  LOGIN
                </button>
            </form>
            <div className='flex flex-row justify-center gap-4 items-center text-white h-auto w-full text-lg pb-4'>
                <div>Don't have an account?</div>
                <Link to={"/signup"} className='text-blue-500 hover:cursor-pointer'>Sign Up</Link>
            </div>
            </div>

        {/* </div> Remove this while routing for page  */}
    </>
  )
}

export default Login